import { describe, expect, test } from '@jest/globals';
import { randomRecommend } from '../src/tools/recommender';

describe('Random Recommender', () => {
    test('Should return a list of recommendations', () => {
        const recommendations = randomRecommend();
        expect(recommendations.length).toBeGreaterThan(0);
    });

    test('Should return a list of recommendations with the correct structure', () => {
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