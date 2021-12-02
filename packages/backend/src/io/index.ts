import Server from '../server';
import { UserSocket } from '../types/socket';

import ioClassroomHandler from './classroom';
import ioVoiceHandler from './voice';
import ioYouTubeHandler from './YouTube';

const ioHandler = (server: Server) => {
  const { io, managers } = server;

  io.on('connection', async (socket: UserSocket) => {
    if (socket.request.user) {
      const userId = socket.request.user.stringId;
      await managers.user.add(userId, socket);
    }

    socket.on('disconnect', async () => {
      if (socket.request.user) {
        const userId = socket.request.user.stringId;
        await managers.classroom.disconnectMemberFromAll(userId);
        managers.user.remove(userId, socket);
      }
    });
  });
  ioVoiceHandler(io, server);
  ioYouTubeHandler(io, server);
  ioClassroomHandler(io, server);
};

export default ioHandler;
