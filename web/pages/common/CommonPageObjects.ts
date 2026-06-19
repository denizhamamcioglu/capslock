import { Locator, Page } from "@playwright/test";

export class CommonPageObjects {
    readonly page: Page;
    readonly submitButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.submitButton = page.locator('button[type="submit"]')
    }
}