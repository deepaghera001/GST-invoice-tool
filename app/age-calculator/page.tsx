'use client';

import Head from "next/head";
import { PageHeader, Footer } from "@/components/home";
import { AgeCalculatorForm } from "@/components/documents/age-calculator/age-calculator-form";

export default function AgeCalculatorPage() {
  return (
    <>
      <Head>
        <title>Age Calculator - Professional Insights | ComplianceKit</title>
        <meta
          name="description"
          content="Calculate your exact age in years, months, and days. Get insights on zodiac signs, eligibility for voting, retirement, and more."
        />
        <meta name="keywords" content="age calculator India, birth date calculator, eligibility calculator, zodiac sign finder, day calculator" />
      </Head>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <PageHeader />

        <div className="flex-grow">
          {/* Breadcrumb or simple heading */}
          <div className="bg-primary/5 border-b">
            <div className="container mx-auto px-4 py-8 md:py-12">
              <h1 className="text-3xl md:text-4xl font-black text-center mb-4">
                Professional <span className="text-primary">Age Calculator</span>
              </h1>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto">
                Get more than just years. Discover your total life duration, zodiac traits, eligibility for legal rights, and health-career tips tailored to your age.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-6xl">
              <AgeCalculatorForm />
            </div>
          </section>

          {/* Additional Info Section for SEO */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4 max-w-4xl space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-3">Why use our calculator?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Unlike basic tools, our Age Calculator provides professional compliance insights such as voting eligibility, senior citizen benefits status, and career phase alignment. It's designed for both personal curiosity and professional planning.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">India-Specific Benefits</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We track specific Indian legal milestones including legal voting age, driving license eligibility (18+), and retirement benchmarks (60+) to help you stay compliant and informed.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
