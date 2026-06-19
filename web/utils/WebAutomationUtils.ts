import { expect, Locator, Page } from "@playwright/test";
import { initLogger } from "../../common/utils/Logger";
import { Constants } from "../../common/data/Constants";

const logger = initLogger('WebAutomationUtils');

export class WebAutomationUtils {
    constructor(private readonly page: Page) {
        this.page = page;
    }

    /**
     * Locates an element by an exact match on its `value` attribute.
     *
     * @param value - The exact `value` attribute to match.
     */
    getElementByValue(value: string): Locator {
        logger.info(`Locating element by value "${value}".`);
        return this.page.locator(`[value="${value}"]`);
    }

    /**
     * Locates an element by attribute, matching the value either exactly or as a
     * substring (when `exact` is false). The value is matched verbatim, since
     * attribute values are case-sensitive.
     *
     * @param attribute - The attribute name to match on.
     * @param value - The attribute value to match.
     * @param exact - When true (default) requires an exact match, otherwise a substring match.
     */
    getElementByAttribute(attribute: string, value: string, exact: boolean = true): Locator {
        logger.info(`Locating element by attribute "${attribute}" ${exact ? 'equal to' : 'containing'} "${value}".`);
        return exact ? this.page.locator(`[${attribute}="${value}"]`) : this.page.locator(`[${attribute}*="${value}"]`);
    }

    /**
     * Smoothly scrolls the page in fixed steps so lazily-rendered content and
     * media have a chance to load before a screenshot is taken.
     *
     * @param direction - 'down' (default) scrolls to the bottom, 'up' to the top.
     * @param speed - 'slow' (default) uses a longer per-step delay, 'fast' a shorter one.
     */
    async smoothScrollToBottom(
        direction: 'down' | 'up' = 'down',
        speed: 'slow' | 'fast' = 'slow'
    ) {
        logger.info(`Smooth scrolling ${direction} the page at ${speed} speed.`);

        await this.page.evaluate(
            async ({ direction, speed }: { direction: 'down' | 'up'; speed: 'slow' | 'fast' }) => {
                const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
                const scrollHeight = () => document.body.scrollHeight;
                const start = direction === 'down' ? 0 : scrollHeight();
                const shouldStop = (position: number) =>
                    direction === 'down' ? position > scrollHeight() : position < 0;
                const increment = direction === 'down' ? 100 : -100;
                const delayTime = speed === 'slow' ? 200 : 20;

                for (let i = start; !shouldStop(i); i += increment) {
                    window.scrollTo(0, i);
                    await delay(delayTime);
                }
            },
            { direction, speed }
        );
    }

    /**
     * Pauses every `<video>` element and rewinds it to the first frame, so visual
     * snapshots are deterministic (autoplaying videos would otherwise differ from
     * run to run).
     */
    async pauseAllVideos() {
        logger.info('Pausing all videos on the page for a deterministic snapshot.');
        await this.page.evaluate(() => {
            document.querySelectorAll('video').forEach((video) => {
                video.pause();
                video.removeAttribute('autoplay');
                video.currentTime = 0;
            });
        });
    }

    /**
     * Waits until the given element's attribute contains the expected substring,
     * polling with Playwright's auto-retrying assertion. Throws if the attribute
     * never contains the expected value within the timeout.
     *
     * @param element - The element whose attribute is being polled.
     * @param attributeToCheck - The attribute name to read.
     * @param attributeValueToExpect - The substring the attribute is expected to contain.
     * @param timeout - Maximum time to wait in milliseconds (defaults to {@link Constants.TIMEOUT}).
     */
    async waitForElementToContainAttribute(
        element: Locator,
        attributeToCheck: string,
        attributeValueToExpect: string,
        timeout: number = Constants.TIMEOUT
    ) {
        logger.info(`Waiting for element's "${attributeToCheck}" attribute to contain "${attributeValueToExpect}".`);
        await expect
            .poll(() => element.getAttribute(attributeToCheck), {
                message: `The "${attributeToCheck}" attribute never contained "${attributeValueToExpect}".`,
                timeout,
            })
            .toContain(attributeValueToExpect);
    }
}
