import React from 'react';

import Header from './Header';
import { mergeClassNames, Styled } from '../utils/style';

const Layout: React.FC<Styled<{}>> = ({ className, style, children }) => (
  <div style={style} className={mergeClassNames('w-full h-full bg-white absolute top-0', className)}>
    {children}

    <Header />
    {/* Dummy Footer */}
    <div
      className="absolute border-t-4 border-pink-500 z-layout bottom-0 w-full"
      style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
    />
  </div>
);

export default Layout;
