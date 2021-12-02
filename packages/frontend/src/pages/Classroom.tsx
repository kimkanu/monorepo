import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import Dialog from '../components/alert/Dialog';
import Button from '../components/buttons/Button';
import FeedChatBox from '../components/chat/FeedChatBox';
import MyChatBox from '../components/chat/MyChatBox';
import OthersChatBox from '../components/chat/OthersChatBox';
import ClassroomChat from '../components/classroom/ClassroomChat';
import VoiceChat from '../components/voice/VoiceChat';
import WaveVisualizer from '../components/voice/WaveVisualizer';
import useMainClassroom from '../hooks/useMainClassroom';
import useScreenType from '../hooks/useScreenType';
import classroomsState from '../recoil/classrooms';
import mainClassroomHashState from '../recoil/mainClassroomHash';
import meState from '../recoil/me';
import { ChatContent, ChatType, FeedType } from '../types/chat';
import ScreenType from '../types/screen';
import { clamp } from '../utils/math';
import { conditionalClassName, conditionalStyle } from '../utils/style';

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

  React.useEffect(() => {
    if (meInfo && classroom) {
      setMainClassroomHash(hash);
    }
  }, [meInfo, classroom, hash]);

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
            <Button
              type="primary"
              width="fit-content"
              height={36}
              text="Set Video"
              onClick={() => {
                if (!classroom) return;
                setClassroom((c) => ({
                  ...c,
                  video: {
                    type: 'single',
                    videoId: 'lIKmm-G7YVQ',
                  },
                }));
              }}
            />
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
