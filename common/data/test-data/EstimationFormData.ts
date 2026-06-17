export type EstimationFormData = {
    zip: string;
    email: string;
    name: string;
    phone: string;
    interests?: string[];
    propertyType?: string;
}

export const validEstimation: EstimationFormData = {
    zip: '68901',
    email: 'john.doe@example.com',
    name: 'John Doe',
    phone: '0123456789',
    interests: ['Independence', 'Safety'],
    propertyType: 'Owned House / Condo',
}

export const outOfRangeEstimation: EstimationFormData = {
    zip: '11111',
    email: 'john.doe@example.com',
    name: 'John Doe',
    phone: '2025550123',
}

export const invalidEmailEstimation: EstimationFormData = {
    zip: '68901',
    email: 'john.doe',
    name: 'John Doe',
    phone: '0123456789',
}