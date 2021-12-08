import { ClassroomsHashPatchResponse, SocketClassroom } from '@team-10/lib';
import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import ClassroomChat from '../components/classroom/ClassroomChat';
import ClassroomInstructorButtons from '../components/classroom/ClassroomInstructorButtons';
import useScreenType from '../hooks/useScreenType';
import useSocket from '../hooks/useSocket';
import classroomsState from '../recoil/classrooms';
import mainClassroomHashState from '../recoil/mainClassroomHash';
import meState from '../recoil/me';
import ScreenType from '../types/screen';

interface Props {
  hash: string;
}

const Classroom: React.FC<Props> = ({ hash }) => {
  const [classroom, setClassroom] = useRecoilState(classroomsState.byHash(hash));
  const setMainClassroomHash = useSetRecoilState(mainClassroomHashState.atom);
  const meInfo = useRecoilValue(meState.info);
  const myId = useRecoilValue(meState.id);
  const screenType = useScreenType();

  const isInstructor = !!classroom && classroom.instructor!.stringId === myId;

  const { socket, connected } = useSocket<
  SocketClassroom.Events.Response, SocketClassroom.Events.Request
  >('/');

  React.useEffect(() => {
    if (meInfo && classroom) {
      setMainClassroomHash(hash);
    }
  }, [meInfo, classroom, hash]);

  React.useEffect(() => {
    if (!connected || !hash) return () => {};

    socket.emit('classroom/Join', { hash });

    const listener = (response: SocketClassroom.Response.Join) => {
      if (!!classroom && !isInstructor) {
        if (response.success) {
          setClassroom(response);
        }
      }
    };
    socket.once('classroom/Join', listener);

    return () => {
      socket.off('classroom/Join', listener);
    };
  }, [connected, hash]);

  return (
    meInfo && classroom ? (
      <>
        {screenType === ScreenType.MobilePortrait && (
          <div
            style={{
              top: 'calc(env(safe-area-inset-top, 0px) + 64px + 56.25vw)',
            }}
            className="absolute w-full p-4 flex justify-end"
          >
            <ClassroomInstructorButtons />
          </div>
        )}
        {screenType !== ScreenType.MobileLandscape && (
          <ClassroomChat isInstructor={isInstructor} dark={false} />
        )}
      </>
    ) : null
  );
};

export default Classroom;
