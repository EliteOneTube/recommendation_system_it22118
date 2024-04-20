import { describe, expect, it } from '@jest/globals';
import request  from 'supertest';
import { Coupon } from '../../src/types/datastore';
import API from '../../src/api';
import http from 'http';

describe('User test suite', () => {
    let server: http.Server;

    beforeAll(() => {
        const api = new API();
        api.init();
        server = api.startServer();
    });

    afterAll(() => {
        server.close();
    });

    it('Should return 200', async () => {
        const mockData: Coupon = {
            coupon_id: '1',
            selections: [{event_id: '1', odds: 1.5}],
            stake: 1,
            timestamp: '2021-01-01T00:00:00Z',
            user_id: '1'
        }

        const response = await request(server)
            .post('/coupon')
            .send(mockData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
    });

    it('Should return 400', async () => {
        const mockData = {
            coupon_id: '1',
            stake: 1,
            timestamp: '2021-01-01T00:00:00Z',
            user_id: '1'
        }

        const response = await request(server)
            .post('/coupon')
            .send(mockData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
    });

    it('Should return 409', async () => {
        const mockData: Coupon = {
            coupon_id: '1',
            selections: [{event_id: '1', odds: 1.5}],
            stake: 1,
            timestamp: '2021-01-01T00:00:00Z',
            user_id: '1'
        }

        const response = await request(server)
            .post('/coupon')
            .send(mockData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(409);
    });     
});