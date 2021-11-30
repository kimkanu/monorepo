import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import Dialog from '../components/alert/Dialog';
import Button from '../components/buttons/Button';
import FeedChatBox from '../components/chat/FeedChatBox';
import MyChatBox from '../components/chat/MyChatBox';
import OthersChatBox from '../components/chat/OthersChatBox';
import TextInput from '../components/input/TextInput';
import VoiceChat from '../components/voice/VoiceChat';
import WaveVisualizer from '../components/voice/WaveVisualizer';
import useMainClassroom from '../hooks/useMainClassroom';
import useScreenType from '../hooks/useScreenType';
import classroomsState from '../recoil/classrooms';
import mainClassroomHashState from '../recoil/mainClassroomHash';
import meState from '../recoil/me';
import { ChatContent, ChatType, FeedType } from '../types/chat';
import { clamp } from '../utils/math';
import { conditionalClassName, conditionalStyle } from '../utils/style';

/**
 * chats를 FeedChat끼리 또는 같은 sender끼리 묶어 chunking합니다.
 */
function chunkChats(chats: ChatContent[]): ChatContent[][] {
  return chats.reduce((collection, item) => {
    if (collection.length > 0 && (
      (collection[collection.length - 1][0].type === ChatType.FEED && item.type === ChatType.FEED)
      || collection[collection.length - 1][0].sender?.userId === item.sender?.userId
    )) {
      collection[collection.length - 1].push(item);
      return collection;
    }
    collection.push([item]);
    return collection;
  }, [] as ChatContent[][]);
}

interface ClassroomChatProps {
  isInstructor: boolean;
  dark: boolean;
  visible: boolean;
  hash: string;
}

