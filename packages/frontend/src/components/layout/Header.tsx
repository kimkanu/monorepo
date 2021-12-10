/* eslint-disable max-len */
import {
  Alert24Filled,
  DoorArrowLeft24Regular,
  IosArrowLtr24Regular,
  Globe24Regular,
  Settings24Filled,
  People24Filled,
  SpinnerIos20Regular,
  Person24Filled,
  SignOut24Filled,
} from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';

import useScreenType from '../../hooks/useScreenType';
import i18n from '../../i18n';
import classroomsState from '../../recoil/classrooms';
import languageState from '../../recoil/language';
import mainClassroomHashState from '../../recoil/mainClassroomHash';
import meState from '../../recoil/me';
import themeState from '../../recoil/theme';
import toastState from '../../recoil/toast';
import ScreenType from '../../types/screen';
import { Theme } from '../../types/theme';
import fetchAPI from '../../utils/fetch';
import appHistory from '../../utils/history';
import { mergeClassNames } from '../../utils/style';
import Dropdown from '../alert/Dropdown';
import AmbientButton from '../buttons/AmbientButton';
import LogoButton from '../buttons/LogoButton';
import ClassroomInstructorButtons from '../classroom/ClassroomInstructorButtons';
import MemberList from '../classroom/MemberList';

interface ProfileDropdownContentProps {
  src?: string;
  displayName: string;
  hideDropdowns: () => void;
}

