/* eslint-disable max-len */
import { EyeShow24Regular, EyeHide24Regular } from '@fluentui/react-icons';
import React from 'react';
import { spring, Motion } from 'react-motion';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import useMainClassroom from '../../hooks/useMainClassroom';
import useScreenType from '../../hooks/useScreenType';
import classroomsState from '../../recoil/classrooms';
import meState from '../../recoil/me';
import ScreenType from '../../types/screen';
import { conditionalStyle, mergeClassNames } from '../../utils/style';
import AmbientButton from '../buttons/AmbientButton';
import ChatInput from '../chat/ChatInput';
import ClassroomChat from '../classroom/ClassroomChat';
import MemberList from '../classroom/MemberList';
import VoiceWrapper from '../voice/VoiceWrapper';

interface Props {
  isUIHidden: boolean;
  setUIHidden: (updater: (value: boolean) => boolean) => void;
}

const Footer: React.FC<Props> = ({ isUIHidden, setUIHidden }) => {
  const screenType = useScreenType();
  const location = useLocation();
  const meInfo = useRecoilValue(meState.info);
  const classrooms = useRecoilValue(classroomsState.atom);
  const mainClassroom = useMainClassroom();
  const inClassroom = /^\/classrooms\/\w{3}-\w{3}-\w{3}/.test(location.pathname);

  const isVisible = classrooms.some(({ isLive }) => isLive) || inClassroom;

  const [text, setText] = React.useState('');

  return (
    <Motion style={{
      percentage: spring(isVisible ? 0 : 100),
      height: spring(
        screenType === ScreenType.MobilePortrait && inClassroom ? 136 : 76,
      ),
    }}
    >
      {({ percentage, height }) => (
        <div
          className={mergeClassNames(
            'flex fixed z-layout bottom-0 w-full',
            screenType === ScreenType.MobileLandscape && inClassroom ? 'flex-row bg-transparent border-none' : 'flex-col border-t-4 border-primary-500 bg-white',
          )}
          style={{
            height: `calc(env(safe-area-inset-bottom, 0px) + ${height}px)`,
            transform: `translateY(${percentage}%)`,
          }}
        >
          {/* !inClassroom */}
          {isVisible && !inClassroom && (
            <div
              className="flex items-center content-center justify-between px-4"
              style={{
                height: 72,
                ...conditionalStyle({
                  mobilePortrait: {
                    width: '100vw',
                  },
                  mobileLandscape: {
                    width: mainClassroom?.video ? 'calc(100vw - 18rem)' : '100vw',
                  },
                  desktop: {
                    width: mainClassroom?.video ? 'calc(100vw - 27rem)' : '100vw',
                  },
                })(screenType),
              }}
            >
              <MemberList />
              <div
                style={{
                  maxWidth: 'calc(100% - 54px)',
                  lineClamp: 2,
                  WebkitLineClamp: 2,
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                }}
                className="flex items-center overflow-hidden max-h-full"
              >
                <span className="font-semibold text-base" style={{ lineHeight: '19px' }}>
                  {mainClassroom?.name}
                </span>
              </div>
            </div>
          )}

          {/* MobilePortrait, inClassroom */}
          {isVisible && screenType === ScreenType.MobilePortrait && inClassroom && (
            <>
              <div className="flex items-center content-center justify-between px-4" style={{ height: 72 }}>
                <MemberList />
                {/* Speaking button when in class */}
                {inClassroom && <VoiceWrapper />}
                {!!mainClassroom && !inClassroom && (
                  <span className="text-bold">{mainClassroom.name}</span>
                )}
              </div>
              <div className="flex items-center content-center justify-between px-4">
                <ChatInput dark={false} text={text} onInput={setText} />
              </div>
            </>
          )}

          {/* MobileLandscape, inClassroom */}
          {isVisible && screenType === ScreenType.MobileLandscape && inClassroom && (
            <>
              {!isUIHidden && (
              <div className="pl-1 py-2">
                <ChatInput dark text={text} onInput={setText} />
              </div>
              )}
              {inClassroom && (
                <div className="flex absolute bottom-0 w-full h-18 items-start justify-end right-0" style={{ height: 60, width: 320 }}>
                  <AmbientButton
                    size={48}
                    icon={!isUIHidden ? <EyeShow24Regular className="stroke-current" /> : <EyeHide24Regular className="stroke-current" />}
                    dark
                    className="mr-20"
                    onClick={() => setUIHidden((h) => !h)}
                  />
                  <VoiceWrapper />
                  {!isUIHidden && (
                  <div className="fixed overflow-y-auto overflow-x-hidden left-0" style={{ width: 416, bottom: 72 }}>
                    <ClassroomChat
                      isInstructor={mainClassroom?.instructor.stringId === meInfo?.stringId}
                      dark
                    />
                  </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Desktop, inClassroom */}
          {isVisible && screenType === ScreenType.Desktop && inClassroom && (
            <>
              <div
                className="w-full flex items-center content-center justify-between px-4 relative"
                style={{ height: 72 }}
              >
                <MemberList />
                {/* Speaking button when in class */}
                {inClassroom && <VoiceWrapper />}
                {!!mainClassroom && !inClassroom && (
                  <span className="text-bold">{mainClassroom.name}</span>
                )}
              </div>
              <div
                className="flex items-center content-center justify-between absolute bottom-0 right-0 z-layout-3 bg-white rounded-t-8"
                style={{
                  width: 'clamp(352px, 30vw, 416px)',
                  bottom: 76,
                }}
              >
                <ChatInput dark={false} text={text} onInput={setText} extended />
              </div>
            </>
          )}
        </div>
      )}
    </Motion>
  );
};

export default Footer;
