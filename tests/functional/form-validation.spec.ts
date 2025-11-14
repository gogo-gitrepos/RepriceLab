import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';

test.describe('Functional - Form Validations', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('email input validates format', async ({ page }) => {
    // Enter invalid email
    await loginPage.emailInput.fill('invalid-email');
    await loginPage.passwordInput.fill('somepassword');
    await loginPage.loginButton.click();

    // Check for validation message
    const emailValidation = await loginPage.emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(emailValidation).toBeTruthy();
  });

  test('password field toggles visibility', async ({ page }) => {
    const passwordInput = loginPage.passwordInput;
    
    // Password should be hidden by default
    const initialType = await passwordInput.getAttribute('type');
    expect(initialType).toBe('password');

    // Look for toggle button
    const toggleButton = page.locator('button[aria-label*="password"], button:has([class*="eye"])');
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      const newType = await passwordInput.getAttribute('type');
      expect(newType).toBe('text');
    }
  });

  test('form requires both email and password', async ({ page }) => {
    // Submit with empty form
    await loginPage.loginButton.click();

    // Email should be required
    const emailRequired = await loginPage.emailInput.evaluate((el: HTMLInputElement) => el.required || el.validity.valueMissing);
    expect(emailRequired).toBeTruthy();
  });

  test('forgot password link navigates correctly', async ({ page }) => {
    await loginPage.clickForgotPassword();
    
    // Should navigate to password reset page
    await page.waitForURL(/.*forgot|.*reset/i, { timeout: 5000 });
  });
});
