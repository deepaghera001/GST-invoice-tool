import { InvoiceForm } from "@/components/documents/invoice/invoice-form"
import Head from "next/head"
import { PageHeader, Footer } from "@/components/home"

export default function InvoicePage() {
  return (
    <>
      <Head>
        <title>Invoice Generator - ComplianceKit</title>
        <meta
          name="description"
          content="Generate professional GST-compliant invoices with ComplianceKit's Invoice Generator. Easy, fast, and accurate."
        />
        <meta name="keywords" content="invoice generator, GST invoice generator, professional invoices, compliance tools" />
      </Head>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <PageHeader />

        {/* Invoice Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <InvoiceForm />
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}
