import { test, expect } from '../../../web/core/BasePage';

test.describe('Tests the happy path form submissions with in range zip codes and email addresses', () => {
    test.only('submit valid estimation', async ({landingPage, thankYouPage}) => {
        await landingPage.submitEstimation();
        await expect(thankYouPage.thankYouText).toBeVisible();
    })
})