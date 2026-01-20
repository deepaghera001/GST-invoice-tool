import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, Calculator, Receipt, IndianRupee, FileText } from 'lucide-react';
import { PageHeader, Footer } from '@/components/home';

export const metadata = {
  title: '404 - Page Not Found | Workngin',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <PageHeader />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Animated 404 with gradient */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 blur-3xl opacity-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
            </div>
            
            <div className="relative">
              <h1 className="text-[180px] sm:text-[220px] font-black leading-none mb-0 bg-gradient-to-br from-slate-800 via-slate-600 to-slate-400 bg-clip-text text-transparent tracking-tight">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full shadow-xl flex items-center justify-center animate-bounce">
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Page Not Found
            </h2>
            <p className="text-lg text-slate-600 max-w-md mx-auto">
              Oops! This page seems to have wandered off. Let's get you back on track.
            </p>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all">
                <Home className="h-5 w-5" />
                Back to Home
              </Button>
            </Link>
            <Link href="/request-document">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-2 hover:bg-slate-50">
                <Search className="h-5 w-5" />
                Request a Document
              </Button>
            </Link>
          </div>

          {/* Popular Tools Grid */}
          <div className="border-t border-slate-200 pt-10">
            <p className="text-sm font-medium text-slate-500 mb-6 uppercase tracking-wide">
              Popular Tools
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/gst-calculator" className="group">
                <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calculator className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">GST Calculator</h3>
                  <p className="text-xs text-slate-500">Free</p>
                </div>
              </Link>

              <Link href="/invoice" className="group">
                <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Receipt className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Invoice</h3>
                  <p className="text-xs text-slate-500">₹99</p>
                </div>
              </Link>

              <Link href="/salary-slip" className="group">
                <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IndianRupee className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Salary Slip</h3>
                  <p className="text-xs text-slate-500">₹99</p>
                </div>
              </Link>

              <Link href="/tds-calculator" className="group">
                <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calculator className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">TDS Calculator</h3>
                  <p className="text-xs text-slate-500">Free</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
