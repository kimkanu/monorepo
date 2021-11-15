import { SocketVoice, ClassHash } from '@team-10/lib';
import { Namespace } from 'socket.io';

import Server from '../server';
import { UserSocket } from '../types/socket';
import nonce from '../utils/nonce';

const ioVoiceHandler = (
  ioVoice: Namespace<SocketVoice.Events.Request, SocketVoice.Events.Response>,
  server: Server,
) => {
  type Socket = UserSocket<SocketVoice.Events.Request, SocketVoice.Events.Response>;
  type ClassVoiceState = {
    speaker: [string, `StateChange-${number}`] | null; // [userId, StateChangeNonce]
  };

  const state: Record<ClassHash, ClassVoiceState> = {};
  const initializeClass = (classHash: ClassHash) => {
    if (!state[classHash]) {
      state[classHash] = {
        speaker: null,
      };
    }
  };

  ioVoice.on('connection', (socket: Socket) => {
    console.log('User connected');
    console.log(socket.request.user);

    socket.on('disconnect', () => {
      console.log('User disconnect');
    });

    socket.on('StateChange', ({ classHash, speaking }) => {
      initializeClass(classHash);

      const stateChangeNonce = nonce('StateChange');
      // TODO: fill userId
      const userId = 'example.user';

      // Voice chat 요청
      if (!socket.request.user) {
        socket.emit('StateChange', {
          nonce: stateChangeNonce,
          success: false,
          reason: SocketVoice.PermissionDeniedReason.UNAUTHORIZED,
        });
      } else if (state[classHash].speaker === null && speaking) {
        state[classHash].speaker = [userId, stateChangeNonce];
        socket.emit('StateChange', {
          nonce: stateChangeNonce,
          success: true,
          speaking: true,
        });
        ioVoice.emit('StateChangeBroadcast', {
          nonce: nonce('StateChangeBroadcast'),
          speaking: true,
          classHash,
          userId: 'user',
          sentAt: Date.now(),
        });
      } else if (speaking) {
        socket.emit('StateChange', {
          nonce: stateChangeNonce,
          success: false,
          reason: SocketVoice.PermissionDeniedReason.SOMEONE_IS_SPEAKING,
        });
      } else {
        state[classHash].speaker = null;
        socket.emit('StateChange', {
          nonce: stateChangeNonce,
          success: true,
          speaking: false,
        });
        ioVoice.emit('StateChangeBroadcast', {
          nonce: nonce('StateChangeBroadcast'),
          speaking: false,
          classHash,
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

      ioVoice.emit('StreamReceiveBroadcast', {
        nonce: nonce('StreamReceiveBroadcast'),
        audioSegment,
        speakerId: 'example.speaker',
      });
    });
  });
};

const ioChatHandler = (ioVoice: Namespace, server: Server) => {
  // type Socket = UserSocket<VoiceListenEventsMap, VoiceEmitEventsMap>;
};

const ioHandler = (server: Server) => {
  const { io } = server;

  io.on('connection', (socket: UserSocket) => {
    console.log('User connected');
    console.log(socket.request.user);
  });

  ioVoiceHandler(io.of('/voice'), server);
  ioChatHandler(io.of('/chat'), server);
};

export default ioHandler;
