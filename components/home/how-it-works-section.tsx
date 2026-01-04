"use client"

import { Eye, FileDown, CreditCard, FileText } from "lucide-react"

const STEPS = [
  {
    icon: FileText,
    title: "Fill the details",
    description: "Enter the required information in the form",
  },
  {
    icon: Eye,
    title: "Review the preview",
    description: "See exactly what your document will look like",
  },
  {
    icon: CreditCard,
    title: "Make payment",
    description: "Simple, secure payment process",
  },
  {
    icon: FileDown,
    title: "Download PDF",
    description: "Get your professional document instantly",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-12 bg-white border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-xl font-semibold text-slate-900">
              A clear flow. No guessing games.
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              See the document before you pay. No surprises later.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="text-center">
                  <div className="relative">
                    <div className="w-12 h-12 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-slate-700" />
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className="hidden md:block absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-px bg-slate-200" />
                    )}
                  </div>
                  <h4 className="font-medium text-slate-900 text-sm mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
