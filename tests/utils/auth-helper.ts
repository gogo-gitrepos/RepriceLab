import { Page } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';

export class AuthHelper {
  static async login(page: Page, email: string, password: string) {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(email, password);
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });
  }

  static async logout(page: Page) {
    await page.locator('button:has-text("Logout"), a:has-text("Logout")').click();
    await page.waitForURL(/.*login|.*home/, { timeout: 5000 });
  }

  static async isAuthenticated(page: Page): Promise<boolean> {
    // Check if on dashboard or if user menu is visible
    const onDashboard = page.url().includes('/dashboard');
    const userMenuVisible = await page.locator('[data-testid="user-menu"]').isVisible().catch(() => false);
    return onDashboard || userMenuVisible;
  }
}
