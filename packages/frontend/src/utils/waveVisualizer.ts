import seedrandom from 'seedrandom';

import {
  rangeEnd, sum, newtonRaphson, range, clamp, randomInt,
} from './math';

export type Curve = {
  type: number; // color type
  animationType: [number, number]; // animation type
  key: string; // curve key, which is a function of (Date.now(), type)
  components: CurveProps[];
};

export interface CurveProps {
  radius: number;
  height: number;
  position: number;
}

export interface Options {
  smoothFactor?: number;
  stepCountFactor?: number;
  min?: number;
  max?: number;
}

const MIN = -400;
const MAX = 400;

/**
 * This work is inspired from SiriWave: https://dev.to/kopiro/how-i-built-the-siriwavejs-library-a-look-at-the-math-and-the-code-l0o
 * While SiriWave used the canvas, I used SVG Bezier paths to approximate the curve.
 *
 * The base curve y = γ(x) is represented by a spline of two Bezier curve segments
 * which are symmetric with respect to the y axis and one of them
 * has the following parametric formula on $t \in [0, 1]$:
 *     x(t) = (1 - t) (t^2 - t + 1),
 *     y(t) = t^2 (3 - 2t).
 * Therefore, dy/dx = 6(t - 1)t / (3t^2 - 4t + 2) on t \in [0, 1], where t = t(x)
 * is obtained using Newton's method.
 * On t \in [-1, 0], dy/dx(t) = - dy/dx(-t), and dy/dx = 0 outside [-1, 1].
 * The base curve can be changed freely.
 *
 * Then, for a curve y = γ_{r, h, p}(x) defined as
 *     γ_{r, h, p}(x) = h γ((x - p) / r),
 * we have d/dx γ_{r, h, p}(x) = (h / r) * γ'((x - p) / r).
 *
 * Finally, the resulting curve (for one color) is defined as
 *     y = \sum_i γ_{r_i, h_i, p_i}(x);
 * thus,
 *     dy/dx = \sum_i d/dx (γ_{r_i, h_i, p_i}(x))
 *           = \sum_i (h_i / r_i) * γ'((x - p_i) / r_i).
 *
 * Given some x coordinates, we can get the direction vector parallel to (1, dy/dx).
 * And the length of the direction vector follows some heuristic: refer to the source code.
 */
const getBaseCurveT = (x: number) => {
  // Assert x \in [0, 1].
  // Find the solution of $(1 - t) (t^2 - t + 1) - x = 0.$
  const tx = newtonRaphson((t) => (1 - t) * (t * (t - 1) + 1) - x, (t) => (4 - 3 * t) * t - 2, 0.5);
  return tx;
};
const getBaseCurveY: (x: number) => number = (x) => {
  if (x < -1 || x > 1) return 0;
  if (x < 0) return getBaseCurveY(-x);
  const t = getBaseCurveT(x);
  return t ** 2 * (3 - 2 * t);
};
const getBaseCurveDydx: (x: number) => number = (x) => {
  if (x < -1 || x > 1) return 0;
  if (x < 0) return -getBaseCurveDydx(-x);
  const t = getBaseCurveT(x);
  return (6 * (t - 1) * t) / (3 * t ** 2 - 4 * t + 2);
};
const getCurveDydx = (curves: CurveProps[]) => (x: number) => sum(
  curves.map(({ radius, height, position }) => (
    (height / radius) * getBaseCurveDydx((x - position) / radius)
  )),
);
const getCurveY = (curves: CurveProps[]) => (x: number) => sum(
  curves.map(({ radius, height, position }) => (
    height * getBaseCurveY((x - position) / radius)
  )),
);
export const getCurveTangent = (curves: CurveProps[]) => (
  x: number, scale: number,
) => {
  const dydx = getCurveDydx(curves)(x);
  const factor = scale / Math.hypot(1, dydx);
  return [factor, factor * dydx];
};

