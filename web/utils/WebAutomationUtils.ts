import { Locator, Page } from "@playwright/test";

export class WebAutomationUtils {
    constructor(private readonly page: Page) {
        this.page = page;
    }

    getElementByValue(value: string): Locator {
        return this.page.locator(`[value="${value}"]`);
    }

    getElementByAttribute(attribute: string, value: string, exact: boolean = true): Locator {
        return exact ? this.page.locator(`[${attribute.toLowerCase()}="${value.toLowerCase()}"]`) : this.page.locator(`[${attribute.toLowerCase()}*="${value.toLowerCase()}"]`);
    }
}