import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { SideMenu } from '../page-objects/SideMenu';

test.describe('Navigation Menu Tests', () => {
  let loginPage: LoginPage;
  let sideMenu: SideMenu;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    sideMenu = new SideMenu(page);

    await loginPage.navigate();
    await loginPage.login('test@repricelab.com', 'TestPassword123!');
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });
  });

  test('N1 - Menu renders correctly', async ({ page }) => {
    await sideMenu.verifyAllMenuItemsVisible();

    await expect(sideMenu.dashboardLink).toBeVisible();
    await expect(sideMenu.dashboardLink).toContainText('Dashboard');

    await expect(sideMenu.productsLink).toBeVisible();
    await expect(sideMenu.productsLink).toContainText('Products');

    await expect(sideMenu.multichannelLink).toBeVisible();
    await expect(sideMenu.repricingRulesLink).toBeVisible();
    await expect(sideMenu.automationsLink).toBeVisible();
    await expect(sideMenu.importLink).toBeVisible();
    await expect(sideMenu.ordersLink).toBeVisible();
    await expect(sideMenu.repricingActivityLink).toBeVisible();
    await expect(sideMenu.competitorsLink).toBeVisible();
    await expect(sideMenu.reportsLink).toBeVisible();
    await expect(sideMenu.settingsButton).toBeVisible();
    await expect(sideMenu.appStoreLink).toBeVisible();

    const isDashboardActive = await sideMenu.isMenuItemActive(sideMenu.dashboardLink);
    expect(isDashboardActive).toBe(true);
  });

  test('N2.1 - Navigate to Products', async ({ page }) => {
    await sideMenu.openProducts();
    
    expect(page.url()).toContain('/products');
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    const isActive = await sideMenu.isMenuItemActive(sideMenu.productsLink);
    expect(isActive).toBe(true);
  });

  test('N2.2 - Navigate to Multichannel', async ({ page }) => {
    await sideMenu.openMultichannel();
    
    expect(page.url()).toContain('/multichannel');
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    const isActive = await sideMenu.isMenuItemActive(sideMenu.multichannelLink);
    expect(isActive).toBe(true);
  });

  test('N2.3 - Navigate to Repricing Rules', async ({ page }) => {
    await sideMenu.openRepricingRules();
    
    expect(page.url()).toContain('/repricing-rules');
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    const isActive = await sideMenu.isMenuItemActive(sideMenu.repricingRulesLink);
    expect(isActive).toBe(true);
  });

  test('N2.4 - Navigate to Automations', async ({ page }) => {
    await sideMenu.openAutomations();
    
    expect(page.url()).toContain('/automations');
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    const isActive = await sideMenu.isMenuItemActive(sideMenu.automationsLink);
    expect(isActive).toBe(true);
  });

  test('N2.5 - Navigate to Import', async ({ page }) => {
    await sideMenu.openImport();
    
    expect(page.url()).toContain('/import');
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    const isActive = await sideMenu.isMenuItemActive(sideMenu.importLink);
    expect(isActive).toBe(true);
  });

  test('N2.6 - Navigate to Orders', async ({ page }) => {
    await sideMenu.openOrders();
    
    expect(page.url()).toContain('/orders');
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    const isActive = await sideMenu.isMenuItemActive(sideMenu.ordersLink);
    expect(isActive).toBe(true);
  });

  test('N2.7 - Navigate to Repricing Activity', async ({ page }) => {
    await sideMenu.openRepricingActivity();
    
    expect(page.url()).toContain('/repricing-activity');
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    const isActive = await sideMenu.isMenuItemActive(sideMenu.repricingActivityLink);
    expect(isActive).toBe(true);
  });

  test('N2.8 - Navigate to Competitors', async ({ page }) => {
    await sideMenu.openCompetitors();
    
    expect(page.url()).toContain('/competitors');
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    const isActive = await sideMenu.isMenuItemActive(sideMenu.competitorsLink);
    expect(isActive).toBe(true);
  });

  test('N2.9 - Navigate to Reports', async ({ page }) => {
    await sideMenu.openReports();
    
    expect(page.url()).toContain('/reports');
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    const isActive = await sideMenu.isMenuItemActive(sideMenu.reportsLink);
    expect(isActive).toBe(true);
  });

  test('N2.10 - Navigate to Settings Account', async ({ page }) => {
    await sideMenu.openSettingsAccount();
    
    expect(page.url()).toContain('/settings/account');
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('N2.11 - Navigate to App Store', async ({ page }) => {
    await sideMenu.openAppStore();
    
    expect(page.url()).toContain('/app-store');
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    const isActive = await sideMenu.isMenuItemActive(sideMenu.appStoreLink);
    expect(isActive).toBe(true);
  });

  test('N3 - Return to Dashboard from any page', async ({ page }) => {
    await sideMenu.openProducts();
    expect(page.url()).toContain('/products');

    await sideMenu.openDashboard();
    expect(page.url()).toContain('/dashboard');

    await expect(page.locator('div:has-text("Safe Mode")').first()).toBeVisible();
    
    const isDashboardActive = await sideMenu.isMenuItemActive(sideMenu.dashboardLink);
    expect(isDashboardActive).toBe(true);
  });

  test('N4 - Menu section titles visible', async () => {
    await sideMenu.verifySectionTitlesVisible();

    await expect(sideMenu.repricingSectionTitle).toBeVisible();
    await expect(sideMenu.repricingSectionTitle).toContainText('ReprIcIng');

    await expect(sideMenu.insightsSectionTitle).toBeVisible();
    await expect(sideMenu.insightsSectionTitle).toContainText('InsIghts');

    await expect(sideMenu.systemSectionTitle).toBeVisible();
    await expect(sideMenu.systemSectionTitle).toContainText('System');
  });

  test('N5 - Settings dropdown expand/collapse behavior', async () => {
    const isInitiallyVisible = await sideMenu.settingsAccountLink.isVisible();
    
    if (!isInitiallyVisible) {
      await sideMenu.expandSettings();
      await expect(sideMenu.settingsAccountLink).toBeVisible();
      await expect(sideMenu.settingsUsersLink).toBeVisible();
      await expect(sideMenu.settingsSubscriptionLink).toBeVisible();
    }

    await sideMenu.collapseSettings();
    await expect(sideMenu.settingsAccountLink).not.toBeVisible();

    await sideMenu.expandSettings();
    await expect(sideMenu.settingsAccountLink).toBeVisible();
  });
});
