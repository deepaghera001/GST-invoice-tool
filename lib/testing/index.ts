/**
 * Test Scenario System - Main Export
 * 
 * Production-safe testing system for form validation
 * - All test code is tree-shaken in production when NEXT_PUBLIC_TEST_MODE !== 'true'
 * - Add new test scenarios by adding objects to scenario files
 * - Works with all form types
 * 
 * Usage:
 * ```tsx
 * import { TestScenarioSelector, invoiceScenarios } from '@/lib/testing';
 * 
 * // In your form component (only renders in test mode):
 * <TestScenarioSelector 
 *   scenarios={invoiceScenarios}
 *   onApply={setFormData}
 * />
 * ```
 */

// Types
export * from './types';

// Components
export { TestScenarioSelector } from './components';

// Scenarios - import individually to enable tree-shaking
export {
  invoiceScenarios,
  salarySlipScenarios,
  gstScenarios,
  tdsScenarios,
  rentAgreementScenarios,
  shareholdersAgreementScenarios,
  influencerContractScenarios,
} from './scenarios';

/**
 * Check if test mode is enabled
 * Use this to conditionally render test UI
 */
export const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

