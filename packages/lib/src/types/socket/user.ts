import { UserInfoMeJSON, UserInfoOtherJSON } from '..';

export namespace SocketUser {
  export namespace Events {
    export interface Request {}
    export interface Response {
      'user/PatchBroadcast': (params: SocketUser.Broadcast.Patch) => void;
    }
  }

  export namespace Broadcast {
    export type Patch = PatchBroadcast;
  }

  export interface PatchBroadcast {
    patch: Partial<UserInfoMeJSON | UserInfoOtherJSON>;
  }
}
