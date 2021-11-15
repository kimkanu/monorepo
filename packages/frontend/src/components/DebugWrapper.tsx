/* istanbul ignore file */

import React from 'react';

const DebugWrapper: React.FC = ({ children }) => (
  process.env.NODE_ENV === 'production' ? null : (
    <div className="absolute left-4 top-4 rounded-lg bg-white bg-opacity-95 z-debug px-8 py-6 shadow-dropdown-desktop">
      {children}
    </div>
  )
);

export default DebugWrapper;
