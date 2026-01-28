/**
 * Salary Slip Page
 * Dynamic page with interactive form for generating salary slips
 */

import { SalarySlipForm } from "@/components/documents/salary-slip/salary-slip-form"
import Head from "next/head"
import { PageHeader, Footer } from "@/components/home"

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
