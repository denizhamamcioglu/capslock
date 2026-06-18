# Capslock — Playwright Test Suite

End-to-end UI tests for the Capslock landing page, built with [Playwright](https://playwright.dev/) and TypeScript using a component-based Page Object Model.

## Requirements

- **Node.js 22.17+** (or any current LTS). Avoid Node 22.15 / 22.16 — they contain a sync-loader regression that breaks Playwright 1.61's config loading. CI pins Node 20 LTS.
- npm (ships with Node).

## Installation

Install the dependencies and the Playwright browsers:

```bash
npm ci                          # install dependencies from package-lock.json
npx playwright install --with-deps   # download browsers (+ OS deps on Linux/CI)
```

Use `npm install` instead of `npm ci` if you are intentionally changing dependencies.

## Running the tests

```bash
npx playwright test                       # run the whole suite
npx playwright test --headed              # run with a visible browser
npx playwright test --ui                  # open the interactive UI mode
npx playwright test path/to/file.spec.ts  # run a single spec file
npx playwright test -g "out of range"     # run tests matching a title substring
```

Common tasks are also wired as npm scripts:

```bash
npm test            # playwright test
npm run lint        # eslint .
npm run lint:fix    # eslint . --fix
npm run tsc         # tsc --noEmit (type-check only)
```

### Running a specific browser / device project

The suite is split into projects (defined in `playwright.config.ts`):

```bash
npx playwright test --project=desktop_chrome_functional_tests
npx playwright test --project=desktop_firefox_functional_tests
npx playwright test --project=desktop_webkit_functional_tests
npx playwright test --project=mobile_chrome_functional_tests
```

### Targeting a different environment

The base URL defaults to `Environment.TEST_BASE_URL`. Override it per run:

```bash
TEST_URL=https://my-environment.example.com npx playwright test
```

### Viewing the report

Locally the HTML reporter is used:

```bash
npx playwright show-report
```

On CI a `blob` report is produced per shard, then merged into a single HTML report (see `.github/workflows/playwright.yml`), published to GitHub Pages and uploaded as the `playwright-report` artifact.

## Project structure

```
common/         # shared data, enums, constants, logger
tests/web/      # spec files
web/core/       # test fixtures (BasePage) and custom expect matchers
web/pages/      # Page Objects and their components (EstimationForm, VideoCard, ...)
web/utils/      # generic web automation helpers
```

## Test coverage

See [`TestCases.md`](./TestCases.md) for the full, ID'd test matrix. In summary:

**Automated (functional, `tests/web/functional/`):**

- Estimation form happy-path submissions on every form (in-range and out-of-range ZIP)
- Step progress bar states across the flow
- Field validation (ZIP, property type, email, name rules, phone)
- Accordion / carousel controls and image navigation
- Video cards: autoplay, play/pause, non-empty sources
- Reviews: element visibility and show more / less toggle

**Not yet automated / planned:**

- Visual regression — `playwright.config.ts` defines `*_visual_tests` projects, but `tests/web/non-functional/visual` has no specs yet, so those projects currently run zero tests.
- Accessibility checks.
- Mobile "Estimate your cost" interaction (currently a failing manual case).

**Known product bugs surfaced by the suite** (tracked in `TestCases.md`):

- Progress bar never completes — the total step count is missing in "1 of x" (both in-range and out-of-range flows).
- Mobile "Estimate your cost" button does not respond.

## Improvement areas
1. add localization if the web app will support any other language then English.
2. contact with the development team to add data-testid attributes or aria-labels for elements with broad CSS selectors.
3. contact with the 

### Internationalization

- Message strings live in enums (`ErrorMessage`, `FeedbackMessage`) as single-language values. Supporting multiple languages requires a key → per-locale translation structure plus locale-aware projects/fixtures.
