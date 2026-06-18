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
