import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../../../web/core/BasePage';
import { AccessibilityConfig } from '../../../../common/data/AccessibilityConfig';

test.describe('Landing page accessibility', () => {
    test('landing page has no detectable WCAG violations', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(AccessibilityConfig.ACCESSIBILITY_TAGS)
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
