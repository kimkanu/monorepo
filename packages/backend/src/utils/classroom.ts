import {
  ClassHash, ClassHashFirst, ClassHashSecond, ClassHashSyllable, ClassHashThird,
} from '@team-10/lib';

// eslint-disable-next-line import/prefer-default-export
export function generateClassroomHash(): ClassHash {
  const generateSyllable = (): ClassHashSyllable => {
    const random = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    const first: ClassHashFirst[] = ['B', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'S', 'T', 'W'];
    const second: ClassHashSecond[] = ['A', 'E', 'I', 'O', 'U'];
    const third: ClassHashThird[] = ['K', 'L', 'M', 'N', 'P', 'S', 'T', 'W', 'Z'];

    return `${random(first)}${random(second)}${random(third)}`;
  };

  return `${generateSyllable()}-${generateSyllable()}-${generateSyllable()}`;
}
