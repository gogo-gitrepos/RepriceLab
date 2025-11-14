import { test, expect } from '@playwright/test';
import { PricingPage } from '../page-objects/PricingPage';

test.describe('Functional - Pricing Page', () => {
  let pricingPage: PricingPage;

  test.beforeEach(async ({ page }) => {
    pricingPage = new PricingPage(page);
    await pricingPage.navigate();
  });

  test('displays all three pricing tiers', async ({ page }) => {
    await expect(pricingPage.plusPlan).toBeVisible();
    await expect(pricingPage.proPlan).toBeVisible();
    await expect(pricingPage.enterprisePlan).toBeVisible();
  });

  test('pricing cards show correct information', async ({ page }) => {
    // Plus plan
    const plusPrice = await pricingPage.getPlanPrice('plus');
    expect(plusPrice).toContain('$99');

    // Pro plan
    const proPrice = await pricingPage.getPlanPrice('pro');
    expect(proPrice).toContain('$199');

    // Enterprise plan
    const enterprisePrice = await pricingPage.getPlanPrice('enterprise');
    expect(enterprisePrice).toContain('$299');
  });

  test('selecting a plan highlights it', async ({ page }) => {
    await pricingPage.selectPlan('pro');
    
    // Pro plan should have selected styling
    const proCardClasses = await pricingPage.proPlan.getAttribute('class');
    expect(proCardClasses).toContain('scale-105');
  });

  test('start free trial button redirects to login', async ({ page }) => {
    await pricingPage.startFreeTrial();
    
    // Should redirect to login page with plan parameter
    await page.waitForURL(/.*login/, { timeout: 5000 });
    expect(page.url()).toMatch(/login/);
  });

  test('back to home button works', async ({ page }) => {
    await pricingPage.backToHomeButton.click();
    await expect(page).toHaveURL(/.*\/$|.*home/);
  });
});
