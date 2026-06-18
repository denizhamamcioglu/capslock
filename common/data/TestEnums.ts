/**
 * Well-known ZIP codes used by the estimation flow.
 */
export enum ZipCode {
    InRange = '68901',
    OutOfRange = '11111',
}

export enum ErrorMessage {
    ZIP_CODE_REQUIRED = 'Enter your ZIP code.',
    ZIP_CODE_INVALID = 'Wrong ZIP code.',
    SELECT_VARIANT = 'Choose one of the variants.',
    NAME_REQUIRED = 'Please enter your name.',
    FULL_NAME_REQUIRED = 'Your full name should contain both first and last name.',
    SHORT_NAME = 'This value is too short. Your name should have at least 3 characters or more.',
    INVALID_NAME = 'Your name should consist only of latin letters, apostrophes, underscores, dots and dashes.',
    PHONE_REQUIRED = 'Enter your phone number.',
    WRONG_PHONE_NUMBER = 'Wrong phone number.',
    MISSING_EMAIL = 'Fill out this field.',
    INVALID_EMAIL = "Please include an '@' in the email address.",
}

export enum FeedbackMessage {
    OUT_OF_AREA = 'Sorry, unfortunately we don’t yet install in your area but if you’d like us to notify you when we do please enter your email address below',
    OUT_OF_AREA_THANK_YOU = 'Thank you for your interest, we will contact you when our service becomes available in your area!',
}
