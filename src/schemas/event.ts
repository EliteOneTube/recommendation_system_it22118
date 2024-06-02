import jsonschema from 'jsonschema';

export const eventSchema: jsonschema.Schema = {
    type: 'object',
    properties: {
        begin_timestamp: { type: 'string' },
        country: { type: 'string' },
        end_timestamp: { type: 'string' },
        event_id: { type: 'string' },
        league: { type: 'string' },
        participants: { type: 'array', items: { type: 'string' } },
        sport: { type: 'string' },
        client_id: { type: 'string' }
    },
    required: ['begin_timestamp', 'country', 'end_timestamp', 'event_id', 'league', 'participants', 'sport', 'client_id'],
    additionalProperties: false
};