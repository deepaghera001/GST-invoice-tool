/**
 * Influencer Contract Page
 * Dynamic page for creating Influencer-Brand Collaboration Agreements
 * 
 * Price: ₹499
 * Target: Influencers and brands who need clear collaboration contracts
 */

import Link from "next/link"
import { InfluencerContractForm } from "@/components/documents/influencer-contract/influencer-contract-form"
import { Users, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

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
    <div className="min-h-screen bg-background">
      {/* Header with navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="p-2 bg-primary rounded-lg">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ComplianceKit</h1>
                <p className="text-xs text-muted-foreground">Documents & Compliance Tools</p>
              </div>
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

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

      {/* Benefits Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why You Need This Contract</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">💰</span>
              </div>
              <h3 className="font-semibold mb-2">Payment Protection</h3>
              <p className="text-sm text-muted-foreground">
                Clear payment terms with advance structure options. No more chasing brands for payment.
              </p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">🛡️</span>
              </div>
              <h3 className="font-semibold mb-2">Content Rights</h3>
              <p className="text-sm text-muted-foreground">
                Define exactly how brands can use your content. Protect against unauthorized repurposing.
              </p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">📝</span>
              </div>
              <h3 className="font-semibold mb-2">Clear Deliverables</h3>
              <p className="text-sm text-muted-foreground">
                Specify exactly what you'll create. Avoid scope creep and endless revision requests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026 ComplianceKit. Professional contracts for influencers and brands.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>🔒 Secure & Private</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              This is a draft template for reference. It does not constitute legal advice.
              No data stored after document generation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
