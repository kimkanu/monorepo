import Server from '../../../server';
import Route from '../../route';

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  // TODO
  // route.accept(
  //   'GET /users/me/sso-accounts',
  //   async (params, body, user, req, res) => ({
  //     success: true,
  //     payload: {},
  //   }),
  // );

  return route;
}
