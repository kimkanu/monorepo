/* istanbul ignore file */
import { ClassroomJSON } from '@team-10/lib';
import React from 'react';
import {
  useLocation,
  useHistory,
} from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import useRedirect from '../../hooks/useRedirect';
import useSocket from '../../hooks/useSocket';

import classroomsState from '../../recoil/classrooms';
import loadingState from '../../recoil/loading';
import meState from '../../recoil/me';
import toastState from '../../recoil/toast';
import { Theme } from '../../types/theme';

import fetchAPI from '../../utils/fetch';
import { Styled } from '../../utils/style';

import Dialog from '../alert/Dialog';
import Dropdown from '../alert/Dropdown';
import ToastDisplay from '../alert/ToastDisplay';
import YTPlayer from '../youtube/YTPlayer';
import YTWrapper from '../youtube/YTWrapper';

import Debug from './Debug';
import DynamicManifest from './DynamicManifest';
import Loading from './Loading';
import ScreenHeightMeasure from './ScreenHeightMeasure';

function sortClassrooms(classrooms: ClassroomJSON[], userId: string): ClassroomJSON[] {
  return classrooms.slice(0)
    .sort((c1, c2) => {
      // Live
      const isLive1 = c1.isLive ? 1 : 0;
      const isLive2 = c2.isLive ? 1 : 0;
      if (isLive1 !== isLive2) return isLive2 - isLive1;

      // Mine
      const isInstructor1 = c1.instructorId === userId ? 1 : 0;
      const isInstructor2 = c2.instructorId === userId ? 1 : 0;
      if (isInstructor1 !== isInstructor2) return isInstructor2 - isInstructor1;

      // updatedAt
      return c2.updatedAt - c1.updatedAt;
    });
}

const Global: React.FC<Styled<{ theme: Theme }>> = ({ theme, className, style }) => {
  const history = useHistory();
  const location = useLocation();
  const inClassroom = /^\/classrooms\/\w{3}-\w{3}-\w{3}/.test(location.pathname);

  const [classrooms, setClassrooms] = useRecoilState(classroomsState.atom);
  const toasts = useRecoilValue(toastState.atom);
  const [loading, setLoading] = useRecoilState(loadingState.atom);
  const [me, setMe] = useRecoilState(meState.atom);

  const { connected } = useSocket('/');

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      setLoading(!connected);
    }
  }, [connected]);

  useRedirect(
    me.loaded && !!me.info && !me.info.initialized,
    '/welcome',
  );

  React.useEffect(() => {
    setLoading(true);
    fetchAPI('GET /users/me')
      .then((response) => {
        if (response.success) {
          setMe({
            loaded: true,
            info: response.payload,
          });
          setClassrooms(sortClassrooms(response.payload.classrooms, response.payload.stringId));
        } else {
          setMe({ loaded: true, info: null });
        }
      })
      .catch((e) => {
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

      {/* 디버그용 컴포넌트 */}
      <Debug />

      {/* manifest.json */}
      <DynamicManifest theme={theme} />

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
        <YTPlayer videoId={classrooms[0]?.video?.videoId} />
      </YTWrapper>

      <ToastDisplay toasts={toasts} />
    </div>
  );
};

export default Global;
