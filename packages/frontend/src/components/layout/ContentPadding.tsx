import { useWindowSize } from '@react-hook/window-size';
import React from 'react';

interface Props {
  isFooterPresent: boolean;
}

const ContentPadding: React.FC<Props> = ({ isFooterPresent, children }) => {
  const [width] = useWindowSize();

  return (
    <div
      style={{
        height: `calc(100 * var(--wh) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - ${isFooterPresent ? 140 : 64}px)`,
        maxWidth: 1184,
        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: `calc(env(safe-area-inset-left, 0px) + ${width >= 960 ? 32 : 24}px)`,
        paddingRight: `calc(env(safe-area-inset-right, 0px) + ${width >= 960 ? 32 : 24}px)`,
        margin: '0 auto',
      }}
    >
      {children}
    </div>
  );
};

export default ContentPadding;
