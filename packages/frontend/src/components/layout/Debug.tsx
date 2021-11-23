/* istanbul ignore file */

import React from 'react';
import { useRecoilSnapshot } from 'recoil';

import useScreenType from '../../hooks/useScreenType';
import useSocket from '../../hooks/useSocket';
import ScreenType from '../../types/screen';
import { conditionalClassName } from '../../utils/style';

import DebugWrapper from './DebugWrapper';

const DebugObserver: React.FC = () => {
  const snapshot = useRecoilSnapshot();
  React.useEffect(() => {
    const stateChanges = Object.fromEntries(
      Array.from(snapshot.getNodes_UNSTABLE({ isModified: true }))
        .map((node) => [node.key, snapshot.getLoadable(node)]),
    );
    console.log('The following atoms were modified:\n', stateChanges);
  }, [snapshot]);

  return <></>;
};

const Debug: React.FC = () => {
  const screenType = useScreenType();

  const { connected } = useSocket('/');

  return (
    <DebugWrapper>
      <DebugObserver />
      <span className="bold text-blue-500">
        {connected ? 'Connected!' : 'Disconnected.'}
      </span>
      <br />
      {/* Tailwind screen prefix에 대한 workaround (이슈 #49 참조) */}
      <span
        className={conditionalClassName({
          desktop: 'text-blue-500',
          mobileLandscape: 'text-green-500',
          mobilePortrait: 'text-red-500',
        })(screenType)}
      >
        Screen type:
        {' '}
        {ScreenType[screenType]}
      </span>
    </DebugWrapper>
  );
};

export default Debug;
