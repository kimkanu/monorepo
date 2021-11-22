/* istanbul ignore file */
import { UsersMeGetResponse } from '@team-10/lib';
import React from 'react';
import {
  useLocation,
  useHistory,
} from 'react-router-dom';
import YouTube from 'react-youtube';
import { useRecoilState, useRecoilValue } from 'recoil';
import { YouTubePlayer } from 'youtube-player/dist/types';

import classroomsState from '../../recoil/classrooms';
import dialogState from '../../recoil/dialog';
import dropdownState from '../../recoil/dropdown';
import loadingState from '../../recoil/loading';
import meState from '../../recoil/me';
import toastState from '../../recoil/toast';

import { MeInfo } from '../../types/user';
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

  const classrooms = useRecoilValue(classroomsState.atom);
  const dropdown = useRecoilValue(dropdownState.atom);
  const dialog = useRecoilValue(dialogState.atom);
  const toasts = useRecoilValue(toastState.atom);
  const [loading, setLoading] = useRecoilState(loadingState.atom);
  const [me, setMe] = useRecoilState(meState.atom);

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

  React.useEffect(() => {
    setLoading(true);
    fetch('/api/users/me')
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error('Not supported');
      })
      .then((response: UsersMeGetResponse) => {
        if (response.success) {
          setMe({
            loading: false,
            info: response.payload,
          });
        } else {
          setMe({ loading: false, info: null });
        }
      })
      .catch((e) => {
        setMe({ loading: false, info: null });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={className} style={style}>
      {/* 화면 vh 조정 */}
      <ScreenHeightMeasure />

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
