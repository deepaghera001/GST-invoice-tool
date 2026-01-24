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

### Stage 1: Retrieval (RAG) ⬜ IN PROGRESS
**Goal:** Extract and embed text for semantic search (AI retrieves, doesn't interpret)

| Task | Status | Success Criteria |
|------|--------|------------------|
| Install PDF parsing library | ⬜ | pdf-parse or pdfjs installed |
| Parse PDF to structured text | ⬜ | Text extracted with page numbers |
| Implement chunking strategy | ⬜ | Chunks ≤ 500 tokens, overlap preserved |
| Choose vector DB | ⬜ | Decision made (local/cloud) |
| Generate embeddings | ⬜ | All chunks embedded |
| Store in vector DB | ⬜ | Retrieval returns correct chunks |
| Create search API | ⬜ | Query returns text + page numbers |
| Test retrieval accuracy | ⬜ | Known queries return correct sections |

**KPI:** Retrieval accuracy > 90%

---

### Stage 2: Rule Candidates ⬜ NOT STARTED
**Goal:** AI proposes possible rules (never claims truth)

| Task | Status | Success Criteria |
|------|--------|------------------|
| Define rule extraction prompt | ⬜ | Prompt forces AI to cite sources |
| Implement candidate extraction | ⬜ | Returns rules + confidence + citations |
| Handle ambiguity | ⬜ | Ambiguous text → null, not guessed |
| Extract tax slabs | ⬜ | Slabs returned with page references |
| Extract rates & thresholds | ⬜ | Numbers match PDF exactly |
| Confidence scoring | ⬜ | Each candidate has 0-1 confidence |

**KPI:** % null vs guessed values (target: 0% guessed)

---

### Stage 3: Alignment Validation ⬜ NOT STARTED
**Goal:** Check alignment with source text (not correctness)

| Task | Status | Success Criteria |
|------|--------|------------------|
| Define alignment criteria | ⬜ | Clear definition of "aligned" |
| Compare candidates to source | ⬜ | Detects missing exceptions |
| Flag conflicts | ⬜ | Conflicting text → "unclear" |
| Calculate alignment score | ⬜ | Score 0-1 per candidate |
| Generate issues list | ⬜ | Lists all alignment problems |

**KPI:** Average confidence score

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

### Core Infrastructure
- [ ] `lib/legal-rag/pdf-manager.ts` - PDF hashing, metadata
- [ ] `lib/legal-rag/parser.ts` - PDF to text extraction
- [ ] `lib/legal-rag/chunker.ts` - Text chunking strategy
- [ ] `lib/legal-rag/vector-store.ts` - Vector DB interface
- [ ] `lib/legal-rag/embedder.ts` - Generate embeddings

### Retrieval Layer (Stage 1)
- [ ] `lib/legal-rag/retrieval/search.ts` - Semantic search
- [ ] `app/api/legal-rag/search/route.ts` - Search API endpoint

### Rule Extraction (Stage 2-3)
- [ ] `lib/legal-rag/extraction/prompts.ts` - Extraction prompts
- [ ] `lib/legal-rag/extraction/candidates.ts` - Candidate extraction
- [ ] `lib/legal-rag/validation/alignment.ts` - Alignment checker
- [ ] `lib/legal-rag/validation/confidence.ts` - Confidence scoring

### Schema & Control (Stage 4)
- [ ] `lib/legal-rag/schemas/income-tax.ts` - Income tax DSL
- [ ] `lib/legal-rag/schemas/validator.ts` - Schema validator
- [ ] `lib/legal-rag/mapping/schema-mapper.ts` - Map to schema

### Testing (Stage 5)
- [ ] `lib/legal-rag/testing/boundary-tests.ts` - Edge case tests
- [ ] `lib/legal-rag/testing/determinism-tests.ts` - Stability tests
- [ ] `lib/legal-rag/testing/regression-tests.ts` - Version tests
- [ ] `lib/legal-rag/testing/parity-tests.ts` - Govt calc comparison

### Governance (Stage 6)
- [ ] `lib/legal-rag/governance/freeze.ts` - Freeze mechanism
- [ ] `lib/legal-rag/governance/approval.ts` - Approval workflow
- [ ] `lib/legal-rag/governance/audit.ts` - Audit logging

### Production (Stage 7)
- [ ] `lib/legal-rag/production/calculator.ts` - Frozen rule executor
- [ ] `lib/legal-rag/production/versioning.ts` - Version management
- [ ] `app/api/legal-rag/calculate/route.ts` - Calculator API

### UI/Admin
- [ ] Admin dashboard for reviewing candidates
- [ ] Test result viewer
- [ ] Rule freeze interface
- [ ] Confidence score display

---

## 🚦 STOP CONDITIONS

**STOP IMMEDIATELY IF:**
- ❌ AI invents values (no null checks)
- ❌ Rules auto-promote to production
- ❌ Tests are skipped
- ❌ Confidence scores ignored
- ❌ PDFs are modified
- ❌ Frozen rules change

**Stopping early = success, not failure**

---

## 📈 SUCCESS METRICS

### Per Stage
- Stage 0: Hash stability ✅
- Stage 1: Retrieval accuracy > 90%
- Stage 2: 0% guessed values
- Stage 3: Average confidence > 0.8
- Stage 4: Schema pass rate > 95%
- Stage 5: Zero critical failures
- Stage 6: Clear approval audit trail
- Stage 7: 100% determinism

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

**Next:** Stage 1 - Parse PDF and implement retrieval

---

## 📅 TIMELINE APPROACH

**Not time-based, gate-based:**
- Each stage must pass before next begins
- No rushing to "get something working"
- Quality gates are mandatory
- Better to stop at Stage 3 with confidence than rush to Stage 7 with bugs

---

## 🎯 IMMEDIATE NEXT STEPS

1. **Stage 1.1:** Choose PDF parsing library
2. **Stage 1.2:** Extract text from Finance Act 2024
3. **Stage 1.3:** Implement chunking strategy
4. **Stage 1.4:** Choose vector DB (local vs cloud)
5. **Stage 1.5:** Generate embeddings
6. **Stage 1.6:** Test retrieval

**Each substep will be tested before proceeding.**
