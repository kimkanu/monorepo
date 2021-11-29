import { ClassroomHash } from './common';

export namespace SocketYouTube {
  export namespace Events {
    export interface Request {
      'youtube/JoinClassroom': (params: SocketYouTube.Request.JoinClassroom) => void;
      'youtube/ChangePlayStatus': (params: SocketYouTube.Request.ChangePlayStatus) => void;
    }
    export interface Response {
      'youtube/JoinClassroom': (params: SocketYouTube.Response.JoinClassroom) => void;
      'youtube/ChangePlayStatus': (params: SocketYouTube.Response.ChangePlayStatus) => void;
      'youtube/ChangePlayStatusBroadcast': (params: SocketYouTube.Broadcast.ChangePlayStatus) => void;
    }
  }

  export namespace Request {
    export type JoinClassroom = JoinClassroomRequest;
    export type ChangePlayStatus = ChangePlayStatusRequest;
  }
  export namespace Response {
    export type JoinClassroom = JoinClassroomResponse;
    export type ChangePlayStatus = ChangePlayStatusResponse;
  }
  export namespace Broadcast {
    export type ChangePlayStatus = ChangePlayStatusBroadcast;
  }

  export interface JoinClassroomRequest {
    hash: ClassroomHash;
  }

  // send play or stop requset
  export interface ChangePlayStatusRequest {
    hash: ClassroomHash;
    play: boolean;
    videoId: string | null;
    time: number | null;
  }

  export type JoinClassroomResponse =
    | ({ success: true } & ChangePlayStatusBroadcast)
    | {
      success: false;
      reason: typeof JoinClassroomFailReason[keyof typeof JoinClassroomFailReason];
    };
  export const JoinClassroomFailReason = {
    UNAUTHORIZED: -1 as -1,
    NOT_MEMBER: -2 as -2,
  };

  // play status response
  export type ChangePlayStatusResponse =
    | ChangePlayStatusSuccessResponse
    | ChangePlayStatusFailResponse;

  export interface ChangePlayStatusSuccessResponse {
    success: true;
    play: boolean;
  }
  export interface ChangePlayStatusFailResponse {
    success: false;
    reason: typeof ChangePlayStatusFailReason[keyof typeof ChangePlayStatusFailReason];
  }
  export const ChangePlayStatusFailReason = {
    UNAUTHORIZED: -1 as -1,
    NOT_MEMBER: -2 as -2,
    PERMISSION_DENIED: -3 as -3,
  };

  // play status Broadcast
  export interface ChangePlayStatusBroadcast {
    hash: ClassroomHash;
    play: boolean;
    videoId: string | null;
    time: number | null;
  }
}
