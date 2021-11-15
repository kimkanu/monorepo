import { SocketVoice, ClassHash } from '@team-10/lib';
import { Namespace } from 'socket.io';
import { getConnection } from 'typeorm';

import Classroom from '../../entity/classroom';
import User from '../../entity/user';
import Server from '../../server';
import { UserSocket } from '../../types/socket';
import nonce from '../../utils/nonce';

const ioVoiceHandler = (
  io: Namespace<SocketVoice.Events.Request, SocketVoice.Events.Response>,
  server: Server,
) => {
  type Socket = UserSocket<SocketVoice.Events.Request, SocketVoice.Events.Response>;
  type ClassVoiceState = {
    speaker: [string, `StateChange-${number}`] | null; // [userId, StateChangeNonce]
  };

  const connection = getConnection();
  const classroomRepository = connection.getRepository(Classroom);
  const userRepository = connection.getRepository(User);

  const state: Record<ClassHash, ClassVoiceState> = {};
  const initializeClass = (classroomHash: ClassHash) => {
    if (!state[classroomHash]) {
      state[classroomHash] = {
        speaker: null,
      };
    }
  };

  io.on('connection', (socket: Socket) => {
    socket.on('StateChange', async ({ classroomHash, speaking }) => {
      initializeClass(classroomHash);
      console.log('StateChange', classroomHash, speaking);

      const stateChangeNonce = nonce('StateChange');
      console.log(state[classroomHash].speaker);

      // 로그인 상태가 아닐 시
      if (!socket.request.user) {
        socket.emit('StateChange', {
          nonce: stateChangeNonce,
          success: false,
          reason: SocketVoice.PermissionDeniedReason.UNAUTHORIZED,
        });
        return;
      }

      // 유저가 교실에 들어있지 않을 때
      const userId: string = socket.request.user.stringId;
      // Classroom을 먼저 찾고 members를 left join해서 user가 있는지 체크
      /*
      const isMember = await classroomRepository
        .findOneOrFail({
          where: {
            hash: classroomHash,
          },
          join: {
            alias: 'classroom',
            leftJoinAndSelect: { members: 'classroom.members' },
          },
        })
        .then(
          ({ members }) => members.some((member) => member.stringId === userId),
        );
      */
      // User를 먼저 찾고 classrooms를 left join해서 classroomHash가 있는지 체크
      const isMember = await userRepository
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
          ({ classrooms }) => classrooms.some((classroom) => {
            console.log(classroom);
            return classroom.hash === classroomHash;
          }),
        );
      if (!isMember) {
        socket.emit('StateChange', {
          nonce: stateChangeNonce,
          success: false,
          reason: SocketVoice.PermissionDeniedReason.NOT_MEMBER,
        });
        return;
      }

      // 이미 유저가 말하고 있으면 말하기 요청 무시
      if (speaking && state[classroomHash].speaker?.[0] === userId) {
        socket.emit('StateChange', {
          nonce: state[classroomHash].speaker![1],
          success: true,
          speaking,
        });
        return;
      }

      // 자신이 아닌 누군가 말하고 있으면 요청 거절
      if (!!state[classroomHash].speaker && state[classroomHash].speaker![0] !== userId) {
        socket.emit('StateChange', {
          nonce: stateChangeNonce,
          success: false,
          reason: SocketVoice.PermissionDeniedReason.SOMEONE_IS_SPEAKING,
        });
        return;
      }

      // 아무도 말하고 있지 않으면 말하기 요청 수락
      if ((state[classroomHash].speaker === null) && speaking) {
        state[classroomHash].speaker = [userId, stateChangeNonce];
        socket.emit('StateChange', {
          nonce: stateChangeNonce,
          success: true,
          speaking: true,
        });
        io.emit('StateChangeBroadcast', {
          nonce: nonce('StateChangeBroadcast'),
          speaking: true,
          classroomHash,
          userId: 'user',
          sentAt: Date.now(),
        });
        return;
      }

      // 자신이 말하고 있으면 말하기 중단 요청
      if (!speaking && state[classroomHash].speaker?.[0] === userId) {
        state[classroomHash].speaker = null;
        socket.emit('StateChange', {
          nonce: stateChangeNonce,
          success: true,
          speaking: false,
        });
        io.emit('StateChangeBroadcast', {
          nonce: nonce('StateChangeBroadcast'),
          speaking: false,
          classroomHash,
          userId: 'user',
          reason: SocketVoice.StateChangeEndReason.NORMAL,
          sentAt: Date.now(),
        });
      }
    });

    socket.on('StreamSend', ({ audioSegment, requestId }) => {
      socket.emit('StreamSend', {
        nonce: nonce('StreamSend'),
        success: true,
        requestId,
      });

      io.emit('StreamReceiveBroadcast', {
        nonce: nonce('StreamReceiveBroadcast'),
        audioSegment,
        speakerId: 'example.speaker',
      });
    });
  });
};

export default ioVoiceHandler;
