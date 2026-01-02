"use client"

import Link from "next/link"
import { FileText, Shield, CheckCircle2, ArrowRight, Calculator, IndianRupee, Home, Receipt, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Head from "next/head"

// Organized by category
const CALCULATORS = [
  {
    id: "gst-calculator",
    name: "GST Penalty Calculator",
    icon: Calculator,
    description: "Calculate late fees and interest for GST returns",
    features: ["GSTR-1 & GSTR-3B", "Late Fee + Interest", "Based on GST Act"],
    href: "/gst-calculator",
    badge: "Free",
  },
  {
    id: "tds-calculator",
    name: "TDS Late Fee Calculator",
    icon: Clock,
    description: "Calculate late filing fees for TDS returns",
    features: ["All TDS Sections", "Cap at TDS Amount", "Section 234E & 201(1A)"],
    href: "/tds-calculator",
    badge: "Free",
  },
]

const DOCUMENTS = [
  {
    id: "invoice",
    name: "Invoice Generator",
    icon: Receipt,
    description: "Professional GST-compliant invoices for your business",
    features: ["GST Calculations", "CGST/SGST/IGST", "PDF Download"],
    href: "/invoice",
    badge: "₹99",
  },
  {
    id: "salary-slip",
    name: "Salary Slip Generator",
    icon: IndianRupee,
    description: "Create employee salary statements with tax breakdowns",
    features: ["Tax Calculations", "CTC Breakdown", "PDF Format"],
    href: "/salary-slip",
    badge: "₹99",
  },
  {
    id: "rent-agreement",
    name: "Rent Agreement",
    icon: Home,
    description: "Generate legally formatted rental agreements",
    features: ["All Indian States", "Standard Clauses", "PDF Download"],
    href: "/rent-agreement",
    badge: "₹149",
  },
]

export default function HomePage() {
  return (
    <>
      <Head>
        <title>ComplianceKit - GST & TDS Calculators, Invoices, Salary Slips</title>
        <meta
          name="description"
          content="ComplianceKit offers GST penalty calculators, TDS late fee calculators, and professional document generators like invoices and salary slips. Simplify compliance today!"
        />
        <meta
          name="keywords"
          content="GST calculator, TDS calculator, invoice generator, salary slip generator, compliance tools"
        />
      </Head>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <div className="p-2 bg-slate-800 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  ComplianceKit
                </h1>
                <p className="text-xs text-slate-500">
                  Documents & Compliance Tools
                </p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100">
                <span className="text-xs font-medium text-slate-500 mr-2">
                  Calculators
                </span>
                <Link
                  href="/gst-calculator"
                  className="text-sm text-slate-700 hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors"
                >
                  GST
                </Link>
                <Link
                  href="/tds-calculator"
                  className="text-sm text-slate-700 hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors"
                >
                  TDS
                </Link>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 ml-2">
                <span className="text-xs font-medium text-slate-500 mr-2">
                  Documents
                </span>
                <Link
                  href="/invoice"
                  className="text-sm text-slate-700 hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors"
                >
                  Invoice
                </Link>
                <Link
                  href="/salary-slip"
                  className="text-sm text-slate-700 hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors"
                >
                  Salary
                </Link>
                <Link
                  href="/rent-agreement"
                  className="text-sm text-slate-700 hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors"
                >
                  Rent
                </Link>
              </div>
            </nav>
            {/* Mobile menu button - simplified */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <FileText className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-600 hover:bg-slate-100"
              >
                5 Tools for Indian Businesses
              </Badge>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
                Compliance Calculators & Document Generators
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Calculate GST/TDS penalties and generate professional business
                documents. Built for Indian tax compliance.
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Button
                  size="lg"
                  asChild
                  className="gap-2 bg-slate-800 hover:bg-slate-900 text-white"
                >
                  <Link href="/gst-calculator">
                    <Calculator className="h-4 w-4" />
                    GST Calculator
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="gap-2 border-slate-300"
                >
                  <Link href="/invoice">
                    <Receipt className="h-4 w-4" />
                    Create Invoice
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Calculators Section */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4 space-y-8">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Penalty Calculators
                </h3>
                <p className="text-sm text-slate-600">
                  Free tools for GST and TDS compliance
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-green-600 border-green-200 bg-green-50"
              >
                Free
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {CALCULATORS.map((tool) => {
                const Icon = tool.icon
                return (
                  <Link key={tool.id} href={tool.href}>
                    <Card className="border-slate-200 hover:border-slate-300 hover:shadow-md transition-all h-full bg-white group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                              <Icon className="h-5 w-5 text-slate-700" />
                            </div>
                            <CardTitle className="text-base font-medium text-slate-900">
                              {tool.name}
                            </CardTitle>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-slate-600">
                          {tool.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {tool.features.map((feature) => (
                            <div
                              key={feature}
                              className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded"
                            >
                              <CheckCircle2 className="h-3 w-3 text-slate-400" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Documents Section */}
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 space-y-8">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Document Generators
                </h3>
                <p className="text-sm text-slate-600">
                  Professional PDFs for your business needs
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-200 bg-blue-50"
              >
                PDF Download
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {DOCUMENTS.map((tool) => {
                const Icon = tool.icon
                return (
                  <Link key={tool.id} href={tool.href}>
                    <Card className="border-slate-200 hover:border-slate-300 hover:shadow-md transition-all h-full bg-white group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="p-2.5 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                            <Icon className="h-5 w-5 text-slate-700" />
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-100 text-slate-600"
                          >
                            {tool.badge}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <CardTitle className="text-base font-medium text-slate-900">
                          {tool.name}
                        </CardTitle>
                        <p className="text-sm text-slate-600">
                          {tool.description}
                        </p>
                        <div className="space-y-1.5 pt-1">
                          {tool.features.map((feature) => (
                            <div key={feature} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                              <span className="text-xs text-slate-500">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Quick Reference Section */}
        <section className="py-12 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 space-y-8">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                Penalty Quick Reference
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Current rates as per GST Act and Income Tax Act
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {/* GST Card */}
              <Card className="border-slate-200 bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium text-slate-900">
                      GST Late Filing
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Section 47 & 48
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Late Fee</span>
                      <span className="font-medium text-slate-900">
                        ₹100/day
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Maximum Cap</span>
                      <span className="font-medium text-slate-900">₹5,000</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600">Interest</span>
                      <span className="font-medium text-slate-900">18% p.a.</span>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-300"
                  >
                    <Link href="/gst-calculator">
                      Calculate GST Penalty →
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* TDS Card */}
              <Card className="border-slate-200 bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium text-slate-900">
                      TDS Late Filing
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Section 234E
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Late Fee</span>
                      <span className="font-medium text-slate-900">
                        ₹200/day
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Maximum Cap</span>
                      <span className="font-medium text-slate-900">TDS Amount</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600">Applies from</span>
                      <span className="font-medium text-slate-900">Day 1</span>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-300"
                  >
                    <Link href="/tds-calculator">
                      Calculate TDS Fee →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-auto">
          <div className="container mx-auto px-4 py-10">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-slate-800 rounded">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-slate-900">
                    ComplianceKit
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Documents & compliance tools for Indian businesses.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3 text-sm">
                  Calculators
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/gst-calculator"
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      GST Penalty Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tds-calculator"
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      TDS Fee Calculator
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3 text-sm">
                  Documents
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/invoice"
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      Invoice Generator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/salary-slip"
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      Salary Slip
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/rent-agreement"
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      Rent Agreement
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3 text-sm">
                  Legal
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 text-center">
              <p className="text-xs text-slate-500">
                © 2025 ComplianceKit. Calculations are for estimation purposes.
                Consult a CA for official advice.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
