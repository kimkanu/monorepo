import Server from '../server';
import { UserSocket } from '../types/socket';

import ioVoiceHandler from './voice';

const ioHandler = (server: Server) => {
  const { io, managers } = server;

  io.on('connection', async (socket: UserSocket) => {
    console.log('user', socket.request.user);
    if (socket.request.user) {
      await managers.user.add(socket.request.user.stringId, socket);
    }

    socket.on('disconnect', () => {
      if (socket.request.user) {
        managers.user.remove(socket.request.user.stringId, socket);
      }
    });
  });

  ioVoiceHandler(io.of('/voice'), server);
};

export default ioHandler;
