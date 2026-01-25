# Rule Candidate Contract

## Purpose

This schema is **the brake pedal** for AI in Stage 2.

Before ANY extraction code is written, this contract defines:
- What AI can propose
- What AI cannot invent
- How ambiguity is represented
- What is explicitly forbidden

## Why This Exists

Without this schema:
- Prompts become huge (AI decides structure + extracts data)
- Models hang (too much responsibility)
- Hallucination becomes undetectable (no validation)
- Stage 3 alignment is impossible (no standard)
- Freeze gate cannot enforce rules (no schema to check)

With this schema:
- Prompts get smaller (just fill the schema)
- Models become usable (clear structure)
- Hallucination becomes schema-invalid (rejected)
- Stage 3 can validate alignment (text → schema match)
- Freeze gate can enforce (schema validator)

## Contract Rules

### ✅ AI MUST:
1. Include `source_pages` for every candidate
2. Quote `source_text` verbatim (no paraphrasing)
3. Set `status: "unclear"` if ANY ambiguity
4. Set `confidence: 0.0` if citations missing
5. Return `rule_data: null` if value is inferred/rounded

### ❌ AI MUST NOT:
1. Invent new `rule_type` values
2. Pick between conflicting sources (return both as unclear)
3. Round numbers (250000 ≠ 2.5 lakh)
4. Infer missing data (return `blocked` instead)
5. Add fields outside schema (`additionalProperties: false`)

## Example: Candidate (Clear)

```json
{
  "rule_type": "tax_slab",
  "status": "candidate",
  "rule_data": {
    "value": {
      "income_min": 0,
      "income_max": 300000,
      "rate": 0.0
    },
    "unit": "INR",
    "conditions": ["resident individual", "opted for section 115BAC"]
  },
  "source_pages": [2],
  "source_text": "total income not exceeding three lakh rupees, at the rate of nil",
  "confidence": 0.95,
  "ambiguity_reason": null,
  "conflicting_candidates": null,
  "extracted_at": "2026-01-25T12:00:00Z",
  "extractor_version": "1.0.0"
}
```

## Example: Unclear (Ambiguous)

```json
{
  "rule_type": "rate",
  "status": "unclear",
  "rule_data": null,
  "source_pages": [3, 7],
  "source_text": null,
  "confidence": 0.0,
  "ambiguity_reason": "Multiple surcharge rates found for same income threshold",
  "conflicting_candidates": [
    {
      "value": 0.10,
      "source_page": 3,
      "source_text": "at the rate of ten per cent"
    },
    {
      "value": 0.15,
      "source_page": 7,
      "source_text": "surcharge of fifteen percent"
    }
  ],
  "extracted_at": "2026-01-25T12:00:00Z",
  "extractor_version": "1.0.0"
}
```

## Example: Blocked (Missing Data)

```json
{
  "rule_type": "threshold",
  "status": "blocked",
  "rule_data": null,
  "source_pages": [],
  "source_text": null,
  "confidence": 0.0,
  "ambiguity_reason": "No relevant text found in retrieved chunks",
  "conflicting_candidates": null,
  "extracted_at": "2026-01-25T12:00:00Z",
  "extractor_version": "1.0.0"
}
```

## What Happens Next

**Stage 2.2:** Write code that FILLS this schema (not invents structure)  
**Stage 2.3:** Validate all candidates against this schema  
**Stage 2.4:** Test with tax slabs extraction  

**Production:** Only `status: "candidate"` with `confidence > 0.8` can proceed to freeze gate.

## Validation

To validate a candidate against this schema:

```javascript
import Ajv from 'ajv';
import schema from './rule-candidate.schema.json';

const ajv = new Ajv();
const validate = ajv.compile(schema);

const isValid = validate(candidate);
if (!isValid) {
  console.error('Schema validation failed:', validate.errors);
}
```

## Version

**Version:** 1.0.0  
**Created:** 2026-01-25  
**Stage:** 2.1 (Rule Candidate Contract Definition)  
**Next:** Stage 2.2 (Implement Candidate Extractor)
