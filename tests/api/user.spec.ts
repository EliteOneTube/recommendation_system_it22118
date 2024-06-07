import { describe, expect, it } from '@jest/globals';
import request  from 'supertest';
import { User } from '../../src/types/datastore';
import API from '../../src/api';
import http from 'http';
import express from 'express';
import fs from 'fs';

describe('User test suite', () => {
    let server: http.Server | express.Express;

    beforeAll(async () => {
        const api = new API();
        await api.init('./user.json');
        server = api.getApp();
    });

    afterAll(() => {
        fs.unlinkSync('./user.json');
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
});