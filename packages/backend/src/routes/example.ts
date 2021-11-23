import Server from '../server';

import Route from './route';

/**
 * 예시 route입니다.
 * @param server Server instance
 * @returns Route
 */
export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.accept(
    'GET /',
    async (params, body, user, req, res, next) => ({
      success: true,
      payload: {},
    }),
  );

  return route;
}
