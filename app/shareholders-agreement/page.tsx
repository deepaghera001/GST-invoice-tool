import Link from "next/link"
import { ShareholdersAgreementForm } from "@/components/documents/shareholders-agreement/shareholders-agreement-form"
import { FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shareholders Agreement Generator - ComplianceKit",
  description: "Generate professional shareholders agreements for Indian companies. Easy, compliant, and legally sound.",
  keywords: "shareholders agreement, shareholders agreement India, startup shareholders agreement",
}

export default function ShareholdersAgreementPage() {
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

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <ShareholdersAgreementForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} ComplianceKit. Shareholders Agreement Generator for Indian Companies.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Secure & Private</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              This document is a standard Shareholders Agreement generated based on user inputs. It does not replace professional legal advice and must be reviewed by a qualified legal professional before execution.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
