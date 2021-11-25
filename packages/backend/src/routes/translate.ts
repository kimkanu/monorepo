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
    'GET /translate',
    async (params, body, user, req, res, next) => {
      console.log('/translate로 GET 요청이 들어옴');

      console.log(params);

      return {
        success: true,
        payload: {
          message: '안녕하세요',
        },
      };
    },
  );

  return route;
}
