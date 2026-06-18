import { ZipCode } from "../TestEnums";

export type EstimationFormData = {
    zip: string;
    email: string;
    name: string;
    phone: string;
    interests?: string[];
    propertyType?: string;
}

export const validEstimation: EstimationFormData = {
    zip: ZipCode.InRange,
    email: 'john.doe@example.com',
    name: 'John Doe',
    phone: '0123456789',
    interests: ['Independence', 'Safety'],
    propertyType: 'Owned House / Condo',
}