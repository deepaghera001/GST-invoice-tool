"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PreviewWrapperProps {
  title?: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  previewId?: string
  dataTestId?: string
  /** CSS length value used for the sticky top offset (e.g. '6rem' or '96px') */
  topOffset?: string
  /** CSS length value reserved at the bottom to avoid content being cut off */
  bottomOffset?: string
  /** Extra gap added on top of measured header height (e.g. '0.5rem' or '12px') */
  topGap?: string
  /** ID for the inner PDF content div (used for PDF capture) */
  pdfContentId?: string
}

export function PreviewWrapper({
  title,
  icon,
  children,
  className,
  previewId,
  dataTestId,
  topOffset = "6rem",
  bottomOffset = "4rem",
  topGap = "0.5rem",
  pdfContentId,
}: PreviewWrapperProps) {
  // Measured offsets (in px/rem strings). Default to provided props, then
  // measure actual header/footer heights at runtime to avoid cutoffs.
  const [measuredTop, setMeasuredTop] = useState<string>(topOffset)
  const [measuredBottom, setMeasuredBottom] = useState<string>(bottomOffset)

  useEffect(() => {
    function measure() {
      try {
        const header = document.querySelector("header") as HTMLElement | null
        const footer = document.querySelector("footer") as HTMLElement | null

        const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : null
        const footerHeight = footer ? Math.ceil(footer.getBoundingClientRect().height) : null

        if (headerHeight !== null) setMeasuredTop(`${headerHeight}px`)
        else setMeasuredTop(topOffset)

        if (footerHeight !== null) setMeasuredBottom(`${footerHeight}px`)
        else setMeasuredBottom(bottomOffset)
      } catch {
        setMeasuredTop(topOffset)
        setMeasuredBottom(bottomOffset)
      }
    }

    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [topOffset, bottomOffset])

  // Compute the inner maxHeight dynamically so the preview never exceeds viewport
  // leaving space for the page header and footer. We add a small `topGap` so the
  // preview doesn't touch the page header. Using inline styles avoids Tailwind
  // limitations for dynamic calc() values.
  const innerMaxHeight = `calc(100vh - ( ${measuredTop} + ${topGap} ) - ${measuredBottom} - 30px)`

  return (
    <Card className={`sticky ${className ?? ""}`} style={{ top: `calc(${measuredTop} + ${topGap})` }}>
      {title && (
        <CardHeader className="bg-primary text-primary-foreground sticky top-0 z-20" style={{ top: 0 }}>
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        {/* Inner container controls scrolling so callers can't accidentally disable it with their own classes */}
        <div
          id={previewId}
          data-testid={dataTestId}
          className="p-6 space-y-6 bg-white overflow-auto"
         // style={{ maxHeight: innerMaxHeight }}
        >
          {/* PDF content wrapper - this is what gets captured for PDF */}
          <div id={pdfContentId}>
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
