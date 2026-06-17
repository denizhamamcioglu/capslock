import { test as base, type BrowserContext } from '@playwright/test';
import { initLogger } from '../../common/utils/Logger';
import { LandingPage } from '../pages/landing/LandingPage';

const logger = initLogger('fixtures');

/**
 * Page-object fixtures. These are instantiated lazily, only when a test
 * actually destructures them, so unused page objects cost nothing.
 */
type Fixtures = {
  landingPage: LandingPage;
};

/**
 * Cross-cutting fixtures that run automatically for every test
 * (declared with `{ auto: true }`), without needing to be requested.
 */
type AutoFixtures = {
  errorCollector: void;
};

export const test = base.extend<Fixtures & AutoFixtures>({
  landingPage: async ({ page }, use) => {
    await use(new LandingPage(page));
  },

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


