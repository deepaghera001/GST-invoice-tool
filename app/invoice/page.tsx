import Link from "next/link"
import { InvoiceForm } from "@/components/documents/invoice/invoice-form"
import { FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InvoicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="p-2 bg-primary rounded-lg">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">DocGen</h1>
                <p className="text-xs text-muted-foreground">Professional Documents for India</p>
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

      {/* Invoice Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Create Invoice</h2>
            <p className="text-muted-foreground">Fill in the details below to generate your GST-compliant invoice</p>
          </div>
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