export const getBezierCurveOverlappingSumPoints = (
  curves: CurveProps[], opts?: Options,
) => {
  // Assume the union of the supports of given curves is connected.
  const STEP_COUNT = (opts?.stepCountFactor ?? 8) * curves.length;
  const ticks = curves.flatMap(({ position, radius }) => [position - radius, position + radius]);
  const minTicks = Math.min(...ticks);
  const maxTicks = Math.max(...ticks);
  const step = ((maxTicks - minTicks) / 2) / STEP_COUNT;
  const uniformSampling = rangeEnd(minTicks, maxTicks, step);
  const mean = sum(curves.map(({ radius }) => radius)) / curves.length;
  const curveTangent = getCurveTangent(curves);
  const curveY = getCurveY(curves);
  return uniformSampling.map((x) => {
    const [tx, ty] = curveTangent(
      x,
      (mean * step) / ((opts?.smoothFactor ?? 1) * (maxTicks - minTicks)),
    );
    const y = curveY(x);
    return {
      tx, ty, x, y,
    } as Point;
  });
};

export const getBezierCurveSumPoints = (curves: CurveProps[], opts?: Options) => {
  if (curves.length === 0) {
    return [];
  }

  // Divide supports of curves into connected components
  // Sort by the left end
  curves.sort((a, b) => (a.position - a.radius) - (b.position - b.radius));
  const curveGroups: CurveProps[][] = [];
  let lastMax = -Infinity;
  for (let i = 0; i < curves.length; i += 1) {
    if (lastMax < curves[i].position - curves[i].radius) {
      curveGroups.push([curves[i]]);
    } else {
      curveGroups[curveGroups.length - 1].push(curves[i]);
    }
    lastMax = curves[i].position + curves[i].radius;
  }

  const result = curveGroups.flatMap((c) => getBezierCurveOverlappingSumPoints(c, opts));
  if (curves[0].position - curves[0].radius > (opts?.min ?? MIN)) {
    result.unshift({
      tx: 1,
      ty: 0,
      x: MIN,
      y: 0,
    });
  }
  if (curves[curves.length - 1].position - curves[curves.length - 1].radius < (opts?.max ?? MAX)) {
    result.push({
      tx: 1,
      ty: 0,
      x: MAX,
      y: 0,
    });
  }
  return result;
};

interface Point {
  x: number;
  y: number;
  tx: number;
  ty: number;
}
export const bezierCurves = (points: Point[]) => points.map(({
  x, y, tx, ty,
}, i) => {
  if (i === 0) {
    return `M ${x} ${-y} C ${x + tx} ${-y - ty},`;
  }
  if (i === points.length - 1) {
    return `${x - tx} ${-y + ty}, ${x} ${-y}`;
  }
  return `${x - tx} ${-y + ty}, ${x} ${-y} C ${x + tx} ${-y - ty},`;
}).join(' ');

export const getBezierCurveSum = (curves: CurveProps[], opts?: Options) => {
  const points = getBezierCurveSumPoints(curves, opts);
  return `${bezierCurves(points)} L ${points[0].x} ${-points[0].y}`;
};

const BASE_CURVES_IN_CURVE = 2;
const LOG_FREQ_MIN = 2;
const LOG_FREQ_MAX = 2.6;

export const generateCurve = (
  type: number, { amplitude, frequency }: { amplitude: number, frequency: number },
): Curve => {
  const generator = seedrandom(`${Date.now()}-${type}`);
  const random = (min: number, max: number): number => (min + (max - min) * generator());
  const freqRatio = clamp(
    0, Math.log10(frequency) - LOG_FREQ_MIN, LOG_FREQ_MAX - LOG_FREQ_MIN,
  ) / (LOG_FREQ_MAX - LOG_FREQ_MIN);
  const components: CurveProps[] = range(BASE_CURVES_IN_CURVE).map(() => {
    const r = random(0, 0.8);
    const min = MIN + 0.1 * (MAX - MIN);
    const max = MAX - 0.1 * (MAX - MIN);
    const meanPosition = min + (max - min) * freqRatio;
    const position = random(min, max) * (1 - r) + meanPosition * r;
    return {
      height: (
        clamp(
          3,
          random(0.8, 1.2) * amplitude * (
            random(0.1, 0.4) / (1 + 4 * ((meanPosition - position) / (max - min)) ** 2)
          ),
          50,
        )
      ),
      position,
      radius: random(30, 120),
    };
  });
  return {
    animationType: [randomInt(3), randomInt(3)],
    components,
    key: `${Date.now()}-${type}`,
    type,
  };
};
