import { ClassroomHash } from './common';

export namespace SocketYouTube {
  export namespace Events {
    export interface Request {
      JoinClassroom: (params: SocketYouTube.Request.JoinClassroom) => void;
      CurrentVideoPosition: (params: SocketYouTube.Request.CurrentVideoPosition) => void;
      ChangePlayStatus: (params: SocketYouTube.Request.ChangePlayStatus) => void;
    }
    export interface Response {
      JoinClassroom: (params: SocketYouTube.Response.JoinClassroom) => void;
      CurrentVideoPosition: (params: SocketYouTube.Response.CurrentVideoPosition) => void;
      ChangePlayStatus: (params: SocketYouTube.Response.ChangePlayStatus) => void;
      ChangePlayStatusBroadcast: (params: SocketYouTube.Broadcast.ChangePlayStatus) => void;
    }
  }

  export namespace Request {
    export type JoinClassroom = JoinClassRoomRequest;
    export type CurrentVideoPosition = CurrentVideoPositionRequest;
    export type ChangePlayStatus = ChangePlayStatusRequest;
  }
  export namespace Response {
    export type JoinClassroom = JoinClassRoomResponse;
    export type CurrentVideoPosition = CurrentVideoPositionResponse;
    export type ChangePlayStatus = ChangePlayStatusResponse;
  }
  export namespace Broadcast {
    export type ChangePlayStatus = ChangePlayStatusBroadcast;
  }
}

export interface JoinClassRoomRequest {
  classroomHash: ClassroomHash;
  userId: string;
  isInstructor: boolean;
}

// send play status and current time to new user
export interface CurrentVideoPositionRequest {
  userId: string; // ID of new user
  classroomHash: ClassroomHash;
  play: boolean;
  videoId: string | null | undefined;
  timeInYouTube: number | undefined;
}

// send play or stop requset
export interface ChangePlayStatusRequest {
  classroomHash: ClassroomHash;
  play: boolean;
  videoId: string | null | undefined;
  timeInYouTube: number | undefined;
}

export interface JoinClassRoomResponse {
  success: boolean;
}

export interface CurrentVideoPositionResponse {
  userId: string;
}

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
  TODO: 0 as 0, // ToDo
};

// play status Broadcast
export interface ChangePlayStatusBroadcast {
  classroomHash: ClassroomHash;
  play: boolean;
  videoId: string | null | undefined;
  timeInYouTube: number | undefined;
}
