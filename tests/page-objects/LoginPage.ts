import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly signUpLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly googleSignInButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button:has-text("Sign In"), button:has-text("Login"), button:has-text("Sign in to Dashboard")');
    this.signUpLink = page.locator('a:has-text("Sign Up"), a:has-text("Sign up")');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot"), a:has-text("forgot password")');
    this.googleSignInButton = page.locator('button:has-text("Google"), button:has-text("Sign in with Google")');
    this.errorMessage = page.locator('[role="alert"], .error, .text-red-500, .text-red-600');
  }

  async navigate() {
    await this.goto('/login');
    await this.waitForPageLoad();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async clickSignUp() {
    await this.signUpLink.click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async clickGoogleSignIn() {
    await this.googleSignInButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }
}
