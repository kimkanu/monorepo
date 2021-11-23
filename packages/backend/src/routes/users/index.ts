import Server from '../../server';

import Route from '../route';

import me from './me';
import other from './other';

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.use(me);
  route.use(other);

  return route;
}
