import { Video16Filled, WeatherPartlyCloudyDay16Regular } from '@fluentui/react-icons';
import { ClassroomsHashPatchResponse, SocketClassroom, SocketYouTube } from '@team-10/lib';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import YouTube from 'react-youtube';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { YouTubePlayer } from 'youtube-player/dist/types';

import useMainClassroom from '../../hooks/useMainClassroom';
import useSocket from '../../hooks/useSocket';
import classroomsState from '../../recoil/classrooms';
import mainClassroomHashState from '../../recoil/mainClassroomHash';
import meState from '../../recoil/me';
import toastState from '../../recoil/toast';
import fetchAPI from '../../utils/fetch';
import appHistory, { classroomPrefixRegex } from '../../utils/history';
import Button from '../buttons/Button';

import YTPlayer from './YTPlayer';
import YTPlayerControl from './YTPlayerControl';
import YTWrapper from './YTWrapper';

type PlayerState = 'playing' | 'paused';

const YTSynchronizer: React.FC = () => {
  const SECONDS = 1000;
  const REQUEST_TIMEOUT = 3 * SECONDS;
  const SYNC_PERIOD = 20 * SECONDS;

  const [playerState, setPlayerState] = React.useState<PlayerState>('paused');
  const [volume, setVolume] = React.useState<number | null>(null);
  const [duration, setDuration] = React.useState<number>(0);
  const [player, setPlayer] = React.useState<YouTubePlayer | null>(null);
  const [lastBroadcast, setlastBroadcast] = React.useState<boolean | null>(null);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isLoadingStart, setLoadingStart] = React.useState(false);

  const location = useLocation();
  const history = useHistory();
  const myId = useRecoilValue(meState.id);
  const hash = useRecoilValue(mainClassroomHashState.atom);
  const [classroom, setClassroom] = useRecoilState(classroomsState.byHash(hash));
  const inClassroom = /^\/classrooms\/\w{3}-\w{3}-\w{3}/.test(location.pathname);
  const isInstructor = !!classroom && classroom.instructor!.stringId === myId;
  const isStudent = !!classroom && classroom.instructor!.stringId !== myId;
  const addToast = useSetRecoilState(toastState.new);
  const video = classroom?.video ?? null;
  const [
    syncResponse, setSyncResponse,
  ] = React.useState<SocketYouTube.Broadcast.ChangePlayStatus | null>(null);
  const [playlist, setPlaylist] = React.useState<string[] | null>(null);

  const { socket, connected } = useSocket<
  SocketYouTube.Events.Response & SocketClassroom.Events.Response, SocketYouTube.Events.Request
  >('/');

  const onReady = (target: YouTubePlayer) => {
    setPlayer(target);
    target.pauseVideo();
    setVolume(target.getVolume());
    setDuration(target.getDuration());
    console.log('onReady', target);

    if (hash) {
      socket.emit('youtube/ChangePlayStatus', {
        hash,
        play: target.getPlayerState() === YouTube.PlayerState.PLAYING,
        video,
        time: target.getCurrentTime(),
      });
    }
  };

  const onStateChange = React.useCallback((newPlayerState: number, newPlayer: YouTubePlayer) => {
    if (!hash || !classroom) return () => {};
    setPlayer(newPlayer);
    console.log('onStateChange', newPlayerState, newPlayer.getPlaylistIndex());

    if (classroom.video?.type === 'playlist' && newPlayer.getPlaylist()) {
      setPlaylist(newPlayer.getPlaylist() as string[]);
    } else if (classroom.video?.type === 'single') {
      setPlaylist(null);
    }

    setClassroom((c) => ({
      ...c,
      video: !c!.video ? c!.video : c!.video.type === 'single' ? c!.video : {
        type: 'playlist',
        playlistId: c!.video.playlistId,
        videoId: (newPlayer as any).getVideoData().video_id,
        index: (newPlayer.getPlaylist() ?? playlist ?? []).findIndex(
          (v) => v === (newPlayer as any).getVideoData().video_id,
        ),
      },
    }));

    let timeout: number | undefined;
    let listener: (response: SocketYouTube.Response.ChangePlayStatus) => void | undefined;

    // instructor의 play state가 바뀔 때마다
    if (isInstructor) {
      if ([YouTube.PlayerState.PLAYING, YouTube.PlayerState.PAUSED].includes(newPlayerState)) {
        socket.emit('youtube/ChangePlayStatus', {
          hash,
          play: newPlayerState === YouTube.PlayerState.PLAYING,
          video,
          time: newPlayer.getCurrentTime(),
        });
        setPlayerState(newPlayerState === YouTube.PlayerState.PLAYING ? 'playing' : 'paused');
        // 요청이 유실됐을 때 한번 더 보내기
        timeout = window.setTimeout(() => {
          socket.emit('youtube/ChangePlayStatus', {
            hash,
            play: newPlayerState === YouTube.PlayerState.PLAYING,
            video,
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
    } else if (newPlayerState === YouTube.PlayerState.PLAYING) {
      console.log('broadcast:', lastBroadcast);
      if (!lastBroadcast) {
        newPlayer.pauseVideo();
      }
    } else if (newPlayerState === YouTube.PlayerState.PAUSED) {
      console.log('broadcast:', lastBroadcast);
      if (lastBroadcast) {
        newPlayer.playVideo();
      }
    }

    return () => {
      clearTimeout(timeout);
      if (listener) {
        socket.off('youtube/ChangePlayStatus', listener);
      }
    };
  }, [connected, video, isInstructor, hash, lastBroadcast]);

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
      // broadcast 주가적으로 불려올 때 마다 실행되어
      // 영상이 끊기는 문제가 있어서 지금 상태와 같으면 실행 안함
      if ((player.getPlayerState() === YouTube.PlayerState.PLAYING) !== play) {
        if (time !== null) {
          player.seekTo(time, true);
        }
      }

      console.log('synchronize');

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
  React.useEffect(() => {
    if (!connected || !hash) return () => {};
    const listener = (response: SocketClassroom.Response.Join) => {
      if (!!classroom && !isInstructor) {
        if (response.success) {
          setSyncResponse({
            hash,
            play: response.isVideoPlaying,
            time: response.videoTime,
            videoId: response.video?.videoId ?? null,
          });
        }
      }
    };
    socket.once('classroom/Join', listener);

    return () => {
      socket.off('classroom/Join', listener);
    };
  }, [connected, player, isStudent, hash]);

  // 동기화
  useEffect(() => {
    console.log(connected, player, isStudent, hash);
    if (!connected || !hash) return () => {};

    const listener = (response: SocketYouTube.Broadcast.ChangePlayStatus) => {
      console.log('ChangePlayStatusBroadcast', response);
      setlastBroadcast(response.play);
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
  }, [connected, player, isStudent, hash, lastBroadcast]);

  useEffect(() => {
    console.log('ChangePlayStatus', isInstructor, playerState, video, hash);
    if (isInstructor && !!video && !!hash) {
      socket.emit('youtube/ChangePlayStatus', {
        hash,
        play: playerState === 'playing',
        video,
        time: player?.getCurrentTime() ?? null,
      });
    }
  }, [player, playerState, video, isInstructor, hash]);

  useEffect(() => {
    console.log('ChangePlayStatus', isInstructor, playerState, video, hash);
    if (isInstructor && !!video && !!hash) {
      socket.emit('youtube/ChangePlayStatus', {
        hash,
        play: playerState === 'playing',
        video,
        time: player?.getCurrentTime() ?? null,
      });
    }
  }, [player, playerState, video, isInstructor, hash]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('ChangePlayStatusInterval', isInstructor, playerState, video, hash);
      if (isInstructor && !!video && !!hash) {
        socket.emit('youtube/ChangePlayStatus', {
          hash,
          play: playerState === 'playing',
          video,
          time: player?.getCurrentTime() ?? null,
        });
      }
    }, SYNC_PERIOD);

    return () => {
      clearInterval(interval);
    };
  }, [player, playerState, video, isInstructor, hash]);

  useEffect(() => {
    if (syncResponse) {
      synchronize(syncResponse);
    }
  }, [syncResponse]);

  useEffect(() => {
    player?.setVolume(volume || 0);
  }, [volume]);

  return (
    <YTWrapper
      isPresent={!!classroom?.video}
      inClassroom={classroomPrefixRegex.test(location.pathname)}
      onClick={() => {
        if (classroom) {
          appHistory.push(`/classrooms/${classroom.hash}`, history);
        }
      }}
    >
      <YTPlayerControl
        isInstructor={isInstructor}
        duration={duration}
        volume={volume}
        setVolume={setVolume}
        currentTime={currentTime}
      >
        <YTPlayer
          videoId={isInstructor && classroom?.video?.type === 'playlist' ? undefined : classroom?.video?.videoId}
          onReady={onReady}
          onStateChange={onStateChange}
          setCurrentTime={setCurrentTime}
          options={isInstructor ? (classroom?.video?.type === 'playlist' ? {
            playerVars: {
              listType: 'playlist',
              list: classroom?.video.playlistId,
            },
          } : undefined) : {
            playerVars: {
              controls: 0,
              disablekb: 1,
            },
          }}
        >
          {inClassroom && isInstructor && !!classroom && !classroom.isLive && (
            <Button
              width="fit-content"
              style={{ width: 152 }}
              type="primary"
              text="수업 시작하기"
              isLoading={isLoadingStart}
              onClick={async () => {
                if (!classroom) return;
                setLoadingStart(true);
                const response = await fetchAPI(
                  'PATCH /classrooms/:hash',
                  { hash: classroom.hash! },
                  { operation: 'toggle', start: true },
                ) as ClassroomsHashPatchResponse<'toggle'>;
                if (!response.success) {
                  addToast({
                    sentAt: new Date(),
                    type: 'error',
                    message: `[${response.error.code}]`,
                  });
                }
                setLoadingStart(false);
              }}
            />
          )}
          {inClassroom && isInstructor && !!classroom && classroom.isLive && !classroom.video && (
            <div className="flex flex-col gap-4 items-center">
              <Button
                width="fit-content"
                type="primary"
                text="유튜브 영상 공유하기"
                onClick={async () => {
                  appHistory.push(`/classrooms/${classroom.hash}/share`, history);
                }}
              />
              <Button
                width="fit-content"
                style={{ width: 136 }}
                type="destructive"
                text="수업 끝내기"
                isLoading={isLoadingStart}
                onClick={async () => {
                  if (!classroom) return;
                  setLoadingStart(true);
                  const response = await fetchAPI(
                    'PATCH /classrooms/:hash',
                    { hash: classroom.hash! },
                    { operation: 'toggle', start: false },
                  ) as ClassroomsHashPatchResponse<'toggle'>;
                  if (!response.success) {
                    addToast({
                      sentAt: new Date(),
                      type: 'error',
                      message: `[${response.error.code}]`,
                    });
                  }
                  setLoadingStart(false);
                }}
              />
            </div>
          )}
        </YTPlayer>
      </YTPlayerControl>
    </YTWrapper>
  );
};

export default YTSynchronizer;
