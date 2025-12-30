"use client"

import Link from "next/link"
import { FileText, Shield, CheckCircle2, ArrowRight, Calculator, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const TOOLS = [
  {
    id: "gst-calculator",
    name: "GST Penalty Calculator",
    icon: Calculator,
    description: "Calculate late fees and interest for GST returns",
    features: ["GSTR-1 & GSTR-3B", "Late Fee + Interest", "Based on GST Act"],
    href: "/gst-calculator",
  },
  {
    id: "tds-calculator",
    name: "TDS Late Fee Calculator",
    icon: Calculator,
    description: "Calculate late filing fees for TDS returns",
    features: ["All TDS Sections", "Cap at TDS Amount", "Section 234E & 201(1A)"],
    href: "/tds-calculator",
  },
  {
    id: "invoice",
    name: "Invoice Generator",
    icon: FileText,
    description: "Professional GST-compliant invoices",
    features: ["GST Calculations", "CGST/SGST/IGST", "PDF Download"],
    href: "/invoice",
  },
  {
    id: "salary-slip",
    name: "Salary Slip",
    icon: IndianRupee,
    description: "Employee salary statements",
    features: ["Tax Calculations", "CTC Breakdown", "PDF Format"],
    href: "/salary-slip",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">ComplianceKit</h1>
              <p className="text-xs text-slate-500">GST & TDS Compliance Tools</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/gst-calculator" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              GST Calculator
            </Link>
            <Link href="/tds-calculator" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              TDS Calculator
            </Link>
            <Link href="/invoice" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Documents
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section - Clean & Professional */}
      <section className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
              GST & TDS Penalty Calculator
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Calculate late filing penalties based on current GST and Income Tax rules. 
              For estimation purposes only.
            </p>

            {/* Dual CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button size="lg" asChild className="gap-2 bg-slate-800 hover:bg-slate-900 text-white">
                <Link href="/gst-calculator">
                  GST Penalty Calculator
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2 border-slate-300">
                <Link href="/tds-calculator">
                  TDS Fee Calculator
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 space-y-10">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <h3 className="text-2xl font-semibold text-slate-900">Tools</h3>
            <p className="text-slate-600">
              Penalty calculators and document generators for your compliance needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {TOOLS.map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.id} href={tool.href}>
                  <Card className="border-slate-200 hover:border-slate-300 transition-colors h-full bg-white">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <Icon className="h-4 w-4 text-slate-600" />
                        </div>
                        <CardTitle className="text-sm font-medium text-slate-900">{tool.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-600">{tool.description}</p>
                      <div className="space-y-1.5">
                        {tool.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-xs text-slate-500">{feature}</span>
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

      {/* Penalty Reference Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 space-y-10">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <h3 className="text-2xl font-semibold text-slate-900">Penalty Reference</h3>
            <p className="text-slate-600">
              Current rates as per GST Act and Income Tax Act.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* GST Card */}
            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-slate-900">
                  GST Late Filing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Late Fee (after grace period)</span>
                    <span className="font-medium text-slate-900">₹100/day</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Maximum Cap</span>
                    <span className="font-medium text-slate-900">₹5,000</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Interest (if tax also late)</span>
                    <span className="font-medium text-slate-900">18% p.a.</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Based on GST Act Section 47 & 48</p>
                <Button asChild variant="outline" className="w-full border-slate-300">
                  <Link href="/gst-calculator">Calculate GST Penalty</Link>
                </Button>
              </CardContent>
            </Card>

            {/* TDS Card */}
            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-slate-900">
                  TDS Late Filing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Late Fee</span>
                    <span className="font-medium text-slate-900">₹200/day</span>
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
                <p className="text-xs text-slate-500">Based on Income Tax Act Section 234E & 201(1A)</p>
                <Button asChild variant="outline" className="w-full border-slate-300">
                  <Link href="/tds-calculator">Calculate TDS Fee</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-slate-800 rounded">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-slate-900">ComplianceKit</span>
              </div>
              <p className="text-sm text-slate-500">
                GST & TDS compliance tools for Indian businesses.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-slate-900 mb-3 text-sm">Tools</h4>
              <ul className="space-y-2">
                <li><Link href="/gst-calculator" className="text-sm text-slate-500 hover:text-slate-700">GST Penalty Calculator</Link></li>
                <li><Link href="/tds-calculator" className="text-sm text-slate-500 hover:text-slate-700">TDS Fee Calculator</Link></li>
                <li><Link href="/invoice" className="text-sm text-slate-500 hover:text-slate-700">Invoice Generator</Link></li>
                <li><Link href="/salary-slip" className="text-sm text-slate-500 hover:text-slate-700">Salary Slip</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-slate-900 mb-3 text-sm">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-slate-500 hover:text-slate-700">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-slate-700">Terms of Service</a></li>
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
  )
}
