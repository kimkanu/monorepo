import { random, rangeEnd } from './math';
import { generateCurve, getBezierCurveSum, getBezierCurveSumPoints } from './waveVisualizer';

describe('generateCurve works well', () => {
  test('getBezierCurveSumPoints with empty argument', () => {
    expect(getBezierCurveSumPoints([])).toStrictEqual([]);
  });

  test.each(rangeEnd(1, 500))('%i/500', (type) => {
    const curve = generateCurve(type % 3, {
      amplitude: random(20, 200),
      frequency: random(100, 400),
    });
    expect(curve.type).toBe(type % 3);
    expect(curve.animationType.every((a) => [0, 1, 2].includes(a))).toBe(true);
    expect(curve.components.every(({ height, position, radius }) => (
      height >= 3
      && height < 50
      && position >= -400
      && position < 400
      && radius >= 30
      && radius < 120
    )));

    const sum = getBezierCurveSum(curve.components).split(' ');
    expect(sum.slice(1, 3)).toStrictEqual(sum.slice(-2));
  });
});
