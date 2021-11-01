import useResizeObserver from '@react-hook/resize-observer';
import React from 'react';

const useSize = (target: React.RefObject<HTMLDivElement>) => {
  const [size, setSize] = React.useState<DOMRect | null>(null);

  React.useLayoutEffect(() => {
    setSize(target.current?.getBoundingClientRect() ?? null);
  }, [target]);

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
};

export default useSize;
