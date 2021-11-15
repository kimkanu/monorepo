/* istanbul ignore file */
import { SocketVoice } from '@team-10/lib';
import useMediaRecorder from '@wmik/use-media-recorder';
import React from 'react';
import { useSetRecoilState } from 'recoil';

import useSocket from '../../hooks/useSocket';
import { randomInt } from '../../utils/math';

interface Props {
  queue: ArrayBuffer[];
}

const AudioPlayer: React.FC<Props> = ({ queue }) => {
  const [mediaSource] = React.useState(new MediaSource());
  const [objectURL] = React.useState(URL.createObjectURL(mediaSource));
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [sourceBuffer, setSourceBuffer] = React.useState<SourceBuffer | null>(null);
  const [internalQueue, setInternalQueue] = React.useState<ArrayBuffer[]>([]);

  // add source buffer when media source is ready
  React.useEffect(() => {
    if (mediaSource.readyState === 'open' && mediaSource.sourceBuffers.length === 0) {
      setSourceBuffer(mediaSource.addSourceBuffer('audio/webm; codecs=opus'));
    }
  }, [mediaSource.readyState]);

  React.useEffect(() => {
    if (mediaSource.readyState === 'open') {
      setInternalQueue((q) => [...q, queue.slice(-1)[0]]);
    }
  }, [queue.length, mediaSource.readyState]);

  React.useEffect(() => {
    if (mediaSource.readyState === 'open') {
      setInternalQueue((q) => [...q, queue.slice(-1)[0]]);
    }
  }, [queue.length, mediaSource.readyState]);

  React.useEffect(() => {
    if (internalQueue.length === 0) return;
    if (!sourceBuffer) return;
    if (sourceBuffer.updating) return;

    const audioSegment = internalQueue[0];
    try {
      sourceBuffer.appendBuffer(audioSegment);
      setInternalQueue(internalQueue.slice(1));
    } catch (e) {
      // Failed to consume audio segment
    }
  }, [internalQueue.length, !!sourceBuffer, sourceBuffer?.updating]);

  return (
    <div className="p-4 bg-primary-100 rounded-2xl">
      readyState:
      {' '}
      {mediaSource.readyState}
      , sourceBuffer ready:
      {' '}
      {!sourceBuffer || sourceBuffer.updating}
      <br />

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={objectURL} autoPlay controls />
    </div>
  );
};

const SocketStreamTest: React.FC = () => {
  const [isButtonPressed, setButtonPressed] = React.useState(false);
  const [audioPlayers, setAudioPlayers] = React.useState<React.ReactElement[]>([]);

  type SpeakingStatus = 'speaking' | 'requesting' | 'none';
  const [speakingStatus, setSpeakingStatus] = React.useState<SpeakingStatus>('none');

  const { socket } = useSocket<SocketVoice.Events.Response, SocketVoice.Events.Request>('/voice');

  React.useEffect(() => {
    if (speakingStatus === 'requesting') {
      socket.once('StateChange', (response) => {
        if (response.success) {
          setSpeakingStatus('speaking');
        } else {
          setSpeakingStatus('none');
          setButtonPressed(false);
        }
      });
    }
  }, [speakingStatus]);

  const pressButton = () => {
    setButtonPressed(true);

    socket.emit('StateChange', {
      classHash: 'SAM-PLE-CLS',
      speaking: true,
    });
    setSpeakingStatus('requesting');
  };
  const releaseButton = () => {
    setButtonPressed(false);
  };
  // setAudioPlayers((a) => [...a, <AudioPlayer key={generateKey()} queue={[]} />]);

  return (
    <>
      <button
        type="button"
        className="color-white bg-pink-500 disabled:bg-gray-500 select-none p-16 rounded-full"
        onMouseDown={pressButton}
        onTouchStart={pressButton}
        onMouseUp={releaseButton}
        onTouchEnd={releaseButton}
        onTouchCancel={releaseButton}
        onMouseLeave={releaseButton}
      >
        Speak!
      </button>
      <ol className="flex flex-col gap-8 p-8">
        <li className="block">
          {audioPlayers}
        </li>
      </ol>
    </>
  );
};

// // TODO: 상태 관리 조금 더 자세히 나누고 모두 state로 관리하기
// const SocketStreamTest: React.FC = () => {
//   const TIME_SLICE = 150;

//   // internal states
//   const [mediaSource] = React.useState(new MediaSource());
//   const [objectURL] = React.useState(URL.createObjectURL(mediaSource));
//   const [requestId, setRequestId] = React.useState(0);
//   const [isButtonPressed, setButtonPressed] = React.useState(false);
//   const audioRef = React.useRef<HTMLAudioElement>(null);
//   const [sourceBuffer, setSourceBuffer] = React.useState<SourceBuffer | null>(null);
//   const [audioSegmentQueue] = React.useState<ArrayBuffer[]>([]);

//   const [audioPaused, setAudioPaused] = React.useState(true);
//   const [streamSendCount, setStreamSendCount] = React.useState(0);

//   const useIncreaseStreamSendCount = () => {
//     setStreamSendCount((s) => s + 1);
//   };

//   // add source buffer when media source is ready
//   React.useEffect(() => {
//     if (mediaSource.readyState === 'open' && mediaSource.sourceBuffers.length === 0) {
//       mediaSource.addSourceBuffer('audio/webm; codecs=opus');
//     }
//   }, [mediaSource.readyState]);

//   // store the sourcebuffer
//   React.useEffect(() => {
//     if (mediaSource.sourceBuffers.length > 0) {
//       const srcBuffer = mediaSource.sourceBuffers[0];
//       setSourceBuffer(srcBuffer);
//     }
//   }, [mediaSource.sourceBuffers.length]);

