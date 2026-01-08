/**
 * E2E Test for TDS Calculator
 * Simulates real user flow: fill form → submit → see results
 * Run: npx playwright test lib/tds/calculator.e2e.test.ts
 */

import { test, expect } from '@playwright/test';

test.describe('TDS Calculator E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/tds-calculator');
    await page.waitForLoadState('networkidle');
  });

  test('Test 1: Submit form with valid data', async ({ page }) => {
    // Fill TDS amount
    await page.fill('#tdsAmount', '50000');
    
    // Fill due date
    await page.fill('#dueDate', '2025-02-15');
    
    // Fill filing date (5 days late)
    await page.fill('#filingDate', '2025-02-20');
    
    // Submit form
    await page.click('button:has-text("Calculate Fee")');
    
    // Wait for results
    await page.waitForSelector('text=Late Filing Fee', { timeout: 5000 });
    
    // Verify content
    const content = await page.content();
    expect(content).toContain('5');
    expect(content).toContain('₹1,000');
  });

  test('Test 2: Calculate Another button resets form', async ({ page }) => {
    // Fill form
    await page.fill('#tdsAmount', '75000');
    await page.fill('#dueDate', '2025-03-31');
    await page.fill('#filingDate', '2025-04-05');
    
    // Submit
    await page.click('button:has-text("Calculate Fee")');
    await page.waitForSelector('text=Late Filing Fee');
    
    // Click reset button
    await page.click('button:has-text("Calculate Another Return")');
    
    // Form should be empty
    const tdsAmount = await page.inputValue('#tdsAmount');
    expect(tdsAmount).toBe('');
  });

  test('Test 3: Form validation - empty fields rejected', async ({ page }) => {
    // Submit without filling
    await page.click('button:has-text("Calculate Fee")');
    
    // Should show error
    await page.waitForSelector('text=Please fill all required fields', { timeout: 3000 });
  });

  test('Test 4: Various calculations produce correct results', async ({ page }) => {
    // Test case 1: 0 days late
    await page.fill('#tdsAmount', '100000');
    await page.fill('#dueDate', '2025-03-31');
    await page.fill('#filingDate', '2025-03-31');
    await page.click('button:has-text("Calculate Fee")');
    await page.waitForSelector('text=on time');
    
    // Reset
    await page.click('button:has-text("Calculate Another Return")');
    
    // Test case 2: 25 days late
    await page.fill('#tdsAmount', '50000');
    await page.fill('#dueDate', '2025-01-15');
    await page.fill('#filingDate', '2025-02-09');
    await page.click('button:has-text("Calculate Fee")');
    
    await page.waitForSelector('text=Late Filing Fee');
    const content = await page.content();
    expect(content).toContain('₹5,000'); // 25 × 200 = 5000, capped at 5000
  });
});
