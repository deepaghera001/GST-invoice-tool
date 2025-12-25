"use client"

import Link from "next/link"
import { FileText, Shield, Zap, CheckCircle2, ArrowRight, TrendingUp, Clock, Lock, FileCheck, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DOCUMENTS = [
  {
    id: "invoice",
    name: "Invoice",
    icon: FileText,
    description: "Professional GST-compliant invoices for services and products",
    features: ["GST Calculations", "CGST/SGST Support", "Inter-state Support"],
    href: "/invoice",
  },
  {
    id: "salary-slip",
    name: "Salary Slip",
    icon: IndianRupee,
    description: "Employee salary statements with deductions and benefits",
    features: ["Tax Calculations", "CTC Breakdown", "Secure Format"],
    href: "#",
    comingSoon: true,
  },
  {
    id: "quotation",
    name: "Quotation",
    icon: FileCheck,
    description: "Professional quotations and estimates for clients",
    features: ["Custom Terms", "Item Pricing", "Professional Layout"],
    href: "#",
    comingSoon: true,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">DocGen</h1>
              <p className="text-xs text-muted-foreground">Professional Documents for India</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Compliant & Secure</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-background border-b border-border flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary border border-primary/20 hover:border-primary/40 transition-colors">
                <Zap className="h-4 w-4" />
                <span>Generate professional documents in minutes</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Professional Documents for{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Indian Businesses
                </span>
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                Generate compliant documents instantly. Invoices, salary slips, quotations, and more. No subscriptions, no complications.
              </p>
            </div>

            {/* Pricing & CTA */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Pay once per document</p>
                <p className="text-3xl md:text-4xl font-bold text-foreground">₹99</p>
              </div>
              <Button size="lg" asChild className="gap-2">
                <Link href="/invoice">
                  Get Started Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-4 pt-12">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Quick Generation</p>
                  <p className="text-sm text-muted-foreground mt-1">Create documents in under 2 minutes</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Fully Compliant</p>
                  <p className="text-sm text-muted-foreground mt-1">Follows all Indian compliance standards</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Secure & Private</p>
                  <p className="text-sm text-muted-foreground mt-1">No data storage. Instant processing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 space-y-12">
          {/* Section Header */}
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">Supported Documents</h3>
            <p className="text-lg text-muted-foreground">
              Start with invoices. More document types coming soon.
            </p>
          </div>

          {/* Document Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {DOCUMENTS.map((doc) => {
              const Icon = doc.icon
              return (
                <Link key={doc.id} href={doc.href} className={doc.comingSoon ? "pointer-events-none" : ""}>
                  <Card className="border-border/50 hover:border-primary/30 transition-all hover:shadow-md h-full relative">
                    {doc.comingSoon && (
                      <div className="absolute top-4 right-4">
                        <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900/30 dark:text-yellow-200">
                          Coming Soon
                        </span>
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle>{doc.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                      <div className="space-y-2">
                        {doc.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                      {!doc.comingSoon && (
                        <Button size="sm" className="w-full gap-2" variant="default">
                          Create {doc.name}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 space-y-12">
          {/* Section Header */}
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">Why Choose DocGen?</h3>
            <p className="text-lg text-muted-foreground">
              Built for Indian businesses. Compliant, secure, and easy to use.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Professional Format
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Standard compliant formats that are accepted by all government portals and clients. Includes all required fields and calculations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Smart Calculations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automatic calculations specific to each document type. GST calculations, salary breakdowns, and more - all handled for you.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Fast & Easy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No complicated setup. Just enter your details and we handle the formatting, validations, and PDF generation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Secure Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Payment processing powered by Razorpay. We don't store your payment information or document data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 space-y-12">
          {/* Section Header */}
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">How It Works</h3>
            <p className="text-lg text-muted-foreground">
              Same simple process for all documents
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/30">
                <span className="font-bold text-primary text-lg">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Choose Document</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Select the type of document you need to generate from our library.
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/30">
                <span className="font-bold text-primary text-lg">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Fill Details</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your information. Real-time validation ensures accuracy and compliance.
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/30">
                <span className="font-bold text-primary text-lg">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Download PDF</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Review, make secure payment, and get your professional PDF instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">Ready to Create Your Document?</h3>
            <p className="text-lg text-muted-foreground">
              Start generating professional, compliant documents in minutes.
            </p>
            <Button size="lg" asChild className="gap-2">
              <Link href="/invoice">
                Create Document Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <FileText className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">DocGen</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional documents for Indian businesses. Compliant, secure, and simple.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Documents</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/invoice" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Invoice
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Salary Slip (Coming Soon)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Quotation (Coming Soon)
                  </a>
                </li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">About</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2025 DocGen. Professional documents made simple.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secure & Compliant</span>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-card/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground text-center">
              🔒 Your privacy is important to us. We don't store your documents or payment information. Everything is processed securely and deleted immediately.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}