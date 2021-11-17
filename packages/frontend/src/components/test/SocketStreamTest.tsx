/* istanbul ignore file */
import { SocketVoice } from '@team-10/lib';
import useMediaRecorder from '@wmik/use-media-recorder';
import AudioRecorder from 'audio-recorder-polyfill';
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder';
import React from 'react';
import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import useSocket from '../../hooks/useSocket';
import toastState, { ToastType } from '../../recoil/toast';
import { arrayBufferToString, concatArrayBuffer } from '../../utils/arrayBuffer';
import { mergeClassNames } from '../../utils/style';
import VoiceBuffer from '../../utils/VoiceBuffer';

// XXX: Chrome의 MediaRecorder 성능이 FF보다 약간 안 좋은 것 같네요 왜인진 모르겠지만
const isOpusSupported = window.MediaRecorder
  && window.MediaRecorder.isTypeSupported('audio/webm;codecs=opus');
if (!isOpusSupported) {
  window.MediaRecorder = AudioRecorder;
  AudioRecorder.encoder = mpegEncoder;
  AudioRecorder.prototype.mimeType = 'audio/mpeg';
}

const SocketStreamTest: React.FC = () => {
  /* ********* *
   * Constants *
   * ********* */

  // MediaRecorder의 onDataAvailable에 들어갈 audio segment의 대략적 길이 (ms)
  const TIME_SLICE = 600;

  // Permission grant request를 얼마 주기로 날릴 건지 (한 번만 날리면 무시될 수도 있기 때문)
  const REQUESTING_PERMISSION_INTERVAL = 500;

  // WRONG_SEQUENCE_TIMEOUT
  const WRONG_SEQUENCE_TIMEOUT = 2 * TIME_SLICE;

  // TODO: replace this by global states
  const myStringId = 'naver:NzYgpUnFPklAHLIrLBw5ic7PvJy64SFpLmPiMWfz4Go';

  /* ****** *
   * Socket *
   * ****** */

  const { socket, connected } = useSocket<SocketVoice.Events.Response, SocketVoice.Events.Request>('/voice');

  /* ************* *
   * Global States *
   * ************* */

  const setToast = useSetRecoilState(toastState.new);

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
    sampleRate: 44100,
  }));
  const [voiceBuffer] = React.useState(new VoiceBuffer(audioContext));

  // onDataAvailable나 socket.io listener에서 internal state를 사용하기 위해
  // object로 감싸고 변할 때마다 업데이트 (필요하면)
  // setState는 쓸 수 있지만 state는 쓸 수 없고, 대신 stateWrapper.state를 사용해야 함
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
      if (stateWrapper.isSpeaking === 'speaking') {
        console.log(type);
        socket.emit('StreamSend', {
          classroomHash: 'BAL-BAT-KIP', // TODO
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
            console.log('failed to send stream: unauthorized! back to the main screen'); // TODO
          } else if (response.reason === SocketVoice.StreamSendDeniedReason.NOT_MEMBER) {
            console.log('failed to send stream: not a member! back to the main screen'); // TODO
          } else if (response.reason === SocketVoice.StreamSendDeniedReason.NOT_SPEAKER) {
            console.log('failed to send stream: NOT_SPEAKER! setSpeaking to none and empty audioTempData');
            setSpeaking('none');
          }
        });
      } else if (stateWrapper.isSpeaking === 'requesting') {
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

  const releaseButton = React.useCallback(() => {
    setButtonPressed(false);

    if (recorderStatus !== 'ready') {
      getMediaStream();
    }

    if (isSpeaking !== 'none') {
      socket.emit('StateChange', {
        classroomHash: 'BAL-BAT-KIP',
        speaking: false,
      });
      setSpeaking('none');
    }
  }, [socket, isSpeaking, recorderStatus]);

  const pressButton = React.useCallback(() => {
    setButtonPressed(true);

    if (isSpeaking !== 'none') return;

    socket.emit('StateChange', {
      classroomHash: 'BAL-BAT-KIP',
      speaking: true,
    });
    setRequestingPermissionInterval(
      setInterval(() => {
        socket.emit('StateChange', {
          classroomHash: 'BAL-BAT-KIP',
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

  // recorderStatus가 'failed'면 토스트 띄우기
  React.useEffect(() => {
    if (recorderStatus === 'failed') {
      setToast({
        type: ToastType.ERROR,
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
          setSpeakerId(myStringId);
        } else {
          setSpeaking('none');
          setSpeakerId(null);
          setButtonPressed(false);
          setToast({
            sentAt: new Date(),
            type: ToastType.ERROR,
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
      speaking, userId,
    }: SocketVoice.Broadcast.StateChange) => {
      setSpeakerId(speaking ? userId : null);
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

        voiceBuffer.appendVoices(indexedVoices.flatMap(([, voices]) => voices));

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

            voiceBuffer.appendVoices(indexedVoices.flatMap(([, voices]) => voices));

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
    <div className="flex justify-center items-center">
      <Link to="/api/auth/naver">로그인</Link>
      <br />
      isSpeaking:
      {' '}
      {isSpeaking}
      <br />
      recorderStatus:
      {' '}
      {recorderStatus}
      <br />
      isButtonPressed:
      {' '}
      {isButtonPressed ? 'pressed' : 'not pressed'}
      <button
        type="button"
        disabled={
          !!recorderError
          || ['acquiring_media', 'stopping', 'failed'].includes(recorderStatus)
          || (!isButtonPressed && !connected && speakerId !== null && speakerId !== myStringId)
        }
        className={mergeClassNames(
          'color-white disabled:bg-gray-500 select-none p-16 rounded-full',
          isButtonPressed ? 'bg-pink-700' : 'bg-pink-500',
        )}
        onMouseDown={pressButton}
        onTouchStart={pressButton}
        onMouseUp={releaseButton}
        onTouchEnd={releaseButton}
        onTouchCancel={releaseButton}
        onMouseLeave={releaseButton}
      >
        Speak!
      </button>
    </div>
  );
};

export default SocketStreamTest;
