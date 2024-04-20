import { describe, expect, it } from '@jest/globals';
import { randomRecommend, frequencyRecommend } from '../src/tools/recommender';
import { FileStore } from '../src/datastore/filestore';
import {generateDummyData} from '../generator/generator';
import { User } from '../src/types/datastore';

describe('Random Recommender', () => {
    it('Should return a list of recommendations', () => {
        const recommendations = randomRecommend();
        expect(recommendations.length).toBeGreaterThan(0);
    });

    it('Should return a list of recommendations with the correct structure', () => {
        const recommendations = randomRecommend();
        expect(recommendations[0]).toHaveProperty('event_id');
        expect(recommendations[0]).toHaveProperty('league');
        expect(recommendations[0]).toHaveProperty('participants');
        expect(recommendations[0]).toHaveProperty('sport');
        expect(recommendations[0]).toHaveProperty('begin_timestamp');
        expect(recommendations[0]).toHaveProperty('end_timestamp');
        expect(recommendations[0]).toHaveProperty('country');
    });
});

describe('Frequency Recommender', () => {
    it('Should return a list of recommendations based on activity', () => {
        const filestore = new FileStore();
        filestore.initialize('./test.json');
        if (filestore.getUsers().length < 1) {
            filestore.writeData(generateDummyData(10, 20, 30));
        }
        const users = filestore.getUsers()

        const randomUser = users[0];

        const recommendations = frequencyRecommend(randomUser.user_id, filestore);
        expect(recommendations.length).toBeGreaterThan(0);
    });

    it('Should return a list of random recommendations if user has no activity', () => {
        const filestore = new FileStore();
        filestore.initialize('./test.json');

        const user1: User = {
            birth_year: '1990',
            country: 'US',
            currency: 'USD',
            gender: 'M',
            registration_date: '2021-01-01',
            user_id: 'user1'
        }

        filestore.insertUser(user1)

        const recommendations = frequencyRecommend('1234', filestore);
        expect(recommendations.length).toBeGreaterThan(0);
    });
});