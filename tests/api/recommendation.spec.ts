import { describe, expect, it } from '@jest/globals';
import request  from 'supertest';
import { server } from '../../src/api';

describe('Recommendation test suite', () => {
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