import jsonschema from 'jsonschema';

export const couponSchema: jsonschema.Schema = {
    type: 'object',
    properties: {
        coupon_id: { type: 'string' },
        stake: { type: 'number' },
        timestamp: { type: 'string' },
        user_id: { type: 'string' },
        selections: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    event_id: { type: 'string' },
                    odds: { type: 'number' }
                },
                required: ['event_id', 'odds'],
                additionalProperties: false
            }
        },
        client_id: { type: 'string' }
    },
    required: ['coupon_id', 'stake', 'timestamp', 'user_id', 'selections', 'client_id'],
    additionalProperties: false
};