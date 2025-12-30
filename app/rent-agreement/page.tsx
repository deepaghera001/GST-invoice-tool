import Link from "next/link"
import { RentAgreementForm } from "@/components/documents/rent-agreement/rent-agreement-form"
import { FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RentAgreementPage() {
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
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Rent Agreement Generator</h2>
            <p className="text-muted-foreground">
              Create a legally formatted rent agreement for residential properties in India
            </p>
          </div>
          <RentAgreementForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2025 ComplianceKit. Rent Agreement Generator for Indian Properties.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Secure & Private</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              This is a template generator. For legal validity, please get the agreement registered and stamped as per your state's requirements.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
