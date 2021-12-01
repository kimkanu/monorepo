/* istanbul ignore file */
import React from 'react';
import { useLocation } from 'react-router-dom';

import { useRecoilState, useRecoilValue } from 'recoil';

import classroomsState from '../../recoil/classrooms';
import YTPlayer from '../youtube/YTPlayer';
import YTPlayerControl from '../youtube/YTPlayerControl';
import YTSynchronizer from '../youtube/YTSynchronizer';
import YTWrapper from '../youtube/YTWrapper';

const YouTubeSyncTest: React.FC = () => {
  const classrooms = useRecoilValue(classroomsState.atom);
  const location = useLocation();

  return (
    <YTSynchronizer>
      {(onReady, onStateChange, isInstructor, duration, volume, setVolume) => (
        <YTWrapper
          isPresent={!!classrooms[0]?.video}
          inClassroom
          onClick={() => {
            if (classrooms[0]?.hash) {
              console.log('sync test');
            }
          }}
        >
          <YTPlayerControl
            isInstructor={isInstructor}
            videoId={classrooms[0]?.video?.videoId}
            duration={duration}
            volume={volume}
            setVolume={setVolume}
            onReady={onReady}
            onStateChange={onStateChange}
          />
        </YTWrapper>
      )}
    </YTSynchronizer>
  );
};

export default YouTubeSyncTest;
