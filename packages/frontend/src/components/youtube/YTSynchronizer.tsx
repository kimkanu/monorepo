import { SocketYouTube } from '@team-10/lib';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import YouTube from 'react-youtube';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { YouTubePlayer } from 'youtube-player/dist/types';

import useSocket from '../../hooks/useSocket';
import classroomsState from '../../recoil/classrooms';
import meState from '../../recoil/me';
import toastState from '../../recoil/toast';
import { classroomPrefixRegex } from '../../utils/history';

interface Props {
  children: (
    onReady: (player: YouTubePlayer) => void,
    onStateChange: (state: number, player: YouTubePlayer) => void,
  ) => React.ReactElement;
}

type PlayerState = 'playing' | 'paused';

const YTSynchronizer: React.FC<Props> = ({ children }) => {
  const SECONDS = 1000;
  const REQUEST_TIMEOUT = 3 * SECONDS;
  const SYNC_PERIOD = 20 * SECONDS;

  // TODO: 유튜브 custom controls에 유용하게 쓰일 것 같습니다.
  const [playerState, setPlayerState] = React.useState<PlayerState>('paused');
  const [volume, setVolume] = React.useState<number>();
  const [player, setPlayer] = React.useState<YouTubePlayer | null>(null);

  const location = useLocation();
  const myId = useRecoilValue(meState.id);
  const hash = location.pathname.match(classroomPrefixRegex)?.[1] ?? null;
  const [classroom, setClassroom] = useRecoilState(classroomsState.byHash(hash));
  const isInstructor = !!classroom && classroom.instructorId === myId;
  const isStudent = !!classroom && classroom.instructorId !== myId;
  const addToast = useSetRecoilState(toastState.new);
  const videoId = classroom?.video?.videoId ?? null;
  const [
    syncResponse, setSyncResponse,
  ] = React.useState<SocketYouTube.Broadcast.ChangePlayStatus | null>(null);

  const { socket, connected } = useSocket<
  SocketYouTube.Events.Response, SocketYouTube.Events.Request
  >('/');

  const onReady = (target: YouTubePlayer) => {
    setPlayer(target);
    target.pauseVideo();
    console.log('onReady', target);
  };

  const onStateChange = React.useCallback((newPlayerState: number, newPlayer: YouTubePlayer) => {
    if (!hash || !classroom) return () => {};
    setPlayer(newPlayer);
    console.log('onStateChange', newPlayerState, newPlayer);

    let timeout: number | undefined;
    let listener: (response: SocketYouTube.Response.ChangePlayStatus) => void | undefined;

    // instructor의 play state가 바뀔 때마다
    if (isInstructor) {
      if ([YouTube.PlayerState.PLAYING, YouTube.PlayerState.PAUSED].includes(newPlayerState)) {
        socket.emit('youtube/ChangePlayStatus', {
          hash,
          play: newPlayerState === YouTube.PlayerState.PLAYING,
          videoId,
          time: newPlayer.getCurrentTime(),
        });
        setPlayerState(newPlayerState === YouTube.PlayerState.PLAYING ? 'playing' : 'paused');

        // 요청이 유실됐을 때 한번 더 보내기
        timeout = window.setTimeout(() => {
          socket.emit('youtube/ChangePlayStatus', {
            hash,
            play: newPlayerState === YouTube.PlayerState.PLAYING,
            videoId,
            time: newPlayer.getCurrentTime(),
          });
        }, REQUEST_TIMEOUT);
        listener = (response) => {
          clearTimeout(timeout);
          if (!response.success) {
            addToast({
              type: 'error',
              sentAt: new Date(),
              message: `${response.reason}`, // TODO: fill the reasons
            });
          }
        };
        socket.once('youtube/ChangePlayStatus', listener);
      }
    }

    return () => {
      clearTimeout(timeout);
      if (listener) {
        socket.off('youtube/ChangePlayStatus', listener);
      }
    };
  }, [connected, videoId, isInstructor, hash]);

  const synchronize = React.useCallback(
    <R extends SocketYouTube.Broadcast.ChangePlayStatus>({
      play, hash: responseHash, time, videoId: responseVideoId,
    }: R) => {
      if (!player) return;
      if (responseHash !== hash) return;

      if (play) {
        player.playVideo();
        setPlayerState('playing');
      } else {
        player.pauseVideo();
        setPlayerState('paused');
      }

      if (time !== null) {
        player.seekTo(time, true);
      }

      // handle videoId changes
      setClassroom((c) => ({
        ...c,
        video: responseVideoId ? {
          type: 'single',
          videoId: responseVideoId,
        } : null,
      }));
    },
    [player, hash],
  );

  // 소켓 연결 상태가 변했거나 처음 들어왔을 때 동기화
  useEffect(() => {
    console.log(connected, player, hash);
    if (!connected || !hash) return () => {};

    socket.emit('youtube/JoinClassroom', { hash });

    const listener = (response: SocketYouTube.Response.JoinClassroom) => {
      console.log('JoinClassroom', response);
      if (isStudent) {
        if (response.success) {
          setClassroom((c) => ({
            ...c,
            video: response.videoId ? {
              type: 'single',
              videoId: response.videoId,
            } : null,
          }));
          setSyncResponse(response);
        } else {
          console.error('JoinClassroom', response.reason);
        }
      }
    };
    socket.once('youtube/JoinClassroom', listener);

    return () => {
      socket.off('youtube/JoinClassroom', listener);
    };
  }, [connected, player, isStudent, hash]);

  // 동기화
  useEffect(() => {
    console.log(connected, player, isStudent, hash);
    if (!connected || !hash) return () => {};

    const listener = (response: SocketYouTube.Broadcast.ChangePlayStatus) => {
      console.log('ChangePlayStatusBroadcast', response);
      if (isStudent) {
        setClassroom((c) => ({
          ...c,
          video: response.videoId ? {
            type: 'single',
            videoId: response.videoId,
          } : null,
        }));
        setSyncResponse(response);
      }
    };
    console.log('ChangePlayStatusBroadcast listener');
    socket.on('youtube/ChangePlayStatusBroadcast', listener);

    return () => {
      socket.off('youtube/ChangePlayStatusBroadcast', listener);
    };
  }, [connected, player, isStudent, hash]);

  useEffect(() => {
    console.log('ChangePlayStatus', isInstructor, playerState, videoId, hash);
    if (isInstructor && !!videoId && !!hash) {
      socket.emit('youtube/ChangePlayStatus', {
        hash,
        play: playerState === 'playing',
        videoId,
        time: player?.getCurrentTime() ?? null,
      });
    }
  }, [player, playerState, videoId, isInstructor, hash]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('ChangePlayStatusInterval', isInstructor, playerState, videoId, hash);
      if (isInstructor && !!videoId && !!hash) {
        socket.emit('youtube/ChangePlayStatus', {
          hash,
          play: playerState === 'playing',
          videoId,
          time: player?.getCurrentTime() ?? null,
        });
      }
    }, SYNC_PERIOD);

    return () => {
      clearInterval(interval);
    };
  }, [player, playerState, videoId, isInstructor, hash]);

  useEffect(() => {
    if (syncResponse) {
      synchronize(syncResponse);
    }
  }, [syncResponse]);

  return <>{children(onReady, onStateChange)}</>;
};

export default YTSynchronizer;
