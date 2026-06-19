import { test as base } from '@playwright/test';
import { LandingPage } from '../pages/landing/LandingPage';
import { ThankYouPage } from '../pages/thank-you-page/ThankYouPage';
import { CommonPageObjects } from '../pages/common/CommonPageObjects';
import { WebAutomationUtils } from '../utils/WebAutomationUtils';

/**
 * Page-object fixtures. These are instantiated lazily, only when a test
 * actually destructures them, so unused page objects cost nothing.
 */
type Fixtures = {
  landingPage: LandingPage;
  thankYouPage: ThankYouPage;
  commonPageObjects: CommonPageObjects;
  webAutomationUtils: WebAutomationUtils;
};

/**
 * Cross-cutting fixtures that run automatically for every test
 * (declared with `{ auto: true }`), without needing to be requested.
 */
type AutoFixtures = {
  errorCollector: void;
  navigate: (url: string) => Promise<void>;
};

export const test = base.extend<Fixtures & AutoFixtures>({
  landingPage: async ({ page }, use) => {
    await use(new LandingPage(page));
  },
  commonPageObjects: async ({ page }, use) => {
    await use(new CommonPageObjects(page));
  },
  thankYouPage: async ({ page }, use) => {
    await use(new ThankYouPage(page));
  },

  webAutomationUtils: async ({ page }, use) => {
    await use(new WebAutomationUtils(page));
  },
  navigate: [
    // errorCollector is requested only to force it to run for every test; it is
    // intentionally not referenced in the body.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ({ page, errorCollector }, use) => {
      await page.goto('/');
      await use(async (url: string) => {
        await page.goto(url);
      });
    },
    { auto: true },
  ],

  errorCollector: [
    async ({ page }, use, testInfo) => {
      const errors: string[] = [];
      const stamp = () => new Date().toISOString();

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(`${stamp()} [Console] ${msg.text()}`);
        }
      });

      page.on('pageerror', (err) => {
        errors.push(`${stamp()} [PageError] ${err.message}`);
      });

      page.on('requestfailed', (req) => {
        errors.push(`${stamp()} [RequestFailed] ${req.url()} - ${req.failure()?.errorText}`);
      });

      page.on('response', (res) => {
        if (res.status() >= 400) {
          errors.push(`${stamp()} [HTTP ${res.status()}] ${res.url()}`);
        }
      });

      await use();

      if (errors.length) {
        await testInfo.attach('detected-errors', {
          body: errors.join('\n'),
          contentType: 'text/plain',
        });
      }
    },
    { auto: true },
  ],
});

export { expect } from './Matchers';

