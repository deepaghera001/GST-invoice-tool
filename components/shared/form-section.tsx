"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import type { LucideIcon } from "lucide-react"
import { Check } from "lucide-react"

/**
 * Configuration for a single form field
 * 
 * Flexible design allows easy extension without tight coupling
 */
export interface FormFieldConfig {
  /** Unique field name (matches formData key) */
  name: string
  /** User-facing label */
  label: string
  /** HTML input type */
  type?: "text" | "textarea" | "number" | "email" | "date" | "tel" | "url"
  /** Placeholder text */
  placeholder?: string
  /** Whether field is required */
  required?: boolean
  /** Optional help text */
  helpText?: string
  /** Grid column span: 1 (full width), 2 (half width), 3 (third width) - default: auto-detect */
  colSpan?: 1 | 2 | 3 | "full" | "half" | "third"
  /** Min and max constraints for number inputs */
  min?: number | string
  max?: number | string
  step?: number | string
  /** Pattern for text validation (not enforced, for UI purposes) */
  pattern?: string
  /** Max length for text inputs */
  maxLength?: number
  /** Custom validation function - receives field value, returns error message or undefined */
  validate?: (value: any) => string | undefined
  /** Custom transform function - called on onChange before storing value */
  transform?: (value: string) => string | number
  /** If true, field won't be rendered - useful for conditional rendering */
  hidden?: boolean
}

/**
 * Layout configuration for field grouping
 * Allows flexible arrangement without coupling to specific widths
 */
export interface FormSectionLayout {
  /** Columns: 1 (full width), 2 (two columns), 3 (three columns) - default: 1 */
  columns?: 1 | 2 | 3
  /** Gap between fields in pixels - default: 16 */
  gap?: number
  /** Show fields in a single column regardless of colSpan - default: false */
  singleColumn?: boolean
}

/**
 * Props for FormSection component
 * 
 * Loose coupling design:
 * - Accepts any validation via config.validate callback
 * - Allows flexible layout via layout prop
 * - Fields can be any type via type prop
 * - Custom logic via children prop
 */
export interface FormSectionProps {
  /** Section title */
  title: string
  /** Icon component from lucide-react */
  icon: LucideIcon
  /** Field configuration array */
  fields: FormFieldConfig[]
  /** Current form data */
  data: Record<string, any>
  /** Validation errors object */
  errors: Record<string, string>
  /** Change handler */
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  /** Blur handler for validation */
  onBlur?: (fieldName: string, value: any) => void
  /** Function to determine if error should show */
  shouldShowError?: (fieldName: string) => boolean
  /** Optional extra content (suggestions, warnings, custom fields, etc.) */
  children?: React.ReactNode
  /** Whether section is completed */
  isCompleted?: boolean
  /** Additional className for section wrapper */
  className?: string
  /** Layout configuration - control columns, gaps, etc. */
  layout?: FormSectionLayout
  /** 
   * Optional prefix for nested field paths (e.g., "employee" for "employee.name")
   * When set, automatically prefixes field names in onChange, onBlur, shouldShowError, and errors lookup
   */
  fieldPrefix?: string
}

/**
 * Reusable form section component
 *
 * Low-coupling, highly flexible design:
 * - Validation via pluggable validate callbacks
 * - Layout via FormSectionLayout config
 * - Field types easily extensible via type prop
 * - Custom rendering via children prop
 * - Transformations via field.transform
 *
 * Handles:
 * - Consistent Card styling
 * - Icon + title rendering
 * - Dynamic field rendering (any type)
 * - Pluggable validation
 * - Error display
 * - Completion badge
 * - Animations
 * - Flexible grid layouts
 *
 * Document-specific logic goes in children prop, not in component
 */
