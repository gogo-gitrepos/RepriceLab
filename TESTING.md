# RepriceLab Testing Guide

Complete test automation framework for RepriceLab SaaS platform.

## 📁 Test Structure

```
tests/
├── e2e/              # End-to-end user flows
├── smoke/            # Fast health checks
├── functional/       # Detailed UI & business logic tests
├── api/              # Backend API tests (Python/pytest in backend/)
├── page-objects/     # Page Object Models (POM)
├── utils/            # Shared test helpers
└── fixtures/         # Test data & fixtures

backend/tests/
├── api/              # FastAPI endpoint tests
└── fixtures/         # Backend test data
```

## 🛠️ Tech Stack

- **Frontend/E2E/UI**: Playwright (TypeScript)
- **Backend/API**: pytest (Python)
- **Test Runner**: Playwright Test + pytest
- **Browser**: Chromium (headless by default)

## 🚀 Installation

### 1. Install Dependencies

```bash
# Install Node.js dependencies (Playwright, etc.)
npm install

# Install Python testing dependencies
cd backend && pip install pytest pytest-asyncio httpx pytest-mock
```

### 2. Set Up Environment

```bash
# Copy example env file
cp .env.example .env.test

# Edit .env.test with your values
# Required:
# - BASE_URL (default: http://localhost:5000)
# - API_URL (default: http://localhost:8000)
# - TEST_USER_EMAIL
# - TEST_USER_PASSWORD
```

## 📊 Running Tests

### Quick Start (Smoke Tests Only)

```bash
npm test
# or
npm run test:smoke
```

### All Test Suites

| Command | Description |
|---------|-------------|
| `npm test` | Run smoke tests (fastest) |
| `npm run test:smoke` | Smoke tests - basic health checks |
| `npm run test:e2e` | E2E flows - complete user journeys |
| `npm run test:e2e:dashboard` | Dashboard page tests only (D1-D8) |
| `npm run test:e2e:navigation` | Navigation menu tests only (N1-N5) |
| `npm run test:functional` | Functional tests - forms, UI, validations |
| `npm run test:ui` | All UI tests (smoke + e2e + functional) |
| `npm run test:api` | Backend API tests (pytest) |
| `npm run test:api:smoke` | API smoke tests only |
| `npm run test:all` | Full regression (UI + API) |

### Advanced Commands

```bash
# Run in headed mode (see browser)
npm run test:headed

# Debug mode (step through tests)
npm run test:debug

# View HTML test report
npm run test:report

# Run specific test file
npx playwright test tests/smoke/app-health.spec.ts

# Run tests matching pattern
npx playwright test --grep "login"
```

## 🧪 Test Suites Explained

### 1. Smoke Tests (`tests/smoke/`)

**Purpose**: Fast checks to verify app is alive  
**Run time**: < 1 minute  
**Run frequency**: Every commit, every deploy

Tests:
- Homepage loads
- Login page renders
- Pricing page displays
- Navigation works
- Contact page accessible

```bash
npm run test:smoke
```

### 2. E2E Tests (`tests/e2e/`)

**Purpose**: Complete end-to-end user journeys  
**Run time**: 2-5 minutes  
**Run frequency**: Before merge, nightly

Tests:
- Full login flow (homepage → login → dashboard)
- Invalid credentials handling
- Google OAuth button exists
- **Dashboard page (8 tests)**: Safe Mode banner, KPI cards, Need Help section, Sales data widget, Insights categories, Profitability score, Repricing insights, Activity history, Buy Box ownership, Top competitors, Responsiveness
- **Navigation menu (17 tests)**: All menu items visible, Navigation to 11 routes, Dashboard return, Section titles, Settings dropdown behavior

```bash
npm run test:e2e                  # All E2E tests
npm run test:e2e:dashboard        # Dashboard tests only
npm run test:e2e:navigation       # Navigation tests only
```

**See [DASHBOARD_TESTS.md](./DASHBOARD_TESTS.md) for detailed dashboard & navigation test documentation.**

### 3. Functional Tests (`tests/functional/`)

**Purpose**: Detailed UI component & business logic tests  
**Run time**: 3-10 minutes  
**Run frequency**: Before merge

Tests:
- Form validations (email format, required fields)
- Password visibility toggle
- Forgot password flow
- Pricing page interactions
- Plan selection & highlighting

```bash
npm run test:functional
```

### 4. API Tests (`backend/tests/api/`)

**Purpose**: Backend endpoint testing  
**Run time**: 1-3 minutes  
**Run frequency**: Every commit

