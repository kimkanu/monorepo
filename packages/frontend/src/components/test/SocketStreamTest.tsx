/* istanbul ignore file */
import {
  SocketVoiceStateChangeBroadcastResponse,
  SocketVoiceStateChangeRequest,
  SocketVoiceStateChangeResponse,
  SocketVoiceStreamReceiveResponse,
  SocketVoiceStreamSendRequest,
} from '@team-10/lib';
import useMediaRecorder from '@wmik/use-media-recorder';
import React from 'react';
import { useSocket } from 'socket.io-react-hook';

// TODO: 상태 관리 조금 더 자세히 나누고 모두 state로 관리하기
const SocketStreamTest: React.FC = () => {
  const TIME_SLICE = 150;
  const DELAY_SET_PAUSED = 50;

  // internal states
  const [mediaSource] = React.useState(new MediaSource());
  const [objectURL] = React.useState(URL.createObjectURL(mediaSource));
  const [requestId, setRequestId] = React.useState(0);
  const [isButtonPressed, setButtonPressed] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [sourceBuffer, setSourceBuffer] = React.useState<SourceBuffer | null>(null);
  const [audioSegmentQueue] = React.useState<ArrayBuffer[]>([]);

  const [audioPaused, setAudioPaused] = React.useState(true);

  // add source buffer when media source is ready
  React.useEffect(() => {
    if (mediaSource.readyState === 'open' && mediaSource.sourceBuffers.length === 0) {
      mediaSource.addSourceBuffer('audio/webm; codecs=opus');
    }
  }, [mediaSource.readyState]);

  // store the sourcebuffer
  React.useEffect(() => {
    if (mediaSource.sourceBuffers.length > 0) {
      const srcBuffer = mediaSource.sourceBuffers[0];
      setSourceBuffer(srcBuffer);
      srcBuffer.onupdate = () => {
        console.log('onupdate', Date.now());
      };
      srcBuffer.onupdateend = () => {
        console.log('onupdateend', Date.now());
        // if (!srcBuffer.updating && audioSegmentQueue.length > 0) {
        //   const q = audioSegmentQueue.shift()!;
        //   srcBuffer.appendBuffer(q);
        //   console.log(audioSegmentQueue.length);
        // }
      };
    }
  }, [mediaSource.sourceBuffers.length]);

  // socket connection
  const { socket, connected } = useSocket(
    '/',
    process.env.NODE_ENV === 'production' || !process.env.REACT_APP_PROXY_URL
      ? undefined
      : {
        host: process.env.REACT_APP_PROXY_URL.replace(/https?:\/\//g, ''),
      },
  );

  // const onDataAvailable = (data: Blob) => {
  //   if (mediaSource.sourceBuffers.length > 0) {
  //     const sourceBuffer = mediaSource.sourceBuffers[0];
  //     data.arrayBuffer().then((buffer) => sourceBuffer.appendBuffer(buffer));
  //   }
  // };

  socket.on('VoiceStreamReceive', ({ audioSegment }: SocketVoiceStreamReceiveResponse) => {
    if (sourceBuffer) {
      if (sourceBuffer.updating) {
        audioSegmentQueue.push(audioSegment);
      } else {
        try {
          sourceBuffer.appendBuffer(audioSegment);
        } catch (e) {
          audioSegmentQueue.unshift(audioSegment);
        }
      }
    }
  });

  socket.on('VoiceStateChangeBroadcast', ({
    speaking,
  }: SocketVoiceStateChangeBroadcastResponse) => {
    if (!audioRef.current) return;

    if (speaking) {
      audioRef.current.play();
      setAudioPaused(false);
    } else {
      if (mediaSource.sourceBuffers.length > 0 && mediaSource.readyState === 'open' && !mediaSource.sourceBuffers[0].updating) {
        mediaSource.sourceBuffers[0].remove(0, 99999);
      }
      setTimeout(() => {
        console.log('speaking', speaking, 'current', audioRef.current);
        if (!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setTimeout(() => {
          setAudioPaused(true);
        }, DELAY_SET_PAUSED);
      }, 10);
    }
  });

  const onDataAvailable = (data: Blob) => {
    data.arrayBuffer().then((audioSegment) => {
      console.log('ava', audioSegment);
      socket.emit('VoiceStreamSend', {
        classHash: 'SAM-PLE-CLS',
        audioSegment,
        requestId,
      } as SocketVoiceStreamSendRequest);
      setRequestId((r) => r + 1);
    });
  };

  const {
    error, status, startRecording, pauseRecording, resumeRecording, stopRecording, isAudioMuted,
  } = useMediaRecorder({
    onDataAvailable,
    mediaStreamConstraints: { audio: true },
    mediaRecorderOptions: { mimeType: 'video/webm; codecs=opus' },
  });

  React.useEffect(() => {
    if (isButtonPressed) {
      startRecording(TIME_SLICE);
      socket.emit('VoiceStateChange', {
        classHash: 'SAM-PLE-CLS',
        requestId,
        speaking: true,
      } as SocketVoiceStateChangeRequest);
      setRequestId((r) => r + 1);
    } else {
      stopRecording();
      socket.emit('VoiceStateChange', {
        classHash: 'SAM-PLE-CLS',
        requestId,
        speaking: false,
      } as SocketVoiceStateChangeRequest);
      setRequestId((r) => r + 1);
    }
  }, [isButtonPressed]);

  return (
    <>
      {error ? `${status} ${error.message}` : status}
      <br />

      {/* eslint-disable-next-line no-nested-ternary */}
      {audioPaused ? 'paused' : 'not paused'}

      <br />

      {isAudioMuted ? 'isAudioMuted' : 'not isAudioMuted'}

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={objectURL} autoPlay controls />
      <br />

      <button
        type="button"
        disabled={
          mediaSource.sourceBuffers.length === 0
          || (!isButtonPressed && !audioPaused)
        }
        className="color-white bg-pink-500 disabled:bg-gray-500"
        onMouseDown={() => {
          if (audioRef.current && audioRef.current.paused) {
            setButtonPressed(true);
          }
        }}
        onMouseUp={() => {
          setButtonPressed(false);
        }}
      >
        Speak!
      </button>
    </>
  );
};

export default SocketStreamTest;
