import React from 'react';

import { mergeClassNames, Styled } from '../../utils/style';

import Header from './Header';

const Layout: React.FC<Styled<{}>> = ({ className, style, children }) => (
  <div style={style} className={mergeClassNames('w-full h-full bg-white absolute top-0 overflow-auto', className)}>
    <Header />
    {/* Dummy Footer */}
    <div
      className="fixed border-t-4 border-primary-500 bg-white z-layout bottom-0 w-100vw"
      style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
    />

    {/* Contents */}
    <div
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 64px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      {children}
    </div>
  </div>
);

export default Layout;
