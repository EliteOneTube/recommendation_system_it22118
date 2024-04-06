import { describe, expect, test } from '@jest/globals';
import { FileStore } from '../src/datastore/filestore';

describe('FileStore', () => {
    test('Should initialize the filestore', () => {
        const fileStore = new FileStore();
        fileStore.initialize('./data.json');
        expect(fileStore.getEvents().length).toBeGreaterThan(0);
    });

    test('Should insert a user', () => {
        const fileStore = new FileStore();
        fileStore.initialize('./data.json');
        fileStore.insertUser({
            birth_year: '1990',
            country: 'US',
            currency: 'USD',
            gender: 'M',
            registration_date: '2021-01-01',
            user_id: '1234'
        });
        expect(fileStore.getUserById('1234')).toBeTruthy();
    });

    test('Should insert an event', () => {
        const fileStore = new FileStore();
        fileStore.initialize('./data.json');
        fileStore.insertEvent({
            begin_timestamp: '2021-01-01T00:00:00Z',
            country: 'US',
            end_timestamp: '2021-01-01T01:00:00Z',
            event_id: '1234',
            league: 'NFL',
            participants: ['Team A', 'Team B'],
            sport: 'Football'
        });
        expect(fileStore.getEventById('1234')).toBeTruthy();
    });

    test('Should insert a coupon', () => {
        const fileStore = new FileStore();
        fileStore.initialize('./data.json');
        fileStore.insertCoupon({
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
        });
        expect(fileStore.getCouponById('1234')).toBeTruthy();
    });
});