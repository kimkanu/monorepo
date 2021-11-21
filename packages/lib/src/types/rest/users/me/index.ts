import { SSOAccountJSON, UserInfoJSON } from '..';
import { Response } from '../..';
import { ClassroomJSON } from '../../classroom';

export interface UserInfoMeJSON extends UserInfoJSON {
  initialized: boolean;
  ssoAccounts: SSOAccountJSON[];
  classrooms: ClassroomJSON[];
  myClassrooms: ClassroomJSON[];
}

export interface UpdatableUserInfoJSON {
  stringId: string;
  displayName: string;
  profileImage: ArrayBuffer; // Blob
}

// GET /users/me
export type UsersMeGetResponse = Response<UserInfoMeJSON, never>;

// PATCH /users/me
export type UsersMeUpdateResponse = Response<Partial<UpdatableUserInfoJSON>, UsersUpdateGetError>;
export type UsersUpdateGetError = {
  code: 'INVALID_INFORMATION';
  statusCode: 400;
  extra: {
    field: string;
    details: string;
  };
};

// DELETE /users/me
export type UsersMeDeleteResponse = Response<{}, never>;

export * from './sso-accounts';
