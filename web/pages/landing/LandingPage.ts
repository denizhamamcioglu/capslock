import { Page } from "@playwright/test";
import { initLogger } from "../../../common/utils/Logger";

const logger = initLogger('LandingPage');

export class LandingPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}