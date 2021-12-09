import Server from '../server';

import auth from './auth';
import classrooms from './classrooms';
import language from './language';
import Route from './route';
import toasts from './toasts';
import translate from './translate';

import users from './users';
import youtube from './youtube';

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.accept(
    'GET /',
    async () => ({ success: true, payload: {} }),
  );

  route.router.use('/auth', auth);
  route.use(classrooms);
  route.use(users);
  route.use(toasts);
  route.use(youtube);
  route.use(language);
  route.use(translate);
  return route;
}
