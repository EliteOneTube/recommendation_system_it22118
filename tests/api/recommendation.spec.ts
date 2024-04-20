import { describe, expect, it } from '@jest/globals';
import request  from 'supertest';
import API from '../../src/api';
import http from 'http';

describe('Recommendation test suite', () => {
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
        const response = await request(server)
            .get('/user/1')
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
    });
});