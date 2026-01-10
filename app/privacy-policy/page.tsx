import { PageHeader, Footer } from "@/components/home";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - Workngin",
  description: "Privacy Policy for Workngin - How we collect, use, and protect your data",
};

export default function PrivacyPolicyPage() {
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
            <span className="text-slate-900 font-medium">Privacy Policy</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
            <p className="text-slate-600">Last updated: January 7, 2026</p>
          </div>

          <Card className="shadow-sm">
            <CardContent className="prose prose-slate max-w-none pt-6">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
                <p className="text-slate-700 leading-relaxed">
                  Welcome to Workngin ("we," "our," or "us"). We are committed to protecting your privacy 
                  and ensuring the security of your personal information. This Privacy Policy explains how we 
                  collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-medium text-slate-900 mb-3">2.1 Information You Provide</h3>
                <p className="text-slate-700 leading-relaxed mb-3">
                  When you use our services, you may provide:
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                  <li>Business information (company name, address, GSTIN, PAN)</li>
                  <li>Contact information (email address for notifications)</li>
                  <li>Document data (invoice details, salary information, agreement details)</li>
                  <li>Payment information (processed securely through Razorpay)</li>
                </ul>

                <h3 className="text-xl font-medium text-slate-900 mb-3">2.2 Automatically Collected Information</h3>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Usage statistics and analytics data</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-slate-700 leading-relaxed mb-3">We use your information to:</p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Generate documents and provide our services</li>
                  <li>Process payments securely</li>
                  <li>Send email notifications (if requested)</li>
                  <li>Improve our platform and user experience</li>
                  <li>Comply with legal obligations</li>
                  <li>Prevent fraud and ensure security</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Data Storage and Security</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  <strong>Important:</strong> We do not store your document data on our servers. All document 
                  generation happens in your browser, and PDFs are created locally on your device.
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Payment data is processed securely through Razorpay (PCI DSS compliant)</li>
                  <li>We use industry-standard encryption for data transmission</li>
                  <li>Email notifications are sent through Resend with encryption</li>
                  <li>Analytics data is anonymized and aggregated</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Data Sharing and Disclosure</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  We do not sell or rent your personal information. We may share data with:
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li><strong>Payment Processors:</strong> Razorpay for payment processing</li>
                  <li><strong>Email Services:</strong> Resend for email notifications</li>
                  <li><strong>Analytics Providers:</strong> Vercel Analytics (anonymized data)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Your Rights</h2>
                <p className="text-slate-700 leading-relaxed mb-3">You have the right to:</p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Cookies</h2>
                <p className="text-slate-700 leading-relaxed">
                  We use cookies and similar technologies to improve user experience and analyze usage. 
                  You can control cookies through your browser settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Children's Privacy</h2>
                <p className="text-slate-700 leading-relaxed">
                  Our services are not directed to individuals under 18 years of age. We do not knowingly 
                  collect personal information from children.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. International Users</h2>
                <p className="text-slate-700 leading-relaxed">
                  Our services are primarily designed for users in India. By using our platform, you consent 
                  to the transfer and processing of your information in accordance with Indian data protection laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Changes to Privacy Policy</h2>
                <p className="text-slate-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material 
                  changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Contact Us</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  If you have questions about this Privacy Policy or our practices, please contact us at:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700">
                    <strong>Email:</strong> privacy@workngin.com<br />
                    <strong>Address:</strong> [Your Business Address]
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
