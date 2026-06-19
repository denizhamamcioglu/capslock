import { test, expect } from '../../../../web/core/BasePage';

/** Maps Playwright's native `isMobile` device option to the golden prefix. */
const formFactorName = (isMobile: boolean): 'mobile' | 'desktop' =>
    isMobile ? 'mobile' : 'desktop';

test.describe('Landing page visual regression', () => {
    test('landing page full-page snapshot', async ({ page, webAutomationUtils, isMobile }) => {
        const formFactor = formFactorName(isMobile);

        await webAutomationUtils.smoothScrollToBottom();
        await webAutomationUtils.pauseAllVideos();

        await expect(page).toHaveScreenshot(`${formFactor}-landing.png`, {
            fullPage: true,
            animations: 'disabled',
        });
    });
});
