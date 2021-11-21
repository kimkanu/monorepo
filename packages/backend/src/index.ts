/* eslint-disable no-console */

import 'reflect-metadata';

import fs from 'fs';

import ioHandler from './io';
import Server from './server';

if (!process.env.PORT) {
  console.error('The port number is not given!');
  process.exit(1);
}
const port = parseInt(process.env.PORT, 10);

if (!process.env.DATABASE_URL) {
  console.error('The database URL is not given!');
  process.exit(1);
}

if (!process.env.SESSION_SECRET) {
  console.error('The session secret is not given!');
  process.exit(1);
}

if (process.env.DYNO) {
  console.log('This is on Heroku..!!');
  fs.openSync('/tmp/app-initialized', 'w');
}

const server = new Server(port);
server.initialize().then(() => {
  ioHandler(server);
  server.listen();
});

export default server;
