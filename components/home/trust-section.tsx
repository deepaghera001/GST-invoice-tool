"use client"

import { ShieldCheck, Eye, Mail, Database } from "lucide-react"

const TRUST_ITEMS = [
  {
    icon: Database,
    title: "No data stored",
    description: "Information entered is used only to generate the document and is not stored.",
  },
  {
    icon: Eye,
    title: "Preview-first",
    description: "See the document before you pay. No surprises later.",
  },
  {
    icon: Mail,
    title: "No accounts. No inbox spam.",
    description: "We respect your time and your data.",
  },
  {
    icon: ShieldCheck,
    title: "What you see is what you download",
    description: "The preview matches the final PDF exactly.",
  },
]

export function TrustSection() {
  return (
    <section className="py-10 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="text-center px-3">
                  <div className="w-10 h-10 mx-auto bg-white border border-slate-200 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="h-4 w-4 text-slate-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 text-sm mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
