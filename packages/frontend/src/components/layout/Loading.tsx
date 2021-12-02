import React from 'react';
import { spring, Motion } from 'react-motion';

import LoadingLogo from './LoadingLogo';

interface Props {
  loading: boolean;
}

const Loading: React.FC<Props> = ({ loading }) => (
  <Motion style={{ opacity: spring(loading ? 1 : 0) }}>
    {({ opacity }) => (
      <div className="w-100vw h-100vh fixed top-0 left-0 bg-gray-900 bg-opacity-10 text-white flex justify-center items-center z-dialog-2" style={{ opacity, pointerEvents: loading ? 'unset' : 'none' }}>
        <LoadingLogo />
      </div>
    )}
  </Motion>
);

export default Loading;
