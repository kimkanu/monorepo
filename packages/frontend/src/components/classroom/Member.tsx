import { Star12Filled } from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { mergeClassNames, mergeStyles, Styled } from '../../utils/style';

interface Props {
  dark: boolean;
  name: string;
  profileImage: string;
  isInstructor: boolean;
  isSpeaking: boolean;
  isConnected: boolean;
}

const FooterMember: React.FC<Styled<Props>> = ({
  dark, name, profileImage, isInstructor, isSpeaking, isConnected, className, style,
}) => {
  const { t } = useTranslation('profile');
  return (
    <div className={mergeClassNames(isInstructor ? (dark ? 'w-10 h-10' : 'w-12 h-12 mr-3') : isSpeaking ? (dark ? 'w-10 h-10' : 'w-10 h-10 mr-2') : 'w-10 h-10', 'relative', className)} style={style}>
      {/* Ripples */}
      {isSpeaking && (
        <>
          <div
            className={mergeClassNames(
              isInstructor ? 'w-10 h-10' : 'w-8 h-8',
              'animate-ping-small-0 bg-primary-300 bg-opacity-50 absolute top-1 left-1 rounded-full z-0',
            )}
          />
          <div
            className={mergeClassNames(
              isInstructor ? 'w-10 h-10' : 'w-8 h-8',
              'animate-ping-small-1 bg-primary-300 bg-opacity-50 absolute top-1 left-1 rounded-full z-0',
            )}
          />
          <div
            className={mergeClassNames(
              isInstructor ? 'w-10 h-10' : 'w-8 h-8',
              'animate-ping-small-2 bg-primary-300 bg-opacity-50 absolute top-1 left-1 rounded-full z-0',
            )}
          />
        </>
      )}
      {/* Profile image */}
      <img
        src={profileImage}
        alt={t('profileImage', { s: name })}
        className={mergeClassNames(
          'w-full h-full rounded-full overflow-hidden object-cover object-center shadow-button relative z-1',
          isSpeaking ? 'shadow-color-primary' : null,
        )}
        style={mergeStyles(
          isSpeaking ? null : { '--shadow-color': 'rgba(0, 0, 0, 0.1)' } as React.CSSProperties,
          isConnected ? null : { filter: 'grayscale(1)' },
        )}
      />
      {/* Instructor mark */}
      {isInstructor && (
        <div
          className="w-4 h-4 bg-primary-500 text-white absolute bottom-0 right-0 rounded-full"
          style={{ padding: 2 }}
        >
          <Star12Filled style={{ transform: 'scale(80%)' }} />
        </div>
      )}
      {/* Offline mark */}
      {!isConnected && (
        <div
          className={`border-4 ${dark ? 'border-black' : 'border-white'} absolute w-6 h-6 rounded-full`}
          style={isInstructor && !dark ? { right: -8, top: -2 } : { right: -6, top: -6 }}
        >
          <div
            className={`w-4 h-4 ${dark ? 'bg-black' : 'bg-white'} border-4 border-gray-300 rounded-full`}
          />
        </div>
      )}
    </div>
  );
};

export default FooterMember;
