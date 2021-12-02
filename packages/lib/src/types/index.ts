export * from './chat';
export * from './classroom';
export * from './rest';
export * from './socket';

export type KeysOfUnion<T> = T extends T ? keyof T: never;
