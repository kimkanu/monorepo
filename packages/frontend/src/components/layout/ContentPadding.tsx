import { useWindowSize } from '@react-hook/window-size';
import React from 'react';

import useScreenType from '../../hooks/useScreenType';
import ScreenType from '../../types/screen';

interface Props {
  isFooterPresent: boolean;
}

const ContentPadding = React.forwardRef<HTMLDivElement, React.PropsWithChildren<Props>>(
  ({ isFooterPresent, children }, ref) => {
    const [width] = useWindowSize();
    const screenType = useScreenType();
    const isMobileLandscape = screenType === ScreenType.MobileLandscape;

    return (
      <div
        ref={ref}
        className="overflow-x-hidden flex justify-center w-full transition"
        style={{
          overflowY: 'var(--overflow, auto)' as React.CSSProperties['overflowY'],
          transitionProperty: 'padding-bottom',
          height: 'calc(100 * var(--wh))',
          paddingTop: `calc(env(safe-area-inset-top, 0px) + ${isMobileLandscape ? 32 : 96}px)`,
          paddingLeft: `calc(env(safe-area-inset-left, 0px) + ${width >= 960 ? 32 : 24}px)`,
          paddingRight: `calc(env(safe-area-inset-right, 0px) + ${width >= 960 ? 32 : 24}px)`,
          paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + ${isFooterPresent ? 108 : 32}px)`,
        }}
      >
        <div className="w-full h-fit my-auto" style={{ maxWidth: 1184 }}>
          {children}
        </div>
      </div>
    );
  },
);

export default ContentPadding;
