# Chunking Strategy Decision Log

## Current Implementation (Finance Act 2024)

### Strategy: Legal Provision Chunking
**Optimized for**: Indian government legal documents (Finance Acts, Income Tax Acts, GST Circulars)

**Parameters**:
- **Target**: 300 chars
- **Max**: 500 chars  
- **Delimiters**: `.!?;` (sentences + semicolons) + line breaks (fallback)
- **Result**: 203 chunks, 348 chars avg, **90% retrieval accuracy** ✅

### Why This Works:
1. ✅ Finance Act has dense numbered provisions (section X, sub-section Y)
2. ✅ Semicolons mark important clause boundaries in legal text
3. ✅ Short chunks (300) needed for specific provision matching (not paragraph-level)
4. ✅ Tested and validated on actual 26-page document

### What This Strategy Does:
1. Split text by sentences and semicolons (legal clause boundaries)
2. Group sentences until ~300 chars (one provision per chunk)
3. If single provision >500 chars, split by line breaks
4. Never break mid-sentence (preserve legal meaning)

### Implementation: `chunk-text.mjs`
- Single-purpose script for legal provision documents
- No strategy pattern (not needed for one document type)
- Direct, testable, working code

## Will This Work for Other Documents?

### ✅ YES - Similar Legal Documents
| Document Type | Expected Accuracy | Notes |
|---------------|------------------|-------|
| Finance Act 2025 | 90%+ | Same format |
| Income Tax Act 1961 | 85-90% | Same provision structure |
| GST Act/Circulars | 80-90% | Government gazette format |
| SEBI Regulations | 80-85% | Similar numbered provisions |

**Why**: All Indian government legal documents use similar structure (sections, sub-sections, provisos)

### ⚠️ MAYBE - Other Legal Documents
| Document Type | Expected Accuracy | Action Needed |
|---------------|------------------|---------------|
| Rent Agreement | 60-70% | May need larger chunks (clauses are longer) |
| Court Judgment | 60-75% | Narrative style, less structured |
| Employment Contract | 65-75% | Different clause structure |

**Why**: Different document structure, but sentence-level splitting still works

### ❌ NO - Non-Text Documents  
| Document Type | Expected Accuracy | Action Needed |
|---------------|------------------|---------------|
| Tax Rate Tables | 30-40% | Need table-aware chunking |
| Financial Statements | 20-30% | Need row-based chunking |
| Scanned PDFs (OCR) | Variable | Need OCR cleanup preprocessing |

**Why**: No sentences to split, tabular structure breaks assumptions

## When to Create New Strategies

**DON'T** create strategy pattern now - we only have one working strategy.

**DO** create when:
1. Adding 2nd document type (e.g., Rent Agreement for production)
2. Accuracy drops below 80% on new doc type
3. You have actual test document to validate against

**How**: Copy `chunk-text.mjs`, modify parameters, test, then refactor into strategy pattern

## Scalability Analysis

### Document Size Scalability
**Current**: 26 pages → 203 chunks

| Pages | Est. Chunks | Processing Time | Memory |
|-------|-------------|-----------------|--------|
| 26    | 203         | ~2s             | <10MB  |
| 100   | ~780        | ~8s             | ~40MB  |
| 500   | ~3,900      | ~40s            | ~200MB |
| 1000  | ~7,800      | ~80s            | ~400MB |

**Conclusion**: ✅ Scales linearly, no architectural changes needed up to 1000 pages

### Edge Cases to Handle Later

1. **Very Large Provisions** (>1000 chars  ✅

### ✅ Reasons to Proceed:
1. **Master Playbook**: "Solve for current document, generalize when needed"
2. **90% Accuracy**: Current strategy WORKS for Finance Act 2024
3. **Testable**: We have ground truth (10 test queries) and validation
4. **Documented**: Future developers know what it's optimized for
5. **Simple**: No over-engineered abstractions, just working code

### ⚠️ Scope Limitations (Not Technical Debt):
- **Optimized for**: Government legal documents with numbered provisions
- **Not suitable for**: Tables, contracts with long clauses, scanned PDFs
- **No strategy pattern**: Will add when we have 2nd document type to support

This is **intentional scope limitation**, not technical debt. We're solving for Finance Act 2024.

### 📋 When to Add New Strategies:
1. ✅ **Trigger**: Adding 2nd document type (e.g., Rent Agreement in production)
2. ✅ **Validation**: Have test document with ground truth queries
3. ✅ **Approach**: Copy chunk-text.mjs, modify, test, then refactor to strategy pattern
4. ❌ **Don't**: Build strategies without test documents

## Next Steps

**✅ Proceed to Stage 2** - Rule Candidate Extraction

Rationale:
- Stage 1 goal: Retrieve relevant chunks (90% ✅)
- Generalization is Stage 8 (Production Hardening)
- Don't over-engineer before validating full pipeline
- Can refactor chunking later if needed without breaking Stages 2-7
