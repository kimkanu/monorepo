import { SocketClassroom } from '@team-10/lib';
import React from 'react';
import { useSetRecoilState } from 'recoil';

import useSocket from '../../hooks/useSocket';
import classroomsState from '../../recoil/classrooms';

const ClassroomPatcher: React.FC = () => {
  const { socket } = useSocket<SocketClassroom.Events.Response, SocketClassroom.Events.Request>('/');
  const setClassrooms = useSetRecoilState(classroomsState.atom);

  React.useEffect(() => {
    const listener = ({ hash, patch }: SocketClassroom.Broadcast.Patch) => {
      setClassrooms((classrooms) => classrooms.map((classroom) => (classroom.hash === hash ? {
        ...classroom, ...patch,
      } : classroom)));
    };
    socket.on('classroom/PatchBroadcast', listener);

    return () => {
      socket.off('classroom/PatchBroadcast', listener);
    };
  }, [socket]);

  return null;
};

export default ClassroomPatcher;
