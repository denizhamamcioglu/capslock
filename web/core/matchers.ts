import { expect as baseExpect, type Locator } from '@playwright/test';
import { initLogger } from '../../common/utils/Logger';

const logger = initLogger('matchers');

/**
 * Custom Playwright matchers for HTML5 constraint validation.
 *
 * These are registered once here and surfaced through the project's shared
 * `expect` (re-exported from BasePage.ts), so every spec gets them for free.
 */
export const expect = baseExpect.extend({
  /**
   * Asserts a field fails HTML5 constraint validation. Browser- and
   * locale-agnostic: relies on the ValidityState API rather than the
   * vendor-generated validation message text.
   *
   * Pass an optional `reason` (e.g. 'typeMismatch', 'valueMissing') to also
   * assert the specific cause.
   */
  async toBeInvalidField(locator: Locator, reason?: keyof ValidityState) {
    const assertionName = 'toBeInvalidField';
    logger.info(`Asserting field is invalid${reason ? ` because of "${reason}"` : ''}.`);
    let actual: boolean | undefined;
    let pass: boolean;

    try {
      if (reason) {
        await baseExpect
          .poll(() => locator.evaluate((el: HTMLInputElement, key) => el.validity[key], reason))
          .toBe(true);
      } else {
        await baseExpect
          .poll(() => locator.evaluate((el: HTMLInputElement) => el.validity.valid))
          .toBe(false);
      }
      pass = true;
    } catch {
      actual = await locator
        .evaluate((el: HTMLInputElement, key) => (key ? el.validity[key as keyof ValidityState] : el.validity.valid), reason)
        .catch(() => undefined);
      pass = false;
    }

    return {
      pass,
      name: assertionName,
      message: () =>
        reason
          ? `Expected field to be invalid because of "${reason}" (validity.${reason} === true), but it was not.`
          : `Expected field to be invalid (validity.valid === false), but it was valid.`,
      actual,
    };
  },

  /**
   * Asserts a field's HTML5 validation message contains the expected text.
   * NOTE: the message text is browser- and locale-specific (Chromium, Firefox
   * and WebKit differ), so prefer `toBeInvalidField` for cross-browser checks
   * and use this only to verify a specific engine's user-facing copy.
   */
  async toHaveValidationMessageContaining(locator: Locator, expected: string) {
    const assertionName = 'toHaveValidationMessageContaining';
    logger.info(`Asserting validation message contains "${expected}".`);
    let actual = '';
    let pass: boolean;

    try {
      await baseExpect
        .poll(async () => {
          actual = await locator.evaluate((el: HTMLInputElement) => el.validationMessage);
          return actual;
        })
        .toContain(expected);
      pass = true;
    } catch {
      pass = false;
    }

    return {
      pass,
      name: assertionName,
      message: () =>
        `Expected validationMessage to contain:\n  ${expected}\nReceived:\n  ${actual}`,
      actual,
      expected,
    };
  },
});

declare global {
  // Playwright's matcher type augmentation requires a namespace.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeInvalidField(reason?: keyof ValidityState): Promise<R>;
    }
  }
}
