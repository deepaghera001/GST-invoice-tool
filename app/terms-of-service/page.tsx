import { PageHeader, Footer } from "@/components/home";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export const metadata = {
  title: "Terms of Service - Workngin",
  description: "Terms of Service for Workngin - Legal terms and conditions for using our platform",
};

export default function TermsOfServicePage() {
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
            <span className="text-slate-900 font-medium">Terms of Service</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Terms of Service</h1>
            <p className="text-slate-600">Last updated: January 7, 2026</p>
          </div>

          <Card className="shadow-sm">
            <CardContent className="prose prose-slate max-w-none pt-6">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-slate-700 leading-relaxed">
                  By accessing or using Workngin ("Platform," "Service"), you agree to be bound by these 
                  Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Description of Service</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Workngin provides:
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>GST and TDS calculators (free tools)</li>
                  <li>Document generators (invoices, salary slips, rent agreements, contracts)</li>
                  <li>Compliance assistance tools for Indian businesses</li>
                  <li>PDF generation and download services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. User Eligibility</h2>
                <p className="text-slate-700 leading-relaxed">
                  You must be at least 18 years old and capable of forming a binding contract to use this Service. 
                  By using our Platform, you represent that you meet these requirements.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Payment Terms</h2>
                <h3 className="text-xl font-medium text-slate-900 mb-3">4.1 Pricing</h3>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Certain features require payment. Prices are displayed in Indian Rupees (INR) and are subject to change.
                </p>
                
                <h3 className="text-xl font-medium text-slate-900 mb-3">4.2 Payment Processing</h3>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Payments are processed securely through Razorpay. We do not store your payment card information.
                </p>

                <h3 className="text-xl font-medium text-slate-900 mb-3">4.3 Refunds</h3>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Due to the digital nature of our service and instant delivery of documents:
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Refunds are generally not available once a document is generated</li>
                  <li>Refunds may be issued in case of technical errors preventing document generation</li>
                  <li>Refund requests must be made within 24 hours of purchase</li>
                  <li>Contact us at support@workngin.com for refund requests</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. User Responsibilities</h2>
                <p className="text-slate-700 leading-relaxed mb-3">You agree to:</p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Use the Service only for lawful purposes</li>
                  <li>Not misuse or attempt to circumvent our payment systems</li>
                  <li>Not reverse engineer or copy our Platform</li>
                  <li>Verify all generated documents for accuracy before use</li>
                  <li>Consult with legal or tax professionals when necessary</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Disclaimer of Warranties</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  <strong>IMPORTANT:</strong> Our Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind.
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Calculations are for <strong>estimation purposes only</strong></li>
                  <li>We do not guarantee accuracy or completeness of generated documents</li>
                  <li>Documents may require review by qualified professionals</li>
                  <li>We are not responsible for compliance with all applicable laws</li>
                  <li>Tax laws and rates may change - verify current regulations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Limitation of Liability</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  To the maximum extent permitted by law:
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>We are not liable for any indirect, incidental, or consequential damages</li>
                  <li>Our total liability shall not exceed the amount paid by you for the Service</li>
                  <li>We are not responsible for errors in data you provide</li>
                  <li>We are not liable for tax penalties or legal issues arising from document use</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Intellectual Property</h2>
                <p className="text-slate-700 leading-relaxed">
                  All content, features, and functionality of the Platform are owned by Workngin and are 
                  protected by copyright, trademark, and other intellectual property laws. You may not copy, 
                  reproduce, or distribute our content without permission.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Data and Privacy</h2>
                <p className="text-slate-700 leading-relaxed">
                  Your use of the Service is also governed by our Privacy Policy. We do not store document data 
                  on our servers - all document generation happens in your browser.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Professional Advice Disclaimer</h2>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                  <p className="text-slate-900 font-semibold mb-2">Important Notice:</p>
                  <p className="text-slate-700 leading-relaxed">
                    Workngin does not provide legal, tax, or financial advice. Our tools are designed to 
                    assist with document creation and calculations, but should not replace professional consultation. 
                    Always consult with qualified legal, tax, or financial professionals for your specific situation.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Service Modifications</h2>
                <p className="text-slate-700 leading-relaxed">
                  We reserve the right to modify, suspend, or discontinue any part of the Service at any time 
                  without notice. We may also change pricing with reasonable notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Termination</h2>
                <p className="text-slate-700 leading-relaxed">
                  We may terminate or suspend your access to the Service immediately, without prior notice, 
                  for any breach of these Terms or for any other reason at our discretion.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Governing Law</h2>
                <p className="text-slate-700 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of India. 
                  Any disputes shall be subject to the exclusive jurisdiction of courts in [Your City], India.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">14. Changes to Terms</h2>
                <p className="text-slate-700 leading-relaxed">
                  We may update these Terms from time to time. Continued use of the Service after changes 
                  constitutes acceptance of the modified Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">15. Contact Information</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  For questions about these Terms, please contact us at:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700">
                    <strong>Email:</strong> legal@workngin.com<br />
                    <strong>Support:</strong> support@workngin.com
                  </p>
                </div>
              </section>

              <section className="mb-0">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-slate-700 text-sm">
                    By using Workngin, you acknowledge that you have read, understood, and agree to be 
                    bound by these Terms of Service.
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
