import { PhotoChatContent } from '@team-10/lib';
import React from 'react';

import { mergeClassNames } from '../../utils/style';

import styles from './Chat.module.css';
import SizedPhotoContainer from './SizedPhotoContainer';

interface Props {
  dark: boolean;
  content: PhotoChatContent;
  size?: [number, number];
}

const MyPhotoChat: React.FC<Props> = ({ dark, content, size }) => (
  <div className={mergeClassNames('rounded-2xl overflow-hidden', styles.maxWidth)} style={{ maxHeight: 280 }}>
    <SizedPhotoContainer className={dark ? 'opacity-50' : ''} src={content.photo} alt={content.alt} size={size} />
  </div>
);

export default MyPhotoChat;
