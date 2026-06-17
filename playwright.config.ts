import { defineConfig, devices } from '@playwright/test';
import { Constants } from './common/data/Constants';
import { Environment } from './common/data/Environment';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: Constants.TIMEOUT,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? (process.env.ENABLE_RETRIES === 'true' ? 1 : 0) : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 5 : 5,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.TEST_URL
      ? process.env.TEST_URL
      : Environment.TEST_BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    timezoneId: 'UTC'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'desktop_chrome_functional_tests',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
      testDir: './tests/web/functional'
    },

    {
      name: 'desktop_firefox_functional_tests',
      use: { ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
      testDir: './tests/web/functional'
    },

    {
      name: 'desktop_webkit_functional_tests',
      use: { ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
      testDir: './tests/web/functional'
    },

    {
      name: 'desktop_chrome_visual_tests',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
      testDir: './tests/web/non-functional/visual'
    },

    /* Test against mobile viewports. */
    {
      name: 'mobile_chrome_functional_tests',
      use: { ...devices['Pixel 10'],},
      testDir: './tests/web/functional'
    },

    {
      name: 'mobile_chrome_visual_tests',
      use: { ...devices['Pixel 10'],},
      testDir: './tests/web/non-functional/visual'
    },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
