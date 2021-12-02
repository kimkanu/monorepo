import {
  ChatContent, ChatType, FeedChatContent, FeedType,
} from '@team-10/lib';
import React from 'react';

import { stringifyDateConsistent } from '../../utils/date';
import { mergeClassNames } from '../../utils/style';

interface FeedChatProps {
  dark: boolean;
  content: FeedChatContent<FeedType>;
}
const FeedChat: React.FC<FeedChatProps> = ({
  dark, content,
}) => (
  <div
    className={mergeClassNames(
      'text-tiny text-center',
      dark ? 'bg-gray-600 bg-opacity-70 py-1 px-2 w-fit rounded-lg mx-auto text-white' : 'text-gray-500',
    )}
  >
    {content.type === 'date' ? (
      stringifyDateConsistent(content.date)
    ) : (
      content.isStart ? '수업이 시작되었습니다.' : '수업이 끝났습니다.'
    )}
  </div>
);

interface Props {
  dark: boolean;
  chats: ChatContent<'feed'>[];
}

const FeedChatBox: React.FC<Props> = ({
  dark, chats,
}) => (
  <div className="w-full flex flex-col gap-5 p-2.5">
    {chats.map((chat) => (
      <FeedChat key={chat.id} dark={dark} content={chat.content} />
    ))}
  </div>
);

export default FeedChatBox;
