import { describe, expect, it } from '@jest/globals';
import request  from 'supertest';
import API from '../../src/api';
import http from 'http';
import express from 'express';
import fs from 'fs';
import { User } from '../../src/types/datastore';

describe('Random recommendation test suite', () => {
    let server: http.Server | express.Express;

    beforeAll(async () => {
        const api = new API();
        await api.init('./recommendation.json');
        server = api.getApp();
    });

    afterAll(() => {
        fs.unlinkSync('./recommendation.json');
    });

    it('Should return 200', async () => {
        const mockData: User = {
            birth_year: '1990',
            country: 'US',
            currency: 'USD',
            gender: 'M',
            registration_date: '2021-01-01',
            user_id: '1',
            client_id: '1'
        }

        await request(server).post('/user').send(mockData).set('Accept', 'application/json');

        const query = {
            client_id: '1'
        }

        const response = await request(server).get('/random/')
        .query(query)
        .set('Accept', 'application/json');

        expect(response.status).toBe(200);
    });
});