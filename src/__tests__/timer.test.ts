import { time } from '../timer';
import { test, expect } from 'vitest';

test('5 seconds is 0:05', () => {
    const actual = time.secondsToString(5);
    expect(actual).toBe('00:05');
});

test('15 seconds is 0:15', () => {
    const actual = time.secondsToString(15);
    expect(actual).toBe('00:15');
});

test('65 seconds is 1:05', () => {
    const actual = time.secondsToString(65);
    expect(actual).toBe('01:05');
});

