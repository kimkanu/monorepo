import { ChatContent, SocketChat } from '@team-10/lib';
import { Server as IOServer } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';

import ChatEntity, { TextChatEntity, PhotoChatEntity } from '../entity/chat';
import Server from '../server';
import { UserSocket } from '../types/socket';

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
      const uuid = uuidV4();
      const userEntity = (await server.managers.user.getEntity(userId))!;

      let chatEntity: ChatEntity;
      let content: ChatContent;

      if (message.type === 'photo') {
        const imageData = await server.managers.image.uploadArraybuffer(message.photo);
        if (!imageData) {
          socket.emit('chat/Send', {
            success: false,
            reason: SocketChat.SendDeniedReason.INTERNAL_SERVER_ERROR,
          });
          return;
        }

        const altText = await server.managers.image.getAltText(imageData.link);

        chatEntity = new PhotoChatEntity();
        (chatEntity as PhotoChatEntity).photo = imageData.link;
        (chatEntity as PhotoChatEntity).alt = altText ? JSON.stringify(altText) : null!;

        content = {
          id: uuid,
          type: 'photo',
          sender: server.managers.user.getUserInfoJSONFromEntity(userEntity),
          sentAt: Date.now(),
          content: {
            photo: imageData.link,
            alt: altText?.[userEntity.language] ?? '', // TODO
          },
        };
      } else if (message.type === 'text') {
        chatEntity = new TextChatEntity();
        (chatEntity as TextChatEntity).text = message.text;

        content = {
          id: uuid,
          type: 'text',
          sender: server.managers.user.getUserInfoJSONFromEntity(userEntity),
          sentAt: Date.now(),
          content: {
            text: message.text,
          },
        };
      } else {
        socket.emit('chat/Send', {
          success: false,
          reason: SocketChat.SendDeniedReason.BAD_REQUEST,
        });
        return;
      }

      chatEntity.uuid = uuid;
      chatEntity.sentAt = new Date();
      chatEntity.author = userEntity;
      chatEntity.classroom = classroom.entity;

      if (message.users && message.users.length > 0) {
        classroom.emit('chat/ChatBroadcast', [userId, ...message.users], {
          hash,
          chatId: uuid,
          message: content,
        });
      } else {
        classroom.broadcast('chat/ChatBroadcast', {
          hash,
          chatId: uuid,
          message: content,
        });
      }

      await chatEntity.save();
    });
  });
};

export default ioChatHandler;
