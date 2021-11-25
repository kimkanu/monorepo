import {
  Send20Filled,
  Image20Regular,
} from '@fluentui/react-icons';
import React from 'react';

import {
  TypedChatContent, ChatType, ChatContent, TextChatContent, PhotoChatContent,
} from '../../types/chat';

import AmbientButton from '../buttons/AmbientButton';

interface Props {
  dark: boolean; // 모바일 가로 교실 화면인지
  text: string;
  onInput?: (newText: string) => void;
  onPhotoButtonClick?: React.MouseEventHandler;
  onSend?: React.MouseEventHandler;
}

const ChatInput: React.FC<Props> = ({
  dark, // dark 스타일링 해주세요!
  text,
  onInput,
  onPhotoButtonClick,
  onSend,
}) => (
  <div className="w-full flex justify-center gap-2">
    <div className="w-full flex flex-row justify-center">
      <AmbientButton
        size={40}
        icon={<Image20Regular />}
        onClick={onPhotoButtonClick}
      />
      <input
        type="text"
        style={{ width: 'calc(100% - 80px)' }}
        value={text}
        onInput={(e) => {
          if (onInput) {
            onInput(e.currentTarget.value);
          }
        }}
        className="text-gray-900 text-emph h-10 rounded-full placeholder-sans outline-none border-none focus:ring-2 bg-gray-200 font-sans px-4 mx-3"
      />
      <AmbientButton
        size={40}
        icon={<Send20Filled className="text-primary-500" />}
        onClick={onSend}
      />
    </div>
  </div>
);

export default ChatInput;
