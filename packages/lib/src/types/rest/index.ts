export type Response<P, E extends ResponseError> = SuccessResponse<P> | FailureResponse<E>;
export interface SuccessResponse<P> {
  success: true;
  payload: P;
}
export interface FailureResponse<E extends ResponseError> {
  success: false;
  error: E;
}
export interface ResponseError {
  code: string;
  statusCode: number;
  extra: Record<string, any>;
}

export * from './users';
export * from './classroom';
