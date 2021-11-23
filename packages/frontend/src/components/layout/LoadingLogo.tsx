import React from 'react';
import { useRecoilValue } from 'recoil';

import themeState from '../../recoil/theme';

const PERIOD = 1000;

const LoadingLogo: React.FC = () => {
  const theme = useRecoilValue(themeState.atom);

  const [time, setTime] = React.useState<number>(0);

  const requestRef = React.useRef<number>();
  const previousTimeRef = React.useRef<number>();

  const animate = (t: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = t - previousTimeRef.current;
      setTime((prev) => prev + deltaTime);
    }
    previousTimeRef.current = t;
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (typeof requestRef.current !== 'undefined')cancelAnimationFrame(requestRef.current); };
  }, []);

  const theta = 2 * Math.PI * (time / PERIOD);
  const path = (width: number) => `M 4 0 H 2 A 1 1 0 0 0 1 1 V 3 A 3 3 0 0 0 4 6 H ${4 + width} A 3 3 0 0 0 ${4 + width} 0 H 4`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="120"
      height="120"
      viewBox="-2.5 -2.5 15 15"
      style={{ backgroundColor: 'white', padding: '17px 14px 15px 18px', borderRadius: '100%' }}
    >
      <defs>
        <path
          id="logo-path-1"
          d={path(1 - Math.cos(2 * Math.PI * (time / PERIOD)))}
          style={{ transform: `scale(${1 - 0.2 * Math.sin(-Math.PI / 6 + theta)}) translate(${0.2 * Math.sin(-Math.PI / 6 + theta)}px, ${2 - 2 * Math.cos(theta)}px)` }}
        />
        <path
          id="logo-path-2"
          d={path(1 + Math.cos(2 * Math.PI * (time / PERIOD)))}
          style={{ transform: `scale(${1 + 0.2 * Math.sin(-Math.PI / 6 + theta)}) translate(${-0.2 * Math.sin(-Math.PI / 6 + theta)}px, ${2 + 2 * Math.cos(theta)}px)` }}
        />
        <mask id="logo-mask-1">
          <rect id="bg" x="0" y="0" width="100%" height="100%" fill="white" />
          <use xlinkHref="#logo-path-1" fill="black" />
        </mask>
        <mask id="logo-mask-2">
          <rect id="bg" x="0" y="0" width="100%" height="100%" fill="white" />
          <use xlinkHref="#logo-path-2" fill="black" />
        </mask>
        <mask id="logo-mask-3">
          <use xlinkHref="#logo-path-2" fill="white" />
        </mask>
      </defs>
      <use xlinkHref="#logo-path-1" mask="url(#logo-mask-2)" fill={['blue', 'green'].includes(theme) ? '#7C98FC' : '#AF83F9'} />
      <use xlinkHref="#logo-path-2" mask="url(#logo-mask-1)" fill={['blue', 'green'].includes(theme) ? '#44D28E' : '#FF8AAD'} />
      <use xlinkHref="#logo-path-1" mask="url(#logo-mask-3)" fill="white" />
    </svg>
  );
};

export default LoadingLogo;
