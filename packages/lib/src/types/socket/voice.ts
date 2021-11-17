import { ClassroomHash, DateNumber } from './common';

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
    classroomHash: ClassroomHash;
    speaking: boolean;
  }
  export type StateChangeResponse =
    | StateChangeGrantedResponse
    | StateChangeDeniedResponse;
  export interface StateChangeGrantedResponse {
    success: true;
    speaking: boolean;
  }
  export interface StateChangeDeniedResponse {
    success: false;
    reason: typeof PermissionDeniedReason[keyof typeof PermissionDeniedReason];
  }
  export const PermissionDeniedReason = {
    UNAUTHORIZED: -1 as -1,
    NOT_MEMBER: -2 as -2,
    SOMEONE_IS_SPEAKING: 0 as 0,
  };
  export function permissionDeniedReasonAsMessage(
    reason: typeof PermissionDeniedReason[keyof typeof PermissionDeniedReason],
  ): string {
    return {
      [PermissionDeniedReason.UNAUTHORIZED]: '현재 로그아웃 상태입니다.',
      [PermissionDeniedReason.NOT_MEMBER]: '이 수업을 가르치거나 듣는 사람이 아닙니다.',
      [PermissionDeniedReason.SOMEONE_IS_SPEAKING]: '누군가 이미 이야기하고 있습니다.',
    }[reason];
  }

  /* Be broadcasted and subscribe voice chat state changes */
  export type StateChangeBroadcast =
    | StateChangeStartBroadcast
    | StateChangeEndBroadcast;
  export interface StateChangeStartBroadcast {
    classroomHash: ClassroomHash;
    userId: string;
    speaking: true;
    sentAt: DateNumber;
  }
  export interface StateChangeEndBroadcast {
    classroomHash: ClassroomHash;
    userId: string;
    speaking: false;
    reason: typeof StateChangeEndReason[keyof typeof StateChangeEndReason];
    sentAt: DateNumber;
  }
  export const StateChangeEndReason = {
    NORMAL: 0 as 0,
    SESSION_EXPIRED: -1 as -1,
    CONNECTION_LOST: -2 as -2,
    INTERRUPTED_BY_INSTRUCTOR: -3 as -3,
  };
  export function stateChangeEndReasonAsMessage(
    reason: typeof StateChangeEndReason[keyof typeof StateChangeEndReason],
  ): string {
    return {
      [StateChangeEndReason.NORMAL]: '말하기가 정상적으로 종료되었습니다.',
      [StateChangeEndReason.SESSION_EXPIRED]: '세션이 만료되었습니다.',
      [StateChangeEndReason.CONNECTION_LOST]: '말씀하시는 분의 접속이 끊겼습니다.',
      [StateChangeEndReason.INTERRUPTED_BY_INSTRUCTOR]: '강의자에 의해 말하기가 종료되었습니다.',
    }[reason];
  }

  /* Send voices while talking */
  export interface StreamSendRequest {
    classroomHash: ClassroomHash;
    voices: Voice[];
    sequenceIndex: number;
  }
  export type StreamSendResponse =
  | StreamSendGrantedResponse
  | StreamSendDeniedResponse;
  export interface StreamSendGrantedResponse {
    success: true;
    sequenceIndex: number;
  }
  export interface StreamSendDeniedResponse {
    success: false;
    reason: typeof StreamSendDeniedReason[keyof typeof StreamSendDeniedReason];
  }
  export const StreamSendDeniedReason = {
    UNAUTHORIZED: -1 as -1,
    NOT_MEMBER: -2 as -2,
    NOT_SPEAKER: -5 as -5,
  };
  export function streamSendDeniedReasonAsMessage(
    reason: typeof StreamSendDeniedReason[keyof typeof StreamSendDeniedReason],
  ): string {
    return {
      [StreamSendDeniedReason.UNAUTHORIZED]: '현재 로그아웃 상태입니다.',
      [StreamSendDeniedReason.NOT_MEMBER]: '이 수업을 가르치거나 듣는 사람이 아닙니다.',
      [StreamSendDeniedReason.NOT_SPEAKER]: '말하기 권한이 없습니다.',
    }[reason];
  }

  /* Received voices */
  export interface StreamReceiveBroadcast {
    speakerId: string;
    voices: Voice[];
    sequenceIndex: number;
  }
  export interface Voice {
    type: 'opus' | 'mpeg';
    buffer: ArrayBuffer;
  }
}
