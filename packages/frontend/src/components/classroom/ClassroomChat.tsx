import { SpinnerIos20Regular } from '@fluentui/react-icons';
import {
  ChatContent, ResponseError, SocketChat, SocketClassroom,
} from '@team-10/lib';
import React from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useIntersectionObserver } from 'react-intersection-observer-hook';
import { useRecoilState, useRecoilValue, atom } from 'recoil';

import useScreenType from '../../hooks/useScreenType';
import useSocket from '../../hooks/useSocket';
import meState from '../../recoil/me';
import fetchAPI from '../../utils/fetch';
import { conditionalStyle } from '../../utils/style';
import FeedChatBox from '../chat/FeedChatBox';
import MyChatBox from '../chat/MyChatBox';
import OthersChatBox from '../chat/OthersChatBox';

const chatsAtom = atom<ChatContent[]>({
  key: 'chatsAtom',
  default: [],
});

const useChats = (
  wrapperRef: React.RefObject<HTMLDivElement>,
  setScrollBottom: (scrollBottom: number) => void,
) => {
  const [chats, setChats] = useRecoilState(chatsAtom);
  const [isLoading, setLoading] = React.useState(false);
  const [hash, setHash] = React.useState<string>('');
  const [lastChatId, setLastChatId] = React.useState<string | null | undefined>(undefined);
  const [error, setError] = React.useState<ResponseError | null>(null);

  const loadMore = React.useCallback((newHash: string) => {
    console.log('loadMore', newHash, isLoading, lastChatId);
    if (isLoading) return;
    if (!newHash) return;

    setLoading(true);
    console.log('loading');
    fetchAPI(
      'GET /classrooms/:hash/chats',
      lastChatId ? { hash: newHash, chatId: lastChatId } : { hash: newHash },
    ).then((response) => {
      console.log('loaded');
      if (response.success) {
        setScrollBottom(
          wrapperRef.current
            ? wrapperRef.current.scrollHeight - wrapperRef.current.scrollTop
            : 0,
        );
        setError(null);
        setLastChatId(response.payload[0]?.id ?? null);
        setChats((i) => [...response.payload, ...i]);
      } else {
        setError(response.error);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [isLoading, lastChatId]);

  const resetHash = (newHash: string) => {
    console.log('resetHash', newHash);
    if (newHash === hash) return;
    setLastChatId(undefined);
    setHash(newHash);
    setChats([]);
    loadMore(newHash);
  };

  const addChat = (chat: ChatContent) => {
    setChats((i) => [...i, chat]);
  };

  return {
    isLoading,
    chats,
    addChat,
    hasNextPage: lastChatId !== null,
    resetHash,
    error,
    loadMore,
  };
};

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
  hash?: string;
}

const ClassroomChat: React.FC<Props> = ({
  isInstructor, dark, hash,
}) => {
  const myId = useRecoilValue(meState.id);
  const screenType = useScreenType();

  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const [bottomRef, { entry: bottomObserverEntry }] = useIntersectionObserver();
  const isAtBottom = !bottomObserverEntry || bottomObserverEntry.isIntersecting;

  const [scrollBottom, setScrollBottom] = React.useState(0);
  const {
    isLoading, chats, hasNextPage, resetHash, error, loadMore, addChat,
  } = useChats(wrapperRef, setScrollBottom);
  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage,
    onLoadMore: () => loadMore(hash ?? ''),
    disabled: !!error || !hash,
    rootMargin: '0px 0px 400px 0px',
  });

  const { socket, connected } = useSocket<
  SocketChat.Events.Response & SocketClassroom.Events.Response,
  SocketChat.Events.Request & SocketClassroom.Events.Response
  >('/');

  React.useEffect(() => {
    resetHash(hash ?? '');
  }, [hash]);

  React.useEffect(() => {
    if (wrapperRef.current) {
      if (isAtBottom) {
        wrapperRef.current.scrollTo(0, wrapperRef.current.scrollHeight + 99999);
      } else {
        wrapperRef.current.scrollTo(0, wrapperRef.current.scrollHeight - scrollBottom);
      }
    }
  }, [chats, wrapperRef.current]);

  React.useEffect(() => {
    const listener = ({ hash: chatClassroomHash, message }: SocketChat.Broadcast.Chat) => {
      console.log('chat', hash, message);
      if (hash === chatClassroomHash) {
        addChat(message);
      }
    };
    socket.on('chat/ChatBroadcast', listener);

    return () => {
      socket.off('chat/ChatBroadcast', listener);
    };
  }, [socket, hash]);

  React.useEffect(() => {
    const listener = ({ hash: chatClassroomHash, patch }: SocketClassroom.Broadcast.Patch) => {
      console.log('chat', hash, patch);
      if (hash === chatClassroomHash) {
        if (typeof patch.isLive !== 'undefined') {
          const chat: ChatContent<'feed'> = {
            id: `FeedChat__${Date.now()}`,
            type: 'feed',
            sentAt: Date.now(),
            content: {
              type: 'class',
              isStart: patch.isLive,
            },
          };
          addChat(chat);
        }
      }
    };
    socket.on('classroom/PatchBroadcast', listener);

    return () => {
      socket.off('classroom/PatchBroadcast', listener);
    };
  }, [socket, hash]);

  return (
    <div
      ref={wrapperRef}
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
      <div className="flex flex-col gap-4 px-8 pt-8">
        {(isLoading || hasNextPage) && (
          <div ref={sentryRef} style={{ transform: 'scale(200%)' }} className="w-5 h-5 m-auto pt-6 py-10">
            <SpinnerIos20Regular className="stroke-current stroke-2 text-gray-300 block w-5 h-5 animate-spin" />
          </div>
        )}

        {chunkChats(chats).map((chatChunks) => (
          chatChunks[0].type === 'feed'
            ? (
              <FeedChatBox
                key={`__FEED__-${chatChunks[0].sentAt}`}
                dark={dark}
                chats={chatChunks as ChatContent<'feed'>[]}
              />
            )
            : chatChunks[0].sender!.stringId === myId
              ? (
                <MyChatBox
                  key={`${myId}-${chatChunks[0].sentAt}`}
                  dark={dark}
                  chats={chatChunks}
                />
              )
              : (
                <OthersChatBox
                  key={`${chatChunks[0].sender!.stringId}-${chatChunks[0].sentAt}`}
                  dark={dark}
                  sender={chatChunks[0].sender!}
                  chats={chatChunks}
                />
              )
        ))}
        <div ref={bottomRef} className="w-full h-8" />
      </div>
    </div>
  );
};

export default ClassroomChat;
