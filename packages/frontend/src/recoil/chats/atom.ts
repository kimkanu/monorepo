import { ChatContent } from '@team-10/lib';
import { atom } from 'recoil';

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

export default chatsAtom;
