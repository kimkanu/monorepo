import { SocketVoice, ClassroomHash } from '@team-10/lib';
import { Namespace } from 'socket.io';
import { getConnection } from 'typeorm';

import User from '../../entity/user';
import Server from '../../server';
import { UserSocket } from '../../types/socket';

const ioVoiceHandler = (
  io: Namespace<SocketVoice.Events.Request, SocketVoice.Events.Response>,
  server: Server,
) => {
  type Socket = UserSocket<SocketVoice.Events.Request, SocketVoice.Events.Response>;
  type ClassroomVoiceState = {
    speaker: string | null; // speaker's `stringId`
  };

  const connection = getConnection();
  const userRepository = connection.getRepository(User);

  const state: Record<ClassroomHash, ClassroomVoiceState> = {};
  const initializeClass = (classroomHash: ClassroomHash) => {
    if (!state[classroomHash]) {
      state[classroomHash] = {
        speaker: null,
      };
    }
  };

  const isMember = (userId: string, classroomHash: ClassroomHash) => userRepository
    .findOneOrFail({
      where: {
        stringId: userId,
      },
      join: {
        alias: 'user',
        leftJoinAndSelect: { classrooms: 'user.classrooms' },
      },
    })
    .then(
      ({ classrooms }) => classrooms.some((classroom) => classroom.hash === classroomHash),
    );

  io.on('connection', (socket: Socket) => {
    socket.on('StateChange', async ({ classroomHash, speaking }) => {
      initializeClass(classroomHash);

      console.log('StateChange', classroomHash, speaking);
      console.log('Speaker', state[classroomHash].speaker);

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
        socket.emit('StateChange', {
          success: true,
          speaking: true,
        });
        io.emit('StateChangeBroadcast', {
          speaking: true,
          classroomHash,
          userId: 'user',
          sentAt: Date.now(),
        });
        return;
      }

      // 자신이 말하고 있을 때 말하기 중단 요청
      if (!speaking && state[classroomHash].speaker === userId) {
        await new Promise((r) => setTimeout(r, 500));
        state[classroomHash].speaker = null;
        socket.emit('StateChange', {
          success: true,
          speaking: false,
        });
        io.emit('StateChangeBroadcast', {
          speaking: false,
          classroomHash,
          userId: 'user',
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
        console.log('UNAUTHORIZED');
        return;
      }

      // 유저가 교실에 들어있지 않을 때
      const userId: string = socket.request.user.stringId;
      if (!await isMember(userId, classroomHash)) {
        socket.emit('StreamSend', {
          success: false,
          reason: SocketVoice.StreamSendDeniedReason.NOT_MEMBER,
        });
        console.log('NOT_MEMBER');
        return;
      }

      // 유저가 speaker가 아닐 때
      if (state[classroomHash].speaker !== userId) {
        socket.emit('StreamSend', {
          success: false,
          reason: SocketVoice.StreamSendDeniedReason.NOT_SPEAKER,
        });
        console.log('NOT_SPEAKER');
        return;
      }

      console.log('StreamSend', sequenceIndex, voices.map((voice) => voice.buffer.byteLength).reduce((a, b) => a + b, 0));

      // TODO: 노이즈 제거 및 음성 변조 등
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
