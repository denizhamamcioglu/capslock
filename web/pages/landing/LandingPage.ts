import { Locator, Page } from "@playwright/test";
import { initLogger } from "../../../common/utils/Logger";
import { EstimationFormData, validEstimation } from "../../../common/data/test-data/EstimationFormData";
import { WebAutomationUtils } from "../../utils/WebAutomationUtils";
import { CommonPageObjects } from "../common/CommonPageObjects";

const logger = initLogger('LandingPage');

export class LandingPage {
  readonly page: Page;
  readonly webAutomationUtils: WebAutomationUtils;
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
  readonly goToEstimateButton: Locator;
  readonly formContainers: Locator;
  readonly commonPageObjects: CommonPageObjects;
  
  constructor(page: Page) {
    this.page = page;
    this.webAutomationUtils = new WebAutomationUtils(page);
    this.commonPageObjects = new CommonPageObjects(page);
    this.formContainers = page.locator('[id^="form-container-"]')
    this.zipCodeInput = page.getByPlaceholder('Enter ZIP Code', { exact: true })
    this.nextButton = page.getByRole('button').filter({ hasText: 'Next' })
    this.independenceOption = page.getByLabel('Independence', { exact: true })
    this.safetyOption = page.getByLabel('Safety', { exact: true })
    this.therapyOption = page.getByLabel('Therapy', { exact: true })
    this.otherOption = page.getByLabel('Other', { exact: true })
    this.ownedHouseOption = page.getByLabel('Owned House / Condo', { exact: true })
    this.rentalOption = page.getByLabel('Rental', { exact: true })
    this.mobileHomeOption = page.getByLabel('Mobile Home', { exact: true })
    this.nameInput = page.getByRole('textbox', { name: 'name' })
    this.emailInput = page.getByRole('textbox', { name: 'email' })
    this.phoneInput = page.getByPlaceholder('(XXX)XXX-XXXX', { exact: true })
    this.submitYourRequestButton = page.getByRole('button').filter({ hasText: 'Submit Your Request' })
    this.goToEstimateButton = page.getByRole('button').filter({ hasText: 'Go to Estimate' })
  }

  getEstimationForm(formIndex: number = 0): Locator {
    return this.formContainers.nth(formIndex).locator('form').first();
  }

  private estimationData(estimation: Partial<EstimationFormData> = {}): EstimationFormData {
    return { ...validEstimation, ...estimation };
  }

  async submitZipCode(formIndex: number = 0, estimation: Partial<EstimationFormData> = {}) {
    const data = this.estimationData(estimation);
    const form = this.getEstimationForm(formIndex);

    await form.locator(this.zipCodeInput).fill(data.zip);
    await form.locator(this.nextButton).click();
  }

  async selectInterests(formIndex: number = 0, interests: string[] = validEstimation.interests ?? []) {
    const form = this.getEstimationForm(formIndex);

    for (const interest of interests) {
      await form.locator(this.page.getByText(interest)).click();
    }

    await form.locator(this.nextButton).click();
  }

  async selectPropertyType(formIndex: number = 0, propertyType: string = validEstimation.propertyType ?? '') {
    const form = this.getEstimationForm(formIndex);

    await form.locator(this.page.getByText(propertyType)).click();
    await form.locator(this.nextButton).click();
  }

  async fillContactDetails(formIndex: number = 0, estimation: Partial<EstimationFormData> = {}) {
    const data = this.estimationData(estimation);
    const form = this.getEstimationForm(formIndex);

    await form.locator(this.nameInput).fill(data.name);
    await form.locator(this.emailInput).fill(data.email);
    await form.locator(this.goToEstimateButton).click();
  }

  async submitPhoneNumber(formIndex: number = 0, estimation: Partial<EstimationFormData> = {}) {
    const data = this.estimationData(estimation);
    const form = this.getEstimationForm(formIndex);

    await form.locator(this.phoneInput).fill(data.phone);
    await form.locator(this.submitYourRequestButton).click();
  }

  async submitEstimation(formIndex: number = 0, estimation: Partial<EstimationFormData> = {}) {
    const data = this.estimationData(estimation);

    await this.submitZipCode(formIndex, data);
    await this.selectInterests(formIndex, data.interests);
    await this.selectPropertyType(formIndex, data.propertyType);
    await this.fillContactDetails(formIndex, data);
    await this.submitPhoneNumber(formIndex, data);
  }
}
