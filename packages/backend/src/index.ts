/* eslint-disable no-console */

import 'reflect-metadata';

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

const server = new Server(port);
server.initialize().then(() => {
  server.listen();
});

export default server;
