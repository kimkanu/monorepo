import React from 'react';

const Debug: React.FC = ({ children }) => (
  process.env.NODE_ENV === 'development' ? (
    <div className="absolute right-4 top-4 rounded-lg bg-white bg-opacity-95 z-debug px-8 py-6 shadow-xl">
      {children}
    </div>
  ) : null
);

export default Debug;
