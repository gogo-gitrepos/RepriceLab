# Dashboard & Navigation Test Documentation

Comprehensive UI/E2E tests for RepriceLab Dashboard and Left Side Menu Navigation.

## 📁 Test Files

```
tests/
├── e2e/
│   ├── dashboard.spec.ts      # Dashboard page tests (D1-D8)
│   └── navigation.spec.ts     # Side menu navigation tests (N1-N5)
├── page-objects/
│   ├── DashboardPage.ts       # Dashboard page object model
│   └── SideMenu.ts            # Side menu page object model
```

## 🎯 Dashboard Tests (D1-D8)

### D1 - Dashboard loads successfully
Tests that the dashboard page loads correctly with:
- Safe Mode banner visible with correct text
- No unhandled console errors
- Main components render properly

```bash
npm run test:e2e:dashboard -- --grep "D1"
```

### D2 - KPI cards are visible
Verifies the 3 top KPI cards:
- **$0.00 Spent this period** - Financial metrics card with icon
- **$0.00 Daily limit remaining** - Daily limit tracking card
- **Need Help?** - Support card with title and description

```bash
npm run test:e2e:dashboard -- --grep "D2"
```

### D3 - Need Help card actions
Tests the "Need Help?" section:
- "Send us an email" button is visible and clickable
- "Schedule a call" button is visible and clickable
- Buttons are properly enabled

```bash
npm run test:e2e:dashboard -- --grep "D3"
```

### D4 - Sales data widget
Verifies the sales data unavailable widget:
- Widget displays "Sales data unavailable for this period"
- Settings button is visible and clickable
- "No data available" message is shown

```bash
npm run test:e2e:dashboard -- --grep "D4"
```

### D5 - Insights + Profitability section
Tests the Insights and Profitability cards:
- **Insights card** shows 5 categories (A-E) with percentages:
  - Category A: 75%
  - Category B: 60%
  - Category C: 45%
  - Category D: 30%
  - Category E: 20%
- Each category has a progress bar
- **Profitability card** shows "84% Profitable" with supporting text

```bash
npm run test:e2e:dashboard -- --grep "D5"
```

### D6 - Repricing Insights + Activity History + Buy Box Ownership
Tests the repricing metrics section:
- **Repricing Insights** card shows:
  - Optimized listings
  - Repricing listings
  - Underpriced listings
  - Buy box loss listings
  - Latest price listings
- **Activity History** card shows total pricing events
- **Buy Box Ownership** card displays:
  - Ring chart with 60% percentage
  - "Current Buy Box Rate" description

```bash
npm run test:e2e:dashboard -- --grep "D6"
```

### D7 - Top Competitors block
Tests the Top Competitors section:
- Lists 5 competitors with ranking (1-5):
  1. TechInnovate Plus - 85%
  2. ElectroWorld Store - 70%
  3. DigitalSolutions Pro - 55%
  4. SmartChoice Market - 40%
  5. TechValue Express - 25%
- Each competitor shows progress bar percentage
- "View All Competitors" button is visible

```bash
npm run test:e2e:dashboard -- --grep "D7"
```

### D8 - Responsiveness basic layout smoke
Tests dashboard responsiveness:
- Desktop (1920x1080): All elements visible
- Tablet (768x1024): Layout adapts properly
- Mobile (375x667): Critical elements remain visible
- No critical overlaps or layout breaks

```bash
npm run test:e2e:dashboard -- --grep "D8"
```

## 🧭 Navigation Tests (N1-N5)

### N1 - Menu renders correctly
Verifies all menu items are visible after login:
- **Dashboard**
- **Repricing Section:**
  - Products
  - Multichannel
  - Repricing Rules
  - Automations
  - Import
- **Insights Section:**
  - Orders
  - Repricing Activity
  - Competitors
  - Reports
- **System Section:**
  - Settings (dropdown)
  - App Store
- Dashboard is highlighted as active

```bash
npm run test:e2e:navigation -- --grep "N1"
```

### N2 - Navigation works for each menu item
Tests navigation to ALL menu items (N2.1 - N2.11):
- Clicks each menu item
- Verifies URL changes correctly
- Checks page heading appears
- Confirms menu item is highlighted as active

Individual tests:
- N2.1: Products → `/products`
- N2.2: Multichannel → `/multichannel`
- N2.3: Repricing Rules → `/repricing-rules`
- N2.4: Automations → `/automations`
- N2.5: Import → `/import`
- N2.6: Orders → `/orders`
- N2.7: Repricing Activity → `/repricing-activity`
- N2.8: Competitors → `/competitors`
- N2.9: Reports → `/reports`
- N2.10: Settings Account → `/settings/account`
- N2.11: App Store → `/app-store`

```bash
npm run test:e2e:navigation -- --grep "N2"
```

### N3 - Return to Dashboard from any page
Tests navigation back to dashboard:
- Navigates to a non-dashboard page (Products)
- Clicks "Dashboard" in side menu
- Verifies:
  - URL contains `/dashboard`
  - Dashboard widgets are visible
  - Dashboard menu item is active

