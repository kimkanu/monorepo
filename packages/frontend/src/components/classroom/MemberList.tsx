import { ClassroomMemberJSON } from '@team-10/lib';
import React from 'react';
import { useLocation } from 'react-router-dom';

import useMainClassroom from '../../hooks/useMainClassroom';
import useScreenType from '../../hooks/useScreenType';
import ScreenType from '../../types/screen';
import { conditionalClassName, mergeClassNames } from '../../utils/style';

import Member from './Member';

const FooterMemberList: React.FC = () => {
  const screenType = useScreenType();
  const location = useLocation();
  const mainClassroom = useMainClassroom();
  const inClassroom = /^\/classrooms\/\w{3}-\w{3}-\w{3}/.test(location.pathname);
  const maxMemberCount = {
    [ScreenType.MobilePortrait]: 4,
    [ScreenType.MobileLandscape]: 6,
    [ScreenType.Desktop]: Infinity,
  }[screenType];

  const memberPriority = (member: ClassroomMemberJSON) => {
    if (member.stringId === mainClassroom?.instructor.stringId) return 3;
    if (member.stringId === mainClassroom?.speakerId) return 2;
    if (member.isConnected) return 1;
    return 0;
  };
  const members = (mainClassroom?.members ?? [])
    .slice()
    .sort((m1, m2) => memberPriority(m2) - memberPriority(m1));

  return mainClassroom ? (
    <div
      className={mergeClassNames(
        'flex gap-4 items-center content-center justify-center',
        screenType === ScreenType.MobileLandscape && inClassroom ? 'ml-4 px-4 py-3 rounded-2xl' : null,
      )}
    >
      {/* Members in the current class */}
      {members
        .slice(0, maxMemberCount)
        .map(({
          stringId,
          displayName,
          profileImage,
          isConnected,
        }) => (
          <Member
            dark={screenType === ScreenType.MobileLandscape && inClassroom}
            key={stringId}
            name={displayName}
            profileImage={profileImage}
            isSpeaking={mainClassroom.speakerId === stringId}
            isConnected={isConnected}
            isInstructor={stringId === mainClassroom.instructor.stringId}
          />
        ))}
      {/* Number of users in the current class */}
      {members.length > maxMemberCount && (
      <span
        className={conditionalClassName({
          portrait: 'font-bold font-emph text-gray-900',
          mobileLandscape: inClassroom ? 'font-bold font-emph text-white bg-gray-900 bg-opacity-50' : 'font-bold font-emph text-gray-900',
        })(screenType)}
      >
        {`+${members.length - maxMemberCount}`}
      </span>
      )}
    </div>
  ) : <div />;
};

export default FooterMemberList;
