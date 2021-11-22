import { SSOAccountJSON, UserInfoJSON } from '..';
import { Response } from '../..';
import { ClassroomJSON } from '../../classroom';

export interface UserInfoMeJSON extends UserInfoJSON {
  initialized: boolean;
  ssoAccounts: SSOAccountJSON[];
  classrooms: ClassroomJSON[];
}

export interface PatchableUserInfoJSON {
  stringId: string;
  displayName: string;
  profileImage: string;
}

// GET /users/me
export type UsersMeGetResponse = Response<UserInfoMeJSON, never>;

// PATCH /users/me
export type UsersMePatchResponse = Response<Partial<PatchableUserInfoJSON>, UsersMePatchError>;
export type UsersMePatchError = {
  code: 'INVALID_INFORMATION';
  statusCode: 400;
  extra: {
    field: string;
    details: string;
  };
};

// DELETE /users/me
export type UsersMeDeleteResponse = Response<Record<string, never>, never>;

export * from './sso-accounts';
