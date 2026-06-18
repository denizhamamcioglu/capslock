import { test, expect } from '../../../web/core/BasePage';
import { ZipCode } from '../../../common/data/TestEnums';

test.describe('Tests the happy path form submissions with in range zip codes and email addresses', () => {
    test('submit valid estimation by using the first form', async ({landingPage, thankYouPage}) => {
        await landingPage.submitEstimation(0);
        await expect(thankYouPage.thankYouText).toBeVisible();
    })

    test('submit valid estimation by using the second form', async ({landingPage, thankYouPage}) => {
        await landingPage.submitEstimation(1);
        await expect(thankYouPage.thankYouText).toBeVisible();
    })

    test.only('submit valid estimation with out of range zip code', async ({landingPage, thankYouPage}) => {
        await landingPage.submitEstimation(0, {zip: ZipCode.OutOfRange});
        await expect(thankYouPage.thankYouText).toBeVisible();
    })
})