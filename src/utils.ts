import jsonschema from 'jsonschema';
import { userSchema } from './schemas/user';
import { eventSchema } from './schemas/event';
import { couponSchema } from './schemas/coupon';

import { User, Event, Coupon } from './types/database';

export function validator(schema: string, data: User | Event | Coupon) {
    const Validator = jsonschema.Validator;
    const v = new Validator();

    let schemaObj: jsonschema.Schema;

    if (schema === 'user') {
        schemaObj = userSchema;
    } else if (schema === 'event') {
        schemaObj = eventSchema;
    } else if (schema === 'coupon') {
        schemaObj = couponSchema;
    } else {
        throw new Error('Invalid schema');
    }

    const validated = v.validate(data, schemaObj);

    return validated;
}

export function errorParser(validated: jsonschema.ValidatorResult): string[] {
    const errors: string[] = [];
    for (let i = 0; i < validated.errors.length; i++) {
        const error = validated.errors[i];
        let property = error.property;
        if (property.startsWith('instance.')) {
            property = property.replace('instance.', '');
        } else if (property === 'instance') {
            property = '';
        }

        let message = error.stack;
        if (error.name === 'additionalProperties') {
            message = `unknown property "${error.argument as string}"`;
        } else if (property) {
            if (error.name === 'anyOf') {
                message = `"${property}" does not have a valid value`;
            } else {
                message = message.replace(error.property, `"${property}"`).trim();
            }
        } else {
            message = message.replace(error.property, property).trim();
        }

        errors.push(message);
    }
    return errors;
}