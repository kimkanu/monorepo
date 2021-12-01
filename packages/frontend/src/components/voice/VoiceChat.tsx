import { Speaker220Filled } from '@fluentui/react-icons';
import { ClassroomJSON, SocketVoice } from '@team-10/lib';
import useMediaRecorder from '@wmik/use-media-recorder';
import AudioRecorder from 'audio-recorder-polyfill';
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import useMainClassroom from '../../hooks/useMainClassroom';
import useScreenType from '../../hooks/useScreenType';
import useSocket from '../../hooks/useSocket';
import meState from '../../recoil/me';
import toastState from '../../recoil/toast';
import ScreenType from '../../types/screen';
import { concatArrayBuffer } from '../../utils/arrayBuffer';
import appHistory from '../../utils/history';
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
  voiceBuffer: VoiceBuffer | null;
  analyser: AnalyserNode | null;
  onVoice?: (amplitude: number, frequency: number) => void;
}

const VoiceChat: React.FC<Styled<Props>> = ({
  voiceBuffer, analyser, onVoice, style, className,
}) => {
  const classroom = useMainClassroom();
  const meInfo = useRecoilValue(meState.info);
  const userId = meInfo?.stringId ?? null;

  /* ********* *
   * Constants *
   * ********* */

  // MediaRecorder의 onDataAvailable에 들어갈 audio segment의 대략적 길이 (ms)
  const TIME_SLICE = 600;

  // Permission grant request를 얼마 주기로 날릴 건지 (한 번만 날리면 무시될 수도 있기 때문)
  const REQUESTING_PERMISSION_INTERVAL = 500;

  // WRONG_SEQUENCE_TIMEOUT
  const WRONG_SEQUENCE_TIMEOUT = 2 * TIME_SLICE;

  /* ****** *
   * Socket *
   * ****** */

  const { socket, connected } = useSocket<SocketVoice.Events.Response, SocketVoice.Events.Request>('/');

  /* ******* *
   * Routing *
   * ******* */

  const history = useHistory();
  const redirectTo = (path: string) => appHistory.push(path, history);

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
  const isSpeaking = React.useRef<Speaking>('none');

  // 현재 speaker의 stringId
  const [speakerId, setSpeakerId] = React.useState<string | null>(null);

  // 말하고 있을 때 StreamSend로 보낼 sequence index
  const sequenceIndex = React.useRef<number>(0);

  // 기다리는 response의 sequence index
  const nextSequenceIndex = React.useRef<number>(0);

  // 잘못된 sequence index를 바로잡기 위해 임시 저장되는 audio data
  const voicesRequestingPermission = React.useRef<SocketVoice.Voice[]>([]);

  // 잘못된 sequence index를 바로잡기 위해 임시 저장되는 audio data
  const voicesWrongSequenceIndex = React.useRef<Map<number, SocketVoice.Voice[]>>(new Map());

  // 잘못된 sequence index를 바로잡기 위해 사용되는 timeout
  const timeoutsWrongSequenceIndex = React.useRef(
    new Map<number, ReturnType<typeof setTimeout>>(),
  );

  // Permission request가 무시됐을 때를 대비해 여러 번 보내는 interval
  const [
    requestingPermissionInterval, setRequestingPermissionInterval,
  ] = React.useState<ReturnType<typeof setInterval> | null>(null);

  const bufferLength = analyser?.frequencyBinCount ?? 0;
  const dataArray = React.useRef(new Uint8Array(bufferLength));

  const requestRef = React.useRef<number>();

  function argMax(array: number[]): number {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  const animate = () => {
    if (!analyser) return;

    analyser.getByteFrequencyData(dataArray.current);
    const array = Array.from(dataArray.current);
    if (onVoice && array.length > 0) {
      // Heuristically chosen amplitude & frequency maps
      onVoice(sum(array) / 25, argMax(array) * 10 + 100);
      console.log('onVoice', Date.now());
    }
    setTimeout(() => {
      requestRef.current = requestAnimationFrame(animate);
    }, TIME_SLICE);
  };

  React.useEffect(() => {
    if (analyser) {
      requestRef.current = requestAnimationFrame(animate);
      dataArray.current = new Uint8Array(analyser.frequencyBinCount);
    }
    return () => {
      if (typeof requestRef.current !== 'undefined') {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [!!analyser]);

  /* ****************** *
   * Media Recorder API *
   * ****************** */

  const onDataAvailable = (data: Blob) => {
    if (!data.size) return;
    if (!classroom) return;

    // 브라우저의 Media Recorder의 output type은 바뀌지 않음
    const type: SocketVoice.Voice['type'] | null = data.type.includes('opus')
      ? 'opus'
      : data.type.includes('mpeg')
        ? 'mpeg'
        : null;
    if (!type) return; // Not supported

    data.arrayBuffer().then((buffer) => {
      if (isSpeaking.current !== 'requesting') {
        socket.emit('voice/StreamSend', {
          hash: classroom.hash, // TODO
          voices: type === 'opus'
            ? [
              {
                type,
                buffer: concatArrayBuffer([
                  ...voicesRequestingPermission.current.map(({ buffer: b }) => b),
                  buffer,
                ]),
              },
            ]
            : [
              ...voicesRequestingPermission.current,
              { type, buffer },
            ],
          sequenceIndex: sequenceIndex.current,
        });
        voicesRequestingPermission.current = [];
        sequenceIndex.current += 1;

        socket.once('voice/StreamSend', (response) => {
          if (response.success) return;

          if (response.reason === SocketVoice.StreamSendDeniedReason.UNAUTHORIZED) {
            addToast({
              type: 'error',
              sentAt: new Date(),
              message: '먼저 로그인 해주세요.',
            });
            redirectTo('/login');
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
            isSpeaking.current = 'none';
          }
        });
      } else {
        voicesRequestingPermission.current.push({ type, buffer });
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
    if (!classroom) return;

    setButtonPressed(false);
    console.log('released!');

    if (recorderStatus !== 'ready') {
      getMediaStream();
    }

    if (isSpeaking.current !== 'none') {
      socket.emit('voice/StateChange', {
        hash: classroom.hash,
        speaking: false,
      });
      setTimeout(() => {
        isSpeaking.current = 'none';
      }, 2000);
    }
  }, [classroom, socket, recorderStatus]);

  const pressButton = React.useCallback(() => {
    if (!classroom) return;

    setButtonPressed(true);

    console.log('pressed!');

    if (isSpeaking.current !== 'none') return;

    socket.emit('voice/StateChange', {
      hash: classroom.hash,
      speaking: true,
    });
    setRequestingPermissionInterval(
      setInterval(() => {
        socket.emit('voice/StateChange', {
          hash: classroom.hash,
          speaking: true,
        });
      }, REQUESTING_PERMISSION_INTERVAL),
    );
    isSpeaking.current = 'requesting';
  }, [classroom, socket]);

  /* ******* *
   * Effects *
   * ******* */

  // 처음 component가 mount될 때 media recorder의 권한 요청
  React.useEffect(() => {
    getMediaStream();
  }, []);

  // recorderStatus가 'acquiring_media'면 `releaseButton(); voiceBuffer.reset()` 실행
  React.useEffect(() => {
    if (!voiceBuffer) return;
    if (recorderStatus === 'acquiring_media') {
      releaseButton();
      voiceBuffer.reset();
    }
  }, [voiceBuffer, recorderStatus]);

  React.useEffect(() => {
    if (!voiceBuffer) return;
    voiceBuffer.reset();
  }, [voiceBuffer]);

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
    const listener: SocketVoice.Events.Response['voice/StateChange'] = (response) => {
      if (isSpeaking.current === 'requesting') {
        if (response.success) {
          isSpeaking.current = 'speaking';
          setSpeakerId(userId);
        } else {
          setTimeout(() => {
            isSpeaking.current = 'none';
          }, 700);
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

    socket.on('voice/StateChange', listener);

    return () => {
      socket.off('voice/StateChange', listener);
    };
  }, [socket]);

  // isSpeaking이 speaking이 아니면 sequence index를 0으로 설정하기
  React.useEffect(() => {
    if (isSpeaking.current !== 'speaking') {
      sequenceIndex.current = 0;
    }
  }, [isSpeaking.current]);

  // StateChange 요청 성공이나 실패 시 `requestingPermissionInterval` 비우기
  React.useEffect(() => {
    if (isSpeaking.current !== 'requesting' && requestingPermissionInterval) {
      clearInterval(requestingPermissionInterval);
      setRequestingPermissionInterval(null);
    }
    return () => {
      if (requestingPermissionInterval) {
        clearInterval(requestingPermissionInterval);
      }
    };
  }, [isSpeaking.current]);

  // StateChangeBroadcast listener
  React.useEffect(() => {
    if (!voiceBuffer) return;

    socket.on('voice/StateChangeBroadcast', ({
      speaking, userId: id,
    }: SocketVoice.Broadcast.StateChange) => {
      if (speakerId !== (speaking ? id : null)) {
        setSpeakerId(speaking ? id : null);
        nextSequenceIndex.current = 0;
      }

      voiceBuffer.reset();
    });
  }, [voiceBuffer, socket]);

  // StreamReceiveBroadcast listener
  React.useEffect(() => {
    if (!voiceBuffer || !analyser) return () => {};

    const listener: SocketVoice.Events.Response['voice/StreamReceiveBroadcast'] = async (response) => {
      if (!classroom) return;

      // 정상적인 상황
      if (nextSequenceIndex.current === response.sequenceIndex) {
        console.log('correct; response.voices', response.voices);
        // eslint-disable-next-line no-restricted-syntax
        const indexedVoices: [number, SocketVoice.Voice[]][] = [
          [response.sequenceIndex, response.voices],
          ...voicesWrongSequenceIndex.current.entries(),
        ];
        indexedVoices.sort(([a], [b]) => a - b);

        voiceBuffer
          .appendVoices(indexedVoices.flatMap(([, voices]) => voices))
          .then((voiceNodes) => {
            voiceNodes.forEach((source) => source.connect(analyser));
          });

        nextSequenceIndex.current = Math.max(
          nextSequenceIndex.current,
          indexedVoices.slice(-1)[0][0],
        ) + 1;
        console.log('nextSequenceIndex.current changed to', nextSequenceIndex.current);
        timeoutsWrongSequenceIndex.current.forEach(clearTimeout);
        timeoutsWrongSequenceIndex.current = new Map();
        voicesWrongSequenceIndex.current = new Map();

        return;
      }

      // 나중에 보낸 요청이 시간 안에 먼저 도착한 상황
      if (nextSequenceIndex.current < response.sequenceIndex) {
        voicesWrongSequenceIndex.current.set(
          response.sequenceIndex,
          response.voices,
        );
        console.log('wrong', nextSequenceIndex.current, response.sequenceIndex);
        console.log('wrong; response.voices', response.voices);
        timeoutsWrongSequenceIndex.current.set(
          response.sequenceIndex,
          setTimeout(() => {
            const indexedVoices: [number, SocketVoice.Voice[]][] = Array.from(
              voicesWrongSequenceIndex.current.entries(),
            );
            indexedVoices.sort(([a], [b]) => a - b);

            voiceBuffer
              .appendVoices(indexedVoices.flatMap(([, voices]) => voices))
              .then((voiceNodes) => {
                voiceNodes.forEach((source) => source.connect(analyser));
              });

            nextSequenceIndex.current = Math.max(
              nextSequenceIndex.current,
              indexedVoices.slice(-1)[0][0],
            ) + 1;
            console.log('nextSequenceIndex.current changed to', nextSequenceIndex.current);
            timeoutsWrongSequenceIndex.current.forEach(clearTimeout);
            timeoutsWrongSequenceIndex.current = new Map();
            voicesWrongSequenceIndex.current = new Map();
          }, WRONG_SEQUENCE_TIMEOUT),
        );
      }
    };

    socket.on('voice/StreamReceiveBroadcast', listener);

    return () => {
      socket.off('voice/StreamReceiveBroadcast', listener);
    };
  }, [voiceBuffer, analyser, socket, classroom]);

  return (
    <Button
      type="primary"
      width="fit-content"
      disabled={
        !!recorderError
        || !classroom
        || !userId
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
