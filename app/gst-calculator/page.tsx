'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, FlaskConical } from 'lucide-react';
import { usePayment } from '@/lib/hooks/use-payment';
import { isTestMode } from '@/lib/testing';
import { GSTPenaltyForm } from '@/components/documents/gst-penalty/gst-penalty-form';
import { useState } from 'react';
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
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-slate-800 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-slate-900">ComplianceKit</span>
                <p className="text-xs text-slate-500">Documents & Compliance Tools</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {isTestMode && (
                <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1">
                  <FlaskConical className="h-3 w-3" />
                  Test Mode
                </Badge>
              )}
              <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                GST Late Fee & Interest Calculator
              </h1>
              <p className="text-slate-600">
                Based on CGST Act Section 47 & 50, Notification 19/2021 & 20/2021. For estimation purposes.
              </p>
            </div>

            <GSTPenaltyForm />

            {/* Info Section */}
            <Card className="mt-8 border-slate-200 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-900">GST Late Fee & Interest Rules (Section 47 & 50)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium text-slate-800">Late Fee (Section 47 + Notification 19/2021):</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Regular Return:</strong> ₹50/day CGST + ₹50/day SGST = ₹100/day total</li>
                      <li><strong>NIL Return:</strong> ₹10/day CGST + ₹10/day SGST = ₹20/day total</li>
                      <li><strong>Regular Cap:</strong> ₹2,500 CGST + ₹2,500 SGST = ₹5,000 total</li>
                      <li><strong>NIL Return Cap:</strong> ₹250 CGST + ₹250 SGST = ₹500 total</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-800">Interest (Section 50):</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Rate:</strong> 18% per annum on outstanding tax</li>
                      <li><strong>Applies when:</strong> Tax payment is also delayed</li>
                      <li><strong>Calculation:</strong> (Tax × 18% × Days Late) / 365</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-slate-500 pt-2 border-t">
                  ⚠️ This is for estimation purposes only. Consult a CA/Tax Professional for official advice. Rules may change.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500 text-center md:text-left">
                © 2025 ComplianceKit. Free GST penalty calculator for Indian businesses.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Free Tool</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400">
                Calculations are for estimation purposes only. Consult a CA for official advice.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
