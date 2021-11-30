import Server from '../server';
import { UserSocket } from '../types/socket';

import ioVoiceHandler from './voice';
import ioYouTubeHandler from './YouTube';

const ioHandler = (server: Server) => {
  const { io, managers } = server;

  io.on('connection', async (socket: UserSocket) => {
    if (socket.request.user) {
      const userId = socket.request.user.stringId;
      await managers.user.add(userId, socket);
      await managers.classroom.connectMemberToAll(userId);
    }

    socket.on('disconnect', async () => {
      if (socket.request.user) {
        const userId = socket.request.user.stringId;
        await managers.classroom.disconnectMemberFromAll(userId);
        managers.user.remove(socket.request.user.stringId, socket);
      }
    });
  });
  ioVoiceHandler(io, server);
  ioYouTubeHandler(io, server);
};

export default ioHandler;
