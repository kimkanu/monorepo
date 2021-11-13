export type SocketVoiceRequest =
  | SocketVoicePermissionRequest
  | SocketVoiceStreamSendRequest;

export type SocketVoiceResponse =
  | SocketVoicePermissionResponse
  | SocketVoiceStateChangeResponse
  | SocketVoiceStreamSendResponse
  | SocketVoiceStreamReceiveResponse;

/* Get permitted to use voice chat */
export interface SocketVoicePermissionRequest {
  requestId: number;
  classHash: number;
}
export type SocketVoicePermissionResponse =
  | SocketVoicePermissionGrantedResponse
  | SocketVoicePermissionDeniedResponse;
export interface SocketVoicePermissionGrantedResponse {
  requestId: number;
  success: true;
}
export interface SocketVoicePermissionDeniedResponse {
  requestId: number;
  success: false;
  reason: SocketVoicePermissionDeniedReason;
}
export enum SocketVoicePermissionDeniedReason {
  UNAUTHORIZED = -1,
  SOMEONE_IS_SPEAKING = 0,
}

/* Be broadcasted and subscribe voice chat state changes */
export type SocketVoiceStateChangeResponse =
  | SocketVoiceStartResponse
  | SocketVoiceEndResponse;
export interface SocketVoiceStartResponse {
  classHash: string;
  userId: string;
  speaking: true;
  sentAt: Date;
}
export interface SocketVoiceEndResponse {
  classHash: string;
  userId: string;
  speaking: false;
  reason: SocketVoiceEndReason;
  sentAt: Date;
}
export enum SocketVoiceEndReason {
  NORMAL = 0,
  CONNECTION_LOST = -2,
  LEFT = -3,
  INTERRUPTED_BY_INSTRUCTOR = -4,
}

/* Send audio segment while talking */
export interface SocketVoiceStreamSendRequest {
  requestId: number;
  classHash: string;
  audioSegment: Blob;
}
export type SocketVoiceStreamSendResponse =
  | SocketVoiceStreamSendGrantedResponse
  | SocketVoiceStreamSendDeniedResponse;
export interface SocketVoiceStreamSendGrantedResponse {
  requestId: number;
  success: true;
}
export interface SocketVoiceStreamSendDeniedResponse {
  requestId: number;
  success: false;
  reason: SocketVoiceStreamSendDeniedReason;
}
export enum SocketVoiceStreamSendDeniedReason {
  UNAUTHORIZED = -1,
  NOT_ALLOWED = -5,
}

/* Received audio segments */
export interface SocketVoiceStreamReceiveResponse {
  requestId: number;
  speakerId: string;
  audioSegment: Blob;
}
