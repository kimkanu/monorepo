import {
  ChatType, ChatContent, TextChatContent, PhotoChatContent,
} from '@team-10/lib';
import React from 'react';

import { stringifyDateTime } from '../../utils/date';
import { mergeClassNames } from '../../utils/style';

import MyPhotoChat from './MyPhotoChat';
import MyTextChat from './MyTextChat';

interface MyChatProps {
  dark: boolean;
  type: ChatType;
  content: ChatContent['content'];
}
const MyChat: React.FC<MyChatProps> = ({
  type, dark, content,
}) => (
  type === 'text'
    ? <MyTextChat dark={dark} content={content as TextChatContent} />
    : <MyPhotoChat dark={dark} content={content as PhotoChatContent} />
);

interface Props {
  dark: boolean;
  chats: ChatContent[];
}

const MyChatBox: React.FC<Props> = ({
  dark, chats,
}) => (
  <div className="w-full flex justify-end gap-2">
    <div className="flex flex-col gap-1.5 items-end" style={{ maxWidth: 'calc(100% - 40px)' }}>
      {chats.map((chat) => (
        <MyChat key={chat.id} dark={dark} type={chat.type} content={chat.content} />
      ))}
      <div
        className={mergeClassNames(
          'text-tiny', dark ? 'bg-gray-600 bg-opacity-70 text-white rounded-lg' : 'text-gray-500',
        )}
        style={{ padding: '3px 4px' }}
      >
        {stringifyDateTime(chats.slice(-1)[0].sentAt)}
      </div>
    </div>
  </div>
);

export default MyChatBox;
