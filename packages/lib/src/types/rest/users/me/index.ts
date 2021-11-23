import { SSOAccountJSON, UserInfoJSON } from '..';
import { Response } from '../..';
import { ClassroomJSON } from '../../../classroom';

import {
  UsersMeSSOAccountsEndpoints,
  UsersMeSSOAccountsPathParams,
  UsersMeSSOAccountsRequestBodyType,
  UsersMeSSOAccountsResponseType,
} from './sso-accounts';

export type UsersMeEndpoints =
  | UsersMeSSOAccountsEndpoints
  | 'GET /users/me'
  | 'PATCH /users/me'
  | 'DELETE /users/me';
export type UsersMePathParams = UsersMeSSOAccountsPathParams & {
  'GET /users/me': undefined;
  'PATCH /users/me': undefined;
  'DELETE /users/me': undefined;
};
export type UsersMeRequestBodyType = UsersMeSSOAccountsRequestBodyType & {
  'GET /users/me': undefined;
  'PATCH /users/me': Partial<PatchableUserInfoJSON>;
  'DELETE /users/me': undefined;
};
export type UsersMeResponseType = UsersMeSSOAccountsResponseType & {
  'GET /users/me': UsersMeGetResponse;
  'PATCH /users/me': UsersMePatchResponse;
  'DELETE /users/me': UsersMeDeleteResponse;
};

// GET /users/me
type UsersMeGetResponse = Response<UserInfoMeJSON, never>;

// PATCH /users/me
type UsersMePatchResponse = Response<UserInfoMeJSON, UsersMePatchError>;
type UsersMePatchError = {
  code: 'INVALID_INFORMATION';
  statusCode: 400;
  extra: {
    field: string;
    details: string;
  };
};

// DELETE /users/me
type UsersMeDeleteResponse = Response<Record<string, never>, never>;

interface PatchableUserInfoJSON {
  stringId: string;
  displayName: string;
  profileImage: string;
}
interface UserInfoMeJSON extends UserInfoJSON {
  initialized: boolean;
  ssoAccounts: SSOAccountJSON[];
  classrooms: ClassroomJSON[];
}

export * from './sso-accounts';
