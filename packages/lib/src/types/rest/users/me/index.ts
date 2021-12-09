import { SSOAccountJSON, UserInfoJSON } from '..';
import { Empty, Response } from '../..';
import { ClassroomJSON } from '../../../classroom';

import {
  UsersMeLanguageEndpoints,
  UsersMeLanguagePathParams,
  UsersMeLanguageRequestBodyType,
  UsersMeLanguageResponseType,
} from './language';

import {
  UsersMeSSOAccountsEndpoints,
  UsersMeSSOAccountsPathParams,
  UsersMeSSOAccountsRequestBodyType,
  UsersMeSSOAccountsResponseType,
} from './sso-accounts';

export type UsersMeEndpoints =
  | UsersMeLanguageEndpoints
  | UsersMeSSOAccountsEndpoints
  | 'GET /users/me'
  | 'PATCH /users/me'
  | 'DELETE /users/me';
export type UsersMePathParams = UsersMeSSOAccountsPathParams & UsersMeLanguagePathParams & {
  'GET /users/me': Empty;
  'PATCH /users/me': Empty;
  'DELETE /users/me': Empty;
};
export type UsersMeRequestBodyType = UsersMeSSOAccountsRequestBodyType &
UsersMeLanguageRequestBodyType & {
  'GET /users/me': Empty;
  'PATCH /users/me': Partial<UserInfoJSON>;
  'DELETE /users/me': Empty;
};
export type UsersMeResponseType = UsersMeSSOAccountsResponseType &
UsersMeLanguageResponseType & {
  'GET /users/me': UsersMeGetResponse;
  'PATCH /users/me': UsersMePatchResponse;
  'DELETE /users/me': UsersMeDeleteResponse;
};

// GET /users/me
type UsersMeGetResponse = Response<UserInfoMeJSON, never>;

// PATCH /users/me
export type UsersMePatchResponse = Response<UserInfoJSON, UsersMePatchError>;
export type UsersMePatchError = {
  code: 'INVALID_INFORMATION';
  statusCode: 400;
  extra: {
    field: string;
    details: string;
  };
};

// DELETE /users/me
type UsersMeDeleteResponse = Response<Empty, never>;

export interface UserInfoMeJSON extends UserInfoJSON {
  initialized: boolean;
  ssoAccounts: SSOAccountJSON[];
  classrooms: ClassroomJSON[];
}

export * from './language';
export * from './sso-accounts';
