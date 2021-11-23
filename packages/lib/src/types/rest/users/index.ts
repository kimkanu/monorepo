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

export type Provider = 'naver' | 'github';

export interface SSOAccountJSON {
  provider: Provider;
  providerId: string;
}

export interface UserInfoJSON {
  stringId: string;
  displayName: string;
  profileImage: string;
}

export type UsersEndpoints =
  | UsersMeEndpoints
  | UsersOtherEndpoints;
export type UsersPathParams =
  UsersMePathParams
  & UsersOtherPathParams;
export type UsersRequestBodyType =
  UsersMeRequestBodyType
  & UsersOtherRequestBodyType;
export type UsersResponseType =
  UsersMeResponseType
  & UsersOtherResponseType;

export * from './me';
export * from './other';
