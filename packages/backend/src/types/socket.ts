import http from 'http';

import { Socket } from 'socket.io';

import User from '../entity/user';

export type UserSocket = Socket & {
  request: http.IncomingMessage & { user?: User };
};
