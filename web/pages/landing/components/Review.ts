import { Locator } from "@playwright/test";

/**
 * Represents a single review item on the landing page.
 * Every locator is scoped to the review's root container, so the same class
 * works for any review on the page (e.g. landingPage.review(0) / (1)).
 */
export class Review {
  readonly root: Locator;
  readonly reviewRow: Locator;
  readonly name: Locator;
  readonly avatar: Locator;
  readonly stars: Locator;
  readonly content: Locator;
  readonly image: Locator;
  readonly moreLessButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.reviewRow = root.locator('[class="review"]')
    this.name = root.locator('[class="review__name"]')
    this.avatar = root.locator('[class="review__ava"]')
    this.stars = root.locator('[class="review__ratingStars"]')
    this.content = root.locator('[class*="review__comment"]')
    this.image = root.locator('[class*="review__img"]')
    this.moreLessButton = root.locator('[class="moreless"]')
  }
}
