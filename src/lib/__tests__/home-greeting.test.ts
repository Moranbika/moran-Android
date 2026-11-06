import { describe, expect, it } from 'vitest';
import { homeGreetingKey } from '@/lib/home-greeting';

describe('home greeting', () => {
  it('changes with the time of day', () => {
    expect(homeGreetingKey(5)).toBe('把今天的学习，留给清晨。');
    expect(homeGreetingKey(9)).toBe('把今天的学习，留给清晨。');
    expect(homeGreetingKey(10)).toBe('趁午前，把今天的学习推进一点。');
    expect(homeGreetingKey(14)).toBe('把今天的学习，放进午后。');
    expect(homeGreetingKey(18)).toBe('把今天的学习，收进今晚。');
    expect(homeGreetingKey(23)).toBe('夜深了，学一点也算数。');
    expect(homeGreetingKey(2)).toBe('夜深了，学一点也算数。');
  });
});
