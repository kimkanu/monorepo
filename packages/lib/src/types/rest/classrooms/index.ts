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
export type ClassroomsHashPatchResponse<T extends ClassroomsHashPatchRequest['operation'] = ClassroomsHashPatchRequest['operation']>
  = Response<ClassroomsHashPatchResponsePayload<T>, ClassroomsHashPatchError>;
export type ClassroomsHashPatchRequest = {
  operation: 'join';
  passcode: string;
} | {
  operation: 'leave';
} | {
  operation: 'reset_passcode';
} | {
  operation: 'rename';
  name: string;
};
/* eslint-disable @typescript-eslint/indent */
export type ClassroomsHashPatchResponsePayload<T extends ClassroomsHashPatchRequest['operation']>
  = T extends 'join'
  ? ClassroomJSON
  : T extends 'leave'
  ? Empty
  : T extends 'reset_passcode'
  ? { passcode: string }
  : T extends 'rename'
  ? { name: string }
  : never;
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
} | {
  code: 'FORBIDDEN';
  statusCode: 403;
  extra: {}
};
