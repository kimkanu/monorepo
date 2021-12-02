import { UserInfoJSON } from '.';

export type ChatType = 'text' | 'photo' | 'feed';
export type FeedType = 'date' | 'class';

// typescript-eslint의 버그로 인해 아래 룰을 disable 해야 합니다.
/* eslint-disable @typescript-eslint/indent */
export type TypedChatContent<
  T extends ChatType,
> = T extends 'text'
  ? TextChatContent
  : T extends 'photo'
  ? PhotoChatContent
  : T extends 'feed'
  ? FeedChatContent<FeedType>
  : never;

export type ChatContent<T extends ChatType = ChatType> = {
  id: string;
  type: T;
  content: TypedChatContent<T>;
  sentAt: Date;
  sender?: UserInfoJSON;
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
> = F extends 'date'
  ? DateFeedChatContent
  : F extends 'class'
  ? ClassFeedChatContent
  : never;

export interface CommonFeedChatContent<F extends FeedType> {
  type: F;
}

export interface DateFeedChatContent extends CommonFeedChatContent<'date'> {
  date: Date;
}

export interface ClassFeedChatContent extends CommonFeedChatContent<'class'> {
  isStart: boolean;
}
