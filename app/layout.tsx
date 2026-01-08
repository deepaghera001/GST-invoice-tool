import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ComplianceKit - GST & TDS Calculators, Invoice & Document Generators for Indian Businesses",
  description:
    "Professional compliance tools for Indian businesses. Free GST & TDS calculators, generate GST invoices, salary slips, rent agreements & contracts. Simple, fast, secure.",
  generator: "v0.app",
  keywords: [
    "GST calculator India",
    "TDS calculator",
    "invoice generator",
    "salary slip generator",
    "rent agreement India",
    "GST compliance",
    "Indian tax calculator",
    "business documents India",
    "ComplianceKit"
  ],
  authors: [{ name: "ComplianceKit" }],
  creator: "ComplianceKit",
  publisher: "ComplianceKit",
  metadataBase: new URL('https://compliancekit.example.com'), // Update with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://compliancekit.example.com',
    siteName: 'ComplianceKit',
    title: 'ComplianceKit - Compliance Tools for Indian Businesses',
    description: 'Free GST & TDS calculators. Generate professional invoices, salary slips, and legal documents for your business.',
    images: [
      {
        url: '/og-image.png', // Create this image (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: 'ComplianceKit - Business Compliance Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ComplianceKit - Compliance Tools for Indian Businesses',
    description: 'Free GST & TDS calculators. Generate professional business documents.',
    images: ['/og-image.png'], // Same as OpenGraph image
    creator: '@compliancekit', // Update with your actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  verification: {
    // Add these when you set up Google Search Console and other tools
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
