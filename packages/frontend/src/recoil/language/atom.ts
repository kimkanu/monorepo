import { atom } from 'recoil';

const languageAtom = atom<string>({
  key: 'languageAtom',
  default: 'ko',
});

export default languageAtom;
