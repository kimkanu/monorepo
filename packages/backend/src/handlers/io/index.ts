import Server from '../../server';
import { UserSocket } from '../../types/socket';

import ioVoiceHandler from './voice';

const ioHandler = (server: Server) => {
  const { io } = server;

  io.on('connection', (socket: UserSocket) => {
    console.log('User connected');
    console.log('User', socket.request.user);
    console.log('ssoAccounts', socket.request.user?.ssoAccounts);
    console.log('classrooms', socket.request.user?.classrooms);

    socket.on('disconnect', () => {
      console.log('User disconnect');
    });
  });

  ioVoiceHandler(io.of('/voice'), server);
};

export default ioHandler;
