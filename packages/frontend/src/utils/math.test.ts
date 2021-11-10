import {
  arrayFill,
  range,
  rangeEnd,
  random,
  randomInt,
  sum,
  clamp,
  newtonRaphson,
} from './math';

test('arrayFill works well', () => {
  expect(arrayFill(5, 0)).toStrictEqual([0, 0, 0, 0, 0]);
});

test('range works well', () => {
  expect(range(5)).toStrictEqual([0, 1, 2, 3, 4]);
  expect(range(1, 5)).toStrictEqual([1, 2, 3, 4]);
  expect(range(1, 5, 3)).toStrictEqual([1, 4]);
});

test('rangeEnd works well', () => {
  expect(rangeEnd(5)).toStrictEqual([0, 1, 2, 3, 4, 5]);
  expect(rangeEnd(1, 5)).toStrictEqual([1, 2, 3, 4, 5]);
  expect(rangeEnd(1, 5, 3)).toStrictEqual([1, 4]);
  expect(rangeEnd(1, 7, 3)).toStrictEqual([1, 4, 7]);
});

describe('random works well', () => {
  test.each(range(1, 11))('%i/10', () => {
    const r = random(3, 7);
    expect(r >= 3 && r < 7).toBe(true);
  });
});

describe('randomInt works well', () => {
  test.each(range(1, 11))('%i/10', () => {
    const r = randomInt(30, 70);
    expect(r >= 30 && r < 70 && r === Math.floor(r)).toBe(true);
  });
});

test('sum works well', () => {
  expect(sum([])).toBe(0);
  expect(sum([1, 2, 3, 4, 5])).toBe(15);
  expect(sum([-1, 5, 9, 3, -20])).toBe(-4);
});

test('clamp works well', () => {
  expect(clamp(0, -5, 100)).toBe(0);
  expect(clamp(1, 3, 7)).toBe(3);
  expect(clamp(-10, 9, 8)).toBe(8);
});

test('newtonRaphson works well', () => {
  const eps = 1e-5;

  const rootOfX = newtonRaphson((x) => x, () => 1, 1, 20);
  expect(Math.abs(rootOfX) < eps);

  const rootOfCubicEqn = newtonRaphson((x) => x ** 3 - 5 * x - 9, (x) => 3 * x ** 2 - 5, 2, 20);
  expect(Math.abs(rootOfCubicEqn - 2.85519653932070) < eps);

  const w1 = newtonRaphson((x) => Math.exp(x) - 3 * x, (x) => Math.exp(x) - 3, 0.5, 20);
  expect(Math.abs(w1 - 0.6190612867359451122) < eps);

  const w2 = newtonRaphson((x) => Math.exp(x) - 3 * x, (x) => Math.exp(x) - 3, 1.5, 20);
  expect(Math.abs(w2 - 1.5121345516578424739) < eps);
});
