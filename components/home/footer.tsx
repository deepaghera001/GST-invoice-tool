"use client"

import Link from "next/link"
import { LogoWE } from "@/components/shared/logo-we"

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
      { label: "Age Calculator", href: "/age-calculator" },
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
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Request a Document", href: "/request-document" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              {/* <div className="p-1.5 h-10 w-10 bg-slate-800 rounded"> */}
                           <LogoWE className="h-8 w-8" />

              {/* </div> */}
              <span className="font-medium text-slate-900">Workngin</span>
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
              © 2026 Workngin. Calculations are for estimation purposes.
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
