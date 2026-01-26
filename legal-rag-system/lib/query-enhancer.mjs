/**
 * Stage 1.10: Deterministic Query Enhancement
 * 
 * Converts casual queries to legal-structured queries using pattern matching.
 * NO AI - pure deterministic rules.
 */

/**
 * Enhance query with legal terminology patterns
 * @param {string} query - User's natural language query
 * @returns {string} - Enhanced query with legal keywords
 */
export function enhanceQuery(query) {
  const lower = query.toLowerCase();
  
  // Pattern-based enhancements (deterministic)
  const patterns = [
    // Tax slabs → Add schedule structure keywords
    {
      triggers: ['slab', 'bracket', 'tax rate for individual'],
      boost: 'Paragraph A First Schedule total income exceeds rupees lakh per cent'
    },
    // Surcharge → Add provision keywords
    {
      triggers: ['surcharge'],
      boost: 'income-tax computed sub-section rate'
    },
    // General rates → Add measurement terms
    {
      triggers: ['rate', 'percentage'],
      boost: 'per cent calculated'
    },
    // Thresholds → Add boundary terms
    {
      triggers: ['threshold', 'limit', 'exceeding'],
      boost: 'exceeds does not exceed lakh crore'
    }
  ];
  
  // Apply first matching pattern
  for (const pattern of patterns) {
    if (pattern.triggers.some(t => lower.includes(t))) {
      return `${query} ${pattern.boost}`;
    }
  }
  
  // No pattern matched - return original
  return query;
}