Tests:
- Auth endpoints (register, login, protected routes)
- Subscription endpoints (status, checkout)
- Error handling & validation
- JWT token validation

```bash
npm run test:api

# Or with pytest directly
cd backend && pytest tests/api -v
```

## 📝 Writing Tests

### Page Object Model Example

```typescript
// tests/page-objects/MyPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  readonly someButton: Locator;

  constructor(page: Page) {
    super(page);
    this.someButton = page.locator('button.my-button');
  }

  async navigate() {
    await this.goto('/my-page');
  }

  async clickButton() {
    await this.someButton.click();
  }
}
```

### Test Example

```typescript
// tests/e2e/my-test.spec.ts
import { test, expect } from '@playwright/test';
import { MyPage } from '../page-objects/MyPage';

test.describe('My Feature', () => {
  test('should work correctly', async ({ page }) => {
    const myPage = new MyPage(page);
    await myPage.navigate();
    await myPage.clickButton();
    await expect(page).toHaveURL(/success/);
  });
});
```

### API Test Example

```python
# backend/tests/api/test_my_api.py
import pytest
from fastapi import status

def test_my_endpoint(authenticated_client):
    """Test my API endpoint"""
    response = authenticated_client.get("/api/my-endpoint")
    assert response.status_code == status.HTTP_200_OK
    assert "expected_field" in response.json()
```

## 🐛 Debugging Tests

### 1. Run in Headed Mode

```bash
npm run test:headed
```

### 2. Use Debug Mode

```bash
npm run test:debug
```

This opens Playwright Inspector where you can:
- Step through each action
- Inspect page state
- View console logs
- Try locators in real-time

### 3. Screenshots

Failed tests automatically capture screenshots to `test-results/`

### 4. Traces

View detailed traces of failed tests:

```bash
npx playwright show-trace test-results/path-to-trace.zip
```

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)

- Base URL: From `.env.test`
- Retries: 2 (in CI), 0 (locally)
- Parallel: Yes
- Screenshots: On failure
- Traces: On first retry

### Pytest Config (`backend/pytest.ini`)

- Test path: `backend/tests`
- Verbosity: High
- Markers: smoke, e2e, unit, slow

## 📈 CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Tests
  run: |
    npm install
    npm run test:all
```

### Replit

Tests run directly in Replit terminal:

```bash
npm run test:smoke    # Quick check
npm run test:all      # Full suite
```

## 🎯 Best Practices

### DO

✅ Use Page Object Model for all UI tests  
✅ Use meaningful test descriptions  
✅ Keep tests independent (no shared state)  
✅ Use fixtures for test data  
✅ Run smoke tests before every commit  
✅ Add assertions for both positive & negative cases  

### DON'T

❌ Hard-code credentials in tests  
❌ Share state between tests  
❌ Test external APIs without mocks  
❌ Write overly long tests (split into smaller ones)  
❌ Ignore flaky tests (fix them)  

## 🆘 Troubleshooting

### Tests Failing?

1. **Check frontend/backend are running**:
   ```bash
   # Frontend should be on :5000
   # Backend should be on :8000
   ```

2. **Verify `.env.test` is configured**:
   ```bash
   cat .env.test
   ```

3. **Check test user exists**:
   - Create test user manually in dev environment
   - Or let tests create it (register endpoint)

4. **Clear test database**:
   ```bash
   rm backend/test.db
   ```

5. **Update Playwright browsers**:
   ```bash
   npx playwright install chromium
   ```

### Specific Errors

**"Timeout waiting for..."**
- Increase timeout in test or config
- Check if element selector is correct
- Verify page loads successfully

**"Connection refused"**
- Ensure frontend/backend servers are running
- Check BASE_URL and API_URL in `.env.test`

**"401 Unauthorized" in API tests**
- Check JWT_SECRET_KEY matches backend
- Verify test user credentials are correct

## 📚 Resources

- [DASHBOARD_TESTS.md](./DASHBOARD_TESTS.md) - Detailed dashboard & navigation test documentation
- [Playwright Docs](https://playwright.dev)
- [pytest Docs](https://docs.pytest.org)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)

## 🎉 Summary

```bash
# Daily development workflow:
npm run test:smoke      # Before commit (< 1 min)
npm run test:ui         # Before push (2-5 min)
npm run test:api        # Before push (1-3 min)
npm run test:all        # Before merge (5-15 min)
```

**Questions?** Check this guide or run `npm test` to get started!
