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
 * Extract candidates using Groq (OpenAI-compatible endpoint)
 * @param {Array<{text: string, page: number}>} chunks 
 * @param {string} ruleType 
 */
export async function extractCandidatesGroq(chunks, ruleType) {
  if (!['tax_slab', 'rate', 'threshold', 'exemption', 'definition'].includes(ruleType)) {
    throw new Error(`Invalid rule_type: ${ruleType}`);
  }

  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not set. Export your key as GROQ_API_KEY.');
  }

  const chunksText = chunks
    .map((c, i) => `[Chunk ${i + 1}, Page ${c.page}]\n${c.text}`)
    .join('\n\n---\n\n');

  const prompt = `Extract ${ruleType} rules from legal text. Return JSON array matching this schema:\n\n${JSON.stringify(schema, null, 2)}\n\nRETRIEVED TEXT:\n${chunksText}\n\nCRITICAL RULES:\n1. rule_type MUST be "${ruleType}"\n2. source_pages: array of page numbers where found\n3. source_text: EXACT verbatim quote (no paraphrasing)\n4. confidence: 0.0-1.0\n5. status: "candidate" (clear), "unclear" (ambiguous), or "blocked" (missing data)\n6. ambiguity_reason: null if clear, string if unclear/blocked\n7. conflicting_candidates: null if clear, array if unclear\n\nReturn ONLY the JSON array, no markdown, no explanation.`;

  const body = {
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 2048
  };

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  const responseText = data.choices?.[0]?.message?.content || '';
  // Parse JSON
  let candidates;
  try {
    const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    candidates = Array.isArray(parsed) ? parsed : [parsed];
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${err.message}\n\nResponse: ${responseText}`);
  }

  // Normalization layer: coerce common variations from providers
  function normalizeCandidate(raw) {
    const c = JSON.parse(JSON.stringify(raw));

    // extracted_at -> ISO date-time
    if (c.extracted_at) {
      const d = new Date(c.extracted_at);
      if (!isNaN(d.getTime())) {
        c.extracted_at = d.toISOString();
      } else {
        c.extracted_at = new Date().toISOString();
      }
    } else {
      c.extracted_at = new Date().toISOString();
    }

    // Trim strings
    if (c.source_text && typeof c.source_text === 'string') {
      c.source_text = c.source_text.replace(/^"+|"+$/g, '').trim().replace(/\s+/g, ' ');
    }

    // Ensure source_pages are integers
    if (Array.isArray(c.source_pages)) {
      c.source_pages = c.source_pages.map(p => parseInt(p, 10)).filter(n => !isNaN(n));
    }

    // Normalize confidence (percentage -> 0-1)
    if (c.confidence !== undefined) {
      if (typeof c.confidence === 'string' && c.confidence.includes('%')) {
        c.confidence = parseFloat(c.confidence.replace('%', '')) / 100;
      } else {
        c.confidence = Number(c.confidence);
        if (!isNaN(c.confidence) && c.confidence > 1) c.confidence = c.confidence / 100;
        if (isNaN(c.confidence)) c.confidence = 0.0;
      }
      if (c.confidence < 0) c.confidence = 0;
      if (c.confidence > 1) c.confidence = 1;
    } else {
      c.confidence = 0.0;
    }

    // Normalize rule_data shapes (handle { value: { slab: [...] } } -> canonical)
    if (c.rule_data && c.rule_data.value && typeof c.rule_data.value === 'object') {
      const val = c.rule_data.value;
      // If provider used 'slab' array, flatten it
      if (val.slab && Array.isArray(val.slab)) {
        // Map to array of { from, to, rate }
        const mapped = val.slab.map(s => {
          const min = s.min !== undefined ? Number(s.min) : null;
          const max = s.max !== undefined ? (s.max === null ? null : Number(s.max)) : null;
          let rate = s.rate;
          let unit = null;
          if (typeof rate === 'string' && rate.trim().endsWith('%')) {
            unit = '%';
            rate = parseFloat(rate.replace('%', '').trim());
          } else {
            rate = Number(rate);
            if (!isNaN(rate) && rate <= 1) {
              // probably fraction; convert to percent
              rate = rate * 100;
              unit = '%';
            }
          }
          return { from: min, to: max, rate, unit };
        });
        c.rule_data.value = mapped;
        // If unit not set at top-level, set based on first
        if (!c.rule_data.unit && mapped.length && mapped[0].unit) {
          c.rule_data.unit = mapped[0].unit;
        }
      }

      // If value is a plain object with numeric strings, coerce
      if (!Array.isArray(c.rule_data.value) && typeof c.rule_data.value === 'object') {
        // attempt to coerce rate fields if present
        if (c.rule_data.value.rate && typeof c.rule_data.value.rate === 'string') {
          const r = c.rule_data.value.rate.trim();
          if (r.endsWith('%')) {
            c.rule_data.value.rate = parseFloat(r.replace('%', '').trim());
            c.rule_data.unit = c.rule_data.unit || '%';
          } else if (!isNaN(Number(r))) {
            c.rule_data.value.rate = Number(r);
          }
        }
      }
    }

    return c;
  }

  const validated = [];
  const errors = [];

  for (const rawCandidate of candidates) {
    const candidate = normalizeCandidate(rawCandidate);

    // Validate basic contract
    const valid = validateCandidate(candidate);
    if (!valid) {
      errors.push({ candidate: rawCandidate, errors: validateCandidate.errors });
      continue;
    }

    if (candidate.rule_type !== ruleType) {
      errors.push({ candidate, errors: [`rule_type mismatch`] });
      continue;
    }

    // Verify source_text exists in chunks
    const cleanedText = candidate.source_text || '';
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
