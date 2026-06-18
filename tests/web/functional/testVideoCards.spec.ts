import { test, expect } from '../../../web/core/BasePage';

test.describe('Test video div properties', () => {
    test('video section properties', async ({landingPage}) => {
        await expect(landingPage.videoCard(0).videoMainElement.first(), 'The video element is missing the autoplay attribute.').toHaveAttribute('autoplay')

        await landingPage.videoCard(0).playPauseButtonContainer.first().waitFor({ state: 'attached' }); // video div seems to be loading slightly slower. a separate dynamic wait is required because of this reason.
        await landingPage.videoCard(0).playPauseButtonContainer.first().click();
        await expect(landingPage.videoCard(0).pauseButton.first(), 'The pause button is not shown after starting playback.').toBeAttached();

        await landingPage.videoCard(0).pauseButton.first().click();
        await expect(landingPage.videoCard(0).playButton.first(), 'The play button is not shown after pausing playback.').toBeAttached();
    })

    test('all cards have video sources', async ({landingPage}) => {
        await landingPage.verifyVideoCardsHaveSourcesOnAllCards();
    })
})
