import { SocketChat } from '@team-10/lib';
import { Server as IOServer } from 'socket.io';

import Server from '../server';
import { UserSocket } from '../types/socket';
import uuid from 'uuid';
import ChatEntity, { TextChatEntity, PhotoChatEntity } from '../entity/chat';
import ChatHistoryEntity from '../entity/history';

const ioChatHandler = (
  io: IOServer<SocketChat.Events.Request, SocketChat.Events.Response>,
  server: Server,
) => {
  type Socket = UserSocket<SocketChat.Events.Request, SocketChat.Events.Response>;

  io.on('connection', (socket: Socket) => {
    socket.on('chat/Send', async ({ hash, message }) => {
      // 로그인 상태가 아닐 시
      if (!socket.request.user) {
        socket.emit('chat/Send', {
          success: false,
          reason: SocketChat.SendDeniedReason.UNAUTHORIZED,
        });
        return;
      }

      // 없는 수업일 때
      const classroom = await server.managers.classroom.get(hash);
      if (!await server.managers.classroom.isPresent(hash)) {
        socket.emit('chat/Send', {
          success: false,
          reason: SocketChat.SendDeniedReason.NOT_MEMBER,
        });
        return;
      }

      // 유저가 교실에 들어있지 않을 때
      const userId: string = socket.request.user.stringId;
      if (!classroom?.hasMember(userId)) {
        socket.emit('chat/Send', {
          success: false,
          reason: SocketChat.SendDeniedReason.NOT_MEMBER,
        });
        return;
      }

      // 요청 수락 
      socket.emit('chat/Send', {
        success: true,
      });

      // broadcast the received message

      if (message.type === 'photo') {
        const chatEntity = new PhotoChatEntity();
        chatEntity.uuid = chatUUID;
        chatEntity.author = message.sender;
        chatEntity.photoUrl = message.photo;

        socket.broadcast('chat/SendBroadcast', {
          hash,
          chatUUID,
          message,
        })
        classroom.broadcast('chat/ReceiveBroadcast', {
          hash,
          chatUUID,
          message,
        });

        await chatEntity.save();
      }
      else {
        const chatEntity = new TextChatEntity();
        chatEntity.uuid = chatUUID;
        chatEntity.author = message.sender;
        chatEntity.text = message.text;

        socket.broadcast('chat/SendBroadcast', {
          hash,
          chatUUID,
          message,
        })
        classroom.broadcast('chat/ReceiveBroadcast', {
          hash,
          chatUUID,
          message,
        });

        await chatEntity.save();
    });
  });
};

export default ioChatHandler;
