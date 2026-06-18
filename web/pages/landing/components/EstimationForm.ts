import { expect, Locator } from "@playwright/test";
import { initLogger } from "../../../../common/utils/Logger";
import { Constants } from "../../../../common/data/Constants";
import { EstimationFormData, validEstimation } from "../../../../common/data/test-data/EstimationFormData";

const logger = initLogger('EstimationForm');

/**
 * Represents a single estimation form instance on the landing page.
 * Every locator is scoped to the form's root container, so the same class
 * works for any form on the page (e.g. landingPage.estimationForm(0) / (1)).
 */
export class EstimationForm {
  readonly root: Locator;
  readonly zipCodeInput: Locator;
  readonly nextButton: Locator;
  readonly independenceOption: Locator;
  readonly safetyOption: Locator;
  readonly therapyOption: Locator;
  readonly otherOption: Locator;
  readonly ownedHouseOption: Locator;
  readonly rentalOption: Locator;
  readonly mobileHomeOption: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly submitYourRequestButton: Locator;
  readonly submitButton: Locator;
  readonly goToEstimateButton: Locator;
  readonly progressBarValues: Locator;
  readonly progressBarCurrentStep: Locator;
  readonly progressBarTotalSteps: Locator;
  readonly inputErrorMessage: Locator;
  readonly cardErrorMessage: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.zipCodeInput = root.getByPlaceholder('Enter ZIP Code', { exact: true })
    this.nextButton = root.getByRole('button').filter({ hasText: 'Next' })
    this.independenceOption = root.getByLabel('Independence', { exact: true })
    this.safetyOption = root.getByLabel('Safety', { exact: true })
    this.therapyOption = root.getByLabel('Therapy', { exact: true })
    this.otherOption = root.getByLabel('Other', { exact: true })
    this.ownedHouseOption = root.getByLabel('Owned House / Condo', { exact: true })
    this.rentalOption = root.getByLabel('Rental', { exact: true })
    this.mobileHomeOption = root.getByLabel('Mobile Home', { exact: true })
    this.nameInput = root.getByRole('textbox', { name: 'name' })
    this.emailInput = root.getByRole('textbox', { name: 'email' })
    this.phoneInput = root.getByPlaceholder('(XXX)XXX-XXXX', { exact: true })
    this.submitYourRequestButton = root.getByRole('button').filter({ hasText: 'Submit Your Request' })
    this.submitButton = root.getByRole('button').filter({ hasText: 'Submit' })
    this.goToEstimateButton = root.getByRole('button').filter({ hasText: 'Go to Estimate' })
    this.progressBarValues = root.locator('[class*="stepProgress__value step"]')
    this.progressBarCurrentStep = root.locator('[class="stepProgress__stepCurrent"]')
    this.progressBarTotalSteps = root.locator('[class="stepProgress__total"]')
    this.inputErrorMessage = root.locator('div[class*="mx-auto px-2 hasError"] div[data-error-block]')
    this.cardErrorMessage = root.locator('div[class*="helpBlock helpBlock_lg"][data-error-block]')
  }

  /**
   * Merges the provided partial estimation data over the valid defaults,
   * so callers only need to specify the fields relevant to their test.
   */
  private estimationData(estimation: Partial<EstimationFormData> = {}): EstimationFormData {
    return { ...validEstimation, ...estimation };
  }

  /**
   * Fills the ZIP code field (step 1) and advances to the next step.
   */
  async submitZipCode(estimation: Partial<EstimationFormData> = {}) {
    const data = this.estimationData(estimation);
    logger.info(`Submitting ZIP code "${data.zip}".`);

    await this.zipCodeInput.clear();
    await this.zipCodeInput.fill(data.zip);
    await this.nextButton.click();
  }

  /**
   * Selects the given interest options (step 2) and advances to the next step.
   */
  async selectInterests(interests: string[] = validEstimation.interests ?? []) {
    logger.info(`Selecting interests: [${interests.join(', ')}].`);
    for (const interest of interests) {
      await this.root.getByText(interest).waitFor({ state: 'visible' }); // animation takes inconsistent amount of time to complete. waiting for interest option visibility is required.
      await this.root.getByText(interest).click();
    }

    await this.nextButton.click();
  }

  /**
   * Selects the given property type (step 3) and advances to the next step.
   */
  async selectPropertyType(propertyType: string = validEstimation.propertyType ?? '') {
    logger.info(`Selecting property type "${propertyType}".`);
    await this.root.getByText(propertyType).waitFor({ state: 'visible' }); // animation takes inconsistent amount of time to complete. waiting for property type visibility is required.
    await this.root.getByText(propertyType).click();
    await this.nextButton.click();
  }

  /**
   * Fills the name and email contact fields (step 4) and proceeds to the estimate.
   */
  async fillContactDetails(estimation: Partial<EstimationFormData> = {}) {
    const data = this.estimationData(estimation);
    logger.info(`Filling contact details with name "${data.name}" and email "${data.email}".`);

    await this.nameInput.clear();
    await this.nameInput.fill(data.name);
    await this.emailInput.clear();
    await this.emailInput.fill(data.email);
    await this.goToEstimateButton.click();
  }

  /**
   * Fills the phone number field (final step) and submits the request.
   */
  async submitPhoneNumber(estimation: Partial<EstimationFormData> = {}) {
    const data = this.estimationData(estimation);
    logger.info(`Submitting phone number "${data.phone}".`);

    await this.phoneInput.clear();
    await this.phoneInput.fill(data.phone);
    await this.submitYourRequestButton.click();
  }

  /**
   * Asserts the form's progress bar exposes exactly one visible value indicator.
   */
  async verifyProgressBarValuesVisible() {
    logger.info('Verifying the progress bar value indicator is visible.');
    await expect.soft(this.progressBarValues, 'The progress bar values are not visible').toHaveCount(1, { timeout: Constants.MEDIUM_WAIT });
    await expect.soft(this.progressBarValues.first(), 'The progress bar value is not visible').toBeVisible();
  }

  /**
   * Asserts the progress bar shows the expected current step and a non-empty total.
   */
  async verifyProgressBarStep(expectedStep: string) {
    logger.info(`Verifying the progress bar is on step "${expectedStep}".`);
    await expect.soft(this.progressBarCurrentStep, `The current progress bar step is not ${expectedStep}`).toHaveText(expectedStep);
    await expect.soft(this.progressBarTotalSteps, 'The total progress bar steps text is empty').not.toHaveText('');
  }

  /**
   * Walks the full happy-path estimation flow end to end, from ZIP code to
   * final phone submission.
   */
  async submitEstimation(estimation: Partial<EstimationFormData> = {}) {
    const data = this.estimationData(estimation);
    logger.info(`Submitting full estimation flow for ZIP "${data.zip}", name "${data.name}", email "${data.email}".`);

    await this.submitZipCode(data);
    await this.selectInterests(data.interests);
    await this.selectPropertyType(data.propertyType);
    await this.fillContactDetails(data);
    await this.submitPhoneNumber(data);
  }
}