//   // socket connection
//   const { socket, connected } = useSocket(
//     '/voice',
//     process.env.NODE_ENV === 'production' || !process.env.REACT_APP_PROXY_URL
//       ? undefined
//       : {
//         host: process.env.REACT_APP_PROXY_URL.replace(/https?:\/\//g, ''),
//       },
//   );

//   React.useEffect(() => {
//     const listener = ({ audioSegment }: SocketVoice.Broadcast.StreamReceive) => {
//       if (sourceBuffer) {
//         if (sourceBuffer.updating) {
//           audioSegmentQueue.push(audioSegment);
//         } else {
//           try {
//             sourceBuffer.appendBuffer(audioSegment);
//           } catch (e) {
//             audioSegmentQueue.unshift(audioSegment);
//           }
//         }
//       }
//     };
//     socket.on('StreamReceiveBroadcast', listener);

//     return () => {
//       socket.off('StreamReceiveBroadcast', listener);
//     };
//   }, [socket]);

//   const tryToPlayAudio = () => {
//     const audio = audioRef.current;
//     if (!audio) return false;

//     console.log(
//       'audio.currentTime > 0', audio.currentTime > 0,
//       '!audio.paused', !audio.paused,
//       'audio.readyState > audio.HAVE_CURRENT_DATA', audio.readyState > audio.HAVE_CURRENT_DATA,
//     );

//     const isPlaying = (
//       audio.currentTime > 0
//         && !audio.paused
//         && audio.readyState > audio.HAVE_CURRENT_DATA
//     );
//     if (isPlaying) return false;

//     try {
//       audio.play();
//     } catch (e) {
//       return false;
//     }

//     return true;
//   };

//   const tryToPlayAudioMultiple = async (): Promise<void> => {
//     const isPlayed = tryToPlayAudio();

//     if (!isPlayed) {
//       const delay = (t: number) => new Promise((r) => setTimeout(r, t));
//       console.log('failed');
//       await delay(50);
//       await tryToPlayAudioMultiple();
//     }
//   };

//   socket.on('StateChangeBroadcast', ({
//     speaking,
//   }: SocketVoice.Broadcast.StateChange) => {
//     if (!audioRef.current) return;

//     if (speaking) {
//       tryToPlayAudioMultiple().then(() => {
//         setAudioPaused(false);
//       });
//     } else if (!audioRef.current.paused) {
//       audioRef.current.pause();
//       setAudioPaused(true);
//     }
//   });

//   const onDataAvailable = (data: Blob) => {
//     data.arrayBuffer().then((audioSegment) => {
//       console.log('ava', audioSegment);
//       socket.emit('StreamSend', {
//         classHash: 'SAM-PLE-CLS',
//         audioSegment,
//         requestId,
//       } as SocketVoice.Request.StreamSend);
//       useIncreaseStreamSendCount();
//       setRequestId((r) => r + 1);
//     });
//   };

//   const {
//     error, status, startRecording, pauseRecording, resumeRecording, stopRecording, isAudioMuted,
//   } = useMediaRecorder({
//     onDataAvailable,
//     mediaStreamConstraints: { audio: true },
//     mediaRecorderOptions: { mimeType: 'video/webm; codecs=opus' },
//   });

//   React.useEffect(() => {
//     if (isButtonPressed) {
//       if (status === 'idle') {
//         startRecording(TIME_SLICE);
//       } else {
//         console.log('paused');
//         resumeRecording();
//       }
//       console.log('resume recording');
//       socket.emit('StateChange', {
//         classHash: 'SAM-PLE-CLS',
//         speaking: true,
//       } as SocketVoice.Request.StateChange);
//       setRequestId((r) => r + 1);
//     } else {
//       pauseRecording();
//       socket.emit('StateChange', {
//         classHash: 'SAM-PLE-CLS',
//         speaking: false,
//       } as SocketVoice.Request.StateChange);
//       setRequestId((r) => r + 1);
//     }
//   }, [isButtonPressed]);

//   return (
//     <>
//       {mediaSource.readyState}
//       <br />

//       {error ? `${status} ${error.message}` : status}
//       <br />

//       {/* eslint-disable-next-line no-nested-ternary */}
//       {audioPaused ? 'paused' : 'not paused'}

//       <br />

//       {isAudioMuted ? 'isAudioMuted' : 'not isAudioMuted'}

//       {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
//       <audio ref={audioRef} src={objectURL} autoPlay controls />
//       <br />

//       <button
//         type="button"
//         disabled={
//           mediaSource.sourceBuffers.length === 0
//           || (!isButtonPressed && !audioPaused)
//         }
//         className="color-white bg-pink-500 disabled:bg-gray-500 select-none p-16 rounded-full"
//         onMouseDown={() => {
//           if (audioRef.current && audioRef.current.paused) {
//             console.log('button pressed');
//             setButtonPressed(true);
//           }
//         }}
//         onTouchStart={() => {
//           if (audioRef.current && audioRef.current.paused) {
//             setButtonPressed(true);
//           }
//         }}
//         onMouseUp={() => {
//           setButtonPressed(false);
//         }}
//         onTouchEnd={() => {
//           setButtonPressed(false);
//         }}
//         onTouchCancel={() => {
//           setButtonPressed(false);
//         }}
//         onMouseLeave={() => {
//           setButtonPressed(false);
//         }}
//       >
//         Speak!
//       </button>
//     </>
//   );
// };

export default SocketStreamTest;
