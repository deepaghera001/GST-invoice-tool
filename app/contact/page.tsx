import { PageHeader, Footer } from "@/components/home";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight, Home, Mail, Clock, MessageSquare, FileText, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us - Workngin",
  description: "Contact Workngin for support, refund requests, or business inquiries. We're here to help with your document generation needs.",
};

export default function ContactPage() {
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
            <span className="text-slate-900 font-medium">Contact Us</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Contact Us</h1>
            <p className="text-slate-600">We&apos;re here to help with your questions and concerns</p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* General Support */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">General Support</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      For help with documents, technical issues, or general questions
                    </p>
                    <a 
                      href="mailto:support@workngin.com" 
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      support@workngin.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refund Requests */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">Refund Requests</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      For payment issues or refund requests (within 24 hours)
                    </p>
                    <a 
                      href="mailto:support@workngin.com?subject=Refund%20Request" 
                      className="text-green-600 hover:text-green-800 font-medium text-sm"
                    >
                      support@workngin.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Requests */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">Feature Requests</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Suggest new documents or features you&apos;d like to see
                    </p>
                    <Link 
                      href="/request-document" 
                      className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                    >
                      Request a Document →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">Response Time</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      We typically respond within 24-48 business hours
                    </p>
                    <p className="text-amber-600 font-medium text-sm">
                      Mon-Sat, 10:00 AM - 6:00 PM IST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Contact Information */}
          <Card className="shadow-sm mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  <Mail className="h-5 w-5 text-slate-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">Email</h3>
                    <p className="text-slate-700">
                      <a href="mailto:support@workngin.com" className="hover:text-blue-600">
                        support@workngin.com
                      </a>
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      For all inquiries including support, refunds, and feedback
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  <Clock className="h-5 w-5 text-slate-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">Business Hours</h3>
                    <p className="text-slate-700">Monday to Saturday</p>
                    <p className="text-slate-700">10:00 AM - 6:00 PM IST</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Emails received outside business hours will be addressed the next business day
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="h-6 w-6 text-slate-600" />
                <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
              </div>
              
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="font-medium text-slate-900 mb-2">How do I request a refund?</h3>
                  <p className="text-slate-600 text-sm">
                    Email support@workngin.com within 24 hours of your purchase with your transaction ID 
                    and description of the issue. See our{" "}
                    <Link href="/refund-policy" className="text-blue-600 hover:underline">
                      Refund Policy
                    </Link>{" "}
                    for details.
                  </p>
                </div>

                <div className="border-b border-slate-200 pb-4">
                  <h3 className="font-medium text-slate-900 mb-2">My document download failed. What should I do?</h3>
                  <p className="text-slate-600 text-sm">
                    Try refreshing the page and generating the document again. If the issue persists, 
                    email us with your transaction details and we&apos;ll help you get your document or process a refund.
                  </p>
                </div>

                <div className="border-b border-slate-200 pb-4">
                  <h3 className="font-medium text-slate-900 mb-2">Can I edit my document after downloading?</h3>
                  <p className="text-slate-600 text-sm">
                    Our documents are generated as PDFs. You&apos;ll need to create a new document with the 
                    correct information. We recommend reviewing all details before downloading.
                  </p>
                </div>

                <div className="pb-2">
                  <h3 className="font-medium text-slate-900 mb-2">Is my data stored on your servers?</h3>
                  <p className="text-slate-600 text-sm">
                    No. All document generation happens in your browser. We do not store your document 
                    data on our servers. See our{" "}
                    <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    for more information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom CTA */}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Can&apos;t find what you&apos;re looking for?{" "}
              <a href="mailto:support@workngin.com" className="text-blue-600 hover:underline font-medium">
                Send us an email
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
