import { ShareholdersAgreementForm } from "@/components/documents/shareholders-agreement/shareholders-agreement-form"
import type { Metadata } from "next"
import { PageHeader, Footer } from "@/components/home"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Shareholders Agreement Generator - Workngin",
  description: "Generate professional shareholders agreements for Indian companies. Easy, compliant, and legally sound.",
  keywords: "shareholders agreement, shareholders agreement India, startup shareholders agreement",
}

export default function ShareholdersAgreementPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <PageHeader />

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-amber-50/50 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 font-semibold">
                ₹2,499 per agreement
              </Badge>
              <Badge variant="outline" className="border-green-200 text-green-700">
                Draft Format
              </Badge>
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                Lawyer-Review Ready
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Shareholders Agreement Generator
            </h1>
            <p className="text-lg text-muted-foreground">
              Create comprehensive draft agreements covering equity, vesting, decision-making, and exit clauses. 
              Perfect for startups and early-stage companies. Editable and ready for legal review.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <ShareholdersAgreementForm />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
