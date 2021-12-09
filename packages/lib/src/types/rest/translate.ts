import { Response, Empty } from '.';

export type TranslateEndpoints =
  | 'GET /translate';
export type TranslatePathParams = {
  'GET /translate': Empty;
};
export type TranslateRequestBodyType = {
  'GET /translate': Empty;
};
export type TranslateResponseType = {
  'GET /translate': TranslateGetResponse;
};

export type TranslateGetResponse = Response<string, TranslateGetError>;
export type TranslateGetError = {
  code: 'NONEXISTENT_CHAT';
  statusCode: 404;
  extra: Empty;
} | {
  code: 'INVALID_CHAT_TYPE';
  statusCode: 400;
  extra: Empty;
} | {
  code: 'NONEXISTENT_CLASSROOM';
  statusCode: 400;
  extra: Empty;
} | {
  code: 'UNNECESSARY_TRANSLATION';
  statusCode: 400;
  extra: Empty;
} | {
  code: 'UNSUPPORTED_TRANSLATION';
  statusCode: 400;
  extra: Empty;
} | {
  code: 'FORBIDDEN';
  statusCode: 403;
  extra: {}
};
