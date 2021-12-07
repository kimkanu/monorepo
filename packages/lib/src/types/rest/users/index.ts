import {
  UsersLangEndpoints,
  UsersLangPathParams,
  UsersLangRequestBodyType,
  UsersLangResponseType,
} from './language';
import {
  UsersMeEndpoints,
  UsersMePathParams,
  UsersMeRequestBodyType,
  UsersMeResponseType,
} from './me';
import {
  UsersOtherEndpoints,
  UsersOtherPathParams,
  UsersOtherRequestBodyType,
  UsersOtherResponseType,
} from './other';

export const providers = ['naver' as 'naver', 'github' as 'github'];
export type Provider = typeof providers extends (infer T)[] ? T : never;

export interface SSOAccountJSON {
  provider: Provider;
  providerId: string;
}

export interface UserInfoJSON {
  stringId: string;
  displayName: string;
  profileImage: string;
}

export interface UserLangJSON {
  stringId: string;
  language: string;
}

export type UsersEndpoints =
  | UsersMeEndpoints
  | UsersOtherEndpoints
  | UsersLangEndpoints;
export type UsersPathParams =
  UsersMePathParams
  & UsersOtherPathParams
  & UsersLangPathParams;
export type UsersRequestBodyType =
  UsersMeRequestBodyType
  & UsersOtherRequestBodyType
  & UsersLangRequestBodyType;
export type UsersResponseType =
  UsersMeResponseType
  & UsersOtherResponseType
  & UsersLangResponseType;

export * from './me';
export * from './other';
export * from './language';
