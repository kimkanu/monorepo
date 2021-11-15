export interface NonceResponse<EventName extends string> {
  nonce: `${EventName}-${number}`;
}

export type ClassHashFirst = 'B' | 'H' | 'J' | 'K' | 'L' | 'M' | 'N' | 'P' | 'S' | 'T' | 'W';
export type ClassHashSecond = 'A' | 'E' | 'I' | 'O' | 'U';
export type ClassHashThird = 'K' | 'L' | 'M' | 'N' | 'P' | 'S' | 'T' | 'W' | 'Z';
export type ClassHashSyllable = `${ClassHashFirst}${ClassHashSecond}${ClassHashThird}`;
// XXX: TypeScript is too limited to handle ClassHash type exactly:
//      Expression produces a union type that is too complex to represent.
// export type ClassHash = `${ClassHashSyllable}-${ClassHashSyllable}-${ClassHashSyllable}`;
export type ClassHash = string;

export type DateNumber = number;
