import { Empty } from '..';
import { Response, UnauthorizedError } from '../..';
import { ClassroomJSON } from '../../classroom';

export type ClassroomsEndpoints =
  | 'POST /classrooms'
  | 'PATCH /classrooms/:hash';
export type ClassroomsPathParams = {
  'POST /classrooms': Empty;
  'PATCH /classrooms/:hash': { hash: string };
};
export type ClassroomsRequestBodyType = {
  'POST /classrooms': ClassroomsPostRequest;
  'PATCH /classrooms/:hash': ClassroomsHashPatchRequest;
};
export type ClassroomsResponseType = {
  'POST /classrooms': ClassroomsPostResponse;
  'PATCH /classrooms/:hash': ClassroomsHashPatchResponse;
};

/* POST /classrooms */
export interface ClassroomsPostRequest {
  name: string;
}
export type ClassroomsPostResponse = Response<ClassroomJSON, UnauthorizedError>;

/* PATCH /classrooms/:hash */
export type ClassroomsHashPatchResponse
  = Response<ClassroomJSON, ClassroomsHashPatchError>;
export type ClassroomsHashPatchRequest = {
  operation: 'join';
  passcode: string;
} | {
  operation: 'leave';
};
export type ClassroomsHashPatchError = UnauthorizedError | {
  code: 'NONEXISTENT_CLASSROOM';
  statusCode: 400;
  extra: Empty;
};
