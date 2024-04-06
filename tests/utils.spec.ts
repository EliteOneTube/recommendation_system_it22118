import { describe, expect, it } from '@jest/globals';
import {mostFrequent} from '../src/tools/utils';

describe('Most Frequent Function', () => {
    it('Should return the most frequent element in an array', () => {
        const arr = ['a', 'a', 'b', 'b', 'b', 'c', 'c', 'c', 'c'];
        expect(mostFrequent(arr)).toBe('c');
    });

    it('Should return the first most frequent element in an array', () => {
        const arr = ['a', 'a', 'b', 'b', 'b', 'c', 'c', 'c', 'c', 'a', 'a'];
        expect(mostFrequent(arr)).toBe('a');
    });

    it('Should return the most frequent element in an array of numbers', () => {
        const arr = [1, 1, 2, 2, 2, 3, 3, 3, 3];
        expect(mostFrequent(arr)).toBe(3);
    });

    it('Should return the first most frequent element in an array of numbers', () => {
        const arr = [1, 1, 2, 2, 2, 3, 3, 3, 3, 1, 1];
        expect(mostFrequent(arr)).toBe(1);
    });

    it('Should return the most frequent element in an array of mixed types', () => {
        const arr = ['a', 'a', 1, 1, 1, 'b', 'b', 'b', 'b'];
        expect(mostFrequent(arr)).toBe('b');
    });

    it('Should return the first most frequent element in an array of mixed types', () => {
        const arr = ['a', 'a', 1, 1, 1, 'b', 'b', 'b', 'b', 'a', 'a'];
        expect(mostFrequent(arr)).toBe('a');
    });
});