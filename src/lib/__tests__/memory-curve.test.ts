import { describe, expect, it } from 'vitest';
import { getForgettingCurve } from '../memory';

describe('forgetting curve', () => {
  it('covers the first fourteen days', () => {
    const curve = getForgettingCurve({}, []);
    expect(curve.actual).toHaveLength(15);
    expect(curve.theoretical).toHaveLength(15);
    expect(curve.actual.at(-1)?.day).toBe(14);
    expect(curve.theoretical[0].recall).toBe(100);
  });
});
