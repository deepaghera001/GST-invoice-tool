import { ShareholdersAgreementForm } from "@/components/documents/shareholders-agreement/shareholders-agreement-form"
import type { Metadata } from "next"
import { PageHeader, Footer } from "@/components/home"

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
