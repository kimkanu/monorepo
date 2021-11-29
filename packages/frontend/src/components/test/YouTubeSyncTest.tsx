/* istanbul ignore file */
import React from 'react';
import { useLocation } from 'react-router-dom';

import { useRecoilState, useRecoilValue } from 'recoil';

import classroomsState from '../../recoil/classrooms';
import YTPlayer from '../youtube/YTPlayer';
import YTWrapper from '../youtube/YTWrapper';

const YouTubeSyncTest: React.FC = () => {
  const classrooms = useRecoilValue(classroomsState.atom);
  const location = useLocation();

  return (
    <YTWrapper
      isPresent
      inClassroom
      onClick={() => {
        if (classrooms[0]?.hash) {
          console.log('youtube click');
        }
      }}
    >
      <YTPlayer videoId="lIKmm-G7YVQ" />
    </YTWrapper>
  );
};

export default YouTubeSyncTest;
