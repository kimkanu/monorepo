import { selector } from 'recoil';

import { guardRecoilDefaultValue } from '..';

import classAtom from './atom';

const classVideoIdSelector = selector<string | null>({
  key: 'classVideoIdSelector',
  get: ({ get }) => {
    const class_ = get(classAtom);
    return class_?.videoId ?? null;
  },
  set: ({ set }, videoId) => {
    if (guardRecoilDefaultValue(videoId)) return;
    set(classAtom, (class_) => (class_ ? { ...class_, videoId } : null));
  },
});

export default classVideoIdSelector;
