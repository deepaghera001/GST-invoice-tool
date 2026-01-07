import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, FileQuestion, ArrowLeft } from 'lucide-react';
import { PageHeader, Footer } from '@/components/home';

export const metadata = {
  title: '404 - Page Not Found | ComplianceKit',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader />
      
      <main className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-2 border-slate-200 shadow-xl">
            <CardContent className="pt-12 pb-12">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-6">
                  <FileQuestion className="h-12 w-12 text-slate-400" />
                </div>
                <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-slate-700 mb-3">Page Not Found</h2>
                <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
                  Oops! The page you're looking for doesn't exist or has been moved.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/">
                    <Button size="lg" className="w-full sm:w-auto gap-2">
                      <Home className="h-5 w-5" />
                      Go to Homepage
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                      <Search className="h-5 w-5" />
                      Browse Documents
                    </Button>
                  </Link>
                </div>

                <div className="pt-6 border-t border-slate-200 mt-8">
                  <p className="text-sm text-slate-600 mb-4">Popular pages:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Link href="/invoice">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        Invoice Generator
                      </Button>
                    </Link>
                    <Link href="/salary-slip">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        Salary Slip
                      </Button>
                    </Link>
                    <Link href="/gst-calculator">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        GST Calculator
                      </Button>
                    </Link>
                    <Link href="/tds-calculator">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        TDS Calculator
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
