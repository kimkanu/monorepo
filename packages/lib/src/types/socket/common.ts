export type ClassroomHashFirst = 'B' | 'H' | 'J' | 'K' | 'L' | 'M' | 'N' | 'P' | 'S' | 'T' | 'W';
export type ClassroomHashSecond = 'A' | 'E' | 'I' | 'O' | 'U';
export type ClassroomHashThird = 'K' | 'L' | 'M' | 'N' | 'P' | 'S' | 'T' | 'W' | 'Z';
export type ClassroomHashSyllable = `${ClassroomHashFirst}${ClassroomHashSecond}${ClassroomHashThird}`;
// XXX: TypeScript is too limited to handle ClassroomHash type exactly:
//      Expression produces a union type that is too complex to represent.
// export type ClassroomHash =
//   `${ClassroomHashSyllable}-${ClassroomHashSyllable}-${ClassroomHashSyllable}`;
export type ClassroomHash = string;

export type DateNumber = number;
