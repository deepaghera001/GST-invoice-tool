import type { Metadata } from "next"
import { PageHeader } from "@/components/home/page-header"
import { Footer } from "@/components/home/footer"
import { UCPValidatorForm } from "@/components/documents/ucp/ucp-validator-form"

export const metadata: Metadata = {
  title: "UCP Manifest Validator | Universal Commerce Protocol Report Generator",
  description: "Free, professional validator for Universal Commerce Protocol (UCP) manifests. Check your AI shopping agent compliance and generate professional PDF validation reports.",
  keywords: ["UCP Validator", "Universal Commerce Protocol", "AI Shopping Agent", "Manifest Validation", "UCP 600", "Protocol Compliance", "E-commerce Protocol"],
}

export default function UCPValidatorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="sr-only">Universal Commerce Protocol (UCP) Manifest Validator</h1>
        <UCPValidatorForm />
      </main>
      <Footer />
    </div>
  )
}
