import http from 'http';

import { Socket } from 'socket.io';
import { EventsMap, DefaultEventsMap } from 'socket.io/dist/typed-events';

import User from '../entity/user';

export interface UserSocket<
  ListenEvents extends EventsMap = DefaultEventsMap,
  EmitEvents extends EventsMap = ListenEvents,
  ServerSideEvents extends EventsMap = DefaultEventsMap,
> extends Socket<ListenEvents, EmitEvents, ServerSideEvents> {
  request: http.IncomingMessage & { user?: User };
}
