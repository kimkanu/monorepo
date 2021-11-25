import React from 'react';

import { PhotoChatContent } from '../../types/chat';

interface Props {
  dark: boolean;
  content: PhotoChatContent;
}
const MyPhotoChat: React.FC<Props> = ({ dark, content }) => (
  <div style={{ maxWidth: 'calc(100% - 40px)' }} className="rounded-2xl overflow-hidden">
    <img src={content.url} alt="" />
  </div>
);

export default MyPhotoChat;
