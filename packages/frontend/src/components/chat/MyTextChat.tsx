import React from 'react';

import { TextChatContent } from '../../types/chat';

interface Props {
  dark: boolean;
  content: TextChatContent;
}
const MyTextChat: React.FC<Props> = ({ dark, content }) => (
  <div
    style={{ maxWidth: 'calc(100% - 40px)', padding: '5px 12px' }}
    className="text-base bg-gray-200 rounded-tl-2xl rounded-tr rounded-b-2xl"
  >
    {content.text}
  </div>
);

const MyTextChat1: React.FC<Props> = ({ dark, content }) => (
  <div
    style={{ maxWidth: 'calc(100% - 40px)', padding: '5px 12px' }}
    className="text-base bg-gray-200 rounded-t-2xl rounded-b-2xl"
  >
    {content.text}
  </div>
);

export default MyTextChat;
