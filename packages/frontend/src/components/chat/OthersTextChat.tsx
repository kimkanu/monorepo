import { TextChatContent } from '@team-10/lib';
import React from 'react';

import { mergeClassNames } from '../../utils/style';

import styles from './Chat.module.css';

interface Props {
  dark: boolean;
  content: TextChatContent;
}
const OthersTextChat: React.FC<Props> = ({ dark, content }) => (
  <div
    style={{ padding: '5px 12px' }}
    className={mergeClassNames(
      'text-base rounded-tl rounded-tr-2xl rounded-b-2xl',
      dark ? 'bg-gray-600 bg-opacity-70 text-white' : 'bg-gray-200',
      styles.maxWidth,
    )}
  >
    {content.text}
  </div>
);

export default OthersTextChat;
