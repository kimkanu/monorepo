import { SpinnerIos20Filled } from '@fluentui/react-icons';
import React from 'react';

import Fade from './Fade';

import styles from './Loading.module.css';

interface Props {
  loading: boolean;
}

const Loading: React.FC<Props> = ({ loading }) => (
  <Fade visible={loading}>
    {(ref) => (
      <div ref={ref} className="w-100vw h-100vh fixed top-0 left-0 bg-gray-900 bg-opacity-50 text-white flex justify-center items-center z-dialog-2">
        <div className={styles.spin}>
          <SpinnerIos20Filled className="stroke-current animate-spin" />
        </div>
      </div>
    )}
  </Fade>
);

export default Loading;
