import { test, expect } from '../../../web/core/BasePage';

test.describe('Test reviews section properties', () => {
    test('review item properties', async ({landingPage}) => {
        await expect(landingPage.review(0).reviewRow.first(), 'The review row is not visible.').toBeVisible();
        await expect(landingPage.review(0).name.first(), 'The review name is not visible.').toBeVisible();
        await expect(landingPage.review(0).avatar.first(), 'The review avatar is not visible.').toBeVisible();
        await expect(landingPage.review(0).stars.first(), 'The review rating stars are not visible.').toBeVisible();
        await expect(landingPage.review(0).content.first(), 'The review content is not visible.').toBeVisible();
        await expect(landingPage.review(0).image.first(), 'The review image is not visible.').toBeVisible();
        await expect(landingPage.review(0).moreLessButton.first(), 'The review more/less button is not visible.').toBeVisible();
    })

    test('more less button', async ({landingPage}) => {
        const initialMoreLessButtonText = await landingPage.review(0).moreLessButton.first().textContent() ?? '';
        await landingPage.review(0).moreLessButton.first().click();
        const newMoreLessButtonText = landingPage.review(0).moreLessButton.first();
        await expect(newMoreLessButtonText, 'The more/less button label did not change after clicking it.').not.toHaveText(initialMoreLessButtonText);
    })
})
