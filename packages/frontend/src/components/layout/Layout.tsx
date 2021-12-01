import React from 'react';

import { mergeClassNames, Styled } from '../../utils/style';

import Footer from './Footer';
import FooterTest from '../test/FooterTest';
import Header from './Header';

const Layout: React.FC<Styled<{}>> = ({ className, style, children }) => {
  const [isUIHidden, setUIHidden] = React.useState(false);

  return (
    <div style={style} className={mergeClassNames('w-full h-full bg-white absolute top-0 overflow-hidden', className)}>
      <Header isUIHidden={isUIHidden} />
      <FooterTest />

      {/* Contents */}
      <div
        className="absolute w-full min-h-full"
        style={{
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
