# Verification record

Verified locally on September 14, 2026.

## Build and code quality

- Production build completed successfully; all six application routes prerendered.
- ESLint passed with no warnings or errors.
- TypeScript passed with no errors.
- Installed application dependencies reported no known vulnerabilities at installation time.

## Functional checks

- Reporting period changes updated the revenue summary (monthly $48,295; weekly $12,940).
- All three chart series reconciled exactly to their exported period totals: $48,295, $12,940, and $132,860.
- Created a customer, refreshed the browser, and verified persistence.
- Updated that customer from Pro to Business and verified the change on the subscriptions page.
- Verified customer search, no-results state, and pagination.
- Canceled and reactivated a sample subscription and checked its status and renewal display.
- Opened invoice INV-2026-0128, downloaded its CSV, and verified the file contents ($79, Pro, Paid).
- Updated a profile name, refreshed, and verified the sidebar reflected the saved name.
- Toggled a notification preference and verified the switch state.
- Reset the demo and verified the original 24 customer records returned.
- Verified desktop layout at 1440px and mobile layout at 390px, including mobile navigation.
- Fixed mobile document overflow caused by an absolutely positioned accessible table label; the page width then remained within the mobile viewport while its table scrolled inside its container.
- Captured five screenshots from the production build and visually reviewed light and dark themes.
- Verified the Vercel deployment at https://metricflow-dashboard-nine.vercel.app. All six application routes returned HTTP 200 and the live overview rendered correctly.
- Connected the existing Vercel project to `jjjcheng/metricflow-dashboard` on GitHub. The project settings confirmed “Connected Git Repository successfully.”
- Verified automatic production deployment from GitHub commit `18c2452`: Vercel deployment `3J5RqSoU41zD5gtYQh3HgiLoftx8` reached Ready and served the existing demo domain.
- Published the Upwork portfolio on September 15, 2026, and reopened it to verify five screenshots with captions, the full case study, five skills, and both external links. Portfolio: https://www.upwork.com/freelancers/~012708d6a9c9783c5b?p=2099667680128626688

## Scope

These checks validate a fictional frontend demonstration. Real authentication, authorization, database persistence, payments, email delivery, and production billing integrations are outside this project's scope.
