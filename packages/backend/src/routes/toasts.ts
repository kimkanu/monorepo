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
    'GET /toasts',
    async (params, body, user, req) => {
      const { toast } = req.session;
      req.session.toast = undefined;

      const toasts = toast ? JSON.parse(toast) : [];

      return {
        success: true,
        payload: toasts,
      };
    },
  );

  return route;
}
