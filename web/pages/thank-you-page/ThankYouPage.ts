import { Locator, Page } from "@playwright/test";

export class ThankYouPage {
    readonly page: Page;
    readonly thankYouText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.thankYouText = page.getByRole('heading', { level: 1, name: 'Thank you!' })
    }
}