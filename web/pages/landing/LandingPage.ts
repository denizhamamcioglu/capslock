import { expect, Locator, Page } from "@playwright/test";
import { initLogger } from "../../../common/utils/Logger";
import { Constants } from "../../../common/data/Constants";
import { WebAutomationUtils } from "../../utils/WebAutomationUtils";
import { CommonPageObjects } from "../common/CommonPageObjects";
import { Accordion } from "./components/Accordion";
import { EstimationForm } from "./components/EstimationForm";
import { Review } from "./components/Review";
import { VideoCard } from "./components/VideoCard";

const logger = initLogger('LandingPage');

export class LandingPage {
  readonly page: Page;
  readonly webAutomationUtils: WebAutomationUtils;
  readonly commonPageObjects: CommonPageObjects;
  readonly formContainers: Locator;
  readonly videoCardContainers: Locator;
  readonly accordionContainers: Locator;
  readonly reviewContainers: Locator;

  constructor(page: Page) {
    this.page = page;
    this.webAutomationUtils = new WebAutomationUtils(page);
    this.commonPageObjects = new CommonPageObjects(page);
    this.formContainers = page.locator('[id^="form-container-"]');
    this.videoCardContainers = page.locator('[class="blockVideo"]');
    this.accordionContainers = page.locator('[class*="sliderTheme"]');
    this.reviewContainers = page.locator('[class*="reviewWrap"]');
  }

  /**
   * Returns the estimation form component scoped to the form at the given index.
   */
  estimationForm(formIndex: number = 0): EstimationForm {
    return new EstimationForm(this.formContainers.nth(formIndex));
  }

  /**
   * Returns the video card component scoped to the card at the given index.
   */
  videoCard(cardIndex: number = 0): VideoCard {
    return new VideoCard(this.videoCardContainers.nth(cardIndex));
  }

  /**
   * Returns the accordion component scoped to the accordion at the given index.
   */
  accordion(accordionIndex: number = 0): Accordion {
    return new Accordion(this.accordionContainers.nth(accordionIndex));
  }

  /**
   * Returns the review component scoped to the review at the given index.
   */
  review(reviewIndex: number = 0): Review {
    return new Review(this.reviewContainers.nth(reviewIndex));
  }

  /**
   * Locates the progress step container whose class list contains the exact
   * `step-{stepNumber}` token (so `step-1` won't match `step-10`).
   */
  stepDiv(stepNumber: number): Locator {
    return this.page.locator(`[class~="steps"][class~="step-${stepNumber}"]`);
  }

  /**
   * Asserts the progress bar value indicator is visible on every form on the page.
   */
  async verifyProgressBarValuesVisibleOnAllForms() {
    const formCount = await this.formContainers.count();
    logger.info(`Verifying progress bar values are visible on all ${formCount} form(s).`);

    for (let formIndex = 0; formIndex < formCount; formIndex++) {
      await this.estimationForm(formIndex).verifyProgressBarValuesVisible();
    }
  }

  /**
   * Asserts every video card on the page has a non-empty `src` attribute.
   */
  async verifyVideoCardsHaveSourcesOnAllCards() {
    const videoCardCount = await this.videoCardContainers.count();
    logger.info(`Verifying all ${videoCardCount} video card(s) have a non-empty src attribute.`);

    for (let videoIndex = 0; videoIndex < videoCardCount; videoIndex++) {
      await expect(this.videoCard(videoIndex).videoMainElement.first(), `Video card ${videoIndex} has an empty src attribute.`).toHaveAttribute('src', /.+/);
    }
  }

  /**
   * Asserts the progress bar value visibility and the expected step on every form.
   */
  async verifyProgressStatesOnAllForms(expectedStep: string) {
    logger.info(`Verifying progress states (values + step "${expectedStep}") on all forms.`);
    await this.verifyProgressBarValuesVisibleOnAllForms();
    await this.verifyProgressBarStepsOnAllForms(expectedStep);
  }

  /**
   * Asserts the progress bar shows the expected current step on every form on the page.
   */
  async verifyProgressBarStepsOnAllForms(expectedStep: string) {
    const formCount = await this.formContainers.count();
    logger.info(`Verifying progress bar step "${expectedStep}" on all ${formCount} form(s).`);

    for (let formIndex = 0; formIndex < formCount; formIndex++) {
      await this.estimationForm(formIndex).verifyProgressBarStep(expectedStep);
    }
  }

  /**
   * Asserts the given message text is visible within every form on the page.
   */
  async verifyMessageVisibleOnAllForms(message: string) {
    const formCount = await this.formContainers.count();
    logger.info(`Verifying the message "${message}" is visible on all ${formCount} form(s).`);

    for (let formIndex = 0; formIndex < formCount; formIndex++) {
      const messageLocator = this.estimationForm(formIndex).root.getByText(message);
      await expect(messageLocator, `The message "${message}" is not visible for form ${formIndex}`).toBeVisible({ timeout: Constants.MEDIUM_WAIT });
    }
  }
}
