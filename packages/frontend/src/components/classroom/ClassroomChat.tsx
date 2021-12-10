import { SpinnerIos20Regular } from '@fluentui/react-icons';
import {
  ChatContent, ResponseError, SocketChat, SocketClassroom,
} from '@team-10/lib';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useIntersectionObserver } from 'react-intersection-observer-hook';
import {
  useRecoilState, useRecoilValue, atom, useSetRecoilState,
} from 'recoil';

import useScreenType from '../../hooks/useScreenType';
import useSocket from '../../hooks/useSocket';
import languageState from '../../recoil/language';
import meState from '../../recoil/me';
import toastState from '../../recoil/toast';

import { isSameDate } from '../../utils/date';
import fetchAPI from '../../utils/fetch';
import { conditionalStyle } from '../../utils/style';
import FeedChatBox from '../chat/FeedChatBox';
import MyChatBox from '../chat/MyChatBox';
import OthersChatBox from '../chat/OthersChatBox';

const chatsAtom = atom<{
  chats: ChatContent[];
  lastChatId: string | null | undefined;
  lastHash: string;
}>({
  key: 'chatsAtom',
  default: {
    chats: [],
    lastChatId: undefined,
    lastHash: '',
  },
});

const translatedChatsAtom = atom<{ [chatId: string]: string }>({
  key: 'translatedChatsAtom',
  default: {},
});

const useChats = (
  wrapperRef: React.RefObject<HTMLDivElement>,
  setScrollBottom: (scrollBottom: number) => void,
) => {
  const [{ chats, lastChatId, lastHash }, setChatsState] = useRecoilState(chatsAtom);
  const [isLoading, setLoading] = React.useState(false);
  const [hash, setHash] = React.useState<string>('');
  const [error, setError] = React.useState<ResponseError | null>(null);

  const loadMore = React.useCallback((newHash: string) => {
    if (isLoading) return;
    if (!newHash) return;

    setLoading(true);
    fetchAPI(
      'GET /classrooms/:hash/chats',
      lastChatId ? { hash: newHash, chatId: lastChatId } : { hash: newHash },
    ).then((response) => {
      if (response.success) {
        setScrollBottom(
          wrapperRef.current
            ? wrapperRef.current.scrollHeight - wrapperRef.current.scrollTop
            : 0,
        );
        setError(null);
        setChatsState((s) => ({
          ...s,
          chats: [...response.payload, ...s.chats],
          lastChatId: response.payload[0]?.id ?? null,
        }));
      } else {
        setError(response.error);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [isLoading, lastChatId]);

  const resetHash = (newHash: string) => {
    if (newHash === hash) return;
    if (newHash === lastHash) return;
    if (!newHash) return;
    setHash(newHash);
    setChatsState(({ chats: [], lastChatId: undefined, lastHash: newHash }));
    loadMore(newHash);
  };

  const addChat = (chat: ChatContent) => {
    if (chats.some((c) => c.id === chat.id)) return;
    setChatsState((s) => ({ ...s, chats: [...s.chats, chat] }));
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
        || ((collection[collection.length - 1][0].sender?.stringId === item.sender?.stringId)
        && (isSameDate(collection[collection.length - 1][0].sentAt, item.sentAt)))
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
  const [translatedChats, setTranslatedChats] = useRecoilState(translatedChatsAtom);
  const myId = useRecoilValue(meState.id);
  const addToast = useSetRecoilState(toastState.new);
  const language = useRecoilValue(languageState.atom);
  const screenType = useScreenType();
  const { t } = useTranslation('classroom');

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

  const onTranslate = async (chatContent: ChatContent) => {
    const response = await fetchAPI(
      'GET /translate',
      { chatId: chatContent.id } as any,
    );
    if (response.success) {
      setTranslatedChats((c) => ({
        ...c,
        [chatContent.id]: response.payload,
      }));
    } else if (response.error.code === 'UNNECESSARY_TRANSLATION') {
      addToast({
        type: 'warn',
        sentAt: new Date(),
        message: t('unnecessaryTranslation'),
      });
      throw new Error();
    } else if (response.error.code === 'UNSUPPORTED_TRANSLATION') {
      addToast({
        type: 'warn',
        sentAt: new Date(),
        message: t('unsupportedTranslation'),
      });
      throw new Error();
    }
  };

  const { socket } = useSocket<
  SocketChat.Events.Response & SocketClassroom.Events.Response,
  SocketChat.Events.Request & SocketClassroom.Events.Response
  >('/');

  React.useEffect(() => {
    resetHash(hash ?? '');
  }, [hash]);

  React.useEffect(() => {
    setTranslatedChats({});
  }, [language]);

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
    socket.on('chat/ChatBroadcast', ({ hash: chatClassroomHash, message }) => {
      if (hash === chatClassroomHash) {
        addChat(message);
      }
    });
    return () => {
      socket.off('chat/ChatBroadcast');
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
                key={chatChunks[0].id}
                dark={dark}
                chats={chatChunks as ChatContent<'feed'>[]}
              />
            )
            : chatChunks[0].sender!.stringId === myId
              ? (
                <MyChatBox
                  key={chatChunks[0].id}
                  dark={dark}
                  chats={chatChunks}
                  translations={translatedChats}
                  onTranslate={onTranslate}
                />
              ) : (
                <OthersChatBox
                  key={chatChunks[0].id}
                  dark={dark}
                  sender={chatChunks[0].sender!}
                  chats={chatChunks}
                  translations={translatedChats}
                  onTranslate={onTranslate}
                />
              )
        ))}
        <div ref={bottomRef} className="w-full h-8" />
      </div>
    </div>
  );
};

export default ClassroomChat;
