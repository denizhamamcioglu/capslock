/**
 * Test data for the landing page "Estimate Your Cost" form.
 * Defined once here and reused across specs to avoid duplication.
 */

export const ZipCodes = {
  /** ZIP that the form treats as inside the service area. */
  inServiceArea: '68901',
  /** ZIP that the form treats as outside the service area. */
  outOfServiceArea: '11111',
} as const;

export interface Applicant {
  name: string;
  email: string;
  /** 10 digits, must be a NANP-valid number (area/exchange cannot start with 0 or 1). */
  phone: string;
}

export const validApplicant: Applicant = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '2025550123',
};

/** Required quiz selections that are not part of the applicant's identity. */
export const formSelections = {
  interests: ['Independence'],
  propertyType: 'Owned House / Condo',
} as const;
