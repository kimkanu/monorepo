import React from 'react';

import { random, range } from '../utils/math';

import {
  Curve,
  generateCurve, getBezierCurveSum,
} from '../utils/waveVisualizer';

import styles from './WaveVisualizer.module.css';

interface Props {}

const colors = [
  '#ff2667',
  '#ff9f29',
  '#13ed79',
];
const MAX_CURVES = 4 * colors.length;

const WaveVisualizer: React.FC<Props> = () => {
  const [curves, setCurves] = React.useState<Curve[]>([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurves((c) => [
        ...c.slice(-MAX_CURVES),
        generateCurve(0, 50, 300),
        generateCurve(1, 50, 300),
        generateCurve(2, 50, 300),
      ]);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const paths = curves.map(({
    animationType, key, components, type,
  }) => (
    <path
      key={key}
      className={styles[`path-${animationType}`]}
      d={getBezierCurveSum(components)}
      fill={colors[type]}
      style={{ mixBlendMode: 'screen' }}
    />
  ));

  return (
    <div className="absolute w-full bottom-0 left-0 flex justify-center items-center opacity-50">
      <svg className="w-full max-w-4xl" viewBox="-400 -100 800 100" xmlns="http://www.w3.org/2000/svg">
        {paths}
      </svg>
    </div>
  );
};

export default WaveVisualizer;
