import { useWindowSize } from '@react-hook/window-size';
import React from 'react';

interface Props {
  isFooterPresent: boolean;
}

const ContentPadding: React.FC<Props> = ({ isFooterPresent, children }) => {
  const [width] = useWindowSize();

  return (
    <div className="overflow-y-auto overflow-x-hidden flex justify-center w-full">
      <div
        className="py-8 w-full"
        style={{
          height: `calc(100 * var(--wh) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - ${isFooterPresent ? 140 : 64}px)`,
          maxWidth: 1184,
          paddingLeft: `calc(env(safe-area-inset-left, 0px) + ${width >= 960 ? 32 : 24}px)`,
          paddingRight: `calc(env(safe-area-inset-right, 0px) + ${width >= 960 ? 32 : 24}px)`,
        }}
      >
        {children}
      </div>

    </div>
  );
};

export default ContentPadding;
