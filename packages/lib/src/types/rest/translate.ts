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

type TranslateGetResponse = Response<{ message: string }, never>;
