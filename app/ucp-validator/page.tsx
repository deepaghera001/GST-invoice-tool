import { PageHeader } from "@/components/home/page-header"
import { Footer } from "@/components/home/footer"
import { UCPValidatorForm } from "@/components/documents/ucp/ucp-validator-form"

export default function UCPValidatorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <UCPValidatorForm />
      </main>
      <Footer />
    </div>
  )
}
