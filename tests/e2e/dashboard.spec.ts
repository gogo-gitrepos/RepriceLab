import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { DashboardPage } from '../page-objects/DashboardPage';

test.describe('Dashboard Page Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('test@repricelab.com', 'TestPassword123!');
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });
  });

  test('D1 - Dashboard loads successfully', async ({ page }) => {
    await dashboardPage.waitForLoad();

    await expect(dashboardPage.safeModeBanner).toBeVisible();
    await expect(dashboardPage.safeModeTitle).toContainText(/Safe Mode/i);

    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const criticalErrors = consoleErrors.filter(
      err => !err.includes('favicon') && !err.includes('404')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('D2 - KPI cards are visible', async () => {
    await dashboardPage.waitForLoad();

    await expect(dashboardPage.spentCard).toBeVisible();
    await expect(dashboardPage.spentCard).toContainText('$0.00');
    await expect(dashboardPage.spentCard).toContainText('Spent this period');

    await expect(dashboardPage.dailyLimitCard).toBeVisible();
    await expect(dashboardPage.dailyLimitCard).toContainText('$0.00');
    await expect(dashboardPage.dailyLimitCard).toContainText('Daily limit remaining');

    await expect(dashboardPage.needHelpCard).toBeVisible();
    await expect(dashboardPage.needHelpCard).toContainText('Need Help?');
    await expect(dashboardPage.needHelpCard).toContainText(/support team/i);
  });

  test('D3 - Need Help card actions', async () => {
    await dashboardPage.waitForLoad();

    await expect(dashboardPage.sendEmailButton).toBeVisible();
    await expect(dashboardPage.sendEmailButton).toBeEnabled();
    await expect(dashboardPage.sendEmailButton).toContainText(/Send us an email/i);

    await expect(dashboardPage.scheduleCallButton).toBeVisible();
    await expect(dashboardPage.scheduleCallButton).toBeEnabled();
    await expect(dashboardPage.scheduleCallButton).toContainText(/Schedule a call/i);

    const isClickable = await dashboardPage.sendEmailButton.isEnabled();
    expect(isClickable).toBe(true);
  });

  test('D4 - Sales data widget', async ({ page }) => {
    await dashboardPage.waitForLoad();

    await expect(dashboardPage.salesDataWidget).toBeVisible();
    await expect(dashboardPage.salesDataWidget).toContainText(/Sales data unavailable/i);

    await expect(dashboardPage.salesDataSettingsButton).toBeVisible();
    await expect(dashboardPage.salesDataSettingsButton).toContainText('Settings');

    await expect(dashboardPage.salesDataUnavailableMessage).toBeVisible();
    await expect(dashboardPage.salesDataUnavailableMessage).toContainText(/No data available/i);
  });

  test('D5 - Insights + Profitability section', async () => {
    await dashboardPage.waitForLoad();

    await expect(dashboardPage.insightsCard).toBeVisible();

    await dashboardPage.verifyInsightsCategories();

    await expect(dashboardPage.insightsCategoryA).toContainText('Category A');
    await expect(dashboardPage.insightsCategoryA.locator('..')).toContainText('75%');

    await expect(dashboardPage.insightsCategoryB).toContainText('Category B');
    await expect(dashboardPage.insightsCategoryB.locator('..')).toContainText('60%');

    await expect(dashboardPage.insightsCategoryC).toContainText('Category C');
    await expect(dashboardPage.insightsCategoryC.locator('..')).toContainText('45%');

    await expect(dashboardPage.insightsCategoryD).toContainText('Category D');
    await expect(dashboardPage.insightsCategoryD.locator('..')).toContainText('30%');

    await expect(dashboardPage.insightsCategoryE).toContainText('Category E');
    await expect(dashboardPage.insightsCategoryE.locator('..')).toContainText('20%');

    await expect(dashboardPage.profitabilityCard).toBeVisible();
    await expect(dashboardPage.profitabilityPercentage).toBeVisible();
    await expect(dashboardPage.profitabilityCard).toContainText(/Profitable/i);
  });

  test('D6 - Repricing Insights + Activity History + Buy Box Ownership', async () => {
    await dashboardPage.waitForLoad();

    await expect(dashboardPage.repricingInsightsCard).toBeVisible();

    await dashboardPage.verifyRepricingInsights();

    await expect(dashboardPage.optimizedListings).toContainText('Optimized listings');
    await expect(dashboardPage.repricingListings).toContainText('Repricing listings');
    await expect(dashboardPage.underpricedListings).toContainText('Underpriced listings');
    await expect(dashboardPage.buyBoxLossListings).toContainText('Buy box loss listings');
    await expect(dashboardPage.latestPriceListings).toContainText('Latest price listings');

    await expect(dashboardPage.activityHistoryCard).toBeVisible();
    await expect(dashboardPage.activityHistoryTotal).toBeVisible();

    await expect(dashboardPage.buyBoxOwnershipCard).toBeVisible();
    await expect(dashboardPage.buyBoxPercentage).toBeVisible();
    await expect(dashboardPage.buyBoxDescription).toBeVisible();
  });

  test('D7 - Top Competitors block', async ({ page }) => {
    await dashboardPage.waitForLoad();

    await expect(dashboardPage.topCompetitorsCard).toBeVisible();

    await dashboardPage.verifyTopCompetitors();

    await expect(dashboardPage.competitor1).toContainText('TechInnovate Plus');
    await expect(dashboardPage.competitor1.locator('..')).toContainText('85%');

    await expect(dashboardPage.competitor2).toContainText('ElectroWorld Store');
    await expect(dashboardPage.competitor2.locator('..')).toContainText('70%');

    await expect(dashboardPage.competitor3).toContainText('DigitalSolutions Pro');
    await expect(dashboardPage.competitor3.locator('..')).toContainText('55%');

    await expect(dashboardPage.competitor4).toContainText('SmartChoice Market');
    await expect(dashboardPage.competitor4.locator('..')).toContainText('40%');

    await expect(dashboardPage.competitor5).toContainText('TechValue Express');
    await expect(dashboardPage.competitor5.locator('..')).toContainText('25%');

    await expect(dashboardPage.viewAllCompetitorsButton).toBeVisible();
    await expect(dashboardPage.viewAllCompetitorsButton).toContainText(/View All Competitors/i);
  });

  test('D8 - Responsiveness basic layout smoke', async ({ page }) => {
    await dashboardPage.waitForLoad();

    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(dashboardPage.safeModeBanner).toBeVisible();
    await expect(dashboardPage.spentCard).toBeVisible();

    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(dashboardPage.safeModeBanner).toBeVisible();

    await page.setViewportSize({ width: 375, height: 667 });
    await expect(dashboardPage.safeModeBanner).toBeVisible();

    await page.setViewportSize({ width: 1920, height: 1080 });
  });
});
