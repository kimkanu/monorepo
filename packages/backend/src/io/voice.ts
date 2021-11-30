import { SocketVoice } from '@team-10/lib';
import { Server as IOServer } from 'socket.io';

import Server from '../server';
import { UserSocket } from '../types/socket';

const ioVoiceHandler = (
  io: IOServer<SocketVoice.Events.Request, SocketVoice.Events.Response>,
  server: Server,
) => {
  type Socket = UserSocket<SocketVoice.Events.Request, SocketVoice.Events.Response>;

  io.on('connection', (socket: Socket) => {
    socket.on('voice/StateChange', async ({ hash, speaking }) => {
      // 로그인 상태가 아닐 시
      if (!socket.request.user) {
        socket.emit('voice/StateChange', {
          success: false,
          reason: SocketVoice.PermissionDeniedReason.UNAUTHORIZED,
        });
        return;
      }

      // 없는 수업일 때
      const classroom = await server.managers.classroom.get(hash);
      if (!classroom) {
        socket.emit('voice/StateChange', {
          success: false,
          reason: SocketVoice.PermissionDeniedReason.NOT_MEMBER,
        });
        return;
      }

      // 유저가 교실에 들어있지 않을 때
      const userId: string = socket.request.user.stringId;
      if (!classroom.hasMember(userId)) {
        socket.emit('voice/StateChange', {
          success: false,
          reason: SocketVoice.PermissionDeniedReason.NOT_MEMBER,
        });
        return;
      }

      // 이미 유저가 말하고 있으면 말하기 요청 무시
      if (speaking && classroom.voice.speaker === userId) {
        socket.emit('voice/StateChange', {
          success: true,
          speaking,
        });
        return;
      }

      // 자신이 아닌 누군가 말하고 있으면 요청 거절
      if (!!classroom.voice.speaker && classroom.voice.speaker !== userId) {
        socket.emit('voice/StateChange', {
          success: false,
          reason: SocketVoice.PermissionDeniedReason.SOMEONE_IS_SPEAKING,
        });
        return;
      }

      // 아무도 말하고 있지 않으면 말하기 요청 수락
      if ((classroom.voice.speaker === null) && speaking) {
        classroom.voice.speaker = userId;
        classroom.voice.startedAt = new Date();
        socket.emit('voice/StateChange', {
          success: true,
          speaking: true,
        });
        classroom.broadcast('voice/StateChangeBroadcast', {
          speaking: true,
          hash,
          userId,
          sentAt: Date.now(),
        });
        // Main socket으로 업데이트
        server.managers.user.makeSocketMain(userId, socket.id);
        return;
      }

      // 자신이 말하고 있을 때 말하기 중단 요청
      if (!speaking && classroom.voice.speaker === userId) {
        socket.emit('voice/StateChange', {
          success: true,
          speaking: false,
        });

        if (classroom.voice.startedAt) {
          server.managers.classroom.recordVoiceHistory(
            hash,
            userId,
            classroom.voice.startedAt!,
            new Date(),
          );
          classroom.voice.startedAt = null;
        }
        await new Promise((r) => setTimeout(r, 1000));
        classroom.voice.speaker = null;
        classroom.broadcast('voice/StateChangeBroadcast', {
          speaking: false,
          hash,
          userId,
          reason: SocketVoice.StateChangeEndReason.NORMAL,
          sentAt: Date.now(),
        });
      }
    });

    socket.on('voice/StreamSend', async ({ voices, hash, sequenceIndex }) => {
      // 로그인 상태가 아닐 시
      if (!socket.request.user) {
        socket.emit('voice/StreamSend', {
          success: false,
          reason: SocketVoice.PermissionDeniedReason.UNAUTHORIZED,
        });
        return;
      }

      // 없는 수업일 때
      const classroom = await server.managers.classroom.get(hash);
      if (!classroom) {
        socket.emit('voice/StreamSend', {
          success: false,
          reason: SocketVoice.PermissionDeniedReason.NOT_MEMBER,
        });
        return;
      }

      // 유저가 speaker가 아닐 때
      const userId: string = socket.request.user.stringId;
      if (classroom.voice.speaker !== userId) {
        socket.emit('voice/StreamSend', {
          success: false,
          reason: SocketVoice.StreamSendDeniedReason.NOT_SPEAKER,
        });
        return;
      }

      socket.emit('voice/StreamSend', {
        success: true,
        sequenceIndex,
      });

      classroom.broadcastMainExcept('voice/StreamReceiveBroadcast', [userId], {
        voices,
        speakerId: userId,
        sequenceIndex,
      });
    });
  });
};

export default ioVoiceHandler;
