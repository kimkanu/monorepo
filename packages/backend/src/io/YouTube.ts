import { SocketYouTube } from '@team-10/lib';
import { Server as IOServer } from 'socket.io';

import Server from '../server';
import { UserSocket } from '../types/socket';

const ioYouTubeHandler = (
  io: IOServer<SocketYouTube.Events.Request, SocketYouTube.Events.Response>,
  server: Server,
) => {
  type Socket = UserSocket<SocketYouTube.Events.Request, SocketYouTube.Events.Response>;

  io.on('connection', (socket: Socket) => {
    socket.on('youtube/JoinClassroom', async ({ hash }) => {
      // 로그인 상태가 아닐 시
      if (!socket.request.user) {
        socket.emit('youtube/JoinClassroom', {
          success: false,
          reason: SocketYouTube.JoinClassroomFailReason.UNAUTHORIZED,
        });
        return;
      }

      // 없는 수업일 때
      const classroom = await server.managers.classroom.get(hash);
      if (!classroom) {
        socket.emit('youtube/JoinClassroom', {
          success: false,
          reason: SocketYouTube.JoinClassroomFailReason.NOT_MEMBER,
        });
        return;
      }

      // 유저가 교실에 들어있지 않을 때
      const userId: string = socket.request.user.stringId;
      if (!classroom.hasMember(userId)) {
        socket.emit('youtube/JoinClassroom', {
          success: false,
          reason: SocketYouTube.JoinClassroomFailReason.NOT_MEMBER,
        });
        return;
      }

      const { youtube } = classroom;
      socket.emit('youtube/JoinClassroom', {
        success: true,
        hash,
        play: youtube.play,
        // eslint-disable-next-line no-nested-ternary
        time: youtube.currentTime === null
          ? null
          : youtube.play
            ? youtube.currentTime
              + (Date.now() - (youtube.responseTime?.getTime() ?? Date.now())) / 1000
            : youtube.currentTime,
        videoId: youtube.videoId,
      });
    });

    socket.on('youtube/ChangePlayStatus', async ({
      hash, play, videoId, time,
    }) => {
      // 로그인 상태가 아닐 시
      if (!socket.request.user) {
        socket.emit('youtube/ChangePlayStatus', {
          success: false,
          reason: SocketYouTube.ChangePlayStatusFailReason.UNAUTHORIZED,
        });
        return;
      }

      // 없는 수업일 때
      const classroom = await server.managers.classroom.get(hash);
      if (!classroom) {
        socket.emit('youtube/ChangePlayStatus', {
          success: false,
          reason: SocketYouTube.ChangePlayStatusFailReason.NOT_MEMBER,
        });
        return;
      }

      // 유저가 교실에 들어있지 않을 때
      const userId: string = socket.request.user.stringId;
      if (!classroom.hasMember(userId)) {
        socket.emit('youtube/ChangePlayStatus', {
          success: false,
          reason: SocketYouTube.ChangePlayStatusFailReason.NOT_MEMBER,
        });
        return;
      }

      // 유저가 instructor가 아닐 때
      if (!classroom.hasMember(userId)) {
        socket.emit('youtube/ChangePlayStatus', {
          success: false,
          reason: SocketYouTube.ChangePlayStatusFailReason.PERMISSION_DENIED,
        });
        return;
      }

      classroom.youtube = {
        responseTime: new Date(),
        play,
        currentTime: time,
        videoId,
      };
      classroom.broadcastExcept(
        'youtube/ChangePlayStatusBroadcast',
        [classroom.instructor.stringId],
        {
          hash, play, videoId, time,
        },
      );
    });
  });
};

export default ioYouTubeHandler;
