import Server from '../../server';

import Route from '../route';

import language from './language';
import me from './me';
import other from './other';

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.use(me);
  route.use(other);
  route.use(language);

  return route;
}
