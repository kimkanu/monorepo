import { SSOAccountJSON } from '..';
import { Response } from '../..';

export type UsersMeSSOAccountsEndpoints =
  | 'GET /users/me/sso-accounts'
  | 'GET /users/me/sso-accounts/:provider'
  | 'DELETE /users/me/sso-accounts/:provider';
export type UsersMeSSOAccountsPathParams = {
  'GET /users/me/sso-accounts': undefined;
  'GET /users/me/sso-accounts/:provider': { provider: string };
  'DELETE /users/me/sso-accounts/:provider': { provider: string };
};
export type UsersMeSSOAccountsRequestBodyType = {
  'GET /users/me/sso-accounts': undefined;
  'GET /users/me/sso-accounts/:provider': undefined;
  'DELETE /users/me/sso-accounts/:provider': undefined;
};
export type UsersMeSSOAccountsResponseType = {
  'GET /users/me/sso-accounts': UsersMeSSOAccountsGetResponse;
  'GET /users/me/sso-accounts/:provider': UsersMeSSOAccountsProviderGetResponse;
  'DELETE /users/me/sso-accounts/:provider': UsersMeSSOAccountsProviderDeleteResponse;
};

// GET /users/me/sso-accounts
export type UsersMeSSOAccountsGetResponse = Response<SSOAccountJSON[], never>;

// GET /users/me/sso-accounts/:provider
export type UsersMeSSOAccountsProviderGetResponse
  = Response<SSOAccountJSON, UsersMeSSOAccountsProviderGetError>;
export type UsersMeSSOAccountsProviderGetError = {
  code: 'UNSUPPORTED_PROVIDER';
  statusCode: 400;
  extra: Record<string, never>;
} | {
  code: 'NONEXISTENT_SSO_ACCOUNT';
  statusCode: 404;
  extra: Record<string, never>;
};

// DELETE /users/me/sso-accounts/:provider
export type UsersMeSSOAccountsProviderDeleteResponse
  = Response<Record<string, never>, UsersMeSSOAccountsProviderDeleteError>;
export type UsersMeSSOAccountsProviderDeleteError = {
  code: 'UNSUPPORTED_PROVIDER';
  statusCode: 400;
  extra: Record<string, never>;
} | {
  code: 'NONEXISTENT_SSO_ACCOUNT';
  statusCode: 400;
  extra: Record<string, never>;
} | {
  code: 'UNIQUE_SSO_ACCOUNT';
  statusCode: 400;
  extra: Record<string, never>;
};
