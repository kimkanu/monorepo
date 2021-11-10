import React from 'react';

const Layout: React.FC = ({ children }) => (
  <div className="w-full h-full bg-white absolute top-0">
    {children}

    {/* Dummy Footer */}
    <div
      className="absolute border-t-4 border-primary-500 z-layout bottom-0 w-full"
      style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
    />
  </div>
);

export default Layout;
