import { SocketVoice, ClassroomHash } from '@team-10/lib';
import { Namespace } from 'socket.io';

import Server from '../server';
import { UserSocket } from '../types/socket';

const ioVoiceHandler = (
  io: Namespace<SocketVoice.Events.Request, SocketVoice.Events.Response>,
  server: Server,
) => {
  type Socket = UserSocket<SocketVoice.Events.Request, SocketVoice.Events.Response>;
  type ClassroomVoiceState = {
    speaker: string | null; // speaker's `stringId`
    startedAt: Date | null;
  };

  const state: Record<ClassroomHash, ClassroomVoiceState> = {};
  const initializeClass = (classroomHash: ClassroomHash) => {
    if (!state[classroomHash]) {
      state[classroomHash] = {
        speaker: null,
        startedAt: null,
      };
    }
  };

  const isMember = server.managers.classroom.isUserMember.bind(server.managers.classroom);

  io.on('connection', (socket: Socket) => {
    socket.on('StateChange', async ({ classroomHash, speaking }) => {
      initializeClass(classroomHash);

      // 로그인 상태가 아닐 시
      if (!socket.request.user) {
        socket.emit('StateChange', {
          success: false,
          reason: SocketVoice.PermissionDeniedReason.UNAUTHORIZED,
        });
        return;
      }

      // 유저가 교실에 들어있지 않을 때
      const userId: string = socket.request.user.stringId;
      if (!await isMember(userId, classroomHash)) {
        socket.emit('StateChange', {
          success: false,
          reason: SocketVoice.PermissionDeniedReason.NOT_MEMBER,
        });
        return;
      }

      // 이미 유저가 말하고 있으면 말하기 요청 무시
      if (speaking && state[classroomHash].speaker === userId) {
        socket.emit('StateChange', {
          success: true,
          speaking,
        });
        return;
      }

      // 자신이 아닌 누군가 말하고 있으면 요청 거절
      if (!!state[classroomHash].speaker && state[classroomHash].speaker !== userId) {
        socket.emit('StateChange', {
          success: false,
          reason: SocketVoice.PermissionDeniedReason.SOMEONE_IS_SPEAKING,
        });
        return;
      }

      // 아무도 말하고 있지 않으면 말하기 요청 수락
      if ((state[classroomHash].speaker === null) && speaking) {
        state[classroomHash].speaker = userId;
        state[classroomHash].startedAt = new Date();
        socket.emit('StateChange', {
          success: true,
          speaking: true,
        });
        io.emit('StateChangeBroadcast', {
          speaking: true,
          classroomHash,
          userId,
          sentAt: Date.now(),
        });
        // Main socket으로 업데이트
        server.managers.user.makeSocketMain(userId, socket.id);
        return;
      }

      // 자신이 말하고 있을 때 말하기 중단 요청
      if (!speaking && state[classroomHash].speaker === userId) {
        socket.emit('StateChange', {
          success: true,
          speaking: false,
        });

        if (state[classroomHash].startedAt) {
          server.managers.classroom.recordVoiceHistory(
            classroomHash,
            userId,
            state[classroomHash].startedAt!,
            new Date(),
          );
          state[classroomHash].startedAt = null;
        }
        await new Promise((r) => setTimeout(r, 1000));
        state[classroomHash].speaker = null;
        io.emit('StateChangeBroadcast', {
          speaking: false,
          classroomHash,
          userId,
          reason: SocketVoice.StateChangeEndReason.NORMAL,
          sentAt: Date.now(),
        });
      }
    });

    socket.on('StreamSend', async ({ voices, classroomHash, sequenceIndex }) => {
      initializeClass(classroomHash);

      // 로그인 상태가 아닐 시
      if (!socket.request.user) {
        socket.emit('StreamSend', {
          success: false,
          reason: SocketVoice.StreamSendDeniedReason.UNAUTHORIZED,
        });
        return;
      }

      const userId: string = socket.request.user.stringId;
      // 유저가 speaker가 아닐 때
      if (state[classroomHash].speaker !== userId) {
        socket.emit('StreamSend', {
          success: false,
          reason: SocketVoice.StreamSendDeniedReason.NOT_SPEAKER,
        });
        return;
      }

      socket.emit('StreamSend', {
        success: true,
        sequenceIndex,
      });

      io.emit('StreamReceiveBroadcast', {
        voices,
        speakerId: userId,
        sequenceIndex,
      });
    });
  });
};

export default ioVoiceHandler;
