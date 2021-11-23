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
  pathParams: PathParams[E] = ({} as any),
  body?: RequestBodyType[E] | FormData,
): Promise<ResponseType[E]> {
  const urls = endpoint.split(' ');
  const method = urls[0] as FetchMethods;
  const url = urls.slice(1).join(' ').replace(
    /(?<=\/):(\w+)(?=\/|$)/g,
    (param) => (pathParams as Record<string, string>)[param.slice(1)],
  );
  console.log(body, body instanceof FormData);
  const response = await fetch(`/api${url}`, {
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