export function FormSection({
  title,
  icon: Icon,
  fields,
  data,
  errors,
  onChange,
  onBlur,
  shouldShowError = () => false,
  children,
  isCompleted = false,
  className = "",
  layout = { columns: 1, gap: 16 },
  fieldPrefix,
}: FormSectionProps) {
  // Helper to get full field path (with prefix if set)
  const getFullPath = (fieldName: string) => fieldPrefix ? `${fieldPrefix}.${fieldName}` : fieldName
  
  // Helper to get error for field (checks prefixed path)
  const getFieldError = (fieldName: string) => {
    const fullPath = getFullPath(fieldName)
    return errors[fullPath] || errors[fieldName]
  }
  
  // Helper to check if should show error (uses prefixed path)
  const checkShouldShowError = (fieldName: string) => {
    const fullPath = getFullPath(fieldName)
    return shouldShowError(fullPath)
  }

  // Filter visible fields
  const visibleFields = fields.filter((field) => !field.hidden)

  // Determine grid class based on layout config
  const getGridClass = () => {
    if (layout.singleColumn) return "space-y-4"
    
    const columns = layout.columns ?? 1
    switch (columns) {
      case 2:
        return "grid gap-4 md:grid-cols-2"
      case 3:
        return "grid gap-4 md:grid-cols-3"
      default:
        return "space-y-4"
    }
  }

  // Get column span class for individual field
  const getFieldColSpan = (field: FormFieldConfig): string => {
    if (layout.singleColumn || !layout.columns || layout.columns === 1) return ""
    
    const span = field.colSpan ?? "auto"
    
    if (span === "full") return "md:col-span-" + layout.columns
    if (span === "half" && layout.columns >= 2) return "md:col-span-1"
    if (span === "third" && layout.columns === 3) return "md:col-span-1"
    
    if (typeof span === "number") {
      return `md:col-span-${span}`
    }
    
    return ""
  }

  // Handle field change with optional transform and prefix
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: FormFieldConfig) => {
    const fullPath = getFullPath(field.name)
    const value = field.transform ? field.transform(e.target.value) : e.target.value
    const newEvent = {
      ...e,
      target: { ...e.target, name: fullPath, value: value.toString() },
    } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    onChange(newEvent)
  }

  // Handle blur with full path
  const handleBlur = (field: FormFieldConfig, value: any) => {
    const fullPath = getFullPath(field.name)
    onBlur?.(fullPath, value)
  }

  return (
    <div
      className={`
        relative p-6 rounded-xl border transition-all duration-500 ease-out
        ${
          isCompleted
            ? "border-green-400/40 bg-gradient-to-br from-green-50/30 to-transparent dark:from-green-950/10 shadow-md shadow-green-500/5"
            : "border-border bg-card hover:border-primary/30 hover:shadow-md"
        }
        ${className}
      `}
    >
      {/* Completion celebration effect */}
      {isCompleted && (
        <div className="absolute -top-2 -right-2 animate-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50 animate-pulse"></div>
            <Badge className="relative bg-green-500 text-white border-0 px-3 py-1.5">
              <Check className="h-4 w-4 mr-1" />
              Complete
            </Badge>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Header: Icon + Title */}
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>

        {/* Dynamic fields based on configuration */}
        <div className={getGridClass()}>
          {visibleFields.map((field) => (
            <div key={field.name} className={getFieldColSpan(field)}>
              <FormField
                label={field.label}
                htmlFor={field.name}
                required={field.required}
                error={checkShouldShowError(field.name) ? getFieldError(field.name) : undefined}
                hint={field.helpText}
              >
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={data[field.name] || ""}
                    placeholder={field.placeholder}
                    onChange={(e) => handleChange(e, field)}
                    onBlur={() => handleBlur(field, data[field.name])}
                    className="transition-all duration-200 focus:scale-[1.005] resize-none"
                    rows={2}
                    maxLength={field.maxLength}
                  />
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type || "text"}
                    value={data[field.name] || ""}
                    placeholder={field.placeholder}
                    onChange={(e) => handleChange(e, field)}
                    onBlur={() => handleBlur(field, data[field.name])}
                    className="transition-all duration-200 focus:scale-[1.01]"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    pattern={field.pattern}
                    maxLength={field.maxLength}
                  />
                )}
              </FormField>
            </div>
          ))}
        </div>

        {/* Extra content from children (suggestions, warnings, buttons, custom fields, etc.) */}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  )
}
