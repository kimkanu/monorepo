import { Empty } from '..';
import { ChatContent, KeysOfUnion, Response } from '../..';
import { ClassroomJSON } from '../../classroom';

export type ClassroomsEndpoints =
  | 'POST /classrooms'
  | 'PATCH /classrooms/:hash'
  | 'DELETE /classrooms/:hash'
  | 'GET /classrooms/:hash/chats';
export type ClassroomsPathParams = {
  'POST /classrooms': Empty;
  'PATCH /classrooms/:hash': { hash: string };
  'DELETE /classrooms/:hash': { hash: string };
  'GET /classrooms/:hash/chats': { hash: string };
};
export type ClassroomsRequestBodyType = {
  'POST /classrooms': ClassroomsPostRequest;
  'PATCH /classrooms/:hash': ClassroomsHashPatchRequest;
  'DELETE /classrooms/:hash': Empty;
  'GET /classrooms/:hash/chats': Empty;
};
export type ClassroomsResponseType = {
  'POST /classrooms': ClassroomsPostResponse;
  'PATCH /classrooms/:hash': ClassroomsHashPatchResponse;
  'DELETE /classrooms/:hash': ClassroomsHashDeleteResponse;
  'GET /classrooms/:hash/chats': ClassroomsHashChatsGetResponse;
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
} | {
  operation: 'toggle';
  start: boolean;
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
  : T extends 'toggle'
  ? Empty
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

export type ClassroomsHashDeleteResponse = Response<Empty, ClassroomsHashDeleteError>;
export type ClassroomsHashDeleteError = {
  code: 'NONEXISTENT_CLASSROOM';
  statusCode: 400;
  extra: Empty;
} | {
  code: 'FORBIDDEN';
  statusCode: 403;
  extra: {}
};

export type ClassroomsHashChatsGetResponse = Response<ChatContent[], ClassroomsHashChatsGetError>;
export type ClassroomsHashChatsGetError = {
  code: 'NONEXISTENT_CLASSROOM';
  statusCode: 400;
  extra: Empty;
} | {
  code: 'FORBIDDEN';
  statusCode: 403;
  extra: {}
};
