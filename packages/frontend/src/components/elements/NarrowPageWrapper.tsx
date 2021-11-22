import React from 'react';

interface Props {
  ref_?: React.RefObject<HTMLDivElement>;
}

const NarrowPageWrapper: React.FC<Props> = ({ ref_, children }) => (
  <div ref={ref_} className="mx-auto" style={{ maxWidth: 480 }}>
    {children}
  </div>
);

export default NarrowPageWrapper;
