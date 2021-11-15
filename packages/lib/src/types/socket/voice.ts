import { ClassHash, DateNumber, NonceResponse } from './common';

export namespace SocketVoice {
  export namespace Events {
    export interface Request {
      StateChange: (params: SocketVoice.Request.StateChange) => void;
      StreamSend: (params: SocketVoice.Request.StreamSend) => void;
    }

    export interface Response {
      StateChange: (params: SocketVoice.Response.StateChange) => void;
      StreamSend: (params: SocketVoice.Response.StreamSend) => void;
      StateChangeBroadcast: (params: SocketVoice.Broadcast.StateChange) => void;
      StreamReceiveBroadcast: (params: SocketVoice.Broadcast.StreamReceive) => void;
    }
  }

  export namespace Request {
    export type StateChange = StateChangeRequest;
    export type StreamSend = StreamSendRequest;
  }

  export namespace Response {
    export type StateChange = StateChangeResponse;
    export type StreamSend = StreamSendResponse;
  }

  export namespace Broadcast {
    export type StateChange = StateChangeBroadcast;
    export type StreamReceive = StreamReceiveBroadcast;
  }

  /* Request to use or stop using voice chat */
  export interface StateChangeRequest {
    classHash: ClassHash;
    speaking: boolean;
  }
  export type StateChangeResponse =
    | StateChangeGrantedResponse
    | StateChangeDeniedResponse;
  export interface StateChangeGrantedResponse extends NonceResponse<'StateChange'> {
    success: true;
    speaking: boolean;
  }
  export interface StateChangeDeniedResponse extends NonceResponse<'StateChange'> {
    success: false;
    reason: typeof PermissionDeniedReason[keyof typeof PermissionDeniedReason];
  }
  export const PermissionDeniedReason = {
    UNAUTHORIZED: -1 as -1,
    SOMEONE_IS_SPEAKING: 0 as 0,
  };

  /* Be broadcasted and subscribe voice chat state changes */
  export type StateChangeBroadcast =
    | StateChangeStartBroadcast
    | StateChangeEndBroadcast;
  export interface StateChangeStartBroadcast extends NonceResponse<'StateChangeBroadcast'> {
    classHash: ClassHash;
    userId: string;
    speaking: true;
    sentAt: DateNumber;
  }
  export interface StateChangeEndBroadcast extends NonceResponse<'StateChangeBroadcast'> {
    classHash: ClassHash;
    userId: string;
    speaking: false;
    reason: typeof StateChangeEndReason[keyof typeof StateChangeEndReason];
    sentAt: DateNumber;
  }
  export const StateChangeEndReason = {
    NORMAL: 0 as 0,
    CONNECTION_LOST: -2 as -2,
    LEFT: -3 as -3,
    INTERRUPTED_BY_INSTRUCTOR: -4 as -4,
  };

  /* Send audio segment while talking */
  export interface StreamSendRequest {
    requestId: number;
    classHash: ClassHash;
    audioSegment: ArrayBuffer;
  }
  export type StreamSendResponse =
  | StreamSendGrantedResponse
  | StreamSendDeniedResponse;
  export interface StreamSendGrantedResponse extends NonceResponse<'StreamSend'> {
    requestId: number;
    success: true;
  }
  export interface StreamSendDeniedResponse extends NonceResponse<'StreamSend'> {
    requestId: number;
    success: false;
    reason: typeof StreamSendDeniedReason[keyof typeof StreamSendDeniedReason];
  }
  export const StreamSendDeniedReason = {
    UNAUTHORIZED: -1 as -1,
    NOT_ALLOWED: -5 as -5,
  };

  /* Received audio segments */
  export interface StreamReceiveBroadcast extends NonceResponse<'StreamReceiveBroadcast'> {
    speakerId: string;
    audioSegment: ArrayBuffer;
  }
}
