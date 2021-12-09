import { Empty, Response } from '../..';

export type UsersMeLanguageEndpoints =
  | 'GET /users/me/language'
  | 'PATCH /users/me/language';
export type UsersMeLanguagePathParams = {
  'GET /users/me/language': Empty;
  'PATCH /users/me/language': Empty;
};
export type UsersMeLanguageRequestBodyType = {
  'GET /users/me/language': Empty;
  'PATCH /users/me/language': { language: string };
};
export type UsersMeLanguageResponseType = {
  'GET /users/me/language': UsersMeLanguageGetResponse;
  'PATCH /users/me/language': UsersMeLanguagePatchResponse;
};

// GET /users/me/language
type UsersMeLanguageGetResponse = Response<{ language: string }, never>;

export type UsersMeLanguagePatchResponse = Response<
{ language: string }, UsersMeLanguagePatchError
>;
export type UsersMeLanguagePatchError = {
  code: 'UNSUPPORTED_LANGUAGE';
  statusCode: 400;
  extra: Empty;
};