const ClassroomChat: React.FC<ClassroomChatProps> = ({
  isInstructor, dark, visible, hash,
}) => {
  const user1 = {
    userId: 'user1',
    displayName: '닉네임',
    profileImage: 'https://picsum.photos/128',
  };
  const chats: ChatContent[] = [
    {
      type: ChatType.TEXT,
      id: 'sjdkslakcnkajsdksjdh',
      sender: user1,
      sentAt: new Date(Date.now() - 86400000),
      content: {
        text: '안녕하세요?',
      },
    },
    {
      type: ChatType.TEXT,
      id: 'aosdjakscnkajsdnksajdn',
      sender: user1,
      sentAt: new Date(Date.now() - 86400000),
      content: {
        text: '채팅이 매우 길 수도 있다는 점을 생각하고 긴 메시지는 이렇게 표시되어야 합니다.',
      },
    },
    {
      type: ChatType.TEXT,
      id: 'qegbowkapsclsokdnijssds',
      sender: user1,
      sentAt: new Date(Date.now() - 86400000),
      content: {
        text: '짧은 메시지',
      },
    },
    {
      type: ChatType.FEED,
      id: ';aklc,qslcaklcs,lsmdklqkwmd',
      sentAt: new Date(),
      content: {
        type: FeedType.DATE,
        date: new Date(),
      },
    },
    {
      type: ChatType.FEED,
      id: ';aklc,asklgmkadjcksjascsacjkjsnc',
      sentAt: new Date(),
      content: {
        type: FeedType.CLASS,
        isStart: true,
      },
    },
    {
      type: ChatType.TEXT,
      id: 'aslpqlkokansclksvnmbslkaslckslkcsj',
      sender: user1,
      sentAt: new Date(),
      content: {
        text: '사진 지원을 한다면:',
      },
    },
    {
      type: ChatType.PHOTO,
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
  const isFooterPresent = true;
  const screenType = useScreenType();

  return (
    <div
      style={conditionalStyle({
        desktop: {
          marginTop: 'calc(env(safe-area-inset-top, 0px) + 64px)',
          marginLeft: 'calc(100vw - env(safe-area-inset-right, 0px) - var(--chat-section-width--desktop))',
          width: 'calc(clamp(352px, 30vw, 416px))',
          height: `calc(100 * var(--wh) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - ${isFooterPresent ? 140 : 64}px)`,
          overflow: 'auto',
        },
        mobilePortrait: {
          marginTop: 'calc(env(safe-area-inset-top, 0px) + 64px + 56.25vw)',
          width: '100%',
          height: `calc(100 * var(--vh) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - ${isFooterPresent ? 140 : 64}px - 56.25vw)`,
          overflow: 'auto',
          paddingTop: isInstructor ? 68 : 0,
        },
      })(screenType)}
    >
      <div className="flex flex-col gap-4 p-8">
        {chunkChats(chats).map((chatChunks) => (
          chatChunks[0].type === ChatType.FEED
            ? (
              <FeedChatBox
                key={`__FEED__-${chatChunks[0].sentAt.getTime()}`}
                dark={dark}
                chats={chatChunks as ChatContent<ChatType.FEED>[]}
              />
            )
            : chatChunks[0].sender!.userId === myId
              ? (
                <MyChatBox
                  key={`${myId}-${chatChunks[0].sentAt.getTime()}`}
                  dark={dark}
                  chats={chatChunks}
                />
              )
              : (
                <OthersChatBox
                  key={`${chatChunks[0].sender!.userId}-${chatChunks[0].sentAt.getTime()}`}
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

interface Props {
  hash: string;
}

const Classroom: React.FC<Props> = ({ hash }) => {
  const [classroom, setClassroom] = useRecoilState(classroomsState.byHash(hash));
  const setMainClassroomHash = useSetRecoilState(mainClassroomHashState.atom);
  const mainClassroom = useMainClassroom();
  const me = useRecoilValue(meState.atom);
  const myId = useRecoilValue(meState.id);

  const [amplitude, setAmplitude] = React.useState(0);
  const [frequency, setFrequency] = React.useState(200);
  const [videoId, setVideoId] = React.useState('');
  const screenType = useScreenType();

  const isInstructor = !!mainClassroom && mainClassroom.instructorId === myId;

  React.useEffect(() => {
    if (me.loaded && me.info && classroom) {
      setMainClassroomHash(hash);
    }
  }, [me, classroom, hash]);

  return (
    <>
      {me.loaded && !!me.info && mainClassroom && (
        <>
          {/* TODO: footer로 가져가 주세요 */}
          <VoiceChat
            userId={me.info.stringId}
            mainClassroom={mainClassroom}
            className="absolute z-layout-3 right-4"
            style={{
              bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
            }}
            onVoice={(amp, freq) => {
              setAmplitude(clamp(0, amp, 200));
              setFrequency(clamp(100, freq, 500));
            }}
          />
          <WaveVisualizer amplitude={amplitude} frequency={frequency} />

          <div
            style={conditionalStyle({
              mobilePortrait: {
                position: 'absolute',
                top: 'calc(env(safe-area-inset-top, 0px) + 64px + 56.25vw)',
              },
            })(screenType)}
            className={conditionalClassName({
              mobilePortrait: 'absolute w-full p-4 flex justify-end',
            })(screenType)}
          >
            <TextInput
              value={videoId}
              font="sans"
              align="left"
              onInput={(newText) => { setVideoId(newText); }}
              placeholderText="YouTube Video ID"
              className="absolute right-0"
              style={{ width: '40%', height: '36px' }}
              button={(
                <div className="absolute h-12 right-0" style={{ width: 136 }}>
                  <Button
                    type="primary"
                    width="full"
                    height={36}
                    text="Set Video"
                    className="absolute right-0 z-5 w-2/5 font-sans"
                    onClick={() => {
                      if (!classroom) return;
                      setClassroom((c) => ({
                        ...c,
                        video: {
                          type: 'single',
                          videoId,
                        },
                      }));
                    }}
                  />
                </div>
              )}
            />
          </div>
          <ClassroomChat isInstructor={isInstructor} dark={false} visible hash={hash} />
        </>
      )}
    </>
  );
};

export default Classroom;
