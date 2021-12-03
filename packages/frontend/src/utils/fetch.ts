import {
  FetchMethods,
  Endpoints,
  PathParams,
  RequestBodyType,
  ResponseType,
  unauthorizedError,
} from '@team-10/lib';

export default async function fetchAPI<E extends Endpoints>(
  endpoint: E,
  params: PathParams[E] & Record<string, string> = ({} as any),
  body?: RequestBodyType[E] | FormData,
): Promise<ResponseType[E]> {
  const urls = endpoint.split(' ');
  const method = urls[0] as FetchMethods;
  const consumed: string[] = [];
  const url = urls.slice(1).join(' ').replace(
    /(?<=\/):(\w+)(?=\/|$)/g,
    (param) => {
      consumed.push(param.slice(1));
      return (params as Record<string, string>)[param.slice(1)];
    },
  );
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(([key]) => !consumed.includes(key)),
  );
  const response = await fetch(`/api${url}?${new URLSearchParams(queryParams).toString()}`, {
    method,
    body: body instanceof FormData ? body : JSON.stringify(body),
    ...(body && !(body instanceof FormData) ? {
      headers: {
        'Content-Type': 'application/json',
      },
    } : {}),
  });
  if (response.status === 401) {
    return { success: false, error: unauthorizedError };
  }
  return response.json() as Promise<ResponseType[E]>;
}
