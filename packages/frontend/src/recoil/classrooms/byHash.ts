/* istanbul ignore file */
import { ClassroomJSONWithSpeaker } from '@team-10/lib';
import { selectorFamily } from 'recoil';

import { guardRecoilDefaultValue } from '..';

import classroomsAtom from './atom';

const classroomsByHashSelector = selectorFamily<
Partial<ClassroomJSONWithSpeaker> | null, string | null
>({
  key: 'classroomsByHashSelector',
  get: (hash) => ({ get }) => get(classroomsAtom).find((c) => c.hash === hash) ?? null,
  set: (hash) => ({ set }, partialClassroom) => {
    if (guardRecoilDefaultValue(partialClassroom)) return;
    if (partialClassroom === null) return;
    set(classroomsAtom, (classrooms) => classrooms.map((c) => (
      c.hash === hash ? { ...c, ...partialClassroom } as ClassroomJSONWithSpeaker : c
    )));
  },
});

export default classroomsByHashSelector;
