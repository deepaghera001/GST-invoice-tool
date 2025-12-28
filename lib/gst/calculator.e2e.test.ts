/**
 * E2E Test for GST Calculator
 * Simulates real user flow: fill form → submit → see results
 * Run: npx playwright test lib/gst/calculator.e2e.test.ts --headed
 */

import { test, expect } from '@playwright/test';

test.describe('GST Calculator E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/gst-calculator');
  });

  test('Test 1: Submit form and see penalty results', async ({ page }) => {
    // Select GSTR-1 radio button
    await page.click('text=GSTR-1');
    
    // Enter tax amount
    await page.fill('#taxAmount', '25000');
    
    // Enter due date
    await page.fill('#dueDate', '2025-01-31');
    
    // Enter filing date (45 days late)
    await page.fill('#filingDate', '2025-03-17');
    
    // Submit form
    await page.click('button:has-text("Calculate Penalty")');
    
    // Wait for results to appear
    await page.waitForSelector('text=Penalty Breakdown', { timeout: 5000 });
    
    // Verify results display
    const pageContent = await page.content();
    expect(pageContent).toContain('45');
    expect(pageContent).toContain('₹1,500');
    
    // Verify download button appears
    const downloadBtn = page.locator('button:has-text("Download Penalty PDF")');
    await expect(downloadBtn).toBeVisible();
  });

  test('Test 2: Grace period (15 days late, no penalty)', async ({ page }) => {
    await page.click('text=GSTR-1');
    await page.fill('#taxAmount', '50000');
    await page.fill('#dueDate', '2025-01-31');
    await page.fill('#filingDate', '2025-02-15'); // 15 days late
    
    await page.click('button:has-text("Calculate Penalty")');
    await page.waitForSelector('text=Penalty Breakdown');
    
    // Should show no penalty in grace period
    const pageContent = await page.content();
    expect(pageContent).toContain('Grace period');
  });

  test('Test 3: Tax also paid late (interest applies)', async ({ page }) => {
    await page.click('text=GSTR-3B');
    await page.fill('#taxAmount', '50000');
    await page.fill('#dueDate', '2025-01-31');
    await page.fill('#filingDate', '2025-03-31'); // 59 days late
    
    // Check "tax paid late" box
    await page.check('#taxPaidLate');
    
    await page.click('button:has-text("Calculate Penalty")');
    await page.waitForSelector('text=Penalty Breakdown');
    
    // Should show both late fee and interest
    const pageContent = await page.content();
    expect(pageContent).toContain('₹2,900');
    expect(pageContent).toContain('₹1,455');
  });

  test('Test 4: Form validation - empty fields rejected', async ({ page }) => {
    // Try to submit without filling anything
    await page.click('button:has-text("Calculate Penalty")');
    
    // Should show error
    await page.waitForSelector('text=Please fill all required fields', { timeout: 3000 });
  });

  test('Test 5: "Calculate Another" button resets form', async ({ page }) => {
    // Fill and submit
    await page.click('text=GSTR-1');
    await page.fill('#taxAmount', '25000');
    await page.fill('#dueDate', '2025-01-31');
    await page.fill('#filingDate', '2025-03-17');
    
    await page.click('button:has-text("Calculate Penalty")');
    await page.waitForSelector('text=Penalty Breakdown');
    
    // Click reset button
    await page.click('button:has-text("Calculate Another Return")');
    
    // Form should be empty
    const taxInput = await page.inputValue('#taxAmount');
    expect(taxInput).toBe('');
  });
});
