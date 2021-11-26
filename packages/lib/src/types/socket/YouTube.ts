import { ClassroomHash } from './common';

export namespace SocketYouTube {
  export namespace Events {
    export interface Request {
      JoinClassroom: (params: SocketYouTube.Request.JoinClassroom) => void;
      CurrentVideoPosition: (params: SocketYouTube.Request.CurrentVideoPosition) => void;
      ChangePlayStatus: (params: SocketYouTube.Request.ChangePlayStatus) => void;
      ChangeTime: (params: SocketYouTube.Request.ChangeTime) => void;

    }
    export interface Response {
      JoinClassroom: (params: SocketYouTube.Response.JoinClassroom) => void;
      CurrentVideoPosition: (params: SocketYouTube.Response.CurrentVideoPosition) => void;
      ChangePlayStatus: (params: SocketYouTube.Response.ChangePlayStatus) => void;
      ChangeTime: (params: SocketYouTube.Response.ChangeTime) => void;
      ChangePlayStatusBroadcast: (params: SocketYouTube.Broadcast.ChangePlayStatus) => void;
      ChangeTimeBroadcast: (params: SocketYouTube.Broadcast.ChangeTime) => void;
    }
  }

  export namespace Request {
    export type JoinClassroom = JoinClassRoomRequest;
    export type CurrentVideoPosition = CurrentVideoPositionRequest;
    export type ChangePlayStatus = ChangePlayStatusRequest;
    export type ChangeTime = ChangeTimeRequest;
  }
  export namespace Response {
    export type JoinClassroom = JoinClassRoomResponse;
    export type CurrentVideoPosition = CurrentVideoPositionResponse;
    export type ChangePlayStatus = ChangePlayStatusResponse;
    export type ChangeTime = ChangeTimeResponse;
  }
  export namespace Broadcast {
    export type ChangePlayStatus = ChangePlayStatusBroadcast;
    export type ChangeTime = ChangeTimeBroadcast;
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

// send time change request
export interface ChangeTimeRequest {
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

// time change response
export type ChangeTimeResponse =
| ChangeTimeSuccessResponse
| ChangeTimeFailResponse;

export interface ChangeTimeSuccessResponse {
  success: true;
  timeInYouTube: number | undefined;
}
export interface ChangeTimeFailResponse {
  success: false;
  reason: typeof ChangeTimeFailReason[keyof typeof ChangeTimeFailReason];
}
export const ChangeTimeFailReason = {
  TODO: 0 as 0, // ToDo
};

// play status Broadcast
export interface ChangePlayStatusBroadcast {
  classroomHash: ClassroomHash;
  play: boolean;
  videoId: string | null | undefined;
  timeInYouTube: number | undefined;
}

// time change Broadcast
export interface ChangeTimeBroadcast {
  classroomHash: ClassroomHash;
  play: boolean;
  videoId: string | null | undefined;
  timeInYouTube: number | undefined;
}
