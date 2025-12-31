/**
 * Salary Slip Preview Component
 * Real-time preview of the salary slip that will be generated
 */

"use client"

import type { SalarySlipFormData, SalarySlipCalculationResult } from "@/lib/salary-slip"
import { MONTHS } from "@/lib/salary-slip"
import { PreviewWrapper } from "../shared/preview-wrapper"

interface SalarySlipPreviewProps {
  formData: SalarySlipFormData
  calculations: SalarySlipCalculationResult
}

export function SalarySlipPreview({ formData, calculations }: SalarySlipPreviewProps) {
  const monthLabel = MONTHS.find((m) => m.value === formData.period.month)?.label || "January"

  return (
    <PreviewWrapper
      title="Salary Slip"
      previewId="salary-slip-preview"
      dataTestId="salary-slip-preview"
      className="bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg"
      pdfContentId="salary-slip-pdf-content"
    >
      <div className="p-8 space-y-6 text-sm">
      {/* Header */}
      <div className="border-b border-border pb-4 text-center">
        <h3 className="font-bold text-lg text-foreground">SALARY SLIP</h3>
        <p className="text-muted-foreground">
          {monthLabel}, {formData.period.year}
        </p>
      </div>

      {/* Company Details */}
      {formData.company.companyName && (
        <div className="border-b border-border pb-4">
          <h4 className="font-semibold text-foreground mb-2">COMPANY DETAILS</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">{formData.company.companyName}</span>
            </p>
            <p>{formData.company.companyAddress}</p>
            <p>PAN: {formData.company.panNumber}</p>
            {formData.company.cin && <p>CIN: {formData.company.cin}</p>}
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
              <p className="font-medium text-foreground">{formData.employee.employeeId}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium text-foreground">{formData.employee.employeeName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Designation</p>
              <p className="font-medium text-foreground">{formData.employee.designation}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Department</p>
              <p className="font-medium text-foreground">{formData.employee.department}</p>
            </div>
            <div>
              <p className="text-muted-foreground">DOJ</p>
              <p className="font-medium text-foreground">{formData.employee.dateOfJoining}</p>
            </div>
            <div>
              <p className="text-muted-foreground">PAN</p>
              <p className="font-medium text-foreground">{formData.employee.panNumber}</p>
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
                <span className="font-medium">₹{formData.earnings.basicSalary.toLocaleString("en-IN")}</span>
              </div>
            )}
            {formData.earnings.dearness > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dearness</span>
                <span className="font-medium">₹{formData.earnings.dearness.toLocaleString("en-IN")}</span>
              </div>
            )}
            {formData.earnings.houseRent > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">House Rent</span>
                <span className="font-medium">₹{formData.earnings.houseRent.toLocaleString("en-IN")}</span>
              </div>
            )}
            {formData.earnings.conveyance > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conveyance</span>
                <span className="font-medium">₹{formData.earnings.conveyance.toLocaleString("en-IN")}</span>
              </div>
            )}
            {formData.earnings.otherEarnings > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Other Earnings</span>
                <span className="font-medium">₹{formData.earnings.otherEarnings.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="border-t border-blue-200 dark:border-blue-800 pt-1 mt-1 flex justify-between font-semibold">
              <span>Total Earnings</span>
              <span>₹{calculations.totalEarnings.toLocaleString("en-IN")}</span>
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
                <span className="font-medium">₹{formData.deductions.providentFund.toLocaleString("en-IN")}</span>
              </div>
            )}
            {formData.deductions.esi > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">ESI</span>
                <span className="font-medium">₹{formData.deductions.esi.toLocaleString("en-IN")}</span>
              </div>
            )}
            {formData.deductions.incomeTax > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Income Tax</span>
                <span className="font-medium">₹{formData.deductions.incomeTax.toLocaleString("en-IN")}</span>
              </div>
            )}
            {formData.deductions.otherDeductions > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Other Deductions</span>
                <span className="font-medium">₹{formData.deductions.otherDeductions.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="border-t border-red-200 dark:border-red-800 pt-1 mt-1 flex justify-between font-semibold">
              <span>Total Deductions</span>
              <span>₹{calculations.totalDeductions.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      )}

      {/* Net Salary */}
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-green-900 dark:text-green-100">NET SALARY</h4>
          <span className="text-2xl font-bold text-green-700 dark:text-green-300">
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
              <span className="font-medium">{formData.bankingDetails.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Holder</span>
              <span className="font-medium">{formData.bankingDetails.accountHolder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account No.</span>
              <span className="font-medium">{formData.bankingDetails.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IFSC</span>
              <span className="font-medium">{formData.bankingDetails.ifscCode}</span>
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
