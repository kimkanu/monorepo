import { Empty } from '..';
import { KeysOfUnion, Response } from '../..';
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
export type ClassroomsPostResponse = Response<ClassroomJSON, ClassroomsPostError>;
export type ClassroomsPostError = {
  code: 'INVALID_INFORMATION';
  statusCode: 400;
  extra: {
    field: keyof ClassroomsPostRequest;
    details: string;
  }
};

/* PATCH /classrooms/:hash */
export type ClassroomsHashPatchResponse
  = Response<ClassroomJSON, ClassroomsHashPatchError>;
export type ClassroomsHashPatchRequest = {
  operation: 'join';
  passcode: string;
} | {
  operation: 'leave';
};
export type ClassroomsHashPatchError = {
  code: 'NONEXISTENT_CLASSROOM';
  statusCode: 400;
  extra: Empty;
} | {
  code: 'INVALID_INFORMATION';
  statusCode: 400;
  extra: {
    field: KeysOfUnion<ClassroomsHashPatchRequest>;
    details: string;
  }
};
