import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly pageTitle: Locator;
  readonly sidebar: Locator;
  readonly header: Locator;
  readonly logoutButton: Locator;
  readonly productsLink: Locator;
  readonly storesLink: Locator;
  readonly rulesLink: Locator;
  readonly analyticsLink: Locator;
  readonly settingsLink: Locator;
  readonly userMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1, h2').first();
    this.sidebar = page.locator('aside, nav[role="navigation"]').first();
    this.header = page.locator('header').first();
    this.logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")');
    this.productsLink = page.locator('a:has-text("Products")');
    this.storesLink = page.locator('a:has-text("Stores")');
    this.rulesLink = page.locator('a:has-text("Rules"), a:has-text("Repricing")');
    this.analyticsLink = page.locator('a:has-text("Analytics"), a:has-text("Dashboard")');
    this.settingsLink = page.locator('a:has-text("Settings")');
    this.userMenu = page.locator('[data-testid="user-menu"], button:has-text("Profile")');
  }

  async navigate() {
    await this.goto('/dashboard');
    await this.waitForPageLoad();
  }

  async isDashboardLoaded(): Promise<boolean> {
    return await this.sidebar.isVisible() && await this.header.isVisible();
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
  }

  async goToProducts() {
    await this.productsLink.click();
  }

  async goToStores() {
    await this.storesLink.click();
  }

  async goToRules() {
    await this.rulesLink.click();
  }

  async goToAnalytics() {
    await this.analyticsLink.click();
  }

  async goToSettings() {
    await this.settingsLink.click();
  }
}
