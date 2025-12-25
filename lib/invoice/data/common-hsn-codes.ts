/**
 * Common HSN/SAC Codes with GST Rates
 * Used for HSN code search and GST rate auto-population
 */

export interface HSNCode {
  code: string
  description: string
  gstRate: number
  type: "HSN" | "SAC" // Added type to distinguish HSN from SAC
}

export const commonHSNCodes: HSNCode[] = [
  { code: "998314", description: "IT consulting & software development", gstRate: 18, type: "SAC" },
  { code: "998313", description: "Software implementation services", gstRate: 18, type: "SAC" },
  { code: "998312", description: "Data processing services", gstRate: 18, type: "SAC" },
  { code: "998315", description: "Website design & development", gstRate: 18, type: "SAC" },
  { code: "999794", description: "Professional, technical & business services", gstRate: 18, type: "SAC" },
  { code: "999799", description: "Other professional services", gstRate: 18, type: "SAC" },
  { code: "998212", description: "Engineering design services", gstRate: 18, type: "SAC" },
  { code: "998219", description: "Other architectural & engineering services", gstRate: 18, type: "SAC" },
  { code: "998611", description: "Market research services", gstRate: 18, type: "SAC" },
  { code: "998551", description: "Training & educational services", gstRate: 18, type: "SAC" },

  // Services
  { code: "9983", description: "Health, fitness, & beauty services", gstRate: 18, type: "HSN" },
  { code: "9982", description: "Educational, training & consulting services", gstRate: 18, type: "HSN" },
  { code: "9972", description: "Residential building construction", gstRate: 12, type: "HSN" },
  { code: "9973", description: "Commercial building construction", gstRate: 12, type: "HSN" },
  { code: "9954", description: "Software development services", gstRate: 18, type: "HSN" },
  { code: "9971", description: "Maintenance & repair services", gstRate: 18, type: "HSN" },
  { code: "9967", description: "Marketing & advertising services", gstRate: 18, type: "HSN" },

  // IT & Electronics
  { code: "8471", description: "Computers & laptops", gstRate: 18, type: "HSN" },
  { code: "8517", description: "Mobile phones & accessories", gstRate: 18, type: "HSN" },
  { code: "8528", description: "Monitors & projectors", gstRate: 18, type: "HSN" },

  // Clothing & Textiles
  { code: "6109", description: "T-shirts & casual wear", gstRate: 12, type: "HSN" },
  { code: "6203", description: "Men's suits & formal wear", gstRate: 12, type: "HSN" },
  { code: "6204", description: "Women's suits & formal wear", gstRate: 12, type: "HSN" },

  // Food & Beverages
  { code: "2106", description: "Food preparations", gstRate: 18, type: "HSN" },
  { code: "2202", description: "Soft drinks & beverages", gstRate: 28, type: "HSN" },
  { code: "1905", description: "Bakery products", gstRate: 18, type: "HSN" },

  // Automotive
  { code: "8703", description: "Motor cars & vehicles", gstRate: 28, type: "HSN" },
  { code: "8711", description: "Motorcycles & two-wheelers", gstRate: 28, type: "HSN" },
  { code: "4011", description: "Tyres & tubes", gstRate: 28, type: "HSN" },

  // Furniture
  { code: "9403", description: "Furniture & fixtures", gstRate: 18, type: "HSN" },

  // Books & Stationery
  { code: "4901", description: "Printed books", gstRate: 12, type: "HSN" },
  { code: "4820", description: "Stationery items", gstRate: 18, type: "HSN" },
]

export function searchHSNCodes(query: string): HSNCode[] {
  if (!query || query.length < 2) return []

  const lowerQuery = query.toLowerCase()

  return commonHSNCodes.filter(
    (item) => item.code.includes(query) || item.description.toLowerCase().includes(lowerQuery),
  )
}

export function getGSTRateForHSN(hsnCode: string): number | null {
  const hsn = commonHSNCodes.find((item) => item.code === hsnCode)
  return hsn ? hsn.gstRate : null
}
