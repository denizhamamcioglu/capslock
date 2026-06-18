import { test, expect } from '../../../web/core/BasePage';
import { ErrorMessage } from '../../../common/data/TestEnums';
import { validEstimation } from '../../../common/data/test-data/EstimationFormData';

test.describe('Tests field validation properties of the estimation form', () => {
    test('check field validation of the estimation form', async ({landingPage, page}) => {
        // empty zip code
        await landingPage.estimationForm(0).submitZipCode({zip: ''});
        await expect.soft(page.getByText(ErrorMessage.ZIP_CODE_REQUIRED), 'The required ZIP code error is not visible for an empty ZIP code.').toBeVisible();

        // invalid zip code
        await landingPage.estimationForm(0).submitZipCode({zip: 'invalidzip'});
        await expect.soft(page.getByText(ErrorMessage.ZIP_CODE_INVALID), 'The invalid ZIP code error is not visible for a malformed ZIP code.').toBeVisible();

        await landingPage.estimationForm(0).submitZipCode({zip: validEstimation.zip});
        await landingPage.estimationForm(0).selectInterests(validEstimation.interests);
        await landingPage.stepDiv(3).first().waitFor({ state: 'visible' }); // animation takes inconsistent amount of time to complete. waiting for step 3 visibility is required.
        await landingPage.estimationForm(0).nextButton.click();

        // mandatory property type
        await expect.soft(page.getByText(ErrorMessage.SELECT_VARIANT), 'The select variant error is not visible when no property type is chosen.').toBeVisible();

        await landingPage.estimationForm(0).selectPropertyType(validEstimation.propertyType);

        // empty email
        await landingPage.estimationForm(0).goToEstimateButton.click();
        await expect(landingPage.estimationForm(0).emailInput, 'The email field does not report the expected validation message when empty.').toBeInvalidField();

        // invalid email
        await landingPage.estimationForm(0).fillContactDetails({name: '', email: 'test'});
        await expect.soft(landingPage.estimationForm(0).emailInput).toBeInvalidField();

        // short name
        await landingPage.estimationForm(0).fillContactDetails({name: '1', email: validEstimation.email});
        await expect.soft(page.getByText(ErrorMessage.SHORT_NAME), 'The short name error is not visible for a single-character name.').toBeVisible();

        // full name required
        await landingPage.estimationForm(0).fillContactDetails({name: 'Test', email: validEstimation.email});
        await expect.soft(page.getByText(ErrorMessage.FULL_NAME_REQUIRED), 'The full name error is not visible for a single-word name.').toBeVisible();

        // invalid name
        await landingPage.estimationForm(0).fillContactDetails({name: '123456', email: validEstimation.email});
        await expect.soft(page.getByText(ErrorMessage.INVALID_NAME), 'The invalid name error is not visible for a numeric name.').toBeVisible();

        await landingPage.estimationForm(0).fillContactDetails({name: validEstimation.name, email: validEstimation.email});

        // missing phone number
        await landingPage.estimationForm(0).submitYourRequestButton.click();
        await expect.soft(page.getByText(ErrorMessage.PHONE_REQUIRED), 'The required phone number error is not visible for an empty phone number.').toBeVisible();
    })
})
