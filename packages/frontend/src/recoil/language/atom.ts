import { atom } from 'recoil';

import i18n from '../../i18n';

const languageAtom = atom<string>({
  key: 'languageAtom',
  default: i18n.language,
});

export default languageAtom;
