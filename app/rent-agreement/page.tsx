import { RentAgreementForm } from "@/components/documents/rent-agreement/rent-agreement-form"
import Head from "next/head"
import { PageHeader, Footer } from "@/components/home"

export default function RentAgreementPage() {
  return (
    <>
      <Head>
        <title>Rent Agreement Generator - Workngin</title>
        <meta
          name="description"
          content="Generate professional rent agreements with Workngin's Rent Agreement Generator. Easy, fast, and accurate."
        />
        <meta name="keywords" content="rent agreement generator, professional rent agreements, compliance tools" />
      </Head>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <PageHeader />

        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <RentAgreementForm />
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}
