# Test Cases

Application under test: `https://test-qa.capslock.global` (landing page)

Legend:

- **Status**: `Automated` / `Manual` / `Planned`
- **Result**: `Pass` / `Fail (bug)` / `Not run`
- ZIP codes: In range = `68901`, Out of range = `11111`

---

## 1. Functional

### 1.1 Estimation Form — Happy Path Submissions

Spec: `tests/web/functional/testValidFormSubmissions.spec.ts`

| ID | Title | Preconditions | Steps | Expected Result | Status | Result |
|----|-------|---------------|-------|-----------------|--------|--------|
| TC-F-001 | Submit a valid estimation using the first form | Landing page loaded | 1. Complete the full estimation flow on form #1 (in-range ZIP, interests, property type, contact details, phone) | "Thank you" text is visible and the URL is `/thank-you` | Automated | Pass |
| TC-F-002 | Submit a valid estimation using the second form | Landing page loaded | 1. Complete the full estimation flow on form #2 | "Thank you" text is visible and the URL is `/thank-you` | Automated | Pass |
| TC-F-003 | Submit an estimation with an out-of-range ZIP code | Landing page loaded | 1. Submit out-of-range ZIP (`11111`)<br>2. Enter a valid email and submit | After ZIP: out-of-area message shown on all forms.<br>After email: out-of-area "thank you" message shown on all forms | Automated | Pass |

### 1.2 Estimation Form — Step Progress Bar

Spec: `tests/web/functional/testValidFormSubmissions.spec.ts`

| ID | Title | Preconditions | Steps | Expected Result | Status | Result |
|----|-------|---------------|-------|-----------------|--------|--------|
| TC-F-004 | Step progress states for an out-of-range ZIP | Landing page loaded | 1. Submit out-of-range ZIP → expect step `2`<br>2. Enter valid email → expect step `3` | Progress bar value is visible and current step is correct on all forms | Automated | **Fail (bug)** — progress bar not complete; total step `x` missing in "1 of x" |
| TC-F-005 | Step progress states for an in-range ZIP | Landing page loaded | 1. Submit in-range ZIP → expect step `2`<br>2. Select interests → expect step `3`<br>3. Select property type → expect step `4`<br>4. Fill contact details → expect step `5` | Progress bar value visible and current step correct on all forms at each stage | Automated | **Fail (bug)** — progress bar state invalid |

### 1.3 Estimation Form — Field Validation

Spec: `tests/web/functional/testMandatoryFields.spec.ts`

| ID | Title | Preconditions | Steps | Expected Result | Status | Result |
|----|-------|---------------|-------|-----------------|--------|--------|
| TC-F-006 | ZIP code is required | Landing page loaded | 1. Submit an empty ZIP code | Error: "Enter your ZIP code." | Automated | Pass |
| TC-F-007 | ZIP code format is validated | Landing page loaded | 1. Submit a malformed ZIP (`invalidzip`) | Error: "Wrong ZIP code." | Automated | Pass |
| TC-F-008 | Property type is mandatory | In-range ZIP submitted, interests selected | 1. Continue without selecting a property type | Error: "Choose one of the variants." | Automated | Pass |
| TC-F-009 | Email is required | Property type selected | 1. Continue with an empty email | Native validation message: "Please fill out this field." | Automated | Pass |
| TC-F-010 | Email format is validated | On the contact step | 1. Enter `test` as email | Native validation message contains "Please include an '@' in the email address." | Automated | Pass |
| TC-F-011 | Name minimum length is enforced | On the contact step, valid email | 1. Enter a single-character name (`1`) | Error: "...your name should have at least 3 characters or more." | Automated | Pass |
| TC-F-012 | Full name (first + last) is required | On the contact step, valid email | 1. Enter a single-word name (`Test`) | Error: "Your full name should contain both first and last name." | Automated | Pass |
| TC-F-013 | Name character set is validated | On the contact step, valid email | 1. Enter a numeric name (`123456`) | Error: "Your name should consist only of latin letters, apostrophes, underscores, dots and dashes." | Automated | Pass |
| TC-F-014 | Phone number is required | Valid name and email entered | 1. Submit the request with an empty phone | Error: "Enter your phone number." | Automated | Pass |

### 1.4 Accordion / Carousel

Spec: `tests/web/functional/testAccordionCards.spec.ts`

| ID | Title | Preconditions | Steps | Expected Result | Status | Result |
|----|-------|---------------|-------|-----------------|--------|--------|
| TC-F-015 | Accordion controls are displayed | Landing page loaded | 1. Locate accordion #1 | Displayed image, Previous button, and Next button are all visible | Automated | Pass |
| TC-F-016 | Accordion image changes on navigation | Landing page loaded | 1. Record current image src<br>2. Click Next<br>3. Click Previous | After Next: image src changes.<br>After Previous: image src returns to the original | Automated | Pass |

### 1.5 Video Cards

Spec: `tests/web/functional/testVideoCards.spec.ts`

| ID | Title | Preconditions | Steps | Expected Result | Status | Result |
|----|-------|---------------|-------|-----------------|--------|--------|
| TC-F-017 | Video autoplays and supports play/pause | Landing page loaded | 1. Confirm the video has `autoplay`<br>2. Click play/pause container → expect pause state<br>3. Click pause → expect play state | Video element has `autoplay`; toggling shows pause then play controls | Automated | Pass |
| TC-F-018 | All video cards have a valid source | Landing page loaded | 1. Iterate all video cards | Every video element has a non-empty `src` attribute | Automated | Pass |

### 1.6 Reviews Section

Spec: `tests/web/functional/testReviews.spec.ts`

| ID | Title | Preconditions | Steps | Expected Result | Status | Result |
|----|-------|---------------|-------|-----------------|--------|--------|
| TC-F-019 | Review item displays all elements | Landing page loaded | 1. Locate review #1 | Review row, name, avatar, stars, content, image, and More/Less button are all visible | Automated | Pass |
| TC-F-020 | More / Less button toggles content | Landing page loaded | 1. Record button text<br>2. Click the More/Less button | Button text changes (e.g. "Show more" ↔ "Show less") | Automated | Pass |

### 1.7 Mobile

| ID | Title | Preconditions | Steps | Expected Result | Status | Result |
|----|-------|---------------|-------|-----------------|--------|--------|
| TC-F-021 | "Estimate your cost" button responds on mobile | Mobile viewport, landing page loaded | 1. Tap the "Estimate your cost" button | Estimation flow is triggered | Manual | **Fail (bug)** — button not responding on mobile |

---

## 2. Non-Functional

| ID | Title | Scope | Status |
|----|-------|-------|--------|
| TC-NF-001 | Visual comparison (regression) tests for individual components | Accordion, video cards, reviews, estimation form | Planned |
| TC-NF-002 | Accessibility checks | Landing page and interactive components | Planned |

---

## Open Bugs Summary

| Ref | Area | Description |
|-----|------|-------------|
| TC-F-004 | Progress bar | Out-of-range flow: progress bar not complete; total step count `x` missing in "1 of x". |
| TC-F-005 | Progress bar | In-range flow: progress bar reaches an invalid state. |
| TC-F-021 | Mobile | "Estimate your cost" button does not respond on mobile. |
