import { ChatContent } from '../chat';

import { ClassroomHash } from './common';

export namespace SocketChat {
  export namespace Events {
    export interface Request {
      'chat/Send': (params: SocketChat.Request.Send) => void;
    }

    export interface Response {
      'chat/Send': (params: SocketChat.Response.Send) => void;
      'chat/ChatBroadcast': (params: SocketChat.Broadcast.Chat) => void;
    }
  }

  export namespace Request {
    export type Send = SendRequest;
  }

  export namespace Response {
    export type Send = SendResponse;
  }

  export namespace Broadcast {
    export type Chat = ChatBroadcast;
  }

  /* Request to send a chat message */
  export interface SendRequest {
    hash: ClassroomHash;
    message: ChatRequest;
  }
  export type SendResponse =
    | SendGrantedResponse
    | SendDeniedResponse;
  export interface SendGrantedResponse {
    success: true;
  }
  export interface SendDeniedResponse {
    success: false;
    reason: typeof SendDeniedReason[keyof typeof SendDeniedReason];
  }
  export const SendDeniedReason = {
    UNAUTHORIZED: -1 as -1,
    NOT_MEMBER: -2 as -2,
    BAD_REQUEST: -3 as -3,
    INTERNAL_SERVER_ERROR: -4 as -4,
  };

  type ChatRequest = {
    type: 'text';
    users?: string[];
    text: string;
  } | {
    type: 'photo';
    users?: string[];
    photo: ArrayBuffer;
  };

  /* Send chat message */
  export interface ChatBroadcast {
    hash: ClassroomHash;
    chatId: string;
    message: ChatContent;
  }
}
