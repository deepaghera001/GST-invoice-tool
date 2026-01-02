'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { GSTPenaltyForm } from '@/components/documents/gst-penalty/gst-penalty-form';
import Head from "next/head";

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
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="p-2 bg-primary rounded-lg">
                  <Shield className="h-5 w-5 text-primary-foreground" />
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
            <GSTPenaltyForm />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/30 mt-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © 2025 ComplianceKit. GST penalty calculator for Indian businesses.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Secure & Compliant</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Calculations are for estimation purposes only. Consult a CA for official advice.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
