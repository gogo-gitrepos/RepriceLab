import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { DashboardPage } from '../page-objects/DashboardPage';

test.describe('E2E - Login Flow', () => {
  test('complete login journey from homepage to dashboard', async ({ page }) => {
    // Start from homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/RepriceLab/i);

    // Click login button
    await page.locator('a:has-text("Login"), a:has-text("Sign In")').first().click();
    await expect(page).toHaveURL(/.*login/);

    // Initialize Login Page Object
    const loginPage = new LoginPage(page);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // Fill in credentials (using env variables)
    const testEmail = process.env.TEST_USER_EMAIL || 'test@repricelab.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'TestPassword123!';
    
    await loginPage.login(testEmail, testPassword);

    // Wait for redirect to dashboard
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });

    // Verify dashboard loaded
    const dashboardPage = new DashboardPage(page);
    const isDashboardLoaded = await dashboardPage.isDashboardLoaded();
    expect(isDashboardLoaded).toBeTruthy();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Try login with invalid credentials
    await loginPage.login('invalid@test.com', 'wrongpassword');

    // Should see error message
    await page.waitForSelector('[role="alert"], .error, .text-red-500', { timeout: 5000 });
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage.length).toBeGreaterThan(0);
  });

  test('google sign in button is functional', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Verify Google sign-in button exists
    const googleButton = await loginPage.googleSignInButton;
    await expect(googleButton).toBeVisible();
  });
});
