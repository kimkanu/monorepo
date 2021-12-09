import {
  ChatType, ChatContent, TextChatContent, PhotoChatContent,
} from '@team-10/lib';
import React from 'react';
import { useTranslation } from 'react-i18next';

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
  translation?: string;
  onTranslate: () => Promise<void>;
}
const OthersChat: React.FC<OthersChatProps> = ({
  type, dark, content, translation, onTranslate,
}) => (
  type === 'text'
    ? (
      <OthersTextChat
        dark={dark}
        content={content as TextChatContent}
        translation={translation}
        onTranslate={onTranslate}
      />
    )
    : <OthersPhotoChat dark={dark} content={content as PhotoChatContent} />
);

interface Props {
  dark: boolean;
  sender: ClassMember;
  chats: ChatContent[];
  translations: { [chatId: string]: string };
  onTranslate: (chatContent: ChatContent) => Promise<void>;
}
const OthersChatBox: React.FC<Props> = ({
  dark, sender, chats, translations, onTranslate,
}) => {
  const { t } = useTranslation('profile');
  return (
    <div className="w-full flex justify-start gap-2">
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <img
          className="w-full h-full shadow-button"
          style={{ '--shadow-color': 'rgba(0, 0, 0, 0.1)' } as React.CSSProperties}
          alt={t('profileImage', { s: sender.displayName })}
          src={sender.profileImage}
        />
      </div>
      <div className="flex flex-col gap-1.5 items-start w-full" style={{ maxWidth: 'calc(100% - 40px)' }}>
        {chats.map((chat) => (
          <OthersChat
            key={chat.id}
            dark={dark}
            type={chat.type}
            content={chat.content}
            translation={translations[chat.id]}
            onTranslate={() => onTranslate(chat)}
          />
        ))}
        <div
          className={mergeClassNames(
            'text-tiny', dark ? 'bg-gray-600 bg-opacity-70 text-white rounded-lg' : 'text-gray-500',
          )}
          style={{ padding: '3px 4px' }}
        >
          {sender.displayName}
          {' ㆍ '}
          {stringifyDateTime(new Date(chats.slice(-1)[0].sentAt))}
        </div>
      </div>
    </div>
  );
};

export default OthersChatBox;
