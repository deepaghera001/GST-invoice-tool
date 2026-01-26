# Stage 1.10: Deterministic Query Enhancement

## Problem Identified

Retrieval accuracy varies by query type:
- **Legal queries** (e.g., "section 115BAC"): ~90% ✅
- **Casual queries** (e.g., "tax slabs for individuals"): ~40% ❌

Root cause: Semantic embeddings alone don't capture legal document structure.

## Solution: Pattern-Based Query Enhancement

**Approach:** Deterministic pattern matching (NO AI)

### Implementation

**File:** `lib/query-enhancer.mjs` (44 lines)

Detects query intent and adds legal keywords:
- "slab" → adds "Paragraph A First Schedule total income exceeds"
- "surcharge" → adds "income-tax computed sub-section rate"  
- "rate" → adds "per cent calculated"
- "threshold" → adds "exceeds does not exceed lakh crore"

**Bidirectional:**
- Legal queries pass through unchanged
- Casual queries boosted with legal terminology

### Integration

**File:** `lib/search.mjs` (modified)

```javascript
import { enhanceQuery } from './query-enhancer.mjs';

async search(query, topK = 3, options = {}) {
  const enhancedQuery = options.skipEnhancement ? query : enhanceQuery(query);
  // ... rest of search
}
```

Optional enhancement (can disable with `skipEnhancement: true`)

### Test Results

**Test:** `test-stage-1.10.mjs`

| Query | Type | Before | After | Result |
|-------|------|--------|-------|--------|
| "income tax slabs for individuals" | Casual | ✅ PASS | ✅ PASS | Maintained |
| "surcharge rates" | Casual | ❌ FAIL | ✅ PASS | **Fixed!** |
| "section 115BAC" | Legal | ✅ PASS | ✅ PASS | No regression |

**Improvement:** Surcharge query fixed (from missing page 3 to hitting it)

## Principles Maintained

✅ **Deterministic** - Same query → same enhancement  
✅ **Testable** - Clear pass/fail criteria  
✅ **Auditable** - Pure pattern matching, no black box  
✅ **Modular** - Can enable/disable per query  
✅ **No AI** - Follows advisor's recommendation

## Next Steps

- ✅ Stage 1.10 complete
- ⬜ Stage 2.4: Re-test tax slab extraction with enhanced retrieval
- ⬜ Measure overall accuracy improvement (target: 40% → 80%+)

## Decision: LLM Enhancement (Phase 2)

**Deferred** per advisor recommendation.

LLM-based enhancement (cached, optional) should only be added **AFTER** deterministic enhancement reaches 80%+ accuracy. This ensures AI enhances UX, not compensates for weak retrieval.
