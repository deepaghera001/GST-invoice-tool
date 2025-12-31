/**
 * HSN/SAC Codes Database
 * HSN = Harmonized System of Nomenclature (for Goods)
 * SAC = Service Accounting Code (for Services)
 */

export interface HSNCode {
  code: string
  description: string
  type: "HSN" | "SAC"
  gstRate?: number // Only for SAC (services) - auto-fill rate
  notes?: string
}

export const commonHSNCodes: HSNCode[] = [
  // =========================
  // SERVICES (SAC) – MOST COMMON FOR FREELANCERS
  // =========================

  {
    code: "998314",
    description: "IT consulting and software development services",
    type: "SAC",
    gstRate: 18,
  },
  {
    code: "998313",
    description: "IT design and implementation services",
    type: "SAC",
    gstRate: 18,
  },
  {
    code: "998312",
    description: "Data processing, hosting and related services",
    type: "SAC",
    gstRate: 18,
  },
  {
    code: "998315",
    description: "Website design, development and maintenance",
    type: "SAC",
    gstRate: 18,
  },
  {
    code: "998361",
    description: "Advertising services",
    type: "SAC",
    gstRate: 18,
  },
  {
    code: "998611",
    description: "Market research and polling services",
    type: "SAC",
    gstRate: 18,
  },
  {
    code: "998212",
    description: "Engineering and technical consultancy",
    type: "SAC",
    gstRate: 18,
  },
  {
    code: "998221",
    description: "Business management and consultancy",
    type: "SAC",
    gstRate: 18,
  },
  {
    code: "998213",
    description: "Accounting, auditing and bookkeeping",
    type: "SAC",
    gstRate: 18,
  },
  {
    code: "998214",
    description: "Legal consultancy services",
    type: "SAC",
    gstRate: 18,
  },
  {
    code: "998551",
    description: "Commercial training and coaching",
    type: "SAC",
    gstRate: 18,
    notes: "Excludes exempt education services",
  },
  {
    code: "997212",
    description: "Rental services (own/leased property)",
    type: "SAC",
    gstRate: 18,
    notes: "GST depends on commercial vs residential use",
  },
  {
    code: "998319",
    description: "Other IT services n.e.c.",
    type: "SAC",
    gstRate: 18,
  },
  {
    code: "998511",
    description: "Photography and videography services",
    type: "SAC",
    gstRate: 18,
  },
  {
    code: "998399",
    description: "Other professional services",
    type: "SAC",
    gstRate: 18,
  },

  // =========================
  // GOODS (HSN) – COMMON SME ITEMS
  // No auto GST rate - user must verify
  // =========================

  {
    code: "847130",
    description: "Laptops and portable computers",
    type: "HSN",
    notes: "GST commonly 18%, verify current rate",
  },
  {
    code: "851712",
    description: "Mobile phones",
    type: "HSN",
    notes: "GST rate subject to change",
  },
  {
    code: "852852",
    description: "Monitors and projectors",
    type: "HSN",
    notes: "Rate varies by specification",
  },
  {
    code: "940360",
    description: "Wooden furniture",
    type: "HSN",
    notes: "Rate varies by product type",
  },
  {
    code: "482010",
    description: "Stationery, notebooks, registers",
    type: "HSN",
    notes: "Rate varies by item",
  },
  {
    code: "610910",
    description: "T-shirts and vests (cotton)",
    type: "HSN",
    notes: "GST depends on price & fabric",
  },
  {
    code: "620343",
    description: "Men's trousers and shorts",
    type: "HSN",
    notes: "Rate depends on fabric & pricing",
  },
  {
    code: "190590",
    description: "Bakery products (except bread)",
    type: "HSN",
    notes: "GST varies by product & packaging",
  },
  {
    code: "490110",
    description: "Printed books",
    type: "HSN",
    notes: "Generally NIL rated, verify exemption",
  },
  {
    code: "844319",
    description: "Printing machinery and equipment",
    type: "HSN",
    notes: "Rate varies",
  },
]

/**
 * Search HSN/SAC codes by query
 * Returns matching codes sorted by relevance
 */
export function searchHSNSACCodes(query: string): HSNCode[] {
  // If no query or too short, return popular SAC codes (most used by freelancers)
  if (!query || query.length < 2) {
    return commonHSNCodes.filter(c => c.type === "SAC").slice(0, 8)
  }

  const lowerQuery = query.toLowerCase()

  // Search with scoring for better results
  const results = commonHSNCodes
    .map(item => {
      let score = 0
      
      // Exact code match = highest priority
      if (item.code === query) score += 100
      // Code starts with query
      else if (item.code.startsWith(query)) score += 50
      // Code contains query
      else if (item.code.includes(query)) score += 30
      
      // Description matches
      if (item.description.toLowerCase().includes(lowerQuery)) score += 20
      
      // Type matches (sac, hsn)
      if (item.type.toLowerCase() === lowerQuery) score += 40
      
      // Common keyword matches
      const keywords = ["service", "software", "consulting", "it", "web", "design", "legal", "accounting"]
      for (const kw of keywords) {
        if (lowerQuery.includes(kw) && item.description.toLowerCase().includes(kw)) {
          score += 15
        }
      }
      
      // SAC codes get slight boost for freelancers
      if (item.type === "SAC") score += 5
      
      return { item, score }
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.item)

  return results
}

/**
 * Get GST rate for a specific HSN/SAC code
 * Returns rate only for SAC codes (services)
 */
export function getGSTRateForCode(code: string): number | null {
  const found = commonHSNCodes.find(item => item.code === code)
  return found?.gstRate ?? null
}

/**
 * Get code details by code
 */
export function getCodeDetails(code: string): HSNCode | null {
  return commonHSNCodes.find(item => item.code === code) ?? null
}
