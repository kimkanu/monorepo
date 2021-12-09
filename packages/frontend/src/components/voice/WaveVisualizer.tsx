import React from 'react';
import { useRecoilValue } from 'recoil';

import useScreenType from '../../hooks/useScreenType';
import themeState from '../../recoil/theme';
import ScreenType from '../../types/screen';
import { random, randomInt, range } from '../../utils/math';
import { conditionalStyle } from '../../utils/style';
import {
  Curve,
  generateCurve, getBezierCurveSum,
} from '../../utils/waveVisualizer';

import styles from './WaveVisualizer.module.css';

interface Props {
  amplitude: number;
  frequency: number;
}

const COLORS = {
  violet: [
    '#ff78c9',
    '#b957ff',
    '#817df5',
  ],
  pink: [
    '#FF2667',
    '#FF9F29',
    '#13ED79',
  ],
  green: [
    '#FFB526',
    '#13ED79',
    '#0DB6FF',
  ],
  blue: [
    '#07EFE1',
    '#4484FF',
    '#817df5',
  ],
};
const INTERVAL = 300;
const AMP_THRESHOLD = 10;

const WaveVisualizer: React.FC<Props> = ({ frequency, amplitude }) => {
  const screenType = useScreenType();
  const [curves, setCurves] = React.useState<Curve[]>([]);
  const [state] = React.useState({
    amplitude, frequency,
  });

  const theme = useRecoilValue(themeState.atom);
  const MAX_CURVES = 4 * COLORS[theme].length;

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
        ...range(COLORS[theme].length)
          .filter((x) => x !== randomInt(COLORS[theme].length) && state.amplitude > AMP_THRESHOLD)
          .map((x) => generateCurve(x, state)),
      ]);
    }, INTERVAL * random(0.9, 1.1));

    return () => clearInterval(interval);
  }, []);

  const paths = curves.map(({
    animationType: [a, b], key, components, type,
  }) => (
    <path
      key={key}
      className={styles[`path-${a}${b}`]}
      d={getBezierCurveSum(components)}
      fill={COLORS[theme][type]}
      style={{ mixBlendMode: 'screen' }}
    />
  ));

  const marginBottom = {
    [ScreenType.MobilePortrait]: 136,
    [ScreenType.MobileLandscape]: 0,
    [ScreenType.Desktop]: 76,
  }[screenType];

  return (
    <div
      className="absolute w-full left-0 flex justify-center items-center opacity-50 z-layout-3 pointer-events-none"
      style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + ${marginBottom}px)` }}
    >
      <svg
        className="w-full max-w-5xl"
        viewBox="-400 -100 800 100"
        xmlns="http://www.w3.org/2000/svg"
        style={conditionalStyle({
          mobilePortrait: {
            minWidth: '50rem',
            transform: 'translateX(calc(50vw - 50%))',
          },
          mobileLandscape: {
            minWidth: '50rem',
            transform: 'translateX(calc(50vw - 9rem - 50%))',
          },
          desktop: {
            minWidth: '50rem',
            transform: 'translateX(calc(50vw - 13.5rem - 50%))',
          },
        })(screenType)}
      >
        {paths}
      </svg>
    </div>
  );
};

export default WaveVisualizer;
