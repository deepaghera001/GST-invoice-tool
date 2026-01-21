'use client';

import { IncomeTaxComparisonForm } from '@/components/documents/income-tax/income-tax-comparison-form';
import Head from "next/head";
import { PageHeader, Footer } from "@/components/home";

export default function IncomeTaxCalculatorPage() {
  return (
    <>
      <Head>
        <title>Income Tax Calculator 2024-25 - Old vs New Regime Comparison</title>
        <meta
          name="description"
          content="Compare Old Tax Regime vs New Tax Regime for FY 2024-25. Calculate which regime saves you more tax with our free Income Tax Calculator for India."
        />
        <meta 
          name="keywords" 
          content="income tax calculator, old vs new tax regime, tax calculator India 2024, FY 2024-25 tax calculator, income tax comparison, tax savings calculator" 
        />
      </Head>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <PageHeader />

        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <IncomeTaxComparisonForm />
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
