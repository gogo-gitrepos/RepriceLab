import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PricingPage extends BasePage {
  readonly pageHeading: Locator;
  readonly plusPlan: Locator;
  readonly proPlan: Locator;
  readonly enterprisePlan: Locator;
  readonly startFreeTrialButtons: Locator;
  readonly backToHomeButton: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.locator('h1:has-text("Pricing")');
    this.plusPlan = page.locator('[data-plan="plus"], .plan-card:has-text("Plus")').first();
    this.proPlan = page.locator('[data-plan="pro"], .plan-card:has-text("Pro")').first();
    this.enterprisePlan = page.locator('[data-plan="enterprise"], .plan-card:has-text("Enterprise")').first();
    this.startFreeTrialButtons = page.locator('button:has-text("Start Free Trial")');
    this.backToHomeButton = page.locator('button:has-text("Back to Home")');
    this.signInButton = page.locator('button:has-text("Sign In")');
  }

  async navigate() {
    await this.goto('/pricing');
    await this.waitForPageLoad();
  }

  async isPricingPageLoaded(): Promise<boolean> {
    return await this.pageHeading.isVisible();
  }

  async selectPlan(plan: 'plus' | 'pro' | 'enterprise') {
    const planCard = plan === 'plus' ? this.plusPlan : plan === 'pro' ? this.proPlan : this.enterprisePlan;
    await planCard.click();
  }

  async startFreeTrial() {
    await this.startFreeTrialButtons.first().click();
  }

  async getPlanPrice(plan: 'plus' | 'pro' | 'enterprise'): Promise<string> {
    const planCard = plan === 'plus' ? this.plusPlan : plan === 'pro' ? this.proPlan : this.enterprisePlan;
    const priceElement = planCard.locator('.text-5xl, [class*="price"]').first();
    return await priceElement.textContent() || '';
  }
}
