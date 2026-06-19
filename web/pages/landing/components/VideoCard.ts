import { Locator } from "@playwright/test";

/**
 * Represents a single video card instance on the landing page.
 * Every locator is scoped to the card's root container, so the same class
 * works for any card on the page (e.g. landingPage.videoCard(0) / (1)).
 */
export class VideoCard {
  readonly root: Locator;
  readonly videoMainElement: Locator;
  readonly playButton: Locator;
  readonly pauseButton: Locator;
  readonly playPauseButtonContainer: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.videoMainElement = root.locator('[class*="blockVideo__video"]')
    this.playButton = root.locator('i[class*="lavin-play"]')
    this.pauseButton = root.locator('i[class*="lavin-pause"]')
    this.playPauseButtonContainer = root.locator('[class="play"]')
  }
}
