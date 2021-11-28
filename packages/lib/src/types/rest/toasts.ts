import { Response, Empty } from '.';

export type ToastsEndpoints =
  | 'GET /toasts';
export type ToastsPathParams = {
  'GET /toasts': Empty;
};
export type ToastsRequestBodyType = {
  'GET /toasts': Empty;
};
export type ToastsResponseType = {
  'GET /toasts': ToastsGetResponse;
};

interface Toast {
  type: 'info' | 'warn' | 'error';
  message: string;
}
type ToastsGetResponse = Response<Toast[], never>;
