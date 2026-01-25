/**
 * Stage 2.2: Rule Candidate Extractor
 * 
 * Fills the contract schema defined in Stage 2.1.
 * Does NOT invent structure - only populates predefined fields.
 */

import Anthropic from '@anthropic-ai/sdk';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load and validate schema
const schema = JSON.parse(
  readFileSync(join(__dirname, '../contracts/rule-candidate.schema.json'), 'utf8')
);

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validateCandidate = ajv.compile(schema);

/**
 * Extract rule candidates using Claude
 * @param {Array<{text: string, page: number}>} chunks - Retrieved chunks from RAG
 * @param {string} ruleType - One of: tax_slab, rate, threshold, exemption, definition
 * @returns {Promise<Array>} - Validated candidates
 */
export async function extractCandidates(chunks, ruleType) {
  if (!['tax_slab', 'rate', 'threshold', 'exemption', 'definition'].includes(ruleType)) {
    throw new Error(`Invalid rule_type: ${ruleType}`);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set');
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  // Small, focused prompt - just fill the schema
  const prompt = buildPrompt(chunks, ruleType);

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const responseText = message.content[0].text;
  
  // Parse JSON response
  let candidates;
  try {
    const parsed = JSON.parse(responseText);
    candidates = Array.isArray(parsed) ? parsed : [parsed];
  } catch (err) {
    throw new Error(`Failed to parse JSON response: ${err.message}\n\nResponse: ${responseText}`);
  }

  // Validate each candidate against schema
  const validated = [];
  const errors = [];

  for (const candidate of candidates) {
    const valid = validateCandidate(candidate);
    if (!valid) {
      errors.push({
        candidate,
        errors: validateCandidate.errors,
      });
      continue;
    }

    // Additional validation: rule_type matches request
    if (candidate.rule_type !== ruleType) {
      errors.push({
        candidate,
        errors: [`rule_type mismatch: expected ${ruleType}, got ${candidate.rule_type}`],
      });
      continue;
    }

    // Critical: Verify source_text exists verbatim in retrieved chunks
    // This prevents LLM from inventing quotes
    // Strip surrounding quotes that LLMs often add and normalize whitespace
    const cleanedText = candidate.source_text ? candidate.source_text.replace(/^"+|"+$/g, '').trim().replace(/\s+/g, ' ') : '';
    const found = chunks.some(c => c.text.replace(/\s+/g, ' ').includes(cleanedText));
    if (cleanedText && !found) {
      errors.push({
        candidate,
        errors: ['source_text not found verbatim in retrieved chunks'],
      });
      continue;
    }

    validated.push(candidate);
  }

  if (validated.length === 0 && errors.length > 0) {
    console.error('All candidates failed validation:', JSON.stringify(errors, null, 2));
    throw new Error(`All ${candidates.length} candidates failed schema validation`);
  }

  return {
    candidates: validated,
    errors: errors.length > 0 ? errors : null,
  };
}

/**
 * Build extraction prompt - small and focused
 */
function buildPrompt(chunks, ruleType) {
  const chunksText = chunks
    .map((c, i) => `[Chunk ${i + 1}, Page ${c.page}]\n${c.text}`)
    .join('\n\n---\n\n');

  return `You are extracting ${ruleType} rules from legal text.

CONTRACT (you MUST follow this schema):
${JSON.stringify(schema, null, 2)}

RETRIEVED TEXT:
${chunksText}

TASK:
Extract ALL ${ruleType} rules you find in the text above. For each rule, fill the schema exactly.

RULES:
1. rule_type MUST be "${ruleType}"
2. source_pages MUST list page numbers where you found this (array of numbers)
3. source_text MUST be verbatim quote from the text (no paraphrasing)
4. confidence: 0.0-1.0 (how confident are you this is a ${ruleType}?)
5. status:
   - "candidate": Rule is clear and complete
   - "unclear": Ambiguous or multiple interpretations exist
   - "blocked": Missing data or cross-references not provided
6. If status is "unclear", fill ambiguity_reason and conflicting_candidates
7. If status is "blocked", explain in ambiguity_reason what's missing

IMPORTANT:
- Quote EXACTLY from the text (check spelling, numbers, punctuation)
- If you find MULTIPLE interpretations, return status="unclear" with ALL candidates
- Do NOT pick between ambiguous options - return them all
- Do NOT round numbers or simplify language
- Do NOT invent rule_type values - only use "${ruleType}"

Return a JSON array of candidates (even if just one). Example:
[
  {
    "rule_type": "${ruleType}",
    "status": "candidate",
    "source_pages": [5],
    "source_text": "exact quote here",
    "confidence": 0.95,
    "ambiguity_reason": null,
    "conflicting_candidates": null
  }
]`;
}

/**
 * Ollama variant for local extraction (simpler prompts, smaller models)
 */
export async function extractCandidatesOllama(chunks, ruleType) {
  if (!['tax_slab', 'rate', 'threshold', 'exemption', 'definition'].includes(ruleType)) {
    throw new Error(`Invalid rule_type: ${ruleType}`);
  }

  const prompt = buildPromptOllama(chunks, ruleType);

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt: prompt,
      format: 'json',
      stream: false,
      options: {
        temperature: 0.1,
        num_predict: 2048,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const responseText = data.response;

  // Parse JSON response - handle potential wrapper objects
  let candidates;
  try {
    const parsed = JSON.parse(responseText);
    
    // Check if wrapped in object (common with smaller models)
    if (parsed.tax_slabs || parsed.candidates || parsed.rules) {
      candidates = parsed.tax_slabs || parsed.candidates || parsed.rules;
    } else if (Array.isArray(parsed)) {
      candidates = parsed;
    } else {
      // Single object, wrap in array
      candidates = [parsed];
    }
  } catch (err) {
    throw new Error(`Failed to parse JSON response: ${err.message}\n\nResponse: ${responseText}`);
  }

  // Validate each candidate
  const validated = [];
  const errors = [];

  for (const candidate of candidates) {
    const valid = validateCandidate(candidate);
    if (!valid) {
      errors.push({
        candidate,
        errors: validateCandidate.errors,
      });
      continue;
    }

    if (candidate.rule_type !== ruleType) {
      errors.push({
        candidate,
        errors: [`rule_type mismatch: expected ${ruleType}, got ${candidate.rule_type}`],
      });
      continue;
    }

    // Critical: Verify source_text exists verbatim in retrieved chunks
    // Strip surrounding quotes that LLMs often add and normalize whitespace
    const cleanedText = candidate.source_text ? candidate.source_text.replace(/^"+|"+$/g, '').trim().replace(/\s+/g, ' ') : '';
    const found = chunks.some(c => c.text.replace(/\s+/g, ' ').includes(cleanedText));
    if (cleanedText && !found) {
      errors.push({
        candidate,
        errors: ['source_text not found verbatim in retrieved chunks'],
      });
      continue;
    }

    validated.push(candidate);
  }

  if (validated.length === 0 && errors.length > 0) {
    console.error('All candidates failed validation:', JSON.stringify(errors, null, 2));
    throw new Error(`All ${candidates.length} candidates failed schema validation`);
  }

  return {
    candidates: validated,
    errors: errors.length > 0 ? errors : null,
  };
}

/**
 * Simplified prompt for smaller models (Ollama)
 */
function buildPromptOllama(chunks, ruleType) {
  const chunksText = chunks
    .map((c, i) => `[Page ${c.page}] ${c.text}`)
    .join('\n\n');

  return `Extract ${ruleType} rules. Return JSON array.

TEXT:
${chunksText}

Return this EXACT format (array of objects):
[
  {
    "rule_type": "${ruleType}",
    "status": "candidate",
    "source_pages": [12],
    "source_text": "single exact quote",
    "confidence": 0.9,
    "ambiguity_reason": null,
    "conflicting_candidates": null
  }
]

STRICT RULES:
- rule_type: string "${ruleType}" (not array)
- status: string "candidate", "unclear", or "blocked"  
- source_pages: array of numbers like [1,2,3]
- source_text: string (ONE quote, not array of quotes)
- confidence: number between 0.0 and 1.0
- ambiguity_reason: null or string
- conflicting_candidates: null or array

Return multiple objects if you find multiple ${ruleType} rules. Each object is ONE rule with ONE quote.`;
}
