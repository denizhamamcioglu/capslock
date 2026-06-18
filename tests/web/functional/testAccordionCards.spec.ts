import { test, expect } from '../../../web/core/BasePage';

test.describe('Test accordion card properties', () => {
    test('accordion card properties', async ({landingPage}) => {
        await expect(landingPage.accordion(0).displayedImage, 'The accordion displayed image is not visible.').toBeVisible();
        await expect(landingPage.accordion(0).previousButton, 'The accordion previous button is not visible.').toBeVisible();
        await expect(landingPage.accordion(0).nextButton, 'The accordion next button is not visible.').toBeVisible();
    })

    test('image change', async ({landingPage}) => {
        const displayedImageSource = await landingPage.accordion(0).displayedImage.getAttribute('src') ?? '';
        await landingPage.accordion(0).nextButton.click();
        const nextImageSource = landingPage.accordion(0).displayedImage;
        await expect(nextImageSource, 'The displayed image did not change after clicking next.').not.toHaveAttribute('src', displayedImageSource);

        await landingPage.accordion(0).previousButton.click();
        const previousImageSource = landingPage.accordion(0).displayedImage;
        await expect(previousImageSource, 'The displayed image did not return to the original after clicking previous.').toHaveAttribute('src', displayedImageSource);
    })
})
