import Server from '../server';

import auth from './auth';
import classrooms from './classrooms';
import Route from './route';
import users from './users';

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.accept(
    'GET /',
    async () => ({ success: true, payload: {} }),
  );

  route.router.use('/auth', auth);
  route.use(classrooms);
  route.use(users);

  return route;
}
