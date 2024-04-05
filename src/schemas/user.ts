import jsonschema from 'jsonschema';

export const userSchema: jsonschema.Schema = {
    type: 'object',
    properties: {
        birth_year: { type: 'string' },
        country: { type: 'string' },
        currency: { type: 'string' },
        gender: { type: 'string' },
        registration_date: { type: 'string' },
        user_id: { type: 'string' }
    },
    required: ['birth_year', 'country', 'currency', 'gender', 'registration_date', 'user_id'],
    additionalProperties: false
};