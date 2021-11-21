import { SSOAccountJSON } from '..';
import { Response } from '../..';

// GET /users/me/sso-account
export type UsersMeSSOAccountsGetResponse = Response<SSOAccountJSON[], never>;

// GET /users/me/sso-account/:provider
export type UsersMeSSOAccountsProviderGetResponse
  = Response<SSOAccountJSON, UsersMeSSOAccountsProviderGetError>;
export type UsersMeSSOAccountsProviderGetError = {
  code: 'UNSUPPORTED_PROVIDER';
  statusCode: 400;
  extra: {};
} | {
  code: 'NONEXISTENT_SSO_ACCOUNT';
  statusCode: 404;
  extra: {};
};

// DELETE /users/me/sso-account/:provider
export type UsersMeSSOAccountsProviderDeleteResponse
  = Response<{}, UsersMeSSOAccountsProviderDeleteError>;
export type UsersMeSSOAccountsProviderDeleteError = {
  code: 'UNSUPPORTED_PROVIDER';
  statusCode: 400;
  extra: {};
} | {
  code: 'NONEXISTENT_SSO_ACCOUNT';
  statusCode: 400;
  extra: {};
} | {
  code: 'UNIQUE_SSO_ACCOUNT';
  statusCode: 400;
  extra: {};
};
