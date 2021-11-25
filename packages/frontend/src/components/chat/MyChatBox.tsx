import React from 'react';

import {
  TypedChatContent, ChatType, ChatContent, TextChatContent, PhotoChatContent,
} from '../../types/chat';

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
  type === ChatType.TEXT
    ? <MyTextChat dark={dark} content={content as TextChatContent} />
    : <MyPhotoChat dark={dark} content={content as PhotoChatContent} />
);

interface Props {
  dark: boolean;
  chats: ChatContent[];
}

function calDate(content: ChatContent['content']) {
  let result;
  if (content.sentAt.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)) {
    result = (content.sentAt.toLocaleString().charAt(21) === ':') ? content.sentAt.toLocaleString().slice(13, 21) : content.sentAt.toLocaleString().slice(13, 22);
  } else {
    result = content.sentAt.toLocaleString();
  }
  return result;
}
const MyChatBox: React.FC<Props> = ({
  dark, chats,
}) => (
  <div className="w-full flex justify-end gap-2">
    <div className="flex flex-col gap-1.5 items-end" style={{ maxWidth: 'calc(100% - 80px)' }}>
      {chats.map((chat) => (
        <MyChat key={chat.id} dark={dark} type={chat.type} content={chat.content} />
      ))}
      <div className="text-tiny text-gray-500" style={{ padding: '3px 4px' }}>
        {calDate(chats.slice(-1)?.[0].content)}
      </div>
    </div>
  </div>
);

export default MyChatBox;
