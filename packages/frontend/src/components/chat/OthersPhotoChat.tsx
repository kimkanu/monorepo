import React from 'react';

import { PhotoChatContent } from '../../types/chat';
import { mergeClassNames } from '../../utils/style';

import styles from './Chat.module.css';

interface Props {
  dark: boolean;
  content: PhotoChatContent;
}
const OthersPhotoChat: React.FC<Props> = ({ dark, content }) => (
  <div className={mergeClassNames('rounded-2xl overflow-hidden', styles.maxWidth)}>
    <img src={content.photo} alt={content.alt} />
  </div>
);

export default OthersPhotoChat;
