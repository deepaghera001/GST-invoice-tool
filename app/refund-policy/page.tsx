import { PageHeader, Footer } from "@/components/home";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export const metadata = {
  title: "Refund & Cancellation Policy - Workngin",
  description: "Refund and Cancellation Policy for Workngin digital services",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader />
      
      <main className="flex-1 bg-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 font-medium">Refund & Cancellation Policy</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Refund & Cancellation Policy</h1>
            <p className="text-slate-600">Last updated: February 2, 2026</p>
          </div>

          <Card className="shadow-sm">
            <CardContent className="prose prose-slate max-w-none pt-6">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Overview</h2>
                <p className="text-slate-700 leading-relaxed">
                  This Refund & Cancellation Policy outlines the terms under which refunds may be requested 
                  for services purchased on Workngin. By making a purchase, you agree to the terms of this policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Digital Products</h2>
                <p className="text-slate-700 leading-relaxed">
                  Our platform provides digital products and services that are delivered instantly upon 
                  successful payment. Due to the nature of digital delivery, all sales are considered final 
                  once the product has been accessed or downloaded.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Refund Eligibility</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Refunds may be considered in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Technical failure preventing service delivery</li>
                  <li>Duplicate or erroneous charges</li>
                  <li>Service not delivered as described</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Non-Refundable Cases</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Refunds will not be provided in the following cases:
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Service has been successfully delivered or accessed</li>
                  <li>User-provided incorrect information</li>
                  <li>Change of mind after purchase</li>
                  <li>Issues caused by user&apos;s device or network</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Cancellation</h2>
                <p className="text-slate-700 leading-relaxed">
                  Orders may be cancelled before payment is completed. Once payment is successful and 
                  the service is delivered, cancellation is not possible.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Refund Request Process</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  To request a refund:
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Contact us within 24 hours of payment</li>
                  <li>Provide your transaction ID or payment reference</li>
                  <li>Describe the issue encountered</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Refund Processing</h2>
                <p className="text-slate-700 leading-relaxed">
                  Approved refunds will be processed within 5-7 business days. The refund will be 
                  credited to the original payment method. Additional processing time by your bank may apply.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Contact Us</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  For refund requests or questions about this policy:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700">
                    <strong>Email:</strong> support@workngin.com
                  </p>
                </div>
              </section>

              <section className="mb-0">
                <div className="bg-slate-100 border-l-4 border-slate-400 p-4">
                  <p className="text-slate-700 text-sm">
                    This policy is subject to change. Updates will be posted on this page.
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
