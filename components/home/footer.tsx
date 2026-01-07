"use client"

import Link from "next/link"
import { Shield } from "lucide-react"

interface FooterLink {
  label: string
  href: string
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Calculators",
    links: [
      { label: "GST Penalty Calculator", href: "/gst-calculator" },
      { label: "TDS Fee Calculator", href: "/tds-calculator" },
    ],
  },
  {
    title: "Documents",
    links: [
      { label: "Invoice Generator", href: "/invoice" },
      { label: "Salary Slip", href: "/salary-slip" },
      { label: "Rent Agreement", href: "/rent-agreement" },
      { label: "Influencer Contract", href: "/influencer-contract" },
    ],
  },
  {
    title: "Advanced",
    links: [
      { label: "Shareholders Agreement (Draft)", href: "/shareholders-agreement" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Request a Document", href: "/request-document" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-slate-800 rounded">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-slate-900">ComplianceKit</span>
            </div>
            <p className="text-sm text-slate-500">
              Documents & compliance tools for Indian businesses.
            </p>
            <p className="text-xs text-slate-400 mt-3">
              We respect your time and your data.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="font-medium text-slate-900 mb-3 text-sm">
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © 2026 ComplianceKit. Calculations are for estimation purposes.
            </p>
            <p className="text-xs text-slate-400">
              No login. No data stored. Just documents.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
