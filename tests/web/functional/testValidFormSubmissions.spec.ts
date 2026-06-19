import { test, expect } from '../../../web/core/BasePage';
import { FeedbackMessage, ZipCode } from '../../../common/data/TestEnums';
import { validEstimation } from '../../../common/data/test-data/EstimationFormData';
import { Environment } from '../../../common/data/Environment';

test.describe('Tests the happy path form submissions with in range and out of range zip codes', () => {
    test('submit valid estimation by using the first form', async ({landingPage, thankYouPage, page}) => {
        await landingPage.estimationForm(0).submitEstimation();
        await expect(thankYouPage.thankYouText, 'Thank you text is not visible on the thank you page.').toBeVisible();
        await expect(page, 'Thank you page does not have the expected URL.').toHaveURL(Environment.PAGE_ROUTES.THANK_YOU);
    })

    test('submit valid estimation by using the second form', async ({landingPage, thankYouPage, page}) => {
        await landingPage.estimationForm(1).submitEstimation();
        await expect(thankYouPage.thankYouText, 'Thank you text is not visible on the thank you page.').toBeVisible();
        await expect(page, 'Thank you page does not have the expected URL.').toHaveURL(Environment.PAGE_ROUTES.THANK_YOU);
    })

    test('submit valid estimation with out of range zip code', async ({landingPage}) => {
        await landingPage.estimationForm(0).submitZipCode({zip: ZipCode.OutOfRange});
        await landingPage.verifyMessageVisibleOnAllForms(FeedbackMessage.OUT_OF_AREA);

        await landingPage.estimationForm(0).emailInput.fill(validEstimation.email);
        await landingPage.estimationForm(0).submitButton.click();

        await landingPage.verifyMessageVisibleOnAllForms(FeedbackMessage.OUT_OF_AREA_THANK_YOU);
    })

    test('check step progress states for out of range zip code', async ({landingPage}) => {
        await landingPage.estimationForm(0).submitZipCode({zip: ZipCode.OutOfRange});
        await landingPage.verifyProgressStatesOnAllForms('2');

        await landingPage.estimationForm(0).emailInput.fill(validEstimation.email);
        await landingPage.estimationForm(0).submitButton.click();

        await landingPage.verifyProgressStatesOnAllForms('3');
    })

    test('check step progress states for in range zip code', async ({landingPage}) => {
        await landingPage.estimationForm(0).submitZipCode({zip: ZipCode.InRange});
        await landingPage.verifyProgressStatesOnAllForms('2');

        await landingPage.estimationForm(0).selectInterests(validEstimation.interests);
        await landingPage.verifyProgressStatesOnAllForms('3');

        await landingPage.estimationForm(0).selectPropertyType(validEstimation.propertyType);
        await landingPage.verifyProgressStatesOnAllForms('4');

        await landingPage.estimationForm(0).fillContactDetails(validEstimation);
        await landingPage.verifyProgressStatesOnAllForms('5');
    })
})
