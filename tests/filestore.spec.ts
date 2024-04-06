import { describe, expect, it } from '@jest/globals';
import { FileStore } from '../src/datastore/filestore';

describe('FileStore', () => {
    it('Should initialize the filestore', () => {
        const fileStore = new FileStore();
        fileStore.initialize('./test.json');
        expect(fileStore.getEvents().length).toBeGreaterThan(0);
    });

    it('Should insert a user', () => {
        const fileStore = new FileStore();
        fileStore.initialize('./test.json');
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

    it('Should not insert a user with duplicate user id', () => {
        const fileStore = new FileStore();
        fileStore.initialize('./test.json');
        const inserted = fileStore.insertUser({
            birth_year: '1995',
            country: 'UK',
            currency: 'GBP',
            gender: 'F',
            registration_date: '2021-02-01',
            user_id: '1234'
        });
        expect(inserted).toBe(false);
    });

    it('Should insert an event', () => {
        const fileStore = new FileStore();
        fileStore.initialize('./test.json');
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

    it('Should not insert an event with duplicate event id', () => {
        const fileStore = new FileStore();
        fileStore.initialize('./test.json');
        const inserted = fileStore.insertEvent({
            begin_timestamp: '2021-01-01T00:00:00Z',
            country: 'US',
            end_timestamp: '2021-01-01T01:00:00Z',
            event_id: '1234',
            league: 'NFL',
            participants: ['Team A', 'Team B'],
            sport: 'Football'
        });
        expect(inserted).toBe(false);
    });

    it('Should insert a coupon', () => {
        const fileStore = new FileStore();
        fileStore.initialize('./test.json');
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

    it('Should not insert a coupon with duplicate coupon id', () => {
        const fileStore = new FileStore();
        fileStore.initialize('./test.json');
        const inserted = fileStore.insertCoupon({
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
        expect(inserted).toBe(false);
    });
});