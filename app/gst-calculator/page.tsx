'use client';

import { GSTPenaltyForm } from '@/components/documents/gst-penalty/gst-penalty-form';
import Head from "next/head";
import { PageHeader, Footer } from "@/components/home";

export default function GSTCalculatorPage() {
  return (
    <>
      <Head>
        <title>GST Penalty Calculator - ComplianceKit</title>
        <meta
          name="description"
          content="Calculate GST late fees and interest with ComplianceKit's GST Penalty Calculator. Accurate, fast, and easy to use."
        />
        <meta name="keywords" content="GST penalty calculator, GST late fee calculator, GST interest calculator, compliance tools" />
      </Head>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <PageHeader />

        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <GSTPenaltyForm />
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
