import { RentAgreementForm } from "@/components/documents/rent-agreement/rent-agreement-form"
import Head from "next/head"
import { PageHeader, Footer } from "@/components/home"
import { Badge } from "@/components/ui/badge"

export default function RentAgreementPage() {
  return (
    <>
      <Head>
        <title>Rent Agreement Generator - Workngin</title>
        <meta
          name="description"
          content="Generate professional rent agreements with Workngin's Rent Agreement Generator. Easy, fast, and accurate."
        />
        <meta name="keywords" content="rent agreement generator, professional rent agreements, compliance tools" />
      </Head>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <PageHeader />

        {/* Hero Section */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  ₹149 per agreement
                </Badge>
                <Badge variant="outline" className="border-green-200 text-green-700">
                  All Indian States
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Professional Rent Agreement Generator
              </h1>
              <p className="text-lg text-muted-foreground">
                Create legally formatted rental agreements with standard clauses. Download as PDF instantly.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <RentAgreementForm />
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}
