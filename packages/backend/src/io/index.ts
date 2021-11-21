import Server from '../server';
import { UserSocket } from '../types/socket';

import ioVoiceHandler from './voice';

const ioHandler = (server: Server) => {
  const { io, managers } = server;

  io.on('connection', async (socket: UserSocket) => {
    console.log('user', socket.request.user);

    if (socket.request.user) {
      managers.socket.add(socket.request.user.id, socket);
      console.log(await managers.classroom.isUserMember(socket.request.user.id, 'TOP-SAL-LIN'));
    }

    socket.on('disconnect', () => {
      if (socket.request.user) {
        managers.socket.remove(socket.request.user.id, socket);
      }
    });
  });

  ioVoiceHandler(io.of('/voice'), server);
};

export default ioHandler;
