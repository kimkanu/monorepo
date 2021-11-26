import { Speaker220Filled } from '@fluentui/react-icons';
import { ClassroomJSON, SocketVoice } from '@team-10/lib';
import useMediaRecorder from '@wmik/use-media-recorder';
import AudioRecorder from 'audio-recorder-polyfill';
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import useScreenType from '../../hooks/useScreenType';
import useSocket from '../../hooks/useSocket';
import toastState from '../../recoil/toast';
import ScreenType from '../../types/screen';
import { concatArrayBuffer } from '../../utils/arrayBuffer';
import { sum } from '../../utils/math';
import { Styled } from '../../utils/style';
import VoiceBuffer from '../../utils/VoiceBuffer';
import Button from '../buttons/Button';

const isOpusSupported = window.MediaRecorder
  && window.MediaRecorder.isTypeSupported('audio/webm;codecs=opus');
if (!isOpusSupported) {
  window.MediaRecorder = AudioRecorder;
  AudioRecorder.encoder = mpegEncoder;
  AudioRecorder.prototype.mimeType = 'audio/mpeg';
}

interface Props {
  userId: string;
  mainClassroom: ClassroomJSON;
  onVoice?: (amplitude: number, frequency: number) => void;
}

const VoiceChat: React.FC<Styled<Props>> = ({
  style, className, userId, mainClassroom, onVoice,
}) => {
  /* ********* *
   * Constants *
   * ********* */

  // MediaRecorder의 onDataAvailable에 들어갈 audio segment의 대략적 길이 (ms)
  const TIME_SLICE = 1000;

  // Permission grant request를 얼마 주기로 날릴 건지 (한 번만 날리면 무시될 수도 있기 때문)
  const REQUESTING_PERMISSION_INTERVAL = 500;

  // WRONG_SEQUENCE_TIMEOUT
  const WRONG_SEQUENCE_TIMEOUT = 10 * TIME_SLICE;

  /* ****** *
   * Socket *
   * ****** */

  const { socket, connected } = useSocket<SocketVoice.Events.Response, SocketVoice.Events.Request>('/voice');

  /* ******* *
   * Routing *
   * ******* */

  const history = useHistory();
  const redirectTo = (path: string) => history.push(path);

  /* ************* *
   * Global States *
   * ************* */

  const addToast = useSetRecoilState(toastState.new);
  const screenType = useScreenType();
  const isDesktop = screenType === ScreenType.Desktop;

  /* ************ *
   * Local States *
   * ************ */

  // Button이 눌려 있는지
  const [isButtonPressed, setButtonPressed] = React.useState(false);

  // Speaker인지 아닌지, 또는 요청 중인지
  type Speaking = 'speaking' | 'requesting' | 'none';
  const [isSpeaking, setSpeaking] = React.useState<Speaking>('none');

  // 현재 speaker의 stringId
  const [speakerId, setSpeakerId] = React.useState<string | null>(null);

  // 말하고 있을 때 StreamSend로 보낼 sequence index
  const [sequenceIndex] = React.useState<number>(0);

  // 기다리는 response의 sequence index
  const [nextSequenceIndex, setNextSequenceIndex] = React.useState<number>(0);

  // 잘못된 sequence index를 바로잡기 위해 임시 저장되는 audio data
  const [voicesRequestingPermission] = React.useState<SocketVoice.Voice[]>([]);

  // 잘못된 sequence index를 바로잡기 위해 임시 저장되는 audio data
  const [
    voicesWrongSequenceIndex,
    setAudioChunksWrongSequenceIndex,
  ] = React.useState<Map<number, SocketVoice.Voice[]>>(new Map());

  // 잘못된 sequence index를 바로잡기 위해 사용되는 timeout
  const [
    timeoutsWrongSequenceIndex,
    setTimeoutsWrongSequenceIndex,
  ] = React.useState<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  // Permission request가 무시됐을 때를 대비해 여러 번 보내는 interval
  const [
    requestingPermissionInterval, setRequestingPermissionInterval,
  ] = React.useState<ReturnType<typeof setInterval> | null>(null);

  const [audioContext] = React.useState(new AudioContext({
    latencyHint: 'interactive',
    sampleRate: 4000,
  }));
  const [voiceBuffer] = React.useState(new VoiceBuffer(audioContext));
  const analyser = React.useRef(audioContext.createAnalyser());
  analyser.current.fftSize = 256;
  analyser.current.connect(audioContext.destination);
  const bufferLength = analyser.current.frequencyBinCount;
  const dataArray = React.useRef(new Uint8Array(bufferLength));

  const requestRef = React.useRef<number>();

  function argMax(array: number[]): number {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  const animate = () => {
    analyser.current.getByteFrequencyData(dataArray.current);
    const array = Array.from(dataArray.current);
    if (onVoice) {
      // Heuristically chosen amplitude & frequency maps
      onVoice(sum(array) / 100, argMax(array) * 10 + 100);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (typeof requestRef.current !== 'undefined') {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // onDataAvailable나 socket.io listener에서 internal state를 사용하기 위해
  // object로 감싸고 변할 때마다 업데이트 (필요하면)
  // setState는 쓸 수 있지만 state는 쓸 수 없고, 대신 stateWrapper.state를 사용해야 함
  // FIXME?: useRef 이용해서 고치기
  type WrappedState = {
    isSpeaking: typeof isSpeaking;
    sequenceIndex: typeof sequenceIndex;
    voicesRequestingPermission: typeof voicesRequestingPermission;
    voicesWrongSequenceIndex: typeof voicesWrongSequenceIndex;
    nextSequenceIndex: typeof nextSequenceIndex;
    timeoutsWrongSequenceIndex: typeof timeoutsWrongSequenceIndex;
  };
  const [stateWrapper] = React.useState<WrappedState>({
    isSpeaking,
    sequenceIndex,
    voicesRequestingPermission,
    voicesWrongSequenceIndex,
    nextSequenceIndex,
    timeoutsWrongSequenceIndex,
  });
  // stateWrapper를 업데이트하는 side effect
  React.useEffect(() => {
    stateWrapper.isSpeaking = isSpeaking;
    stateWrapper.voicesWrongSequenceIndex = voicesWrongSequenceIndex;
    stateWrapper.nextSequenceIndex = nextSequenceIndex;
    stateWrapper.timeoutsWrongSequenceIndex = timeoutsWrongSequenceIndex;
  }, [
    isSpeaking,
    voicesWrongSequenceIndex,
    nextSequenceIndex,
    timeoutsWrongSequenceIndex,
  ]);

  /* ****************** *
   * Media Recorder API *
   * ****************** */

  const onDataAvailable = (data: Blob) => {
    if (!data.size) return;

    // 브라우저의 Media Recorder의 output type은 바뀌지 않음
    const type: SocketVoice.Voice['type'] | null = data.type.includes('opus')
      ? 'opus'
      : data.type.includes('mpeg')
        ? 'mpeg'
        : null;
    if (!type) return; // Not supported

    data.arrayBuffer().then((buffer) => {
      if (stateWrapper.isSpeaking !== 'requesting') {
        socket.emit('StreamSend', {
          classroomHash: mainClassroom.hash, // TODO
          voices: type === 'opus'
            ? [
              {
                type,
                buffer: concatArrayBuffer([
                  ...stateWrapper.voicesRequestingPermission.map(({ buffer: b }) => b),
                  buffer,
                ]),
              },
            ]
            : [
              ...stateWrapper.voicesRequestingPermission,
              { type, buffer },
            ],
          sequenceIndex: stateWrapper.sequenceIndex,
        });
        stateWrapper.voicesRequestingPermission = [];
        stateWrapper.sequenceIndex += 1;

        socket.once('StreamSend', (response) => {
          if (response.success) return;

          if (response.reason === SocketVoice.StreamSendDeniedReason.UNAUTHORIZED) {
            addToast({
              type: 'error',
              sentAt: new Date(),
              message: '먼저 로그인 해주세요.',
            });
            redirectTo('/login');
            console.log('failed to send stream: unauthorized! back to the main screen'); // TODO
          } else if (response.reason === SocketVoice.StreamSendDeniedReason.NOT_MEMBER) {
            addToast({
              type: 'error',
              sentAt: new Date(),
              message: '먼저 수업에 참가해야 합니다.',
            });
            redirectTo('/');
          } else if (response.reason === SocketVoice.StreamSendDeniedReason.NOT_SPEAKER) {
            addToast({
              type: 'error',
              sentAt: new Date(),
              message: '현재 누군가 말하고 있습니다.',
            });
            setSpeaking('none');
          }
        });
      } else {
        stateWrapper.voicesRequestingPermission.push({ type, buffer });
      }
    });
  };

  const {
    error: recorderError,
    status: recorderStatus,
    startRecording,
    stopRecording,
    getMediaStream,
  } = useMediaRecorder({
    onDataAvailable,
    mediaStreamConstraints: { audio: true },
    mediaRecorderOptions: {
      mimeType: isOpusSupported ? 'audio/webm;codecs=opus' : 'audio/mpeg',
      audioBitsPerSecond: 8000,
    },
  });

  /* *********************** *
   * Button onClick handlers *
   * *********************** */

  // eslint-disable-next-line consistent-return
  const releaseButton = React.useCallback(() => {
    setButtonPressed(false);

    if (recorderStatus !== 'ready') {
      getMediaStream();
    }

    if (isSpeaking !== 'none') {
      socket.emit('StateChange', {
        classroomHash: mainClassroom.hash,
        speaking: false,
      });
      setTimeout(() => {
        setSpeaking('none');
      }, 2000);
    }
  }, [socket, isSpeaking, recorderStatus]);

  const pressButton = React.useCallback(() => {
    setButtonPressed(true);

    if (isSpeaking !== 'none') return;

    socket.emit('StateChange', {
      classroomHash: mainClassroom.hash,
      speaking: true,
    });
    setRequestingPermissionInterval(
      setInterval(() => {
        socket.emit('StateChange', {
          classroomHash: mainClassroom.hash,
          speaking: true,
        });
      }, REQUESTING_PERMISSION_INTERVAL),
    );
    setSpeaking('requesting');
  }, [socket, isSpeaking]);

  /* ******* *
   * Effects *
   * ******* */

  // 처음 component가 mount될 때 media recorder의 권한 요청
  React.useEffect(() => {
    getMediaStream();
  }, []);

  // recorderStatus가 'acquiring_media'면 `releaseButton(); voiceBuffer.reset()` 실행
  React.useEffect(() => {
    if (recorderStatus === 'acquiring_media') {
      releaseButton();
      voiceBuffer.reset();
    }
  }, [recorderStatus]);
  React.useEffect(() => {
    voiceBuffer.reset();
  }, [speakerId]);

  // recorderStatus가 'failed'면 토스트 띄우기
  React.useEffect(() => {
    if (recorderStatus === 'failed') {
      addToast({
        type: 'error',
        message: '마이크 사용 권한을 얻는 데에 실패했습니다! 마이크 사용 권한을 허용해 주세요.',
        sentAt: new Date(),
      });
    }
  }, [recorderStatus]);

  // 버튼이 눌리면 recording 시작하고, release 되면 recording 중지하기
  React.useEffect(() => {
    if (isButtonPressed) {
      startRecording(TIME_SLICE);
    } else {
      stopRecording();
    }
  }, [isButtonPressed]);

  // 컴포넌트 unmount 시 timeoutsWrongSequenceIndex 비우기
  React.useEffect(() => () => {
    Object.values(timeoutsWrongSequenceIndex).forEach(clearTimeout);
  }, []);

  // socket이 보낸 StateChange 요청에 대한 응답 listen하기
  React.useEffect(() => {
    const listener: SocketVoice.Events.Response['StateChange'] = (response) => {
      if (isSpeaking === 'requesting') {
        if (response.success) {
          setSpeaking('speaking');
          setSpeakerId(userId);
        } else {
          setTimeout(() => {
            setSpeaking('none');
          }, 1000);
          setSpeakerId(null);
          setButtonPressed(false);
          addToast({
            sentAt: new Date(),
            type: 'error',
            message: `음성 채팅 권한을 얻는 데에 실패했습니다. ${
              SocketVoice.permissionDeniedReasonAsMessage(response.reason)
            }`,
          });
        }
      }
    };

    socket.on('StateChange', listener);

    return () => {
      socket.off('StateChange', listener);
    };
  }, [socket, isSpeaking]);

  // isSpeaking이 speaking이 아니면 sequence index를 0으로 설정하기
  React.useEffect(() => {
    if (isSpeaking !== 'speaking') {
      stateWrapper.sequenceIndex = 0;
    }
  }, [isSpeaking]);

  // StateChange 요청 성공이나 실패 시 `requestingPermissionInterval` 비우기
  React.useEffect(() => {
    if (isSpeaking !== 'requesting' && requestingPermissionInterval) {
      clearInterval(requestingPermissionInterval);
      setRequestingPermissionInterval(null);
    }
    return () => {
      if (requestingPermissionInterval) {
        clearInterval(requestingPermissionInterval);
      }
    };
  }, [isSpeaking]);

  // StateChangeBroadcast listener
  React.useEffect(() => {
    socket.on('StateChangeBroadcast', ({
      speaking, userId: id,
    }: SocketVoice.Broadcast.StateChange) => {
      setSpeakerId(speaking ? id : null);
      setNextSequenceIndex(0);

      voiceBuffer.reset();
    });
  }, [socket]);

  // StreamReceiveBroadcast listener
  React.useEffect(() => {
    const listener: SocketVoice.Events.Response['StreamReceiveBroadcast'] = async (response) => {
      // 정상적인 상황
      if (stateWrapper.nextSequenceIndex === response.sequenceIndex) {
        // eslint-disable-next-line no-restricted-syntax
        const indexedVoices: [number, SocketVoice.Voice[]][] = [
          [response.sequenceIndex, response.voices],
          ...stateWrapper.voicesWrongSequenceIndex.entries(),
        ];
        indexedVoices.sort(([a], [b]) => a - b);

        voiceBuffer
          .appendVoices(indexedVoices.flatMap(([, voices]) => voices))
          .then((voiceNodes) => {
            voiceNodes.forEach((source) => source.connect(analyser.current));
          });

        setNextSequenceIndex(indexedVoices.slice(-1)[0][0] + 1);
        stateWrapper.timeoutsWrongSequenceIndex.forEach(clearTimeout);
        setTimeoutsWrongSequenceIndex(new Map());
        setAudioChunksWrongSequenceIndex(new Map());

        return;
      }

      // 나중에 보낸 요청이 시간 안에 먼저 도착한 상황
      if (stateWrapper.nextSequenceIndex < response.sequenceIndex) {
        stateWrapper.voicesWrongSequenceIndex.set(
          response.sequenceIndex,
          response.voices,
        );
        stateWrapper.timeoutsWrongSequenceIndex.set(
          response.sequenceIndex,
          setTimeout(() => {
            const indexedVoices: [number, SocketVoice.Voice[]][] = Array.from(
              stateWrapper.voicesWrongSequenceIndex.entries(),
            );
            indexedVoices.sort(([a], [b]) => a - b);

            voiceBuffer
              .appendVoices(indexedVoices.flatMap(([, voices]) => voices))
              .then((voiceNodes) => {
                voiceNodes.forEach((source) => source.connect(analyser.current));
              });

            setNextSequenceIndex(indexedVoices.slice(-1)[0][0] + 1);
            stateWrapper.timeoutsWrongSequenceIndex.forEach(clearTimeout);
            setTimeoutsWrongSequenceIndex(new Map());
            setAudioChunksWrongSequenceIndex(new Map());
          }, WRONG_SEQUENCE_TIMEOUT),
        );
      }
    };

    socket.on('StreamReceiveBroadcast', listener);

    return () => {
      socket.off('StreamReceiveBroadcast', listener);
    };
  }, [socket]);

  return (
    <Button
      type="primary"
      width="fit-content"
      disabled={
        !!recorderError
        || ['acquiring_media', 'stopping', 'failed'].includes(recorderStatus)
        || (!isButtonPressed && !connected && speakerId !== null && speakerId !== userId)
      }
      icon={<Speaker220Filled />}
      style={style}
      className={className}
      text={isDesktop ? '말하기' : undefined}
      filled
      onMouseDown={pressButton}
      onTouchStart={pressButton}
      onMouseUp={releaseButton}
      onTouchEnd={releaseButton}
      onTouchCancel={releaseButton}
      onMouseLeave={releaseButton}
    />
  );
};

export default VoiceChat;
