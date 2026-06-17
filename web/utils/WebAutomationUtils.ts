import { Locator, Page } from "@playwright/test";

export class WebAutomationUtils {
    constructor(private readonly page: Page) {
        this.page = page;
    }

    async getElementByLabel(label: string): Promise<Locator> {
        return this.page.getByLabel(label, { exact: true });
    }

    async getElementByValue(value: string): Promise<Locator> {
        return this.page.locator(`[value="${value}"]`);
    }
}