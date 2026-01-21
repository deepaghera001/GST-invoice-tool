import { useState, useCallback, useMemo } from 'react';
import { 
  compareRegimes, 
  calculateTotalDeductions,
  type AgeGroup,
  type Deductions,
  type ComparisonResult 
} from '@/lib/utils/tax-calculations';

export interface IncomeTaxFormData {
  grossIncome: string;
  ageGroup: AgeGroup;
  section80C: string;
  section80D: string;
  hra: string;
  homeLoanInterest: string;
  nps80CCD1B: string;
  otherDeductions: string;
}

export interface IncomeTaxFormErrors {
  grossIncome?: string;
  section80C?: string;
  section80D?: string;
  hra?: string;
  homeLoanInterest?: string;
  nps80CCD1B?: string;
  otherDeductions?: string;
}

const INITIAL_FORM_DATA: IncomeTaxFormData = {
  grossIncome: '',
  ageGroup: 'below-60',
  section80C: '',
  section80D: '',
  hra: '',
  homeLoanInterest: '',
  nps80CCD1B: '',
  otherDeductions: '',
};

export function useIncomeTaxForm() {
  const [formData, setFormData] = useState<IncomeTaxFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<IncomeTaxFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Parse number helper
  const parseNumber = useCallback((value: string): number => {
    const num = parseFloat(value.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  }, []);

  // Validate field
  const validateField = useCallback((name: keyof IncomeTaxFormData, value: string): string | undefined => {
    const num = parseNumber(value);

    if (name === 'grossIncome') {
      if (!value.trim()) return 'Gross income is required';
      if (num <= 0) return 'Income must be greater than 0';
      if (num > 100000000) return 'Please enter a realistic income';
    }

    if (name === 'section80C' && num > 150000) {
      return 'Maximum ₹1,50,000 allowed under 80C';
    }

    if (name === 'section80D' && num > 100000) {
      return 'Maximum ₹1,00,000 allowed under 80D';
    }

    if (name === 'homeLoanInterest' && num > 200000) {
      return 'Maximum ₹2,00,000 allowed for home loan interest';
    }

    if (name === 'nps80CCD1B' && num > 50000) {
      return 'Maximum ₹50,000 allowed under 80CCD(1B)';
    }

    if (['section80C', 'section80D', 'hra', 'homeLoanInterest', 'nps80CCD1B', 'otherDeductions'].includes(name)) {
      if (value.trim() && num < 0) return 'Amount cannot be negative';
    }

    return undefined;
  }, [parseNumber]);

  // Handle input change
  const handleChange = useCallback((name: keyof IncomeTaxFormData, value: string | AgeGroup) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (typeof value === 'string' && name !== 'ageGroup') {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validateField]);

  // Handle blur
  const handleBlur = useCallback((name: keyof IncomeTaxFormData) => {
    setTouchedFields(prev => new Set(prev).add(name));
    const error = validateField(name, formData[name] as string);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [formData, validateField]);

  // Check if should show error
  const shouldShowError = useCallback((field: keyof IncomeTaxFormData): boolean => {
    if (field === 'ageGroup') return false;
    return touchedFields.has(field) && !!errors[field as keyof IncomeTaxFormErrors];
  }, [touchedFields, errors]);

  // Get error message
  const getError = useCallback((field: keyof IncomeTaxFormData): string | undefined => {
    if (field === 'ageGroup') return undefined;
    return shouldShowError(field) ? errors[field as keyof IncomeTaxFormErrors] : undefined;
  }, [shouldShowError, errors]);

  // Validate entire form
  const validateFormFull = useCallback((): { isValid: boolean; errors: IncomeTaxFormErrors } => {
    const newErrors: IncomeTaxFormErrors = {};
    
    (Object.keys(formData) as Array<keyof IncomeTaxFormData>).forEach(key => {
      if (key !== 'ageGroup') {
        const error = validateField(key, formData[key] as string);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouchedFields(new Set(Object.keys(formData)));
    
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  }, [formData, validateField]);

  // Check if form is complete
  const isFormComplete = useMemo(() => {
    return formData.grossIncome.trim() !== '' && parseNumber(formData.grossIncome) > 0;
  }, [formData.grossIncome, parseNumber]);

  // Calculate comparison results
  const comparisonResult = useMemo((): ComparisonResult | null => {
    if (!isFormComplete) return null;

    const deductions: Deductions = {
      section80C: parseNumber(formData.section80C),
      section80D: parseNumber(formData.section80D),
      hra: parseNumber(formData.hra),
      homeLoanInterest: parseNumber(formData.homeLoanInterest),
      nps80CCD1B: parseNumber(formData.nps80CCD1B),
      otherDeductions: parseNumber(formData.otherDeductions),
    };

    return compareRegimes(
      parseNumber(formData.grossIncome),
      deductions,
      formData.ageGroup
    );
  }, [formData, isFormComplete, parseNumber]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setTouchedFields(new Set());
  }, []);

  // Get total deductions for display
  const totalDeductions = useMemo(() => {
    const deductions: Deductions = {
      section80C: parseNumber(formData.section80C),
      section80D: parseNumber(formData.section80D),
      hra: parseNumber(formData.hra),
      homeLoanInterest: parseNumber(formData.homeLoanInterest),
      nps80CCD1B: parseNumber(formData.nps80CCD1B),
      otherDeductions: parseNumber(formData.otherDeductions),
    };
    return calculateTotalDeductions(deductions);
  }, [formData, parseNumber]);

  return {
    formData,
    errors,
    handleChange,
    handleBlur,
    validateFormFull,
    shouldShowError,
    getError,
    resetForm,
    isFormComplete,
    comparisonResult,
    totalDeductions,
  };
}
