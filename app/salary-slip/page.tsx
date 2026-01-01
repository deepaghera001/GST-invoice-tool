/**
 * Salary Slip Page
 * Dynamic page with interactive form for generating salary slips
 */

import Link from "next/link"
import { SalarySlipForm } from "@/components/documents/salary-slip/salary-slip-form"
import { IndianRupee, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Head from "next/head"

export const dynamic = "force-dynamic"

export default function SalarySlipPage() {
  return (
    <>
      <Head>
        <title>Salary Slip Generator - ComplianceKit</title>
        <meta
          name="description"
          content="Generate professional salary slips with ComplianceKit's Salary Slip Generator. Easy, fast, and accurate."
        />
        <meta name="keywords" content="salary slip generator, professional salary slips, compliance tools" />
      </Head>
      <div className="min-h-screen bg-background">
        {/* Header with navigation */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="p-2 bg-primary rounded-lg">
                  <IndianRupee className="h-5 w-5 text-primary-foreground" />
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

        {/* Salary Slip Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <SalarySlipForm />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/30 mt-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © 2025 ComplianceKit. Professional salary slips for Indian companies.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Secure & Compliant</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">No data stored after salary slip generation.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
