import { ChatType } from '@team-10/lib';
import React from 'react';
import { useSetRecoilState } from 'recoil';

import toastState from '../../recoil/toast';
import ChatInput from '../chat/ChatInput';
import MyChatBox from '../chat/MyChatBox';
import OthersChatBox from '../chat/OthersChatBox';

const ChatBoxTest: React.FC = () => {
  const [text, setText] = React.useState('');
  const addToast = useSetRecoilState(toastState.new);

  return (
    <div className="p-8" style={{ width: 'clamp(352px, 30vw, 416px)' }}>
      <div className="flex flex-col gap-4">
        <OthersChatBox
          dark={false}
          sender={{
            displayName: '닉네임',
            profileImage: 'https://picsum.photos/128',
          }}
          chats={[
            {
              content: { text: '상대 메세지' },
              id: '1',
              type: 'text',
              sentAt: new Date(),
            },
            {
              content: { text: '긴 메세지는 이렇게 표시됩니다 긴 메세지는 이렇게 표시됩니다' },
              id: '1',
              type: 'text',
              sentAt: new Date(),
            },
            {
              content: { photo: 'https://picsum.photos/640/480', alt: '채팅 사진' },
              id: '2',
              type: 'photo',
              sentAt: new Date(),
            },
          ]}
        />
        <MyChatBox
          dark={false}
          chats={[
            {
              content: { text: '내 메세지' },
              id: '1',
              type: 'text',
              sentAt: new Date(),
            },
            {
              content: { text: '긴 메세지는 이렇게 표시됩니다 긴 메세지는 이렇게 표시됩니다' },
              id: '1',
              type: 'text',
              sentAt: new Date(),
            },
          ]}
        />
      </div>
      <ChatInput
        dark={false}
        text={text}
        onInput={setText}
        onPhotoButtonClick={() => console.log('사진 버튼이 눌렸습니다.')}
        onSend={() => {
          console.log('전송 버튼이 눌렸습니다.');
          addToast({
            type: 'info',
            sentAt: new Date(),
            message: text,
          });
          setText('');
        }}
      />
    </div>
  );
};

export default ChatBoxTest;
