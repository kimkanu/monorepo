import {
  Person20Filled,
  Person24Filled,
  Star12Filled,
} from '@fluentui/react-icons';

import React from 'react';

import { mergeClassNames, Styled } from '../../utils/style';
import AmbientButton from '../buttons/AmbientButton';

interface Props {
  name: string;
  img: string;
  isHost: boolean;
  isMe: boolean;
  isSpeaking: boolean;
}

const FooterMember: React.FC<Styled<Props>> = ({
  name, img, isHost, isMe, isSpeaking,
}) => (
  <div className={isHost ? 'order-3' : isSpeaking ? 'order-2' : isMe ? 'order-1' : 'order-4 items-center content-center justify-center'}>
    { isSpeaking ? (
      <>
        <span className="animate-ping-small absolute w-10 h-10 ml-2 mr-2 px-2 py-2 bg-primary-500 opacity-75 rounded-full" />
        <div className="w-10 h-10 ml-2 mr-2 px-2 py-2 bg-primary-500 rounded-full items-center content-center justify-center">
          <Person24Filled />
        </div>
      </>
    ) : isMe ? (
      <div className="w-10 h-10 ml-2 mr-2 px-2 py-2 bg-blue-500 rounded-full items-center content-center justify-center">
        <Person24Filled />
      </div>
    ) : isHost ? (
      <div className="w-10 h-10 ml-2 mr-2 px-2 py-2 bg-gray-500 rounded-full">
        <Person24Filled />
        <div className="relative w-3 h-3 bottom-1 -right-4 bg-pink-500 rounded-full text-center items-center content-center justify-center">
          <Star12Filled />
        </div>
      </div>
    ) : (
      <div className="w-9 h-9 ml-2 mr-2 px-2 py-2 bg-gray-500 rounded-full text-center items-center content-center justify-center">
        <Person20Filled className="w-full"/>
      </div>
    )}
  </div>
);

export default FooterMember;
