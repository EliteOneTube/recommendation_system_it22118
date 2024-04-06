import jsonschema, {ValidatorResult} from 'jsonschema';
import { userSchema } from '../schemas/user';
import { eventSchema } from '../schemas/event';
import { couponSchema } from '../schemas/coupon';

import { User, Event, Coupon } from '../types/datastore';

export function validator(schema: string, data: User | Event | Coupon): ValidatorResult {
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