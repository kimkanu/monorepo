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
  extra: Record<string, never>;
} | {
  code: 'NONEXISTENT_SSO_ACCOUNT';
  statusCode: 404;
  extra: Record<string, never>;
};

// DELETE /users/me/sso-account/:provider
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
