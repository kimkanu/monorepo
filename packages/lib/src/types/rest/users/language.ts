import { UserLangJSON } from '..';
import { Empty, Response } from '../..';

export type UsersLangEndpoints =
  | 'GET /users/lang'
  | 'PATCH /users/lang';
export type UsersLangPathParams = {
  'GET /users/lang': Empty;
  'PATCH /users/lang': Empty;
};
export type UsersLangRequestBodyType = {
  'GET /users/lang': Empty;
  'PATCH /users/lang': Partial<UserLangJSON>;
};
export type UsersLangResponseType = {
  'GET /users/lang': UsersLangGetResponse;
  'PATCH /users/lang': UsersLangPatchResponse;
};

// GET /users/lang
type UsersLangGetResponse = Response<{ lang: string }, never>;

// PATCH /users/lang
export type UsersLangPatchResponse = Response<UserLangJSON, UsersLangPatchError>;
export type UsersLangPatchError = {
  code: 'INVALID_INFORMATION';
  statusCode: 400;
  extra: {
    field: string;
    details: string;
  };
};
