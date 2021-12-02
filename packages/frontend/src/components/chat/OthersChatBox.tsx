import {
  ChatType, ChatContent, TextChatContent, PhotoChatContent,
} from '@team-10/lib';
import React from 'react';

import { stringifyDateTime } from '../../utils/date';
import { mergeClassNames } from '../../utils/style';

import OthersPhotoChat from './OthersPhotoChat';
import OthersTextChat from './OthersTextChat';

interface ClassMember {
  displayName: string;
  profileImage: string;
}

interface OthersChatProps {
  dark: boolean;
  type: ChatType;
  content: ChatContent['content'];
}
const OthersChat: React.FC<OthersChatProps> = ({
  type, dark, content,
}) => (
  type === 'text'
    ? <OthersTextChat dark={dark} content={content as TextChatContent} />
    : <OthersPhotoChat dark={dark} content={content as PhotoChatContent} />
);

interface Props {
  dark: boolean;
  sender: ClassMember;
  chats: ChatContent[];
}
const OthersChatBox: React.FC<Props> = ({
  dark, sender, chats,
}) => (
  <div className="w-full flex justify-start gap-2">
    <div className="w-8 h-8 rounded-full overflow-hidden">
      <img className="w-full h-full" alt={`${sender.displayName}의 프로필 사진`} src={sender.profileImage} />
    </div>
    <div className="flex flex-col gap-1.5 items-start" style={{ maxWidth: 'calc(100% - 40px)' }}>
      {chats.map((chat) => (
        <OthersChat key={chat.id} dark={dark} type={chat.type} content={chat.content} />
      ))}
      <div
        className={mergeClassNames(
          'text-tiny', dark ? 'bg-gray-600 bg-opacity-70 text-white rounded-lg' : 'text-gray-500',
        )}
        style={{ padding: '3px 4px' }}
      >
        {sender.displayName}
        {' ㆍ '}
        {stringifyDateTime(chats.slice(-1)[0].sentAt)}
      </div>
    </div>
  </div>
);

export default OthersChatBox;
