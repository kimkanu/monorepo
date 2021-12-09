/* istanbul ignore file */
import { ClassroomJSONWithSpeaker } from '@team-10/lib';
import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import useMainClassroom from '../../hooks/useMainClassroom';
import useSocket from '../../hooks/useSocket';

import i18n from '../../i18n';
import classroomsState from '../../recoil/classrooms';
import loadingState from '../../recoil/loading';
import meState from '../../recoil/me';
import toastState from '../../recoil/toast';
import { Theme } from '../../types/theme';

import fetchAPI from '../../utils/fetch';
import appHistory, { classroomPrefixRegex } from '../../utils/history';
import { Styled } from '../../utils/style';

import ToastDisplay from '../alert/ToastDisplay';
import ClassroomPatcher from '../patcher/ClassroomPatcher';
import MyInfoPatcher from '../patcher/MyInfoPatcher';
import YTPlayerControl from '../youtube/YTPlayerControl';
import YTSynchronizer from '../youtube/YTSynchronizer';
import YTWrapper from '../youtube/YTWrapper';

import Debug from './Debug';
import DynamicManifest from './DynamicManifest';
import HistoryListener from './HistoryListener';
import Loading from './Loading';
import ScreenHeightMeasure from './ScreenHeightMeasure';

function sortClassrooms(
  classrooms: ClassroomJSONWithSpeaker[],
  userId: string,
): ClassroomJSONWithSpeaker[] {
  return classrooms.slice(0)
    .sort((c1, c2) => {
      // Live
      const isLive1 = c1.isLive ? 1 : 0;
      const isLive2 = c2.isLive ? 1 : 0;
      if (isLive1 !== isLive2) return isLive2 - isLive1;

      // Mine
      const isInstructor1 = c1.instructor.stringId === userId ? 1 : 0;
      const isInstructor2 = c2.instructor.stringId === userId ? 1 : 0;
      if (isInstructor1 !== isInstructor2) return isInstructor2 - isInstructor1;

      // updatedAt
      return c2.updatedAt - c1.updatedAt;
    });
}

const Global: React.FC<Styled<{ theme: Theme }>> = ({ theme, className, style }) => {
  const history = useHistory();
  const location = useLocation();
  const inClassroom = classroomPrefixRegex.test(location.pathname);

  const [classrooms, setClassrooms] = useRecoilState(classroomsState.atom);
  const mainClassroom = useMainClassroom();
  const toasts = useRecoilValue(toastState.atom);
  const addToast = useSetRecoilState(toastState.new);
  const [loading, setLoading] = useRecoilState(loadingState.atom);
  const setMe = useSetRecoilState(meState.atom);

  const { connected } = useSocket('/');

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      setLoading(!connected);
    }
  }, [connected]);

  React.useEffect(() => {
    fetchAPI('GET /toasts')
      .then((response) => {
        if (response.success) {
          response.payload.forEach((toast, i) => {
            addToast({
              ...toast,
              // `+ i * 1000` to ensure the key is unique & give user more time to read toasts
              sentAt: new Date(Date.now() + i * 1000),
            });
          });
        }
      });
  }, []);

  React.useEffect(() => {
    setLoading(true);
    fetchAPI('GET /users/me')
      .then((response) => {
        if (response.success) {
          setMe({
            loaded: true,
            info: response.payload,
          });
          setClassrooms(sortClassrooms(
            response.payload.classrooms.map((c) => ({ ...c, speakerId: null })),
            response.payload.stringId,
          ));
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

  React.useEffect(() => {
    fetchAPI('GET /lang')
      .then((response) => {
        if (response.success) {
          i18n.changeLanguage(response.payload.lang);
        }
      });
  }, []);

  return (
    <div className={className} style={style}>
      {/* History Listener */}
      <HistoryListener />

      {/* Info Patcher */}
      <ClassroomPatcher />
      <MyInfoPatcher />

      {/* 화면 vh 조정 */}
      <ScreenHeightMeasure />

      {/* 디버그용 컴포넌트 */}
      <Debug />

      {/* manifest.json */}
      <DynamicManifest theme={theme} />

      <Loading loading={loading} />

      <YTSynchronizer />

      <ToastDisplay toasts={toasts} />
    </div>
  );
};

export default Global;
