import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SideMenu extends BasePage {
  readonly dashboardLink: Locator;
  readonly productsLink: Locator;
  readonly multichannelLink: Locator;
  readonly repricingRulesLink: Locator;
  readonly automationsLink: Locator;
  readonly importLink: Locator;
  readonly ordersLink: Locator;
  readonly repricingActivityLink: Locator;
  readonly competitorsLink: Locator;
  readonly reportsLink: Locator;
  readonly settingsButton: Locator;
  readonly appStoreLink: Locator;
  readonly mobileMenuButton: Locator;

  readonly settingsAccountLink: Locator;
  readonly settingsUsersLink: Locator;
  readonly settingsSubscriptionLink: Locator;

  readonly repricingSectionTitle: Locator;
  readonly insightsSectionTitle: Locator;
  readonly systemSectionTitle: Locator;

  constructor(page: Page) {
    super(page);
    
    this.dashboardLink = page.locator('a[href="/dashboard"]');
    this.productsLink = page.locator('a[href="/products"]');
    this.multichannelLink = page.locator('a[href="/multichannel"]');
    this.repricingRulesLink = page.locator('a[href="/repricing-rules"]');
    this.automationsLink = page.locator('a[href="/automations"]');
    this.importLink = page.locator('a[href="/import"]');
    this.ordersLink = page.locator('a[href="/orders"]');
    this.repricingActivityLink = page.locator('a[href="/repricing-activity"]');
    this.competitorsLink = page.locator('a[href="/competitors"]');
    this.reportsLink = page.locator('a[href="/reports"]');
    this.settingsButton = page.locator('button:has-text("Settings")');
    this.appStoreLink = page.locator('a[href="/app-store"]');
    this.mobileMenuButton = page.locator('button:has([class*="Menu"])').first();

    this.settingsAccountLink = page.locator('a[href="/settings/account"]');
    this.settingsUsersLink = page.locator('a[href="/settings/users"]');
    this.settingsSubscriptionLink = page.locator('a[href="/settings/subscription"]');

    this.repricingSectionTitle = page.locator('h3:has-text("ReprIcIng")');
    this.insightsSectionTitle = page.locator('h3:has-text("InsIghts")');
    this.systemSectionTitle = page.locator('h3:has-text("System")');
  }

  async openDashboard() {
    await this.dashboardLink.click();
    await this.page.waitForURL('**/dashboard');
  }

  async openProducts() {
    await this.productsLink.click();
    await this.page.waitForURL('**/products');
  }

  async openMultichannel() {
    await this.multichannelLink.click();
    await this.page.waitForURL('**/multichannel');
  }

  async openRepricingRules() {
    await this.repricingRulesLink.click();
    await this.page.waitForURL('**/repricing-rules');
  }

  async openAutomations() {
    await this.automationsLink.click();
    await this.page.waitForURL('**/automations');
  }

  async openImport() {
    await this.importLink.click();
    await this.page.waitForURL('**/import');
  }

  async openOrders() {
    await this.ordersLink.click();
    await this.page.waitForURL('**/orders');
  }

  async openRepricingActivity() {
    await this.repricingActivityLink.click();
    await this.page.waitForURL('**/repricing-activity');
  }

  async openCompetitors() {
    await this.competitorsLink.click();
    await this.page.waitForURL('**/competitors');
  }

  async openReports() {
    await this.reportsLink.click();
    await this.page.waitForURL('**/reports');
  }

  async expandSettings() {
    await this.settingsButton.click();
    await this.settingsAccountLink.waitFor({ state: 'visible' });
  }

  async collapseSettings() {
    const isVisible = await this.settingsAccountLink.isVisible();
    if (isVisible) {
      await this.settingsButton.click();
    }
  }

  async openSettingsAccount() {
    await this.expandSettings();
    await this.settingsAccountLink.click();
    await this.page.waitForURL('**/settings/account');
  }

  async openSettingsUsers() {
    await this.expandSettings();
    await this.settingsUsersLink.click();
    await this.page.waitForURL('**/settings/users');
  }

  async openSettingsSubscription() {
    await this.expandSettings();
    await this.settingsSubscriptionLink.click();
    await this.page.waitForURL('**/settings/subscription');
  }

  async openAppStore() {
    await this.appStoreLink.click();
    await this.page.waitForURL('**/app-store');
  }

  async isMenuItemActive(menuItem: Locator): Promise<boolean> {
    const classes = await menuItem.getAttribute('class');
    return classes?.includes('from-purple-100') || false;
  }

  async verifyAllMenuItemsVisible() {
    await this.dashboardLink.waitFor({ state: 'visible' });
    await this.productsLink.waitFor({ state: 'visible' });
    await this.multichannelLink.waitFor({ state: 'visible' });
    await this.repricingRulesLink.waitFor({ state: 'visible' });
    await this.automationsLink.waitFor({ state: 'visible' });
    await this.importLink.waitFor({ state: 'visible' });
    await this.ordersLink.waitFor({ state: 'visible' });
    await this.repricingActivityLink.waitFor({ state: 'visible' });
    await this.competitorsLink.waitFor({ state: 'visible' });
    await this.reportsLink.waitFor({ state: 'visible' });
    await this.settingsButton.waitFor({ state: 'visible' });
    await this.appStoreLink.waitFor({ state: 'visible' });
  }

  async verifySectionTitlesVisible() {
    await this.repricingSectionTitle.waitFor({ state: 'visible' });
    await this.insightsSectionTitle.waitFor({ state: 'visible' });
    await this.systemSectionTitle.waitFor({ state: 'visible' });
  }

  async openMobileMenu() {
    await this.mobileMenuButton.click();
  }
}
