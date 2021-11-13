import {
  SocketVoiceStateChangeBroadcastResponse,
  SocketVoiceStateChangeGrantedResponse,
  SocketVoiceStateChangeRequest,
  SocketVoiceStateChangeResponse,
  SocketVoiceStreamReceiveResponse,
  SocketVoiceStreamSendRequest,
  SocketVoiceStreamSendResponse,
} from '@team-10/lib';

import Server from '../server';
import { UserSocket } from '../types/socket';

const ioHandler = (server: Server) => {
  const { io } = server;

  io.on('connection', (socket: UserSocket) => {
    console.log('User connected');
    console.log(socket.request.user);

    socket.on('disconnect', () => {
      console.log('User disconnect');
    });

    socket.on('msg', (data) => {
      console.log(data);
    });

    socket.on('VoiceStateChange', ({ requestId, classHash, speaking }: SocketVoiceStateChangeRequest) => {
      socket.emit('VoiceStateChange', {
        success: true,
        requestId,
        speaking,
      } as SocketVoiceStateChangeGrantedResponse);

      io.emit('VoiceStateChangeBroadcast', {
        classHash,
        speaking,
        userId: 'user',
        sentAt: Date.now(),
      } as SocketVoiceStateChangeBroadcastResponse);
    });

    socket.on('VoiceStreamSend', ({ audioSegment, requestId }: SocketVoiceStreamSendRequest) => {
      socket.emit('VoiceStreamSend', {
        success: true,
        requestId,
      } as SocketVoiceStreamSendResponse);

      io.emit('VoiceStreamReceive', {
        audioSegment,
        speakerId: 'example.speaker',
      } as SocketVoiceStreamReceiveResponse);
    });
  });
};

export default ioHandler;
