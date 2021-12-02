import { ClassroomJSON } from '..';

import { ClassroomHash } from './common';

import { DateNumber } from '.';

export namespace SocketClassroom {
  export namespace Events {
    export interface Request {
      'classroom/Join': (params: SocketClassroom.Request.Join) => void;
    }
    export interface Response {
      'classroom/Join': (params: SocketClassroom.Response.Join) => void;
      'classroom/PatchBroadcast': (params: SocketClassroom.Broadcast.Patch) => void;
    }
  }

  export namespace Request {
    export type Join = JoinRequest;
  }
  export namespace Response {
    export type Join = JoinResponse;
  }
  export namespace Broadcast {
    export type Patch = PatchBroadcast;
  }

  export interface JoinRequest {
    hash: ClassroomHash;
  }
  export type JoinResponse =
    | ({ success: true; isVideoPlaying: boolean; videoTime: DateNumber | null } & ClassroomJSON)
    | {
      success: false;
      reason: typeof JoinFailReason[keyof typeof JoinFailReason];
    };
  export const JoinFailReason = {
    UNAUTHORIZED: -1 as -1,
    NOT_MEMBER: -2 as -2,
  };

  export interface PatchBroadcast {
    hash: ClassroomHash;
    patch: Partial<ClassroomJSON>;
  }
}
