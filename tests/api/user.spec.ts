import { describe, expect, it } from '@jest/globals';
import request  from 'supertest';
import { User } from '../../src/types/datastore';
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
        const mockData: User = {
            birth_year: '1990',
            country: 'US',
            currency: 'USD',
            gender: 'M',
            registration_date: '2021-01-01',
            user_id: '1'
        }

        const response = await request(server)
            .post('/user')
            .send(mockData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
    });

    it('Should return 400', async () => {
        const mockData = {
            birth_year: '1990',
            country: 'US',
            currency: 'USD',
        }

        const response = await request(server)
            .post('/user')
            .send(mockData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
    });

    it('Should return 409', async () => {
        const mockData: User = {
            birth_year: '1990',
            country: 'US',
            currency: 'USD',
            gender: 'M',
            registration_date: '2021-01-01',
            user_id: '1'
        }

        const response = await request(server)
            .post('/user')
            .send(mockData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(409);
    });     
});