```bash
npm run test:e2e:navigation -- --grep "N3"
```

### N4 - Menu section titles visible
Verifies section titles are properly displayed:
- "ReprIcIng" section title
- "InsIghts" section title
- "System" section title

```bash
npm run test:e2e:navigation -- --grep "N4"
```

### N5 - Settings dropdown expand/collapse behavior
Tests the collapsible Settings menu:
- Expands Settings dropdown
- Verifies sub-items are visible:
  - Account Settings
  - Users
  - Subscription
- Collapses Settings dropdown
- Verifies sub-items are hidden
- Re-expands to verify functionality

```bash
npm run test:e2e:navigation -- --grep "N5"
```

## 🚀 Running the Tests

### Run All Dashboard Tests
```bash
npm run test:e2e:dashboard
```

### Run All Navigation Tests
```bash
npm run test:e2e:navigation
```

### Run Specific Test by Name
```bash
# Dashboard tests
npm run test:e2e -- --grep "Dashboard loads successfully"
npm run test:e2e -- --grep "KPI cards"
npm run test:e2e -- --grep "Top Competitors"

# Navigation tests
npm run test:e2e -- --grep "Menu renders"
npm run test:e2e -- --grep "Navigate to Products"
npm run test:e2e -- --grep "Settings dropdown"
```

### Run in Headed Mode (See Browser)
```bash
npm run test:headed tests/e2e/dashboard.spec.ts
npm run test:headed tests/e2e/navigation.spec.ts
```

### Debug Mode
```bash
npm run test:debug tests/e2e/dashboard.spec.ts
npm run test:debug tests/e2e/navigation.spec.ts
```

## 📊 Test Coverage

| Category | Tests | Coverage |
|----------|-------|----------|
| **Dashboard** | 8 tests | Safe Mode banner, KPI cards, Sales data, Insights, Profitability, Repricing metrics, Activity history, Buy Box ownership, Top competitors, Responsiveness |
| **Navigation** | 17 tests | Menu rendering, 11 navigation routes, Dashboard return, Section titles, Settings dropdown |
| **Total** | **25 tests** | Complete dashboard and navigation coverage |

## 🔍 What's Tested

### Dashboard Components
✅ Safe Mode banner with title and description  
✅ Financial metrics (Spent, Daily limit)  
✅ Help section (Email, Call buttons)  
✅ Sales data widget with Settings button  
✅ Insights categories (A-E with percentages)  
✅ Profitability score (84%)  
✅ Repricing insights (5 listing types)  
✅ Activity history totals  
✅ Buy Box ownership percentage  
✅ Top 5 competitors with rankings  
✅ Responsive layout (desktop/tablet/mobile)  

### Navigation Elements
✅ All 12 menu items visible with icons  
✅ Dashboard active state on load  
✅ Navigation to all 11 routes  
✅ URL changes correctly  
✅ Active state highlighting  
✅ Section titles (Repricing, Insights, System)  
✅ Settings dropdown expand/collapse  
✅ Return to dashboard functionality  

## 🎯 Best Practices Used

1. **Page Object Model (POM)**: All tests use Page Objects for maintainability
2. **Data Independence**: Tests focus on static texts and components, not live data
3. **Clear Naming**: Test names clearly describe what's being tested
4. **Stable Selectors**: Using text-based selectors that match the UI
5. **Wait Strategies**: Proper waits for page loads and element visibility
6. **Isolation**: Each test is independent and can run standalone

## 🐛 Troubleshooting

### Tests Failing?

1. **Ensure servers are running:**
   ```bash
   # Frontend on :5000, Backend on :8000
   ```

2. **Check test user exists:**
   - Email: `test@repricelab.com`
   - Password: `TestPassword123!`

3. **Verify dashboard loads manually:**
   - Login and check if dashboard displays correctly
   - Ensure Safe Mode banner appears

4. **Check browser console:**
   - Tests verify no critical console errors
   - Favicon and 404 errors are filtered out

### Common Issues

**"Element not visible"**
- Dashboard components may take time to load
- Tests include proper wait strategies
- Check if Safe Mode banner appears first

**"Navigation timeout"**
- Ensure frontend server is running on port 5000
- Check if routes are properly configured
- Verify authentication is working

**"Active state not detected"**
- Menu items use CSS classes to show active state
- Check if `from-purple-100` class is applied
- Verify pathname matching works correctly

## 📚 Related Documentation

- [TESTING.md](./TESTING.md) - Complete testing guide
- [Page Objects](./tests/page-objects/) - Page Object Models
- [Test Reports](./playwright-report/) - HTML test reports

## 🎉 Summary

- ✅ **8 Dashboard tests** covering all widgets and components
- ✅ **17 Navigation tests** covering all menu items and behaviors
- ✅ **Page Object Model** for maintainability
- ✅ **Data-independent** assertions
- ✅ **Responsive** testing included
- ✅ **Complete coverage** of dashboard and navigation

Run the tests and ensure your dashboard and navigation work perfectly! 🚀
