import {
  ClassroomsEndpoints,
  ClassroomsPathParams,
  ClassroomsRequestBodyType,
  ClassroomsResponseType,
} from './classrooms';
import {
  UsersEndpoints,
  UsersPathParams,
  UsersRequestBodyType,
  UsersResponseType,
} from './users';

export type Response<P, E extends ResponseError> = SuccessResponse<P> | FailureResponse<E>;
export interface SuccessResponse<P> {
  success: true;
  payload: P;
}
export interface FailureResponse<E extends ResponseError> {
  success: false;
  error: UnauthorizedError | E;
}
export interface ResponseError {
  code: string;
  statusCode: number;
  extra: Record<string, any>;
}
export interface UnauthorizedError extends ResponseError {
  code: 'UNAUTHORIZED';
  statusCode: 401;
  extra: Record<string, never>;
}
export const unauthorizedError: UnauthorizedError = {
  code: 'UNAUTHORIZED',
  statusCode: 401,
  extra: {},
};

export type FetchMethods = 'GET' | 'POST' | 'PATCH' | 'DELETE';
export type Endpoints =
  | UsersEndpoints
  | ClassroomsEndpoints;
export type PathParams =
  UsersPathParams
  & ClassroomsPathParams;
export type RequestBodyType =
  UsersRequestBodyType
  & ClassroomsRequestBodyType;
export type ResponseType =
  UsersResponseType
  & ClassroomsResponseType;

export * from './users';
export * from './classrooms';
