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
- **Vector DB:** JSON filesystem (initial implementation)
  - Why: Simpler, deterministic, sufficient for single-document retrieval
  - When to upgrade: If adding >5 documents OR cross-document search needed
  - Upgrade path: ChromaDB (local, persistent)
- **Embeddings:** Xenova/all-MiniLM-L6-v2 (384 dimensions, local)
  - Why: No API costs, deterministic, 90% accuracy achieved
  - Fallback: OpenAI text-embedding-3-small if accuracy drops <85% on new docs
- **Search:** Custom cosine similarity (pure math, deterministic)
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

### Stage 1: Retrieval (RAG) ✅ COMPLETE
**Goal:** Extract and embed text for semantic search (AI retrieves, doesn't interpret)

| Task | Type | Status | Success Criteria |
|------|------|--------|------------------|
| 1.1 PDF parsing library | Infrastructure | ✅ | pdfjs-dist installed and working |
| 1.2 Parse PDF to structured text | Infrastructure | ✅ | 26/26 pages extracted with page numbers |
| 1.3 Semantic-preserving chunking | Infrastructure | ✅ | 203 chunks, 348 chars avg, sentence boundaries preserved |
| 1.4 Install embeddings library | Vector DB | ✅ | @xenova/transformers installed (local embeddings) |
| 1.5 Generate embeddings | Vector DB | ✅ | All 203 chunks embedded (Xenova/all-MiniLM-L6-v2, 384 dims) |
| 1.6 Store embeddings | Vector DB | ✅ | JSON storage with chunk metadata |
| 1.7 Test retrieval - known facts | Validation | ✅ | Query "section 115BAC" returns page 3 ✅ |
| 1.8 Test retrieval - boundaries | Validation | ✅ | Query "surcharge rates" returns relevant chunks ✅ |
| 1.9 Measure retrieval precision | Validation | ✅ | 10 test queries, 9/10 top-3 correct (90%) ✅ |

**KPI Achievement:**
- **Retrieval Accuracy = 90%** ✅ (9/10 queries return correct chunk in top-3)
- **Estimated True Accuracy: ~85%** (accounting for same-document test bias)
- Test queries: 10 hand-crafted legal queries covering sections, thresholds, metadata
- Results stored in: `legal-rag-system/TEST_RESULTS_ANALYSIS.md`
- Methodology: Manual verification of "failed" tests revealed better answers than expected
- **Validation Approach:** Attempted holdout validation revealed that creating accurate test queries requires careful PDF review, which defeats "unseen" purpose. True cross-document validation deferred to Stage 8 (test on Finance Act 2023).
- **Confidence Level:** HIGH for legal provision documents similar to Finance Act structure

**Tech Stack Decisions:**
- ✅ Used local embeddings (Xenova/all-MiniLM-L6-v2) instead of OpenAI
  - Rationale: 90% accuracy achieved, no API costs, deterministic
- ✅ Used JSON storage instead of ChromaDB
  - Rationale: Simpler, sufficient for single document, faster for small datasets
- ✅ Custom cosine similarity search (pure math, no external dependencies)

**Key Learnings:**
- ✅ Sentence-level chunking (300/500 chars) works well for legal provisions
- ✅ Local embeddings (Xenova) sufficient - no need for OpenAI at this stage
- ✅ Manual verification essential - revealed 2 wrong test expectations
- ✅ True holdout validation requires different document (Finance Act 2023), not just different queries from same PDF
- ⚠️ Chunking strategy may need adaptation for tables/schedules (documented in CHUNKING_STRATEGY_DECISION.md)

**Commits:**
- 31de45d: Stage 1.1 PDF extraction
- 1c344e4: Stage 1.2 semantic chunking (initial)
- d36fd3c: PROJECT_PLAN audit fixes
- 4937906: Stage 1.5-1.6 embeddings generation (initial with 44 chunks)
- [PENDING]: Stage 1 complete (203 chunks, 90% accuracy, validation learnings)

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
 (legal provision strategy)
- [x] `legal-rag-system/embed-and-store.mjs` - Embedding generation (@xenova/transformers)
- [x] `legal-rag-system/lib/search.mjs` - Search engine (cosine similarity)

### Retrieval Layer (Stage 1)
- [x] `legal-rag-system/lib/search.mjs` - LegalSearchEngine class with semantic search
- [x] `legal-rag-system/test-search.mjs` - Automated retrieval tests (10 queries)
- [x] `legal-rag-system/TEST_RESULTS_ANALYSIS.md` - Test results documentation
- [x] `legal-rag-system/CHUNKING_STRATEGY_DECISION.md` - Chunking strategy documentation
- [x] `legal-rag-system/vector-db/income_tax/FINANCE_ACT_2024/embeddings.json` - Stored embedding
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
- Stage 1: Retrieval accuracy ≥ 90% ✅ (9/10 queries, manual verification)
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
- Metadata validated

**Stage 1: COMPLETE ✅**
- ✅ 1.1-1.3: PDF parsing, chunking (203 chunks, 348 chars avg)
- ✅ 1.4-1.6: Local embeddings (Xenova/all-MiniLM-L6-v2, 384 dims), JSON storage
- ✅ 1.7-1.9: Semantic search engine, 10-query test suite, 90% accuracy

**Commits:**
- 31de45d: Stage 1.1 PDF extraction
- 1c344e4: Stage 1.2 semantic chunking (initial)
- d36fd3c: PROJECT_PLAN audit fixes
- 4937906: Stage 1.5-1.6 embeddings generation (initial)
- [PENDING]: Stage 1 complete (final chunking + search + 90% validation)

**Next Stage:**
- **Stage 2: Rule Candidate Extraction**
  - AI proposes rules with citations (never approves)
  - Handles ambiguity explicitly
  - Target: 0% guessed values

---

## 📅 TIMELINE APPROACH

**Not time-based, gate-based:**
- Each stage must pass before next begins
- No rushing to "get something working"
- Quality gates are mandatory
- Better to 0:** Document Authority (PDF storage, hashing, metadata)
- ✅ **Stage 1:** Retrieval/RAG (PDF parsing, chunking, embeddings, search, 90% accuracy)

### In Progress:
- ⬜ **Stage 2:** Rule Candidate Extraction (AI proposes, never validates)

**Each stage tested and valida
### In Progress:
- ⚙️ **Stage 1.4:** Install ChromaDB
- ⬜ **Stage 1.5:** Generate embeddings (OpenAI)
- ⬜ **Stage 1.6:** Store in vector DB
- ⬜ **Stage 1.7-1.9:** Test retrieval accuracy

**Each substep will be tested before proceeding.**
