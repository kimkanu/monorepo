/* istanbul ignore file */

import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useSocket } from 'socket.io-react-hook';

import useScreenType from '../../hooks/useScreenType';
import classroomState from '../../recoil/classroom';
import loadingState from '../../recoil/loading';
import ScreenType from '../../types/screen';
import { conditionalClassName } from '../../utils/style';

import DebugWrapper from './DebugWrapper';

const Debug: React.FC = () => {
  const screenType = useScreenType();
  const [classroom, setClassroom] = useRecoilState(classroomState.atom);
  const setLoading = useSetRecoilState(loadingState.atom);

  const { connected } = useSocket(
    '/',
    process.env.NODE_ENV === 'production' || !process.env.REACT_APP_PROXY_URL
      ? undefined
      : {
        host: process.env.REACT_APP_PROXY_URL.replace(/https?:\/\//g, ''),
      },
  );

  return (
    <DebugWrapper>
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
      <br />
      <button
        type="button"
        onClick={() => {
          setLoading((l) => !l);
        }}
      >
        Toggle loading
      </button>
      <br />
      <button
        type="button"
        onClick={() => {
          setClassroom(classroom ? null : {
            hash: 'SAM-PEL-KAS',
            name: 'Sample Class',
            videoId: 'Zyi9QUB-fyo',
            isLive: true,
            isMine: true,
          });
        }}
      >
        {classroom ? 'End class' : 'Start class'}
      </button>
      {classroom ? (
        <button
          type="button"
          onClick={() => {
            setClassroom(classroom.hash === 'SAM-PEL-KAS' ? {
              hash: 'SAM-PEL-KAT',
              name: 'Sample Class 2',
              videoId: 'nYyddo_VXs8',
              isLive: true,
              isMine: false,
            } : {
              hash: 'SAM-PEL-KAS',
              name: 'Sample Class',
              videoId: 'Zyi9QUB-fyo',
              isLive: true,
              isMine: true,
            });
          }}
        >
          Change class
        </button>
      ) : null}
    </DebugWrapper>
  );
};

export default Debug;
