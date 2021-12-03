import { TextChatContent } from '@team-10/lib';
import React from 'react';

import { mergeClassNames } from '../../utils/style';

import styles from './Chat.module.css';

interface Props {
  dark: boolean;
  content: TextChatContent;
}
const MyTextChat: React.FC<Props> = ({ dark, content }) => (
  <div
    style={{ padding: '5px 12px' }}
    className={mergeClassNames(
      'text-base rounded-tl-2xl rounded-tr rounded-b-2xl',
      dark ? 'bg-gray-900 bg-opacity-50 text-white' : 'bg-gray-200',
      styles.maxWidth,
    )}
  >
    {content.text}
  </div>
);

export default MyTextChat;
