import React from 'react';

import {
  TypedChatContent, ChatType, ChatContent, TextChatContent, PhotoChatContent,
} from '../../types/chat';

import OthersPhotoChat from './OthersPhotoChat';
import OthersTextChat from './OthersTextChat';

interface ClassMember {
  displayName: string;
  profileImage: string;
}

interface OthersChatProps {
  dark: boolean; // 모바일 가로 교실 화면인지
  type: ChatType;
  content: ChatContent['content'];
}
const OthersChat: React.FC<OthersChatProps> = ({
  type, dark, content,
}) => (
  type === ChatType.TEXT
    ? <OthersTextChat dark={dark} content={content as TextChatContent} />
    : <OthersPhotoChat dark={dark} content={content as PhotoChatContent} />
);

interface Props {
  dark: boolean; // 모바일 가로 교실 화면인지
  sender: ClassMember;
  chats: ChatContent[];
}
function calDate(content: ChatContent['content']) {
  let result;
  if (content.sentAt.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)) {
    result = content.sentAt.toLocaleString().slice(13, 22);
  } else {
    result = content.sentAt.toLocaleString();
  }
  return result;
}
const OthersChatBox: React.FC<Props> = ({
  dark, sender, chats,
}) => (
  <div className="w-full flex justify-start gap-2">
    <div className="w-8 h-8 rounded-full overflow-hidden">
      <img className="w-full h-full" alt={`${sender.displayName}의 프로필 사진`} src={sender.profileImage} />
    </div>
    <div className="flex flex-col gap-1.5 items-start" style={{ maxWidth: 'calc(100% - 80px)' }}>
      {chats.map((chat) => (
        <OthersChat key={chat.id} dark={dark} type={chat.type} content={chat.content} />
      ))}
      <div className="text-tiny text-gray-500" style={{ padding: '3px 4px' }}>
        {sender.displayName}
        {' ㆍ '}
        {calDate(chats.slice(-1)?.[0].content)}
      </div>
    </div>
  </div>
);

export default OthersChatBox;
