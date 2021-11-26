import { SocketYouTube } from '@team-10/lib';
import { Namespace } from 'socket.io';

import Server from '../server';
import { UserSocket } from '../types/socket';

const ioYouTubeHandler = (
  io: Namespace<SocketYouTube.Events.Request, SocketYouTube.Events.Response>,
  server: Server,
) => {
  type Socket = UserSocket<SocketYouTube.Events.Request, SocketYouTube.Events.Response>;
  const { managers } = server;
  io.on('connection', (socket: Socket) => {
    console.log('connected youtube : ', socket.id);
    socket.on('JoinClassroom', async ({ classroomHash, userId, isInstructor }) => {
      socket.join(classroomHash);
      console.log(isInstructor);
      if (!isInstructor) {
        io.emit('CurrentVideoPosition', { userId });
        console.log('give current info');
      }
    });
    socket.on('CurrentVideoPosition', async ({
      userId, classroomHash, play, videoId, timeInYouTube,
    }) => {
      io.to(userId).emit('ChangePlayStatusBroadcast', {
        classroomHash,
        play,
        videoId,
        timeInYouTube,
      });
      console.log('current paly : ', play);
      console.log('current time : ', timeInYouTube);
    });
    socket.on('ChangePlayStatus', async ({
      classroomHash, play, videoId, timeInYouTube,
    }) => {
      console.log('broadcast change status');
      socket.broadcast.to(classroomHash).emit('ChangePlayStatusBroadcast', {
        classroomHash,
        play,
        videoId,
        timeInYouTube,
      });
    });
    socket.on('ChangeTime', async ({
      classroomHash, play, videoId, timeInYouTube,
    }) => {
      console.log('broadcast change time');
      socket.broadcast.to(classroomHash).emit('ChangeTimeBroadcast', {
        classroomHash,
        play,
        videoId,
        timeInYouTube,
      });
    });
  });
};

export default ioYouTubeHandler;
