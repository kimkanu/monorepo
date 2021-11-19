/* istanbul ignore file */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

import React from 'react';

const DebugWrapper: React.FC = ({ children }) => {
  const [isVisible, setVisible] = React.useState(true);

  return (
    process.env.NODE_ENV === 'production' ? null : (
      <div
        className="absolute left-4 bottom-4 rounded-lg bg-white hover:bg-gray-200 cursor-pointer bg-opacity-95 z-debug px-8 py-6 shadow-dropdown-desktop transition-all"
        style={{
          width: 280,
          transform: `translateX(${isVisible ? '0px' : '-250px'})`,
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setVisible((v) => !v);
          }
        }}
      >
        {children}
      </div>
    )
  );
};

export default DebugWrapper;
