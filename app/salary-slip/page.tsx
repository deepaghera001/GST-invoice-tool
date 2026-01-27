/**
 * Salary Slip Page
 * Dynamic page with interactive form for generating salary slips
 */

import { SalarySlipForm } from "@/components/documents/salary-slip/salary-slip-form"
import Head from "next/head"
import { PageHeader, Footer } from "@/components/home"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default function SalarySlipPage() {
  return (
    <>
      <Head>
        <title>Salary Slip Generator - Workngin</title>
        <meta
          name="description"
          content="Generate professional salary slips with Workngin's Salary Slip Generator. Easy, fast, and accurate."
        />
        <meta name="keywords" content="salary slip generator, professional salary slips, compliance tools" />
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
                  ₹99 per slip
                </Badge>
                <Badge variant="outline" className="border-green-200 text-green-700">
                  Tax Compliant
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Professional Salary Slip Generator
              </h1>
              <p className="text-lg text-muted-foreground">
                Create detailed salary slips with tax calculations and CTC breakdowns. Download as PDF instantly.
              </p>
            </div>
          </div>
        </section>

        {/* Salary Slip Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <SalarySlipForm />
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}
