/**
 * Salary Slip Preview Component
 * Real-time preview of the salary slip that will be generated
 * With built-in field highlighting and auto-scroll
 */

"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import type { SalarySlipFormData, SalarySlipCalculationResult } from "@/lib/salary-slip"
import { MONTHS } from "@/lib/salary-slip"
import { PreviewWrapper } from "../shared/preview-wrapper"

// Highlight duration in milliseconds
const HIGHLIGHT_DURATION = 2500

interface SalarySlipPreviewProps {
  formData: SalarySlipFormData
  calculations: SalarySlipCalculationResult
  /** Optional max height for preview (e.g. '55vh') */
  maxHeight?: string
}

export function SalarySlipPreview({ formData, calculations, maxHeight }: SalarySlipPreviewProps) {
  const monthLabel = MONTHS.find((m) => m.value === formData.period.month)?.label || "January"

  // ===== SIMPLE HIGHLIGHTING LOGIC =====
  const prevFormDataRef = useRef(formData)
  const prevCalculationsRef = useRef(calculations)
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set())
  const fieldRefs = useRef<Map<string, HTMLElement | null>>(new Map())
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  useEffect(() => {
    const prev = prevFormDataRef.current
    const prevCalc = prevCalculationsRef.current
    const changed: string[] = []

    // Check period fields
    if (prev.period.month !== formData.period.month) changed.push('month')
    if (prev.period.year !== formData.period.year) changed.push('year')

    // Check company fields
    if (prev.company.companyName !== formData.company.companyName && formData.company.companyName) changed.push('companyName')
    if (prev.company.companyAddress !== formData.company.companyAddress && formData.company.companyAddress) changed.push('companyAddress')
    if (prev.company.panNumber !== formData.company.panNumber && formData.company.panNumber) changed.push('companyPan')
    if (prev.company.cin !== formData.company.cin && formData.company.cin) changed.push('companyCin')

    // Check employee fields
    if (prev.employee.employeeId !== formData.employee.employeeId && formData.employee.employeeId) changed.push('employeeId')
    if (prev.employee.employeeName !== formData.employee.employeeName && formData.employee.employeeName) changed.push('employeeName')
    if (prev.employee.designation !== formData.employee.designation && formData.employee.designation) changed.push('designation')
    if (prev.employee.department !== formData.employee.department && formData.employee.department) changed.push('department')
    if (prev.employee.dateOfJoining !== formData.employee.dateOfJoining && formData.employee.dateOfJoining) changed.push('dateOfJoining')
    if (prev.employee.panNumber !== formData.employee.panNumber && formData.employee.panNumber) changed.push('employeePan')
    if (prev.employee.uan !== formData.employee.uan && formData.employee.uan) changed.push('uan')

    // Check earnings
    if (prev.earnings.basicSalary !== formData.earnings.basicSalary && formData.earnings.basicSalary) changed.push('basicSalary')
    if (prev.earnings.dearness !== formData.earnings.dearness && formData.earnings.dearness) changed.push('dearness')
    if (prev.earnings.houseRent !== formData.earnings.houseRent && formData.earnings.houseRent) changed.push('houseRent')
    if (prev.earnings.conveyance !== formData.earnings.conveyance && formData.earnings.conveyance) changed.push('conveyance')
    if (prev.earnings.otherEarnings !== formData.earnings.otherEarnings && formData.earnings.otherEarnings) changed.push('otherEarnings')

    // Check deductions
    if (prev.deductions.providentFund !== formData.deductions.providentFund && formData.deductions.providentFund) changed.push('providentFund')
    if (prev.deductions.esi !== formData.deductions.esi && formData.deductions.esi) changed.push('esi')
    if (prev.deductions.incomeTax !== formData.deductions.incomeTax && formData.deductions.incomeTax) changed.push('incomeTax')
    if (prev.deductions.otherDeductions !== formData.deductions.otherDeductions && formData.deductions.otherDeductions) changed.push('otherDeductions')

    // Check banking details
    if (prev.bankingDetails.bankName !== formData.bankingDetails.bankName && formData.bankingDetails.bankName) changed.push('bankName')
    if (prev.bankingDetails.accountHolder !== formData.bankingDetails.accountHolder && formData.bankingDetails.accountHolder) changed.push('accountHolder')
    if (prev.bankingDetails.accountNumber !== formData.bankingDetails.accountNumber && formData.bankingDetails.accountNumber) changed.push('accountNumber')
    if (prev.bankingDetails.ifscCode !== formData.bankingDetails.ifscCode && formData.bankingDetails.ifscCode) changed.push('ifscCode')

    // Check calculated totals
    if (prevCalc.totalEarnings !== calculations.totalEarnings && calculations.totalEarnings > 0) changed.push('totalEarnings')
    if (prevCalc.totalDeductions !== calculations.totalDeductions && calculations.totalDeductions > 0) changed.push('totalDeductions')
    if (prevCalc.netSalary !== calculations.netSalary && calculations.netSalary > 0) changed.push('netSalary')

    if (changed.length > 0) {
      setHighlighted(prev => {
        const next = new Set(prev)
        changed.forEach(f => next.add(f))
        return next
      })

      // Auto-scroll within preview container
      setTimeout(() => {
        const firstRef = fieldRefs.current.get(changed[0])
        const scrollContainer = document.getElementById('salary-slip-preview')
        if (firstRef && scrollContainer) {
          const containerRect = scrollContainer.getBoundingClientRect()
          const elementRect = firstRef.getBoundingClientRect()
          const scrollTop = scrollContainer.scrollTop + (elementRect.top - containerRect.top) - (containerRect.height / 2)
          scrollContainer.scrollTo({ top: scrollTop, behavior: 'smooth' })
        }
      }, 50)

      // Clear highlights after duration
      changed.forEach(field => {
        const existing = timeoutsRef.current.get(field)
        if (existing) clearTimeout(existing)
        const timeout = setTimeout(() => {
          setHighlighted(prev => {
            const next = new Set(prev)
            next.delete(field)
            return next
          })
        }, HIGHLIGHT_DURATION)
        timeoutsRef.current.set(field, timeout)
      })
    }

    prevFormDataRef.current = JSON.parse(JSON.stringify(formData))
    prevCalculationsRef.current = { ...calculations }
  }, [formData, calculations])

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t))
    }
  }, [])

  const hl = useCallback((field: string) => {
    return highlighted.has(field) 
      ? 'pdf-field-highlight' 
      : ''
  }, [highlighted])

  const setRef = useCallback((field: string) => (el: HTMLElement | null) => {
    fieldRefs.current.set(field, el)
  }, [])
  // ===== END HIGHLIGHTING LOGIC =====

  return (
    <PreviewWrapper
      title="Salary Slip"
      previewId="salary-slip-preview"
      dataTestId="salary-slip-preview"
      className="bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg"
      pdfContentId="salary-slip-pdf-content"
      maxHeight={maxHeight}
    >
      <div className="p-8 space-y-6 text-sm" style={{ fontFamily: 'var(--font-document)' }}>
      {/* Company logo (optional) */}
      {formData.company.logo && (
        <div className="flex justify-center mb-2">
          <img src={formData.company.logo} alt="Company logo" className="h-16 object-contain" />
        </div>
      )}
      {/* Header */}
      <div className="border-b border-border pb-4 text-center">
        <h3 className="font-bold text-lg text-foreground">SALARY SLIP</h3>
        <p className="text-muted-foreground">
          <span ref={setRef('month')} className={hl('month')}>{monthLabel}</span>, <span ref={setRef('year')} className={hl('year')}>{formData.period.year}</span>
        </p>
      </div>

      {/* Company Details */}
      {formData.company.companyName && (
        <div className="border-b border-border pb-4">
          <h4 className="font-semibold text-foreground mb-2">COMPANY DETAILS</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <span ref={setRef('companyName')} className={`font-medium text-foreground ${hl('companyName')}`}>{formData.company.companyName}</span>
            </p>
            <p><span ref={setRef('companyAddress')} className={hl('companyAddress')}>{formData.company.companyAddress}</span></p>
            <p>PAN: <span ref={setRef('companyPan')} className={hl('companyPan')}>{formData.company.panNumber}</span></p>
            {formData.company.cin && <p>CIN: <span ref={setRef('companyCin')} className={hl('companyCin')}>{formData.company.cin}</span></p>}
          </div>
        </div>
      )}

      {/* Employee Details */}
      {formData.employee.employeeName && (
        <div className="border-b border-border pb-4">
          <h4 className="font-semibold text-foreground mb-2">EMPLOYEE DETAILS</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground">Employee ID</p>
              <p ref={setRef('employeeId')} className={`font-medium text-foreground ${hl('employeeId')}`}>{formData.employee.employeeId}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Name</p>
              <p ref={setRef('employeeName')} className={`font-medium text-foreground ${hl('employeeName')}`}>{formData.employee.employeeName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Designation</p>
              <p ref={setRef('designation')} className={`font-medium text-foreground ${hl('designation')}`}>{formData.employee.designation}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Department</p>
              <p ref={setRef('department')} className={`font-medium text-foreground ${hl('department')}`}>{formData.employee.department}</p>
            </div>
            <div>
              <p className="text-muted-foreground">DOJ</p>
              <p ref={setRef('dateOfJoining')} className={`font-medium text-foreground ${hl('dateOfJoining')}`}>{formData.employee.dateOfJoining}</p>
            </div>
            <div>
              <p className="text-muted-foreground">PAN</p>
              <p ref={setRef('employeePan')} className={`font-medium text-foreground ${hl('employeePan')}`}>{formData.employee.panNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">UAN</p>
              <p ref={setRef('uan')} className={`font-medium text-foreground ${hl('uan')}`}>{formData.employee.uan || "-"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Earnings */}
      {calculations.totalEarnings > 0 && (
        <div className="border-b border-border pb-4">
          <h4 className="font-semibold text-foreground mb-2 bg-blue-50 dark:bg-blue-950/30 p-2 rounded">
            EARNINGS
          </h4>
          <div className="space-y-1 text-xs">
            {formData.earnings.basicSalary > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Basic Salary</span>
                <span ref={setRef('basicSalary')} className={`font-medium ${hl('basicSalary')}`}>₹{formData.earnings.basicSalary.toLocaleString("en-IN")}</span>
              </div>
            )}
            {formData.earnings.dearness > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dearness</span>
                <span ref={setRef('dearness')} className={`font-medium ${hl('dearness')}`}>₹{formData.earnings.dearness.toLocaleString("en-IN")}</span>
              </div>
            )}
            {formData.earnings.houseRent > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">House Rent</span>
                <span ref={setRef('houseRent')} className={`font-medium ${hl('houseRent')}`}>₹{formData.earnings.houseRent.toLocaleString("en-IN")}</span>
              </div>
            )}
            {formData.earnings.conveyance > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conveyance</span>
                <span ref={setRef('conveyance')} className={`font-medium ${hl('conveyance')}`}>₹{formData.earnings.conveyance.toLocaleString("en-IN")}</span>
              </div>
            )}
            {formData.earnings.otherEarnings > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Other Earnings</span>
                <span ref={setRef('otherEarnings')} className={`font-medium ${hl('otherEarnings')}`}>₹{formData.earnings.otherEarnings.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="border-t border-blue-200 dark:border-blue-800 pt-1 mt-1 flex justify-between font-semibold">
              <span>Total Earnings</span>
              <span ref={setRef('totalEarnings')} className={hl('totalEarnings')}>₹{calculations.totalEarnings.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      )}

      {/* Deductions */}
      {calculations.totalDeductions > 0 && (
        <div className="border-b border-border pb-4">
          <h4 className="font-semibold text-foreground mb-2 bg-red-50 dark:bg-red-950/30 p-2 rounded">
            DEDUCTIONS
          </h4>
          <div className="space-y-1 text-xs">
            {formData.deductions.providentFund > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provident Fund (PF)</span>
                <span ref={setRef('providentFund')} className={`font-medium ${hl('providentFund')}`}>₹{formData.deductions.providentFund.toLocaleString("en-IN")}</span>
              </div>
            )}
            {formData.deductions.esi > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">ESI</span>
                <span ref={setRef('esi')} className={`font-medium ${hl('esi')}`}>₹{formData.deductions.esi.toLocaleString("en-IN")}</span>
              </div>
            )}
            {formData.deductions.incomeTax > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Income Tax</span>
                <span ref={setRef('incomeTax')} className={`font-medium ${hl('incomeTax')}`}>₹{formData.deductions.incomeTax.toLocaleString("en-IN")}</span>
              </div>
            )}
            {formData.deductions.otherDeductions > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Other Deductions</span>
                <span ref={setRef('otherDeductions')} className={`font-medium ${hl('otherDeductions')}`}>₹{formData.deductions.otherDeductions.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="border-t border-red-200 dark:border-red-800 pt-1 mt-1 flex justify-between font-semibold">
              <span>Total Deductions</span>
              <span ref={setRef('totalDeductions')} className={hl('totalDeductions')}>₹{calculations.totalDeductions.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      )}

      {/* Net Salary */}
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-green-900 dark:text-green-100">NET SALARY</h4>
          <span ref={setRef('netSalary')} className={`text-2xl font-bold text-green-700 dark:text-green-300 ${hl('netSalary')}`}>
            ₹{calculations.netSalary.toLocaleString("en-IN")}
          </span>
        </div>
        {calculations.amountInWords && (
          <p className="text-xs text-green-800 dark:text-green-200 italic">
            {calculations.amountInWords.charAt(0).toUpperCase() + calculations.amountInWords.slice(1)} Rupees Only
          </p>
        )}
      </div>

      {/* Banking Details */}
      {formData.bankingDetails.bankName && (
        <div className="border-t border-border pt-4">
          <h4 className="font-semibold text-foreground mb-2">BANKING DETAILS</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bank</span>
              <span ref={setRef('bankName')} className={`font-medium ${hl('bankName')}`}>{formData.bankingDetails.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Holder</span>
              <span ref={setRef('accountHolder')} className={`font-medium ${hl('accountHolder')}`}>{formData.bankingDetails.accountHolder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account No.</span>
              <span ref={setRef('accountNumber')} className={`font-medium ${hl('accountNumber')}`}>{formData.bankingDetails.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IFSC</span>
              <span ref={setRef('ifscCode')} className={`font-medium ${hl('ifscCode')}`}>{formData.bankingDetails.ifscCode}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-xs text-center text-muted-foreground border-t border-border pt-4">
        <p>This is a computer-generated document. No signature required.</p>
      </div>
      </div>
    </PreviewWrapper>
  )
}
