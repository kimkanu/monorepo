import { ClassroomMember } from './user';

/// src/types/chat.ts
export enum ChatType {
  TEXT,
  PHOTO,
  FEED,
  // CODE,
  // ...
}

export enum FeedType {
  DATE,
  CLASS,
}

// typescript-eslint의 버그로 인해 아래 룰을 disable 해야 합니다.
/* eslint-disable @typescript-eslint/indent */
export type TypedChatContent<
  T extends ChatType,
> = T extends typeof ChatType.TEXT
  ? TextChatContent
  : T extends typeof ChatType.PHOTO
  ? PhotoChatContent
  : T extends typeof ChatType.FEED
  ? FeedChatContent<FeedType>
  : never;

export type ChatContent<T extends ChatType = ChatType> = {
  id: string;
  type: T;
  content: TypedChatContent<T>;
  sentAt: Date;
  sender?: ClassroomMember;
};

export interface CommonChatContent {}

export interface TextChatContent extends CommonChatContent {
  text: string;
}

export interface PhotoChatContent extends CommonChatContent {
  photo: string;
  alt: string;
}

export type FeedChatContent<
F extends FeedType = FeedType,
> = F extends typeof FeedType.DATE
  ? DateFeedChatContent
  : F extends typeof FeedType.CLASS
  ? ClassFeedChatContent
  : never;

export interface CommonFeedChatContent<F extends FeedType> {
  type: F;
}

export interface DateFeedChatContent extends CommonFeedChatContent<FeedType.DATE> {
  date: Date;
}

export interface ClassFeedChatContent extends CommonFeedChatContent<FeedType.CLASS> {
  isStart: boolean;
}
