import { describe, expect, it } from '@jest/globals';
import request  from 'supertest';
import { Event } from '../../src/types/datastore';
import API from '../../src/api';
import http from 'http';
import express from 'express';
import fs from 'fs';

describe('User test suite', () => {
    let server: http.Server | express.Express;

    beforeEach(async () => {
        const api = new API();
        await api.init('./event.json');
        server = api.getApp();
    });

    afterAll(() => {
        fs.unlinkSync('./event.json');
    });

    it('Should return 200', async () => {
        const mockData: Event = {
            begin_timestamp: '2021-01-01T00:00:00Z',
            country: 'US',
            end_timestamp: '2021-01-01T00:00:00Z',
            event_id: '1',
            league: 'NFL',
            participants: ['Team A', 'Team B'],
            sport: 'Football'
        }

        const response = await request(server)
            .post('/event')
            .send(mockData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
    });

    it('Should return 400', async () => {
        const mockData = {
            begin_timestamp: '2021-01-01T00:00:00Z',
            country: 'US',
            end_timestamp: '2021-01-01T00:00:00Z',
            event_id: '1',
            league: 'NFL',
            participants: ['Team A', 'Team B'],
        }

        const response = await request(server)
            .post('/event')
            .send(mockData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
    });

    it('Should return 409', async () => {
        const mockData: Event = {
            begin_timestamp: '2021-01-01T00:00:00Z',
            country: 'US',
            end_timestamp: '2021-01-01T00:00:00Z',
            event_id: '1',
            league: 'NFL',
            participants: ['Team A', 'Team B'],
            sport: 'Football'
        }

        const response = await request(server)
            .post('/event')
            .send(mockData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(409);
    });     
});