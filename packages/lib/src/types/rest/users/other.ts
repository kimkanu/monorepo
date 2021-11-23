import { Empty, Response } from '..';
import { ClassroomJSON } from '../../classroom';

import { UserInfoJSON } from '.';

export type UsersOtherEndpoints = 'GET /users/:id';
export type UsersOtherPathParams = {
  'GET /users/:id': { id: string };
};
export type UsersOtherRequestBodyType = {
  'GET /users/:id': Empty;
};
export type UsersOtherResponseType = {
  'GET /users/:id': UsersOtherGetResponse;
};

/* GET /users/:id */
export interface UserInfoOtherJSON extends UserInfoJSON {
  commonClassrooms: ClassroomJSON[];
}
export type UsersOtherGetResponse = Response<UserInfoOtherJSON, UserInfoOtherGetError>;
export type UserInfoOtherGetError = {
  code: 'NONEXISTENT_USER';
  statusCode: 404;
  extra: Empty;
};
