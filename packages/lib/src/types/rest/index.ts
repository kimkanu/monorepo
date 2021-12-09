import {
  ClassroomsEndpoints,
  ClassroomsPathParams,
  ClassroomsRequestBodyType,
  ClassroomsResponseType,
} from './classrooms';
import {
  UsersLangEndpoints,
  UsersLangPathParams,
  UsersLangRequestBodyType,
  UsersLangResponseType,
} from './language';
import {
  ToastsEndpoints,
  ToastsPathParams,
  ToastsRequestBodyType,
  ToastsResponseType,
} from './toasts';
import {
  UsersEndpoints,
  UsersPathParams,
  UsersRequestBodyType,
  UsersResponseType,
} from './users';
import {
  YouTubeEndpoints,
  YouTubePathParams,
  YouTubeRequestBodyType,
  YouTubeResponseType,
} from './youtube';

export type Empty = Record<string, never>;

export type Response<P, E extends ResponseError> = SuccessResponse<P> | FailureResponse<E>;
export interface SuccessResponse<P> {
  success: true;
  payload: P;
}
export interface FailureResponse<E extends ResponseError> {
  success: false;
  error: UnauthorizedError | InternalServerError | E;
}
export interface ResponseError {
  code: string;
  statusCode: number;
  extra: Record<string, any>;
}
export interface UnauthorizedError extends ResponseError {
  code: 'UNAUTHORIZED';
  statusCode: 401;
  extra: Empty;
}
export interface InternalServerError extends ResponseError {
  code: 'INTERNAL_SERVER_ERROR';
  statusCode: 500;
  extra: {
    details?: string;
  }
}
export const unauthorizedError: UnauthorizedError = {
  code: 'UNAUTHORIZED',
  statusCode: 401,
  extra: {},
};

export type FetchMethods = 'GET' | 'POST' | 'PATCH' | 'DELETE';
export type Endpoints =
  | 'GET /'
  | UsersEndpoints
  | ClassroomsEndpoints
  | ToastsEndpoints
  | YouTubeEndpoints
  | UsersLangEndpoints;
export type PathParams =
  { 'GET /': Empty }
  & UsersPathParams
  & ClassroomsPathParams
  & ToastsPathParams
  & YouTubePathParams
  & UsersLangPathParams;
export type RequestBodyType =
  { 'GET /': Empty }
  & UsersRequestBodyType
  & ClassroomsRequestBodyType
  & ToastsRequestBodyType
  & YouTubeRequestBodyType
  & UsersLangRequestBodyType;
export type ResponseType =
  { 'GET /': Response<Empty, never> }
  & UsersResponseType
  & ClassroomsResponseType
  & ToastsResponseType
  & YouTubeResponseType
  & UsersLangResponseType;

export * from './users';
export * from './classrooms';
export * from './toasts';
export * from './youtube';
export * from './language';
