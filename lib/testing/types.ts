/**
 * Test Scenario System - Type Definitions
 * Production-safe: This entire module is tree-shaken when TEST_MODE is disabled
 */

export type ScenarioCategory = 'valid' | 'invalid' | 'edge-case' | 'partial';

export interface TestScenario<T> {
  /** Unique identifier */
  id: string;
  /** Display name shown in dropdown */
  name: string;
  /** Category for filtering/grouping */
  category: ScenarioCategory;
  /** Description of what this scenario tests */
  description?: string;
  /** The test data (partial - will be merged with defaults) */
  data: Partial<T>;
  /** Fields that are expected to have errors after applying this scenario */
  expectedErrors?: string[];
}

export interface TestScenarioGroup<T> {
  /** Form type identifier */
  formType: string;
  /** Display name */
  formName: string;
  /** All scenarios for this form */
  scenarios: TestScenario<T>[];
}

export type FormType = 'invoice' | 'salary-slip' | 'gst' | 'tds' | 'rent-agreement';

/**
 * Category icons and colors for UI
 */
export const CATEGORY_CONFIG: Record<ScenarioCategory, { icon: string; color: string; label: string }> = {
  'valid': { icon: '✅', color: 'text-green-600', label: 'Valid' },
  'invalid': { icon: '❌', color: 'text-red-600', label: 'Invalid' },
  'edge-case': { icon: '⚠️', color: 'text-amber-600', label: 'Edge Case' },
  'partial': { icon: '📝', color: 'text-blue-600', label: 'Partial' },
};
