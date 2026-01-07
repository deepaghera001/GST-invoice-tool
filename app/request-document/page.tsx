'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Loader2, Sparkles, ArrowRight, FileText, Lightbulb, Home } from 'lucide-react';
import { PageHeader, Footer } from '@/components/home';
import Link from 'next/link';

export default function RequestDocumentPage() {
  const [formData, setFormData] = useState({
    documentName: '',
    description: '',
    userEmail: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/document-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          documentName: '',
          description: '',
          userEmail: '',
          additionalInfo: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader />
      
      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">Help us grow</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 animate-slide-up">
              Request a New Document
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto animate-slide-up-delay">
              Missing a document? We're constantly expanding our library based on your needs!
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Encouragement Box */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Your Ideas Matter!</CardTitle>
                  <CardDescription className="text-base">
                    Every great feature starts with a suggestion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-600">
                      We review every request personally
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-600">
                      Popular requests get prioritized
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-600">
                      Get notified when it's ready
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-delay">
                <CardHeader>
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Need Inspiration?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <p className="font-medium text-slate-900">Popular requests:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Employment Agreement</li>
                    <li>• Non-Disclosure Agreement</li>
                    <li>• Purchase Order</li>
                    <li>• Quotation Template</li>
                    <li>• Offer Letter</li>
                  </ul>
                </CardContent>
              </Card>

              <Link href="/">
                <Button variant="outline" className="w-full group">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-slate-200 animate-slide-up">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                  <CardTitle className="text-2xl">Tell Us What You Need</CardTitle>
                  <CardDescription className="text-base">
                    Fill out the form below and we'll work on bringing your document to life
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="documentName" className="text-base font-medium">
                        Document Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="documentName"
                        name="documentName"
                        placeholder="e.g., Employment Agreement, NDA, Purchase Order..."
                        value={formData.documentName}
                        onChange={handleChange}
                        required
                        className="h-11 text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                      <Label htmlFor="description" className="text-base font-medium">
                        What should this document do? <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe the purpose, key sections, and information this document should include. The more details, the better!"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                      <Label htmlFor="userEmail" className="text-base font-medium">
                        Your Email (Optional)
                      </Label>
                      <Input
                        id="userEmail"
                        name="userEmail"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.userEmail}
                        onChange={handleChange}
                        className="h-11 text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        We'll notify you when this document is available
                      </p>
                    </div>

                    <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                      <Label htmlFor="additionalInfo" className="text-base font-medium">
                        Additional Information
                      </Label>
                      <Textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        placeholder="Any specific features, compliance requirements, or use cases you have in mind..."
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows={4}
                        className="text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {submitStatus === 'success' && (
                      <Alert className="bg-green-50 border-green-200 animate-slide-down">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <AlertDescription className="text-green-800 text-base">
                          🎉 Thank you! Your document request has been submitted successfully. We'll review it soon!
                        </AlertDescription>
                      </Alert>
                    )}

                    {submitStatus === 'error' && (
                      <Alert variant="destructive" className="animate-shake">
                        <AlertDescription className="text-base">
                          Something went wrong. Please try again later.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Submitting Your Request...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Submit Request
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="border-2 border-dashed border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-2xl font-bold mb-3">Together We Build Better Tools</h3>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  Your feedback shapes our roadmap. Every suggestion helps us create documents that truly serve your needs.
                </p>
                <Link href="/">
                  <Button variant="outline" size="lg" className="group">
                    Explore Current Documents
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-slide-up-delay {
          animation: slide-up 0.6s ease-out 0.2s both;
        }

        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
