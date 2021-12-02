import React from 'react';
import { useRecoilValue } from 'recoil';

import useScreenType from '../../hooks/useScreenType';
import meState from '../../recoil/me';
import { ChatContent, ChatType, FeedType } from '@team-10/lib';
import { conditionalStyle } from '../../utils/style';
import FeedChatBox from '../chat/FeedChatBox';
import MyChatBox from '../chat/MyChatBox';
import OthersChatBox from '../chat/OthersChatBox';

/**
 * chats를 FeedChat끼리 또는 같은 sender끼리 묶어 chunking합니다.
 */
function chunkChats(chats: ChatContent[]): ChatContent[][] {
  return chats.reduce((collection, item) => {
    if (collection.length > 0 && (
      (collection[collection.length - 1][0].type === 'feed' && item.type === 'feed')
        || collection[collection.length - 1][0].sender?.stringId === item.sender?.stringId
    )) {
      collection[collection.length - 1].push(item);
      return collection;
    }
    collection.push([item]);
    return collection;
  }, [] as ChatContent[][]);
}

interface Props {
  isInstructor: boolean;
  dark: boolean;
}

const ClassroomChat: React.FC<Props> = ({
  isInstructor, dark,
}) => {
  /**
   * // TODO: TODO: TODO
   */
  const user1 = {
    userId: 'user1',
    displayName: '닉네임',
    profileImage: 'https://picsum.photos/128',
  };
  const chats: ChatContent[] = [
    {
      type: 'text',
      id: 'sjdkslakcnkajsdksjdh',
      sender: user1,
      sentAt: new Date(Date.now() - 86400000),
      content: {
        text: '안녕하세요?',
      },
    },
    {
      type: 'text',
      id: 'aosdjakscnkajsdnksajdn',
      sender: user1,
      sentAt: new Date(Date.now() - 86400000),
      content: {
        text: '채팅이 매우 길 수도 있다는 점을 생각하고 긴 메시지는 이렇게 표시되어야 합니다.',
      },
    },
    {
      type: 'text',
      id: 'qegbowkapsclsokdnijssds',
      sender: user1,
      sentAt: new Date(Date.now() - 86400000),
      content: {
        text: '짧은 메시지',
      },
    },
    {
      type: 'feed',
      id: ';aklc,qslcaklcs,lsmdklqkwmd',
      sentAt: new Date(),
      content: {
        type: FeedType.DATE,
        date: new Date(),
      },
    },
    {
      type: 'feed',
      id: ';aklc,asklgmkadjcksjascsacjkjsnc',
      sentAt: new Date(),
      content: {
        type: FeedType.CLASS,
        isStart: true,
      },
    },
    {
      type: 'text',
      id: 'aslpqlkokansclksvnmbslkaslckslkcsj',
      sender: user1,
      sentAt: new Date(),
      content: {
        text: '사진 지원을 한다면:',
      },
    },
    {
      type: 'photo',
      id: 'asfagadbavslkcmlk jbacskjlkcm',
      sender: user1,
      sentAt: new Date(),
      content: {
        photo: 'https://picsum.photos/256',
        alt: '채팅 사진',
      },
    },
  ];
  const myId = useRecoilValue(meState.id);
  const screenType = useScreenType();

  return (
    <div
      style={conditionalStyle({
        desktop: {
          marginTop: 'calc(env(safe-area-inset-top, 0px) + 64px)',
          marginLeft: 'calc(100vw - env(safe-area-inset-right, 0px) - var(--chat-section-width--desktop))',
          width: 'calc(clamp(352px, 30vw, 416px))',
          height: 'calc(100 * var(--wh) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 64px)',
          paddingBottom: 200,
          overflow: 'auto',
        },
        mobilePortrait: {
          marginTop: 'calc(env(safe-area-inset-top, 0px) + 64px + 56.25vw)',
          width: '100%',
          height: 'calc(100 * var(--vh) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 200px - 56.25vw)',
          overflow: 'auto',
          paddingTop: isInstructor ? 68 : 0,
        },
        mobileLandscape: {
          width: 433,
          zIndex: 9999,
          overflowY: 'scroll',
          overflowX: 'hidden',
          maxHeight: 'calc(100 * var(--vh) - 136px)',
        },
      })(screenType)}
    >
      <div className="flex flex-col gap-4 p-8">
        {chunkChats(chats).map((chatChunks) => (
          chatChunks[0].type === 'feed'
            ? (
              <FeedChatBox
                key={`__FEED__-${chatChunks[0].sentAt.getTime()}`}
                dark={dark}
                chats={chatChunks as ChatContent<'feed'>[]}
              />
            )
            : chatChunks[0].sender!.stringId === myId
              ? (
                <MyChatBox
                  key={`${myId}-${chatChunks[0].sentAt.getTime()}`}
                  dark={dark}
                  chats={chatChunks}
                />
              )
              : (
                <OthersChatBox
                  key={`${chatChunks[0].sender!.stringId}-${chatChunks[0].sentAt.getTime()}`}
                  dark={dark}
                  sender={chatChunks[0].sender!}
                  chats={chatChunks}
                />
              )
        ))}
      </div>
    </div>
  );
};

export default ClassroomChat;
