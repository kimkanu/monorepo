import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import VoiceChat from '../components/voice/VoiceChat';
import WaveVisualizer from '../components/voice/WaveVisualizer';
import useMainClassroom from '../hooks/useMainClassroom';
import classroomsState from '../recoil/classrooms';
import mainClassroomHashState from '../recoil/mainClassroomHash';
import meState from '../recoil/me';
import { clamp } from '../utils/math';

interface Props {
  hash: string;
}

const Classroom: React.FC<Props> = ({ hash }) => {
  const classrooms = useRecoilValue(classroomsState.atom);
  const setMainClassroomHash = useSetRecoilState(mainClassroomHashState.atom);
  const mainClassroom = useMainClassroom();
  const me = useRecoilValue(meState.atom);
  const history = useHistory();
  const { voiceBuffer, audioContext } = useRecoilValue(voiceState.atom);

  const [amplitude, setAmplitude] = React.useState(0);
  const [frequency, setFrequency] = React.useState(200);

  const [amplitude, setAmplitude] = React.useState(0);
  const [frequency, setFrequency] = React.useState(200);

  React.useEffect(() => {
    if (me.loaded) {
      if (me.info) {
        const classroom = classrooms.find((c) => c.hash === hash);
        if (!classroom) {
          if (history.length > 0) {
            history.goBack();
          } else {
            history.replace('/');
          }
        } else {
          setMainClassroomHash(hash);
        }
      } else {
        history.replace(`/login?redirect_uri=/classrooms/${hash}`);
      }
    }
  }, [me, classrooms, hash]);

  return (
    <>
      {me.loaded && !!me.info && mainClassroom && (
        <>
          <VoiceChat
            userId={me.info.stringId}
            mainClassroom={mainClassroom}
            className="absolute z-layout-3 right-4"
            style={{
              bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
            }}
            onVoice={(amp, freq) => {
              setAmplitude(clamp(0, amp, 200));
              setFrequency(clamp(100, freq, 500));
            }}
          />
          <WaveVisualizer amplitude={amplitude} frequency={frequency} />
        </>
      )}
    </>
  );
};

export default Classroom;
