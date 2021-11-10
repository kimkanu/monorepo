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
  '#ff5cbe',
  '#a526ff',
  '#5e59f7',
];
const INTERVAL = 200;
const MAX_CURVES = 4 * COLORS.length;
const AMP_THRESHOLD = 10;

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
    }, INTERVAL * ((Math.random() + 2) / 2.5));

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
    <div
      className="absolute w-full left-0 flex justify-center items-center opacity-50"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
    >
      <svg className="w-full" style={{ maxWidth: 1366 }} viewBox="-500 -100 1000 100" xmlns="http://www.w3.org/2000/svg">
        {paths}
      </svg>
    </div>
  );
};

export default WaveVisualizer;
