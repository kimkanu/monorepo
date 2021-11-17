import {
  ClassroomHash, ClassroomHashFirst, ClassroomHashSecond, ClassroomHashSyllable, ClassroomHashThird,
} from '@team-10/lib';

// eslint-disable-next-line import/prefer-default-export
export function generateClassroomHash(): ClassroomHash {
  const generateSyllable = (): ClassroomHashSyllable => {
    const random = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    const first: ClassroomHashFirst[] = ['B', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'S', 'T', 'W'];
    const second: ClassroomHashSecond[] = ['A', 'E', 'I', 'O', 'U'];
    const third: ClassroomHashThird[] = ['K', 'L', 'M', 'N', 'P', 'S', 'T', 'W', 'Z'];

    return `${random(first)}${random(second)}${random(third)}`;
  };

  return `${generateSyllable()}-${generateSyllable()}-${generateSyllable()}`;
}
