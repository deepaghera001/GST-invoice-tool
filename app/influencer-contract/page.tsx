/**
 * Influencer Contract Page
 * Dynamic page for creating Influencer-Brand Collaboration Agreements
 * 
 * Price: ₹499
 * Target: Influencers and brands who need clear collaboration contracts
 */

import { InfluencerContractForm } from "@/components/documents/influencer-contract/influencer-contract-form"
import type { Metadata } from "next"
import { PageHeader, Footer } from "@/components/home"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Influencer-Brand Contract Generator | ComplianceKit",
  description: "Create professional influencer-brand collaboration agreements in minutes. Protect your content, secure your payments, and establish clear usage rights. ₹499",
  keywords: [
    "influencer contract",
    "brand collaboration agreement",
    "influencer marketing contract",
    "content creator contract",
    "brand deal contract",
    "influencer agreement template",
    "social media contract",
    "sponsored content agreement",
  ],
  openGraph: {
    title: "Influencer-Brand Contract Generator | ComplianceKit",
    description: "Create professional influencer-brand collaboration agreements. Secure payments, protect content rights.",
    type: "website",
  },
}

export default function InfluencerContractPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <PageHeader />

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Protect Your Content
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Secure Payments
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Influencer-Brand Collaboration Contract
            </h1>
            <p className="text-lg text-muted-foreground">
              Stop losing money on unclear brand deals. Create a professional contract that protects 
              your content rights, secures your payment terms, and establishes clear deliverables.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <InfluencerContractForm />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
