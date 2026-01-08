"use client"

import Link from "next/link"
import { Calculator, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-600 hover:bg-slate-100"
          >
            No login. No registration. No "relation" — because some things don't need introductions.
          </Badge>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
            Documents & Compliance Tools
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Generate professional business documents and calculate GST/TDS penalties. 
            What you see is what you download.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button
              size="lg"
              asChild
              className="gap-2 bg-slate-800 hover:bg-slate-900 text-white"
            >
              <Link href="/gst-calculator">
                <Calculator className="h-4 w-4" />
                GST Calculator
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="gap-2 border-slate-300"
            >
              <Link href="/invoice">
                <Receipt className="h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
