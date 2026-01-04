"use client"

import Link from "next/link"
import { CheckCircle2, ArrowRight, Calculator, IndianRupee, Home, Receipt, Clock, Users, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Head from "next/head"
import { HeroSection, HowItWorksSection, TrustSection, Footer, PageHeader } from "@/components/home"

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
  {
    id: "influencer-contract",
    name: "Influencer Contract",
    icon: UserCheck,
    description: "Professional contracts for brand-influencer collaborations",
    features: ["Legal Clauses", "Payment Terms", "Content Rights"],
    href: "/influencer-contract",
    badge: "₹199",
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
        <PageHeader showBackButton={false} showNav={true} />

        {/* Hero Section */}
        <HeroSection />

        {/* Trust Indicators */}
        <TrustSection />

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

        {/* How It Works */}
        <HowItWorksSection />

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

        {/* Advanced / Founder Documents Section */}
        <section className="py-12 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 space-y-8">
            <div className="max-w-4xl mx-auto">
              {/* Divider with text */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-slate-300"></div>
                <span className="text-sm text-slate-500 font-medium">Looking for advanced company documents?</span>
                <div className="flex-1 h-px bg-slate-300"></div>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Advanced Business & Founder Documents</h3>
                <p className="text-sm text-slate-600 mt-1">Professional drafts for startups and growing companies</p>
              </div>

              {/* Shareholders Agreement Card - Featured */}
              <div className="max-w-lg mx-auto">
                <Link href="/shareholders-agreement">
                  <Card className="border-slate-300 border-2 hover:border-slate-400 hover:shadow-lg transition-all bg-white group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                            <Users className="h-5 w-5 text-amber-700" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-medium text-slate-900">
                              Shareholders Agreement (Draft Format)
                            </CardTitle>
                            <p className="text-xs text-slate-500 mt-0.5">For founders & early-stage companies</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 font-semibold">
                          ₹2,499
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-600">
                        Comprehensive draft agreement covering equity, vesting, decision-making, and exit clauses.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-xs text-slate-600">Editable & lawyer-review ready</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-xs text-slate-600">Saves legal drafting time</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-xs text-slate-600">Multi-founder & investor friendly</span>
                        </div>
                      </div>
                      
                     

                      <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white gap-2">
                        View Draft Template
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </div>
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
        <Footer />
      </div>
    </>
  )
}
