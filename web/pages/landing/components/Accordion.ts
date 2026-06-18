import { Locator } from "@playwright/test";

/**
 * Represents a single accordion instance on the landing page.
 * Every locator is scoped to the accordion's root container, so the same class
 * works for any accordion on the page (e.g. landingPage.accordion(0) / (1)).
 */
export class Accordion {
  readonly root: Locator;
  readonly previousButton: Locator;
  readonly nextButton: Locator;
  readonly displayedImage: Locator;
  

  constructor(root: Locator) {
    this.root = root;
    this.previousButton = root.getByLabel('Previous')
    this.nextButton = root.getByLabel('Next')
    this.displayedImage = root.locator('[class*="sliderDefault__item"][tabindex="0"]').getByRole('img')
  
  }
}
