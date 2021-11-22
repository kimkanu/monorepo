/* istanbul ignore file */
import { ClassroomJSON } from '@team-10/lib';
import { selector } from 'recoil';

import { guardRecoilDefaultValue } from '..';

import classroomsAtom from './atom';

const classroomsNewSelector = selector<ClassroomJSON | null>({
  key: 'classroomsNewSelector',
  // get the most recently added classroom
  get: ({ get }) => {
    const classrooms = get(classroomsAtom);
    return classrooms?.[0] ?? null;
  },
  set: ({ set }, classroom) => {
    if (guardRecoilDefaultValue(classroom)) return;
    set(classroomsAtom, (classrooms) => (
      classroom === null ? classrooms : [
        classroom,
        ...classrooms.filter((c) => c.hash !== classroom.hash),
      ]
    ));
  },
});

export default classroomsNewSelector;
