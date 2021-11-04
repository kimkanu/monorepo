import React from 'react';

import { randomInt, range } from '../utils/math';

import {
  Curve,
  generateCurve, getBezierCurveSum,
} from '../utils/waveVisualizer';

import styles from './WaveVisualizer.module.css';

interface Props {
  amplitude: number;
  frequency: number;
}

const COLORS = [
  '#ff2667',
  '#ff9f29',
  '#13ed79',
];
const INTERVAL = 200;
const MAX_CURVES = 4 * COLORS.length;
const AMP_THRESHOLD = 40;

const WaveVisualizer: React.FC<Props> = ({ frequency, amplitude }) => {
  const [curves, setCurves] = React.useState<Curve[]>([]);
  const [state] = React.useState({
    amplitude, frequency,
  });
  React.useEffect(() => {
    state.frequency = frequency;
  }, [frequency]);
  React.useEffect(() => {
    state.amplitude = amplitude;
  }, [amplitude]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      // 랜덤으로 COLORS.length 가지 색 중 하나를 제외하고 생성
      setCurves((c) => [
        ...c.slice(-(MAX_CURVES - 2)),
        ...range(3)
          .filter((x) => x !== randomInt(COLORS.length) && state.amplitude > AMP_THRESHOLD)
          .map((x) => generateCurve(x, state)),
      ]);
    }, INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const paths = curves.map(({
    animationType: [a, b], key, components, type,
  }) => (
    <path
      key={key}
      className={styles[`path-${a}${b}`]}
      d={getBezierCurveSum(components)}
      fill={COLORS[type]}
      style={{ mixBlendMode: 'screen' }}
    />
  ));

  return (
    <div className="absolute w-full bottom-0 left-0 flex justify-center items-center opacity-50">
      <svg className="w-full" style={{ maxWidth: 1366 }} viewBox="-500 -100 1000 100" xmlns="http://www.w3.org/2000/svg">
        {paths}
      </svg>
    </div>
  );
};

export default WaveVisualizer;
