/* eslint-disable no-console */
/* istanbul ignore file */
import React from 'react';

import { useRecoilValue } from 'recoil';

import classroomsState from '../../recoil/classrooms';
import YTWrapper from '../youtube/YTWrapper';

const YouTubeSyncStudentTest: React.FC = () => {
  const classrooms = useRecoilValue(classroomsState.atom);

  return (
    <YTWrapper
      isPresent
      inClassroom
      onClick={() => {
        if (classrooms[0]?.hash) {
          console.log('youtube click');
        }
      }}
    />
  );
};

export default YouTubeSyncStudentTest;
