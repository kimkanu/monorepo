import { SocketClassroom } from '@team-10/lib';
import { Server as IOServer } from 'socket.io';

import Server from '../server';
import { UserSocket } from '../types/socket';

const ioClassroomHandler = (
  io: IOServer<SocketClassroom.Events.Request, SocketClassroom.Events.Response>,
  server: Server,
) => {
  type Socket = UserSocket<SocketClassroom.Events.Request, SocketClassroom.Events.Response>;

  io.on('connection', (socket: Socket) => {
    socket.on('classroom/Join', async ({ hash }) => {
      // 로그인 상태가 아닐 시
      if (!socket.request.user) {
        socket.emit('classroom/Join', {
          success: false,
          reason: SocketClassroom.JoinFailReason.UNAUTHORIZED,
        });
        return;
      }

      // 없는 수업일 때
      const classroom = await server.managers.classroom.get(hash);
      if (!classroom) {
        socket.emit('classroom/Join', {
          success: false,
          reason: SocketClassroom.JoinFailReason.NOT_MEMBER,
        });
        return;
      }

      // 유저가 교실에 들어있지 않을 때
      const userId: string = socket.request.user.stringId;
      if (!classroom.hasMember(userId)) {
        socket.emit('classroom/Join', {
          success: false,
          reason: SocketClassroom.JoinFailReason.NOT_MEMBER,
        });
        return;
      }

      const { youtube } = classroom;
      const json = (await server.managers.classroom.getClassroomJSON(hash))!;
      socket.emit('classroom/Join', {
        success: true,
        ...json,
        isVideoPlaying: youtube.play,
        // eslint-disable-next-line no-nested-ternary
        videoTime: youtube.currentTime === null
          ? null
          : youtube.play
            ? youtube.currentTime
              + (Date.now() - (youtube.responseTime?.getTime() ?? Date.now())) / 1000
            : youtube.currentTime,
      });

      await server.managers.classroom.disconnectMemberFromAll(userId);
      await server.managers.classroom.connectMember(userId, hash);
    });
  });
};

export default ioClassroomHandler;
