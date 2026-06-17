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
  readonly commonPageObjects: CommonPageObjects;
  
  constructor(page: Page) {
    this.page = page;
    this.webAutomationUtils = new WebAutomationUtils(page);
    this.commonPageObjects = new CommonPageObjects(page);

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
    this.phoneInput = page.getByRole('textbox', { name: 'phone' })
    this.submitYourRequestButton = page.getByRole('button').filter({ hasText: 'Submit Your Request' })
    this.goToEstimateButton = page.getByRole('button').filter({ hasText: 'Go to Estimate' })
  }

  async submitEstimation(estimation: EstimationFormData = validEstimation, useFirstForm: boolean = true) {
    const formIndex = useFirstForm ? 0 : 1;

    await this.zipCodeInput.nth(formIndex).fill(estimation.zip);
    await this.commonPageObjects.submitButton.nth(formIndex).click();
    
    // select interests
    for (const interest of estimation.interests ?? []) {
        await (await this.webAutomationUtils.getElementByLabel(interest)).nth(formIndex).click();
    }
    
    await this.commonPageObjects.submitButton.nth(formIndex).click();
    
    // select property type
    await (await this.webAutomationUtils.getElementByLabel(estimation.propertyType ?? '')).nth(formIndex).click();
    await this.commonPageObjects.submitButton.nth(formIndex).click();

    // fill name & email
    await this.nameInput.nth(formIndex).fill(estimation.name);
    await this.emailInput.nth(formIndex).fill(estimation.email);
    
    await this.goToEstimateButton.nth(formIndex).click();
    
    // enter phone number
    await this.phoneInput.nth(formIndex).fill(estimation.phone);
    await this.submitYourRequestButton.nth(formIndex).click();
  }
}
