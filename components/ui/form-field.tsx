"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

interface FormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  success?: boolean
  hint?: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, htmlFor, required, error, success, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          {hint}
        </p>
      )}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {success && !error && (
        <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in">
          <CheckCircle2 className="h-3 w-3" />
          Valid
        </p>
      )}
    </div>
  )
}
