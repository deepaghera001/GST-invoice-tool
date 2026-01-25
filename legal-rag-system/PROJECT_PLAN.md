# Legal RAG System - Project Plan

## 🎯 OVERALL GOAL

> **Build a system that converts official Indian law PDFs into testable, traceable, confidence-scored calculators & documents, without AI making legal decisions.**

**Target Reliability:** 97-99% (measured by tests and confidence, not claims)

---

## 🧭 CORE PRINCIPLES (NON-NEGOTIABLE)

1. ✅ **PDFs are the only truth** - never modified, always hashed
2. ✅ **AI never approves correctness** - only retrieves and proposes
3. ✅ **Rules are frozen before production** - immutable after freeze
4. ✅ **Production never uses AI** - only frozen deterministic rules
5. ✅ **Everything must be testable** - clear pass/fail criteria
6. ✅ **If unsure → do nothing (fail safe)** - no guessing

**If any step violates these → STOP**

---

## 🔧 TECHNOLOGY STACK (LOCKED)

### Stage 0-1: Document Processing
- **PDF Parser:** `pdfjs-dist` (Mozilla PDF.js legacy build)
- **Runtime:** Node.js 20+
- **Storage:** Filesystem (JSON)

### Stage 1: Retrieval Layer
- **Vector DB:** ChromaDB (local, persistent)
- **Embeddings:** OpenAI `text-embedding-3-small` (1536 dimensions)
  - Fallback: None initially (fail-safe: return error, don't guess)
- **Orchestration:** Custom (Stage 1)
  - **LlamaIndex:** NOT USED initially
  - **When needed:** If Stage 2 requires multi-document reasoning (cross-referencing Finance Act + Income-tax Act)
  - **Decision gate:** After Stage 1.9 passes, before Stage 2.1

### Stage 2-3: Rule Extraction
- **LLM:** OpenAI GPT-4 (or Claude Sonnet)
  - ONLY for candidate generation, NEVER for approval
- **Prompt Management:** Hardcoded prompts (version controlled)
- **Output Format:** Structured JSON (schema-validated)

### Stage 4: Schema Enforcement
- **Validation:** Zod or JSON Schema
- **DSL Storage:** TypeScript interfaces + runtime validators

### Stage 5-7: Testing & Production
- **Test Framework:** Vitest or Jest
- **Frozen Rules Storage:** Immutable JSON files (git-tracked)
- **Production Runtime:** Pure TypeScript (NO AI calls)

### Cross-Cutting
- **Graph DB:** Optional (Stage 3+)
  - **Tool:** Neo4j or embedded graph library
  - **Purpose:** Rule dependencies, cross-act references, proviso chains
  - **Trigger:** ONLY if >20% of rules have cross-references
  - **NOT for production execution** - only for candidate validation
  - **Decision:** After Stage 2 extracts first 50 rules
- **Audit Logging:** Filesystem (append-only JSON logs)

---

## 🧱 PIPELINE OVERVIEW (8 STAGES)

```
Stage 0: Document Authority (PDFs + Hashing)
    ↓
Stage 1: Retrieval (RAG - Text Extraction & Embedding)
    ↓
Stage 2: Rule Candidates (AI Proposes Rules)
    ↓
Stage 3: Alignment Validation (Check Alignment, Not Correctness)
    ↓
Stage 4: Schema Mapping (Force Rules into Fixed Structure)
    ↓
Stage 5: Deterministic Testing (Boundary, Regression, Parity Tests)
    ↓
Stage 6: Freeze Gate (Governance - Approve for Production)
    ↓
Stage 7: Production Execution (Frozen Rules Only, No AI)
```

---

## 📊 PROGRESS TRACKING

### Stage 0: Document Authority ✅ COMPLETE
**Goal:** Store PDFs with proof of version used

| Task | Status | Success Criteria |
|------|--------|------------------|
| Create folder structure | ✅ | All folders exist |
| Download Finance Act 2024 | ✅ | PDF in correct location |
| Generate SHA-256 hash | ✅ | Hash file created |
| Create metadata | ✅ | metadata.json exists |
| Register in documents.json | ✅ | Document registered |

**KPI:** Hash stable ✅

---

### Stage 1: Retrieval (RAG) ⚙️ 60% COMPLETE
**Goal:** Extract and embed text for semantic search (AI retrieves, doesn't interpret)

| Task | Type | Status | Success Criteria |
|------|------|--------|------------------|
| 1.1 PDF parsing library | Infrastructure | ✅ | pdfjs-dist installed and working |
| 1.2 Parse PDF to structured text | Infrastructure | ✅ | 26/26 pages extracted with page numbers |
| 1.3 Semantic-preserving chunking | Infrastructure | ✅ | 44 chunks, no mid-sentence breaks, page refs |
| 1.4 Install ChromaDB | Vector DB | ⬜ | `chromadb` npm package installed |
| 1.5 Generate embeddings | Vector DB | ⬜ | All 44 chunks embedded (OpenAI API) |
| 1.6 Store in ChromaDB | Vector DB | ⬜ | Collection created, chunks inserted |
| 1.7 Test retrieval - known facts | Validation | ⬜ | Query "section 115BAC" returns correct page |
| 1.8 Test retrieval - boundaries | Validation | ⬜ | Query "surcharge threshold" returns exact text |
| 1.9 Measure retrieval precision | Validation | ⬜ | 10 test queries, ≥8 return top-3 correct chunks |

**KPI Definition:**
- **Retrieval Accuracy = 90%** means:
  - Given 10 hand-crafted test queries (known answers)
  - At least 9 queries return the correct chunk in top-3 results
  - Test queries stored in `tests/retrieval/known-queries.json`

**Failure Conditions:**
- ❌ Embedding generation fails → STOP (no fallback yet)
- ❌ ChromaDB persistence fails → STOP
- ❌ Retrieval accuracy < 80% → Investigate chunking strategy

---

### Stage 2: Rule Candidates ⬜ NOT STARTED
**Goal:** AI proposes possible rules (never claims truth)

| Task | Status | Success Criteria |
|------|--------|------------------|
| 2.1 Define extraction prompts | ⬜ | Prompts stored in `lib/legal-rag/prompts/*.txt` |
| 2.2 Implement candidate extractor | ⬜ | Returns `{ rule, confidence, citations, ambiguities }` (AI suggests, never approves) |
| 2.3 Handle explicit ambiguity | ⬜ | Returns `{ status: "unclear", reason: "..." }` for conflicts |
| 2.4 Extract tax slabs (test case) | ⬜ | Slabs match PDF exactly, with page refs |
| 2.5 Extract rates & thresholds | ⬜ | Numbers NOT rounded, NOT inferred |
| 2.6 Confidence scoring logic | ⬜ | Low confidence if: citations conflict, proviso missing |
| 2.7 Multi-document cross-check | ⬜ | BLOCKED until Income-tax Act 1961 is ingested (Stage 1 repeated) |

**Ambiguity Representation:**
```json
{
  "status": "unclear",
  "reason": "Multiple surcharge rates found",
  "candidates": [
    {"value": "10%", "source": "page 3, para 2"},
    {"value": "15%", "source": "page 7, Schedule I"}
  ],
  "resolution": null
}
```

**CRITICAL:**
- AI NEVER picks between candidates
- Human or later stage resolves
- Production BLOCKS if unresolved

**KPI:** 
- 0% guessed values = ALL ambiguous fields return `status: "unclear"`
- Track: `% unclear / total fields extracted`

---

### Stage 3: Alignment Validation ⬜ NOT STARTED
**Goal:** Check alignment with source text (NOT correctness)

**Alignment Definition (Explicit):**
- Candidate text matches PDF verbatim (case-insensitive, whitespace-normalized)
- All cited page numbers exist in source PDF
- No proviso/exception omitted within 100 chars of extracted text
- Cross-references (e.g., "as per section X") are intact

**NOT Alignment:**
- Legal correctness (we don't verify law)
- Completeness across entire act
- Interpretation accuracy

| Task | Status | Success Criteria |
|------|--------|------------------|
| 3.1 Define alignment criteria | ⬜ | Written spec (above) |
| 3.2 Text similarity validator | ⬜ | Fuzzy match with threshold 0.95 |
| 3.3 Detect missing provisos | ⬜ | Regex for "Provided that" within context window |
| 3.4 Flag cross-ref failures | ⬜ | Extract section refs, verify they exist in PDF |
| 3.5 Calculate alignment score | ⬜ | Score = (matched_checks / total_checks) |
| 3.6 Generate issues report | ⬜ | JSON list of misalignments |

**KPI:** Average confidence score > 0.8
- Confidence = alignment_score × (1 - ambiguity_count/total_fields)

---

### Stage 4: Schema Mapping ⬜ NOT STARTED
**Goal:** Force rules into predefined structure (AI can't add fields)

| Task | Status | Success Criteria |
|------|--------|------------------|
| Define calculator schema (DSL) | ⬜ | Income tax schema created |
| Create schema validator | ⬜ | Rejects invalid structures |
| Map candidates to schema | ⬜ | All fields typed correctly |
| Handle missing fields | ⬜ | Missing required → explicit fail |
| Type validation | ⬜ | Numbers are numbers, strings are strings |

**KPI:** Schema pass rate

---

### Stage 5: Deterministic Testing ⬜ NOT STARTED
**Goal:** Prove math is stable and safe

| Task | Status | Success Criteria |
|------|--------|------------------|
| Create test framework | ⬜ | Can run tests automatically |
| Boundary tests | ⬜ | Edge cases covered |
| Determinism tests | ⬜ | Same input → same output |
| Regression tests | ⬜ | Previous versions still pass |
| Parity tests (if govt calc exists) | ⬜ | Matches official calculator |
| Generate test reports | ⬜ | Pass/fail clearly shown |

**KPI:** Zero critical test failures

---

### Stage 6: Freeze Gate ⬜ NOT STARTED
**Goal:** Governance - decide if rules can enter production

| Task | Status | Success Criteria |
|------|--------|------------------|
| Define freeze criteria | ⬜ | Clear thresholds set |
| Freeze approval mechanism | ⬜ | Human or automated approval |
| Create frozen rule artifacts | ⬜ | Immutable JSON files |
| Add audit metadata | ⬜ | Who, when, why frozen |
| Version control | ⬜ | Each freeze = new version |

**KPI:** Freeze success rate

---

### Stage 7: Production Execution ⬜ NOT STARTED
**Goal:** Run calculators safely (NO AI, frozen rules only)

| Task | Status | Success Criteria |
|------|--------|------------------|
| Load frozen rules only | ⬜ | Production can't use candidates |
| Deterministic calculator | ⬜ | Pure functions, no randomness |
| Result breakdown | ⬜ | Shows step-by-step calculation |
| Confidence display | ⬜ | Shows rule confidence to user |
| Version logging | ⬜ | Every result logs rule version |
| Error handling | ⬜ | Missing rules → clear error |

**KPI:** Determinism (same input → same output forever)

---

## 🏗️ MODULES TO BUILD

### Core Infrastructure (Stage 0-1)
- [x] `legal-rag-system/extract-pdf.mjs` - PDF extraction (pdfjs-dist)
- [x] `legal-rag-system/chunk-text.mjs` - Semantic chunking
- [ ] `lib/legal-rag/embedder.ts` - Embedding generation (OpenAI)
- [ ] `lib/legal-rag/vector-store.ts` - ChromaDB wrapper
- [ ] `lib/legal-rag/retrieval.ts` - Query orchestration

### Retrieval Layer (Stage 1)
- [ ] `lib/legal-rag/search/semantic-search.ts` - Vector similarity search
- [ ] `lib/legal-rag/search/reranker.ts` - (Optional) Re-rank by page proximity
- [ ] `tests/retrieval/known-queries.json` - Test query bank
- [ ] `tests/retrieval/test-search.ts` - Automated retrieval tests

### Rule Extraction (Stage 2-3)
- [ ] `lib/legal-rag/prompts/extract-tax-slabs.txt` - Slab extraction prompt
- [ ] `lib/legal-rag/prompts/extract-thresholds.txt` - Threshold extraction
- [ ] `lib/legal-rag/extraction/candidate-generator.ts` - LLM wrapper (generates candidates, NEVER validates)
- [ ] `lib/legal-rag/extraction/ambiguity-detector.ts` - Conflict detector
- [ ] `lib/legal-rag/validation/alignment-checker.ts` - Text alignment
- [ ] `lib/legal-rag/validation/cross-ref-validator.ts` - Section reference checker

### Schema & Control (Stage 4)
- [ ] `lib/legal-rag/schemas/income-tax-2024.ts` - FY 2024-25 schema (Zod)
- [ ] `lib/legal-rag/schemas/validator.ts` - Runtime schema validator

### Testing (Stage 5)
- [ ] `tests/boundary/tax-slabs.test.ts` - Slab boundary tests
- [ ] `tests/determinism/same-input.test.ts` - Determinism tests
- [ ] `tests/regression/fy-2023-24-parity.test.ts` - Previous year comparison

### Governance (Stage 6)
- [ ] `lib/legal-rag/governance/freeze.ts` - Freeze mechanism
- [ ] `rules_final/income_tax/FY_2024_25/frozen.json` - Frozen rules artifact

### Production (Stage 7)
- [ ] `lib/legal-rag/production/calculator.ts` - Deterministic executor
- [ ] `app/api/legal-rag/calculate/route.ts` - Production API

---

## 🚦 STOP CONDITIONS

**STOP IMMEDIATELY IF:**
- ❌ AI invents values (no null checks)
- ❌ Rules auto-promote to production
- ❌ Tests are skipped
- ❌ Confidence scores ignored
- ❌ PDFs are modified
- ❌ Frozen rules change
- ❌ LLM called in production API endpoint (Stage 7)
- ❌ Confidence threshold bypassed

**Stopping early = success, not failure**

---

## 📈 SUCCESS METRICS

### Per Stage
- Stage 0: Hash stability ✅
- Stage 1: Retrieval accuracy ≥ 90% (9/10 known queries return correct chunk in top-3)
- Stage 2: 0% guessed values
- Stage 3: Average confidence > 0.8
- Stage 4: Schema pass rate > 95%
- Stage 5: Zero critical failures
- Stage 6: Clear approval audit trail
- Stage 7: Determinism verified (same input → same output, 10k test runs)

### Overall System
- 97-99% reliability on test cases
- Full traceability (result → rule → PDF → hash)
- Zero production AI usage
- Clear confidence scores on all outputs

---

## 📝 CURRENT STATUS

**Stage 0: COMPLETE ✅**
- Finance Act 2024 stored
- Hash: `61c6ab8909b8fffc735973c0e0188631b4eb3d1d0618c321bdffb0e91737c19b`
- 26 pages, official source
- Commits: 31de45d (extraction), 1c344e4 (chunking)
- Next commit: PROJECT_PLAN audit corrections

**Stage 1: 60% COMPLETE ⚙️**
- ✅ 1.1-1.3: PDF parsing, chunking (semantic-preserving)
- ⬜ 1.4-1.9: Vector DB, embeddings, search testing

**Next Immediate Steps:**
1. Install ChromaDB (`npm install chromadb`)
2. Generate embeddings for 44 chunks
3. Test semantic search with 10 known queries
4. Measure retrieval accuracy before moving to Stage 2

---

## 📅 TIMELINE APPROACH

**Not time-based, gate-based:**
- Each stage must pass before next begins
- No rushing to "get something working"
- Quality gates are mandatory
- Better to stop at Stage 3 with confidence than rush to Stage 7 with bugs

---

## 🎯 IMMEDIATE NEXT STEPS

### Completed:
- ✅ **Stage 1.1:** PDF parsing (pdfjs-dist)
- ✅ **Stage 1.2:** Text extraction (26 pages)
- ✅ **Stage 1.3:** Semantic chunking (44 chunks)
- ✅ **Stage 1.3.1:** Manual chunk inspection (verified no mid-sentence breaks)

### In Progress:
- ⚙️ **Stage 1.4:** Install ChromaDB
- ⬜ **Stage 1.5:** Generate embeddings (OpenAI)
- ⬜ **Stage 1.6:** Store in vector DB
- ⬜ **Stage 1.7-1.9:** Test retrieval accuracy

**Each substep will be tested before proceeding.**