const ProfileDropdownContent: React.FC<ProfileDropdownContentProps> = ({ src, displayName, hideDropdowns }) => {
  const [theme, setTheme] = useRecoilState(themeState.atom);
  const meInfo = useRecoilValue(meState.info);
  const history = useHistory();
  const addToast = useSetRecoilState(toastState.new);
  const { t } = useTranslation('profile');

  return (
    <div className="flex flex-col items-center">
      <img
        src={src}
        alt={t('profileImageOnly')}
        style={{ '--shadow-color': 'rgba(0, 0, 0, 0.1)' } as React.CSSProperties}
        className="w-28 h-28 rounded-full overflow-hidden shadow-button object-cover object-center my-8"
      />
      <span className="text-sub inline-flex max-w-full whitespace-nowrap gap-1">
        <span>{t('hello')}</span>
        <span className="font-bold inline-block overflow-hidden overflow-ellipsis">{displayName}</span>
        <span>{t('mark')}</span>
      </span>
      <div className="w-full flex flex-col justify-start mt-8">
        <span className="text-gray-800 font-bold">{t('theme')}</span>
        <div className="mt-3 bg-gray-100 rounded-xl py-4 px-10 flex justify-between">
          {(['violet', 'pink', 'green', 'blue'] as Theme[]).map((color) => (
            <button key={color} type="button" aria-label="Violet" className={`bg-${color}-500 hover:bg-${color}-700 w-10 h-10 rounded-full transition-colors`} onClick={() => setTheme(color)}>
              {theme === color && <span className="text-white text-big">✓</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col justify-start mt-8">
        <span className="text-gray-800 font-bold">{t('accountMg')}</span>
        <div className="flex flex-col gap-1 mt-3">
          <button
            type="button"
            className="flex w-full items-center transition rounded-2xl bg-transparent text-gray-900 hover:bg-gray-200 text-emph px-6 py-3"
            style={{
              transitionProperty: 'background-color, border-color, color, fill, stroke',
            }}
            onClick={() => {
              if (meInfo?.initialized) {
                hideDropdowns();
                appHistory.push('/profile', history);
              } else {
                addToast({
                  type: 'error',
                  sentAt: new Date(),
                  message: t('message'),
                });
              }
            }}
          >
            <Person24Filled className="mr-6 text-gray-700" />
            <span className="text-emph">{t('seeProfile')}</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center transition rounded-2xl bg-transparent text-gray-900 hover:bg-gray-200 text-emph px-6 py-3"
            style={{
              transitionProperty: 'background-color, border-color, color, fill, stroke',
            }}
            onClick={() => {
              hideDropdowns();
              window.location.pathname = '/api/auth/logout';
            }}
          >
            <SignOut24Filled className="mr-6 text-gray-700" />
            <span className="text-emph">{t('logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const LanguageSelectionDropdownContent: React.FC = () => {
  const [language, setLanguage] = useRecoilState(languageState.atom);
  return (
    <div className="flex items-center">
      <button
        type="button"
        className={mergeClassNames(
          'flex w-full justify-between items-center transition rounded-2xl bg-transparent text-gray-900 hover:bg-gray-200 text-emph px-4 py-2',
          language === 'ko' ? 'cursor-default bg-gray-200' : '',
        )}
        style={{
          transitionProperty: 'background-color, border-color, color, fill, stroke',
        }}
        onClick={() => {
          if (i18n.language === 'ko') return;
          i18n.changeLanguage('ko');
          setLanguage('ko');
          fetchAPI('PATCH /users/me/language', {}, {
            language: 'ko',
          });
        }}
      >
        <i className="twa twa-kr text-big" />
        {' '}
        <span style={{ lineHeight: '32px' }}>한국어</span>
      </button>
      <div className="mx-4 bg-gray-200" style={{ width: 1, height: 24 }} />
      <button
        type="button"
        className={mergeClassNames(
          'flex w-full justify-between items-center transition rounded-2xl bg-transparent text-gray-900 hover:bg-gray-200 text-emph px-4 py-2',
          language === 'en' ? 'cursor-default bg-gray-200' : '',
        )}
        style={{
          transitionProperty: 'background-color, border-color, color, fill, stroke',
        }}
        onClick={() => {
          if (i18n.language === 'en') return;
          i18n.changeLanguage('en');
          setLanguage('en');
          fetchAPI('PATCH /users/me/language', {}, {
            language: 'en',
          });
        }}
      >
        <i className="twa twa-us text-big absolute" style={{ transform: 'translate(6px, 6px)', zIndex: 1 }} />
        <i className="twa twa-gb text-big" style={{ transform: 'translate(-6px, -6px)' }} />
        {' '}
        <span style={{ lineHeight: '32px' }}>English</span>
      </button>
    </div>
  );
};

interface Props {
  isUIHidden: boolean;
}

const Header: React.FC<Props> = ({ isUIHidden }) => {
  const screenType = useScreenType();
  const location = useLocation();
  const history = useHistory();
  const me = useRecoilValue(meState.atom);
  const mainClassroomHash = useRecoilValue(mainClassroomHashState.atom);
  const mainClassroom = useRecoilValue(classroomsState.byHash(mainClassroomHash));

  const classroomHash = location.pathname.match(/^\/classrooms\/(\w{3}-\w{3}-\w{3})/)?.[1];
  const inClassroom = !!classroomHash;

  const [isLanguageDropdownVisible, setLanguageDropdownVisible] = React.useState(false);
  const [isNotificationDropdownVisible, setNotificationDropdownVisible] = React.useState(false);
  const [isProfileDropdownVisible, setProfileDropdownVisible] = React.useState(false);

  const hideDropdowns = () => {
    setLanguageDropdownVisible(false);
    setNotificationDropdownVisible(false);
    setProfileDropdownVisible(false);
  };

  const isMobileLandscapeClassroomUI = screenType === ScreenType.MobileLandscape && inClassroom;

  const isMainButtonsVisible = (
    screenType === ScreenType.Desktop
    || (screenType === ScreenType.MobilePortrait && !inClassroom)
    || (screenType === ScreenType.MobileLandscape && !inClassroom)
  );
  const isClassroomButtonsVisible = (
    inClassroom && screenType !== ScreenType.MobileLandscape
  ) || (
    isMobileLandscapeClassroomUI && !isUIHidden
  );

  return (
    <>
      {/* Profile Dropdown */}
      <Dropdown
        visible={isProfileDropdownVisible}
        onClose={() => setProfileDropdownVisible(false)}
        right={0}
      >
        <ProfileDropdownContent
          src={me.loaded ? me.info?.profileImage : undefined}
          displayName={me.loaded ? (me.info?.displayName ?? '') : ''}
          hideDropdowns={hideDropdowns}
        />
      </Dropdown>

      {/* Notification Dropdown */}
      <Dropdown
        visible={isNotificationDropdownVisible}
        onClose={() => setNotificationDropdownVisible(false)}
        right={60}
      >
        hi
      </Dropdown>

      {/* Language Selection Dropdown */}
      <Dropdown
        visible={isLanguageDropdownVisible}
        onClose={() => setLanguageDropdownVisible(false)}
        right={130}
      >
        <LanguageSelectionDropdownContent />
      </Dropdown>
      <div
        className={mergeClassNames(
          'w-100vw h-16 px-4 py-3 fixed top-0 items-center content-center flex justify-between z-header transition-button',
          screenType === ScreenType.MobileLandscape ? 'bg-transparent' : 'bg-white',
        )}
        style={{
          height: 'calc(env(safe-area-inset-top, 0px) + 64px)',
          boxShadow: screenType === ScreenType.MobileLandscape ? 'none' : '0 0 16px 0 rgba(0, 0, 0, 0.25)',
        }}
      >
        <div className="flex items-center">
          {/* Back button or Logo */}
          <div className="w-fit h-10 mr-4 flex justify-center items-center">
            {inClassroom ? (
              <>
                {(!inClassroom || isClassroomButtonsVisible) && (
                  <AmbientButton
                    dark={isMobileLandscapeClassroomUI}
                    alt="Back"
                    icon={(
                      <IosArrowLtr24Regular
                        className="inline-block"
                        style={{ transform: 'translateX(3px)' }}
                      />
                  )}
                    onClick={() => {
                      hideDropdowns();
                      appHistory.goBack(history);
                    }}
                  />
                )}
                {screenType === ScreenType.MobileLandscape && !isUIHidden && <MemberList />}
              </>
            ) : (
              <LogoButton
                onClick={() => {
                  hideDropdowns();
                  appHistory.goMain(history);
                }}
              />
            )}
          </div>
          {/* Classroom Name */}
          {mainClassroom && inClassroom && screenType === ScreenType.MobilePortrait && (
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
                {mainClassroom.name}
              </span>
            </div>
          )}
          {mainClassroom && inClassroom && screenType === ScreenType.Desktop && (
            <div>
              <span className="font-semibold text-base" style={{ lineHeight: '19px' }}>
                {mainClassroom.name}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-5 items-center">
          {inClassroom && screenType !== ScreenType.MobilePortrait && (screenType === ScreenType.Desktop || !isUIHidden) && (
            <div className="w-fit px-2 flex">
              <ClassroomInstructorButtons />
            </div>
          )}
          {/* Classroom Buttons */}
          {isClassroomButtonsVisible && (
            <>
              <AmbientButton
                dark={isMobileLandscapeClassroomUI}
                alt="Members"
                icon={<People24Filled />}
                filled
                onClick={() => {
                  if (!classroomHash) return;
                  appHistory.push(`/classrooms/${classroomHash}/members`, history);
                }}
              />
              <AmbientButton
                dark={isMobileLandscapeClassroomUI}
                alt="Settings"
                icon={<Settings24Filled />}
                filled
                onClick={() => {
                  appHistory.push(`/classrooms/${classroomHash!}/settings`, history);
                }}
              />
            </>
          )}
          {isMainButtonsVisible && (
            <>
              <AmbientButton
                alt="Langauge Selection"
                className="mr-2.5"
                icon={(
                  <span className="w-6 h-6">
                    <span className="inline-flex items-center w-10">
                      <Globe24Regular />
                      {/* Downward Arrow */}
                      <svg className="ml-1" width="12.5" height="7.5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L4.29289 4.29289C4.68342 4.68342 5.31658 4.68342 5.70711 4.29289L9 1" stroke="#46444A" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </span>
                  )}
                onClick={() => {
                  hideDropdowns();
                  setLanguageDropdownVisible(() => !isLanguageDropdownVisible);
                }}
              />
              <AmbientButton
                alt="Notifications"
                icon={<Alert24Filled />}
                filled
                onClick={() => {
                  hideDropdowns();
                  setNotificationDropdownVisible(() => !isNotificationDropdownVisible);
                }}
              />
              {!me.loaded ? (
                <AmbientButton
                  alt="Account Settings (Logging in)"
                  icon={<SpinnerIos20Regular className="animate-spin block" style={{ height: 20 }} />}
                  onClick={() => {
                    hideDropdowns();
                  }}
                />
              ) : me.info ? (
                <AmbientButton
                  alt="Account Settings"
                  icon={(
                    <img
                      src={me.info.profileImage}
                      alt="Profile"
                      className="w-10 h-10 rounded-full overflow-hidden object-cover object-center shadow-button"
                      style={{ '--shadow-color': 'rgba(0, 0, 0, 0.1)' } as React.CSSProperties}
                    />
                  )}
                  isImageIcon
                  onClick={() => {
                    hideDropdowns();
                    setProfileDropdownVisible(() => !isProfileDropdownVisible);
                  }}
                />
              ) : (
                <AmbientButton
                  alt="Account Settings"
                  icon={<DoorArrowLeft24Regular />}
                  onClick={() => {
                    hideDropdowns();
                    if (appHistory.pathname !== '/login') {
                      appHistory.push(`/login?redirect_uri=${appHistory.pathname}`, history);
                    }
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
