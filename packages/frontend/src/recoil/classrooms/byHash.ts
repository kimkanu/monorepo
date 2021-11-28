/* istanbul ignore file */
import { ClassroomJSON } from '@team-10/lib';
import { selectorFamily } from 'recoil';

import { guardRecoilDefaultValue } from '..';

import classroomsAtom from './atom';

const classroomsByHashSelector = selectorFamily<Partial<ClassroomJSON> | null, string | null>({
  key: 'classroomsByHashSelector',
  get: (hash) => ({ get }) => get(classroomsAtom).find((c) => c.hash === hash) ?? null,
  set: (hash) => ({ set }, partialClassroom) => {
    if (guardRecoilDefaultValue(partialClassroom)) return;
    if (partialClassroom === null) return;
    set(classroomsAtom, (classrooms) => classrooms.map((c) => (
      c.hash === hash ? { ...c, ...partialClassroom } as ClassroomJSON : c
    )));
  },
});

export default classroomsByHashSelector;
