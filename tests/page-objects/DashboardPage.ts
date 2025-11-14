import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly safeModeBanner: Locator;
  readonly safeModeTitle: Locator;
  readonly safeModeDescription: Locator;
  readonly safeModeButton: Locator;

  readonly spentCard: Locator;
  readonly dailyLimitCard: Locator;
  readonly needHelpCard: Locator;
  readonly sendEmailButton: Locator;
  readonly scheduleCallButton: Locator;

  readonly salesDataWidget: Locator;
  readonly salesDataSettingsButton: Locator;
  readonly salesDataUnavailableMessage: Locator;

  readonly insightsCard: Locator;
  readonly insightsCategoryA: Locator;
  readonly insightsCategoryB: Locator;
  readonly insightsCategoryC: Locator;
  readonly insightsCategoryD: Locator;
  readonly insightsCategoryE: Locator;

  readonly profitabilityCard: Locator;
  readonly profitabilityPercentage: Locator;

  readonly repricingInsightsCard: Locator;
  readonly optimizedListings: Locator;
  readonly repricingListings: Locator;
  readonly underpricedListings: Locator;
  readonly buyBoxLossListings: Locator;
  readonly latestPriceListings: Locator;

  readonly activityHistoryCard: Locator;
  readonly activityHistoryTotal: Locator;

  readonly buyBoxOwnershipCard: Locator;
  readonly buyBoxPercentage: Locator;
  readonly buyBoxDescription: Locator;

  readonly topCompetitorsCard: Locator;
  readonly competitor1: Locator;
  readonly competitor2: Locator;
  readonly competitor3: Locator;
  readonly competitor4: Locator;
  readonly competitor5: Locator;
  readonly viewAllCompetitorsButton: Locator;

  constructor(page: Page) {
    super(page);

    this.safeModeBanner = page.locator('.bg-gradient-to-r.from-purple-600').first();
    this.safeModeTitle = page.locator('h3:has-text("Safe Mode")');
    this.safeModeDescription = this.safeModeBanner.locator('p').first();
    this.safeModeButton = this.safeModeBanner.locator('button');

    this.spentCard = page.locator('div:has-text("Spent this period")').first();
    this.dailyLimitCard = page.locator('div:has-text("Daily limit remaining")').first();
    this.needHelpCard = page.locator('div:has-text("Need Help?")').first();
    this.sendEmailButton = page.locator('button:has-text("Send us an email")');
    this.scheduleCallButton = page.locator('button:has-text("Schedule a call")');

    this.salesDataWidget = page.locator('div:has-text("Sales data unavailable")').first();
    this.salesDataSettingsButton = this.salesDataWidget.locator('button:has-text("Settings")');
    this.salesDataUnavailableMessage = page.locator('p:has-text("No data available for the selected period")');

    this.insightsCard = page.locator('div:has-text("Insights")').filter({ has: page.locator('div:has-text("Category")') }).first();
    this.insightsCategoryA = this.insightsCard.locator('span:has-text("Category A")');
    this.insightsCategoryB = this.insightsCard.locator('span:has-text("Category B")');
    this.insightsCategoryC = this.insightsCard.locator('span:has-text("Category C")');
    this.insightsCategoryD = this.insightsCard.locator('span:has-text("Category D")');
    this.insightsCategoryE = this.insightsCard.locator('span:has-text("Category E")');

    this.profitabilityCard = page.locator('div:has-text("Profitability")').first();
    this.profitabilityPercentage = this.profitabilityCard.locator('text=84%');

    this.repricingInsightsCard = page.locator('div:has-text("Repricing Insights")').first();
    this.optimizedListings = page.locator('div:has-text("Optimized listings")');
    this.repricingListings = page.locator('div:has-text("Repricing listings")');
    this.underpricedListings = page.locator('div:has-text("Underpriced listings")');
    this.buyBoxLossListings = page.locator('div:has-text("Buy box loss listings")');
    this.latestPriceListings = page.locator('div:has-text("Latest price listings")');

    this.activityHistoryCard = page.locator('div:has-text("Activity History")').first();
    this.activityHistoryTotal = this.activityHistoryCard.locator('div:has-text("Total pricing events")');

    this.buyBoxOwnershipCard = page.locator('div:has-text("Buy Box Ownership")').first();
    this.buyBoxPercentage = this.buyBoxOwnershipCard.locator('text=60%');
    this.buyBoxDescription = this.buyBoxOwnershipCard.locator('p:has-text("Current Buy Box Rate")');

    this.topCompetitorsCard = page.locator('div:has-text("Top Competitors")').first();
    this.competitor1 = this.topCompetitorsCard.locator('span:has-text("TechInnovate Plus")');
    this.competitor2 = this.topCompetitorsCard.locator('span:has-text("ElectroWorld Store")');
    this.competitor3 = this.topCompetitorsCard.locator('span:has-text("DigitalSolutions Pro")');
    this.competitor4 = this.topCompetitorsCard.locator('span:has-text("SmartChoice Market")');
    this.competitor5 = this.topCompetitorsCard.locator('span:has-text("TechValue Express")');
    this.viewAllCompetitorsButton = page.locator('button:has-text("View All Competitors")');
  }

  async navigate() {
    await this.goto('/dashboard');
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.safeModeBanner.waitFor({ state: 'visible', timeout: 10000 });
  }

  async verifyKPICardsVisible() {
    await this.spentCard.waitFor({ state: 'visible' });
    await this.dailyLimitCard.waitFor({ state: 'visible' });
    await this.needHelpCard.waitFor({ state: 'visible' });
  }

  async verifyInsightsCategories() {
    await this.insightsCategoryA.waitFor({ state: 'visible' });
    await this.insightsCategoryB.waitFor({ state: 'visible' });
    await this.insightsCategoryC.waitFor({ state: 'visible' });
    await this.insightsCategoryD.waitFor({ state: 'visible' });
    await this.insightsCategoryE.waitFor({ state: 'visible' });
  }

  async verifyRepricingInsights() {
    await this.optimizedListings.waitFor({ state: 'visible' });
    await this.repricingListings.waitFor({ state: 'visible' });
    await this.underpricedListings.waitFor({ state: 'visible' });
    await this.buyBoxLossListings.waitFor({ state: 'visible' });
    await this.latestPriceListings.waitFor({ state: 'visible' });
  }

  async verifyTopCompetitors() {
    await this.competitor1.waitFor({ state: 'visible' });
    await this.competitor2.waitFor({ state: 'visible' });
    await this.competitor3.waitFor({ state: 'visible' });
    await this.competitor4.waitFor({ state: 'visible' });
    await this.competitor5.waitFor({ state: 'visible' });
  }

  async clickViewAllCompetitors() {
    await this.viewAllCompetitorsButton.click();
  }

  async clickSalesDataSettings() {
    await this.salesDataSettingsButton.click();
  }

  async clickSendEmail() {
    await this.sendEmailButton.click();
  }

  async clickScheduleCall() {
    await this.scheduleCallButton.click();
  }
}
