/* istanbul ignore file */
import React from 'react';
import {
  useLocation,
  useHistory,
} from 'react-router-dom';
import ScrollRestoration from 'react-scroll-restoration';
import YouTube from 'react-youtube';
import { useRecoilState, useRecoilValue } from 'recoil';
import { YouTubePlayer } from 'youtube-player/dist/types';

import useRedirect from '../../hooks/useRedirect';
import useSocket from '../../hooks/useSocket';

import classroomsState from '../../recoil/classrooms';
import dialogState from '../../recoil/dialog';
import dropdownState from '../../recoil/dropdown';
import loadingState from '../../recoil/loading';
import meState from '../../recoil/me';
import toastState from '../../recoil/toast';

import fetchAPI from '../../utils/fetch';
import { Styled } from '../../utils/style';
import { getYouTubePlayerStateName } from '../../utils/youtube';

import Dialog from '../alert/Dialog';
import Dropdown from '../alert/Dropdown';
import ToastDisplay from '../alert/ToastDisplay';
import YTPlayer from '../youtube/YTPlayer';
import YTWrapper from '../youtube/YTWrapper';

import Debug from './Debug';
import Loading from './Loading';
import ScreenHeightMeasure from './ScreenHeightMeasure';

const Global: React.FC<Styled<{}>> = ({ className, style }) => {
  const history = useHistory();
  const location = useLocation();
  const inClassroom = /^\/classrooms\/\w{3}-\w{3}-\w{3}$/.test(location.pathname);

  const [classrooms, setClassrooms] = useRecoilState(classroomsState.atom);
  const dropdown = useRecoilValue(dropdownState.atom);
  const dialog = useRecoilValue(dialogState.atom);
  const toasts = useRecoilValue(toastState.atom);
  const [loading, setLoading] = useRecoilState(loadingState.atom);
  const [me, setMe] = useRecoilState(meState.atom);

  const { connected } = useSocket('/');

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      setLoading(!connected);
    }
  }, [connected]);

  const onYouTubeReady = (player: YouTubePlayer) => {
    console.log('Player ready', player);
    player.playVideo();
  };
  const onYouTubeStateChange = (state: number, player: YouTubePlayer) => {
    console.log('State changed', getYouTubePlayerStateName(state));
    if ([YouTube.PlayerState.UNSTARTED].includes(state)) {
      player.playVideo();
    }
  };

  useRedirect(me.loaded && !!me.info && !me.info.initialized, [me], '/welcome');

  React.useEffect(() => {
    setLoading(true);
    fetchAPI('GET /users/me').then((response) => {
      if (response.success) {
        setMe({
          loaded: true,
          info: response.payload,
        });
        setClassrooms(response.payload.classrooms);
      } else {
        setMe({ loaded: true, info: null });
      }
    })
      .catch(() => {
        setMe({ loaded: true, info: null });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={className} style={style}>
      {/* 화면 vh 조정 */}
      <ScreenHeightMeasure />

      {/* 스크롤 위치 복구 */}
      <ScrollRestoration />

      {/* 디버그용 컴포넌트 */}
      <Debug />

      <Dropdown visible={dropdown.visible} onClose={dropdown.onClose ?? (() => {})}>
        {dropdown.element}
      </Dropdown>

      <Dialog visible={dialog.visible} onClose={dialog.onClose ?? (() => {})}>
        {dialog.element}
      </Dialog>

      <Loading loading={loading} />

      <YTWrapper
        isPresent={!!classrooms[0]?.video}
        inClassroom={inClassroom}
        onClick={() => {
          if (classrooms[0]?.hash) {
            history.push(`/classrooms/${classrooms[0]?.hash}`);
          }
        }}
      >
        <YTPlayer
          videoId={classrooms[0]?.video?.videoId}
          onReady={onYouTubeReady}
          onStateChange={onYouTubeStateChange}
        />
      </YTWrapper>

      <ToastDisplay toasts={toasts} />
    </div>
  );
};

export default Global;
