import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Application Health', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/RepriceLab|Home/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In"), button:has-text("Login")')).toBeVisible();
  });

  test('pricing page displays all tiers', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('text=/Plus|Pro|Enterprise/i')).toHaveCount(3, { timeout: 10000 });
    await expect(page.locator('button:has-text("Start Free Trial")')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    
    // Test Pricing link
    await page.locator('a:has-text("Pricing")').click();
    await expect(page).toHaveURL(/.*pricing/);
    
    // Test Login link
    await page.locator('a:has-text("Login"), a:has-text("Sign In")').first().click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('contact page is accessible', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('body')).toBeVisible();
    // Should not show 404
    await expect(page.locator('text=/404|not found/i')).not.toBeVisible();
  });
});
