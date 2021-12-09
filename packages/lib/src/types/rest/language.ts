import { UserLangJSON } from '..';
import { Empty, Response } from '../..';

export type UsersLangEndpoints =
  | 'GET /lang'
  | 'PATCH /lang';
export type UsersLangPathParams = {
  'GET /lang': Empty;
  'PATCH /lang': Empty;
};
export type UsersLangRequestBodyType = {
  'GET /lang': Empty;
  'PATCH /lang': Partial<UserLangJSON>;
};
export type UsersLangResponseType = {
  'GET /lang': UsersLangGetResponse;
  'PATCH /lang': UsersLangPatchResponse;
};

// GET /users/lang
type UsersLangGetResponse = Response<{ lang: string }, never>;

export type UsersLangPatchResponse = Response<UserLangJSON, never>;
