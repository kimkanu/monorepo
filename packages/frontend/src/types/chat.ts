/// src/types/chat.ts
export enum ChatType {
  TEXT,
  PHOTO,
  // CODE,
  // ...
}

// typescript-eslint의 버그로 인해 아래 룰을 disable 해야 합니다.
/* eslint-disable @typescript-eslint/indent */
export type TypedChatContent<
  T extends ChatType,
> = T extends typeof ChatType.TEXT
  ? TextChatContent
  : T extends typeof ChatType.PHOTO
  ? PhotoChatContent
  : never;

export type ChatContent<T extends ChatType = ChatType> = {
  id: string;
  type: T;
  content: TypedChatContent<T>;
};

interface CommonChatContent {
  sentAt: Date;
}

export interface TextChatContent extends CommonChatContent {
  text: string;
}

export interface PhotoChatContent extends CommonChatContent {
  url: string;
}
