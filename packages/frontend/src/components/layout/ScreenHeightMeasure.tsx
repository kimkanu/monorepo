import { useWindowSize } from '@react-hook/window-size';
import React from 'react';
import { useRecoilState } from 'recoil';

import screenSizeState from '../../recoil/screenSize';

// Height change가 이 값을 넘지 않으면 키보드로 간주되지 않습니다.
const HEIGHT_THRESHOLD = 160;

const ScreenHeightMeasure: React.FC = () => {
  // 가상 키보드 및 주소창이 있는 모바일 기기인지 확인합니다.
  const [isProblematic, setProblematic] = React.useState<boolean | null>(null);
  const [lastWidth, setLastWidth] = React.useState<number | null>(null);
  const [lastHeight, setLastHeight] = React.useState<number | null>(null);

  const [width, height] = useWindowSize();
  const ref = React.useRef<HTMLDivElement>(null);

  const [, setScreenSize] = useRecoilState(screenSizeState.atom);

  React.useEffect(() => {
    if (ref.current !== null) {
      setProblematic(ref.current.getBoundingClientRect().height !== height);
    }
  }, [ref.current]);

  React.useEffect(() => {
    if (ref.current !== null && isProblematic) {
      const offset = Math.round(ref.current?.getBoundingClientRect().height - height);
      setScreenSize((s) => ({ ...s, offset }));
    }
  }, [ref.current, isProblematic]);

  React.useEffect(() => {
    setLastWidth(width);
    setScreenSize((s) => ({ ...s, width }));
  }, [width]);

  React.useEffect(() => {
    const difference = height - (lastHeight ?? height);

    const shouldUpdateVh = isProblematic === false || (
      Math.abs(difference) < HEIGHT_THRESHOLD // 주소창
      || ((lastWidth ?? width) < (lastHeight ?? height)) !== width < height // orientation
    );

    // 키보드가 열린 상태인지까지 확인하려면 (추후에 필요할 상황을 위해서):
    //
    // let shouldUpdateVh = false;
    // if (isProblematic !== true) {
    //   shouldUpdateVh = false;
    // } else {
    //   if (
    //     Math.abs(difference) < HEIGHT_THRESHOLD
    //     || ((lastWidth ?? width) < (lastHeight ?? height)) !== width < height
    //   ) {
    //     shouldUpdateVh = true;
    //   } else if (difference > 0) {
    //     shouldUpdateVh = false;
    //     setMsg('keyboard disappeared');
    //   } else {
    //     shouldUpdateVh = false;
    //     setMsg('keyboard detected');
    //   }
    // }

    if (shouldUpdateVh && document.documentElement.style) {
      document.documentElement.style.setProperty('--vh', `${height / 100}px`);
    }
    document.documentElement.style.setProperty('--wh', `${height / 100}px`);

    setLastHeight(height);
    setScreenSize((s) => ({
      ...s,
      actualHeight: height,
      viewportHeight: shouldUpdateVh ? height : (s.viewportHeight || height),
    }));
  }, [height, ref.current]);

  return (
    <div ref={ref} className="absolute top-0 w-0 overflow-hidden" style={{ height: '100vh' }} />
  );
};

export default ScreenHeightMeasure;
