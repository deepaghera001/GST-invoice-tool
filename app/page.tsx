import { InvoiceForm } from "@/components/invoice-form"
import { FileText, Shield, Zap, CheckCircle2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">InvoiceGen</h1>
              <p className="text-xs text-muted-foreground">Professional GST Invoices</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>GST Compliant Format</span>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              Generate invoices in under 2 minutes
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance leading-tight">
              GST Invoice Generator for Indian Freelancers & Consultants
            </h2>

            <p className="text-lg font-semibold text-foreground">
              ₹99 per invoice • No subscription • Instant PDF
            </p>

            <p className="text-sm text-muted-foreground text-pretty max-w-2xl mx-auto">
              GST-compliant format (standard domestic invoices)
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Secure Payments</p>
                  <p className="text-xs text-muted-foreground">Powered by Razorpay</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Compliant Format</p>
                  <p className="text-xs text-muted-foreground">GST-compliant format (standard domestic invoices)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Instant Download</p>
                  <p className="text-xs text-muted-foreground">PDF ready in seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <InvoiceForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2025 InvoiceGen. Made for Indian freelancers who don't want GST mistakes.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secure & Compliant</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              No data stored after invoice generation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}