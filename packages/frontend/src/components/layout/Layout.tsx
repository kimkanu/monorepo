import React from 'react';

import { mergeClassNames, Styled } from '../../utils/style';
import VoiceWrapper from '../voice/VoiceWrapper';

import Footer from './Footer';
import Header from './Header';

const Layout: React.FC<Styled<{}>> = ({ className, style, children }) => {
  const [isUIHidden, setUIHidden] = React.useState(false);

  return (
    <div style={style} className={mergeClassNames('w-full h-full bg-white absolute top-0 overflow-hidden', className)}>
      <Header isUIHidden={isUIHidden} />
      <Footer isUIHidden={isUIHidden} setUIHidden={setUIHidden} />
      {/* Dummy Footer */}
      {/* <div
        className="fixed border-t-4 border-primary-500 bg-white z-layout bottom-0 w-100vw"
        style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
      >
      </div> */}

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
