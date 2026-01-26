/**
 * OpenRouter variant for rule extraction
 * Free tier: ~25 requests/day
 * Supports Claude, GPT-4, and other models
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load schema
const schema = JSON.parse(
  readFileSync(join(__dirname, '../contracts/rule-candidate.schema.json'), 'utf8')
);

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validateCandidate = ajv.compile(schema);

/**
 * Extract candidates using OpenRouter (free tier)
 * @param {Array<{text: string, page: number}>} chunks 
 * @param {string} ruleType 
 * @returns {Promise<{candidates: Array, errors: Array|null}>}
 */
export async function extractCandidatesOpenRouter(chunks, ruleType) {
  if (!['tax_slab', 'rate', 'threshold', 'exemption', 'definition'].includes(ruleType)) {
    throw new Error(`Invalid rule_type: ${ruleType}`);
  }

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not set. Get free key from https://openrouter.ai/');
  }

  const chunksText = chunks
    .map((c, i) => `[Chunk ${i + 1}, Page ${c.page}]\n${c.text}`)
    .join('\n\n---\n\n');

  const prompt = `Extract ${ruleType} rules from legal text. Return JSON array matching this schema:

${JSON.stringify(schema, null, 2)}

RETRIEVED TEXT:
${chunksText}

CRITICAL RULES:
1. rule_type MUST be "${ruleType}"
2. source_pages: array of page numbers where found
3. source_text: EXACT verbatim quote (no paraphrasing)
4. confidence: 0.0-1.0
5. status: "candidate" (clear), "unclear" (ambiguous), or "blocked" (missing data)
6. ambiguity_reason: null if clear, string if unclear/blocked
7. conflicting_candidates: null if clear, array if unclear

Return ONLY the JSON array, no markdown, no explanation.`;

  // OpenRouter API call
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/yourusername/legal-rag',
      'X-Title': 'Legal RAG Extraction'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet', // Free tier model
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 512
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const responseText = data.choices[0].message.content;

  // Parse JSON
  let candidates;
  try {
    // Remove markdown code blocks if present
    const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    candidates = Array.isArray(parsed) ? parsed : [parsed];
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${err.message}\n\nResponse: ${responseText}`);
  }

  // Validate
  const validated = [];
  const errors = [];

  for (const candidate of candidates) {
    const valid = validateCandidate(candidate);
    if (!valid) {
      errors.push({ candidate, errors: validateCandidate.errors });
      continue;
    }

    if (candidate.rule_type !== ruleType) {
      errors.push({ candidate, errors: [`rule_type mismatch`] });
      continue;
    }

    // Source text verification
    const cleanedText = candidate.source_text?.replace(/^"+|"+$/g, '').trim().replace(/\s+/g, ' ') || '';
    if (cleanedText && !chunks.some(c => c.text.replace(/\s+/g, ' ').includes(cleanedText))) {
      errors.push({ candidate, errors: ['source_text not found in chunks'] });
      continue;
    }

    validated.push(candidate);
  }

  if (validated.length === 0 && errors.length > 0) {
    console.error('All failed validation:', JSON.stringify(errors, null, 2));
    throw new Error(`All ${candidates.length} candidates failed validation`);
  }

  return { candidates: validated, errors: errors.length > 0 ? errors : null };
}
