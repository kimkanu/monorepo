/* istanbul ignore file */
import { selector } from 'recoil';

import { guardRecoilDefaultValue } from '..';

import classroomAtom from './atom';

const classroomVideoIdSelector = selector<string | null>({
  key: 'classroomVideoIdSelector',
  get: ({ get }) => {
    const classroom = get(classroomAtom);
    return classroom?.videoId ?? null;
  },
  set: ({ set }, videoId) => {
    if (guardRecoilDefaultValue(videoId)) return;
    set(classroomAtom, (classroom) => (classroom ? { ...classroom, videoId } : null));
  },
});

export default classroomVideoIdSelector;
