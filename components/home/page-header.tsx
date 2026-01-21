"use client"

import Link from "next/link"
import { Shield, ArrowLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  showBackButton?: boolean
  showNav?: boolean
}

export function PageHeader({ showBackButton = true, showNav = false }: PageHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="p-2 bg-slate-800 rounded-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Workngin
            </h1>
            <p className="text-xs text-slate-500">
              Documents & Compliance Tools
            </p>
          </div>
        </Link>

        {showNav && (
          <nav className="hidden md:flex items-center gap-1">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100">
              <span className="text-xs font-medium text-slate-500 mr-2">
                Calculators
              </span>
              <Link
                href="/gst-calculator"
                className="text-sm text-slate-700 hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors"
              >
                GST
              </Link>
              <Link
                href="/tds-calculator"
                className="text-sm text-slate-700 hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors"
              >
                TDS
              </Link>
              <Link
                href="/age-calculator"
                className="text-sm text-slate-700 hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors"
              >
                Age
              </Link>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 ml-2">
              <span className="text-xs font-medium text-slate-500 mr-2">
                Documents
              </span>
              <Link
                href="/invoice"
                className="text-sm text-slate-700 hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors"
              >
                Invoice
              </Link>
              <Link
                href="/salary-slip"
                className="text-sm text-slate-700 hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors"
              >
                Salary
              </Link>
              <Link
                href="/rent-agreement"
                className="text-sm text-slate-700 hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors"
              >
                Rent
              </Link>
              <Link
                href="/influencer-contract"
                className="text-sm text-slate-700 hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors"
              >
                Contract
              </Link>
              <Link
                href="/shareholders-agreement"
                className="text-sm text-slate-700 hover:text-slate-900 hover:bg-white px-2 py-1 rounded transition-colors"
              >
                SHA
              </Link>
            </div>
          </nav>
        )}

        {showBackButton && (
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        )}

        {showNav && (
          <Button variant="ghost" size="sm" className="md:hidden">
            <FileText className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  )
}
