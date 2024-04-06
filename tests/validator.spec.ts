// Import the validator function and test it
import { validator } from '../src/tools/validator';
import { User, Event, Coupon } from '../src/types/datastore';
import { describe, expect, it } from '@jest/globals';

describe('Validator', () => {
  it('Should validate a valid User', () => {
    const user: User = {
      birth_year: '1990',
      country: 'US',
      currency: 'USD',
      gender: 'M',
      registration_date: '2021-01-01',
      user_id: '1234'
    };

    const validated = validator('user', user);
    expect(validated.valid).toBe(true);
  });

  it('Should validate an invalid User', () => {
    const user = {
      birth_year: '1990',
      country: 'US',
      currency: 'USD',
      gender: 'M',
      registration_date: '2021-01-01',
      user_id: '1234',
      invalid_field: 'invalid'
    };

    const validated = validator('user', user as User);
    expect(validated.valid).toBe(false);
  });

  it('Should validate a valid Event', () => {
    const event: Event = {
      begin_timestamp: '2021-01-01T00:00:00Z',
      country: 'US',
      end_timestamp: '2021-01-01T01:00:00Z',
      event_id: '1234',
      league: 'NFL',
      participants: ['Team A', 'Team B'],
      sport: 'Football'
    };

    const validated = validator('event', event);
    expect(validated.valid).toBe(true);
  });

  it('Should validate an invalid Event', () => {
    const event = {
      begin_timestamp: '2021-01-01T00:00:00Z',
      country: 'US',
      end_timestamp: '2021-01-01T01:00:00Z',
      event_id: '1234',
      league: 'NFL',
      participants: ['Team A', 'Team B'],
      sport: 'Football',
      invalid_field: 'invalid'
    };

    const validated = validator('event', event as Event);
    expect(validated.valid).toBe(false);
  });

  it('Should validate a valid Coupon', () => {
    const coupon: Coupon = {
      coupon_id: '1234',
      selections: [
        {
          event_id: '5678',
          odds: 1.5
        }
      ],
      stake: 10,
      timestamp: '2021-01-01T00:00:00Z',
      user_id: '1234'
    };

    const validated = validator('coupon', coupon);
    expect(validated.valid).toBe(true);
  });

  it('Should validate an invalid Coupon', () => {
    const coupon = {
      coupon_id: '1234',
      selections: [
        {
          event_id: '5678',
          odds: 1.5
        }
      ],
      stake: 10,
      timestamp: '2021-01-01T00:00:00Z',
      user_id: '1234',
      invalid_field: 'invalid'
    };

    const validated = validator('coupon', coupon as Coupon);
    expect(validated.valid).toBe(false);
  });
});