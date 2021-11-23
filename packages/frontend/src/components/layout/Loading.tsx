import React from 'react';

import Fade from './Fade';
import LoadingLogo from './LoadingLogo';

interface Props {
  loading: boolean;
}

const Loading: React.FC<Props> = ({ loading }) => (
  <Fade visible={loading}>
    {(ref) => (
      <div ref={ref} className="w-100vw h-100vh fixed top-0 left-0 bg-gray-900 bg-opacity-10 text-white flex justify-center items-center z-dialog-2">
        <LoadingLogo />
      </div>
    )}
  </Fade>
);

export default Loading;
