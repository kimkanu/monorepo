/* eslint-disable no-nested-ternary */
import Crypto from 'crypto';

import { ClassroomJSON, ClassroomMemberJSON, YouTubeVideo } from '@team-10/lib';
import { ChatContent } from '@team-10/lib/src/types/chat';
import {
  Between, getConnection, LessThanOrEqual, MoreThan,
} from 'typeorm';

import ChatEntity, { PhotoChatEntity, TextChatEntity } from '../entity/chat';
import ClassroomEntity from '../entity/classroom';
import HistoryEntity, {
  ClassHistoryEntity, VoiceHistoryEntity, AttendanceHistoryEntity,
} from '../entity/history';
import UserEntity from '../entity/user';
import Server from '../server';

export interface ClassroomVoiceState {
  speaker: string | null; // speaker's `stringId`
  startedAt: Date | null;
}

export interface ClassroomYouTubeState {
  responseTime: Date | null;
  currentTime: number | null;
  play: boolean;
}

export default class Classroom {
  /**
   * Information in the database
   */
  hash: string;

  name: string;

  instructor: UserEntity;

  // 등록된 멤버
  members: UserEntity[];

  passcode: string;

  updatedAt: Date;

  isLive: boolean = false;

  /**
   * Internal states
   */
  // 현재 연결되어 있는 멤버
  connectedMemberIds: Set<string>;

  temporarilyDisconnectedMemberIds: Set<string>;

  temporaryDisconnectionTimeout: Map<string, ReturnType<typeof setTimeout>>;

  voice: ClassroomVoiceState;

  youtube: ClassroomYouTubeState & { video: YouTubeVideo | null };

  constructor(
    public server: Server,
    public entity: ClassroomEntity,
  ) {
    this.hash = this.entity.hash;
    this.name = this.entity.name;
    this.passcode = this.entity.passcode;
    this.instructor = this.entity.instructor;
    this.members = this.entity.members;
    this.updatedAt = this.entity.updatedAt;
    this.connectedMemberIds = new Set();
    this.temporarilyDisconnectedMemberIds = new Set();
    this.temporaryDisconnectionTimeout = new Map();
    this.voice = {
      speaker: null,
      startedAt: null,
    };
    this.youtube = {
      responseTime: null,
      video: null,
      currentTime: null,
      play: false,
    };
  }

  async connectMember(userId: string) {
    const userEntity = this.members.find(({ stringId }) => stringId === userId);
    if (!userEntity) return false;
    this.connectedMemberIds.add(userId);
    console.log('a member connected', userId);

    // TODO: 임시적으로 끊긴 유저라면 DB 접근 없이 timeout만 clear & delete하고,
    // TODO: 그렇지 않다면 DB에 출석 history entity 만들어서 저장하기
    if (this.temporarilyDisconnectedMemberIds.has(userId)) {
      clearTimeout(this.temporaryDisconnectionTimeout.get(userId)!);
      this.temporaryDisconnectionTimeout.delete(userId);
      this.temporarilyDisconnectedMemberIds.delete(userId);
    } else {
      console.log('a member attended the classroom', userId);
      const attendanceEntity = new AttendanceHistoryEntity();
      attendanceEntity.classroom = this.entity;
      attendanceEntity.user = userEntity;
      attendanceEntity.date = new Date();
      attendanceEntity.connected = true;
      // make a DB entry: attendance history entity, attend
      await attendanceEntity.save();
    }
    const { members } = this.getClassroomJSON();
    this.broadcast('classroom/PatchBroadcast', {
      hash: this.hash,
      patch: {
        members: members.map((m) => (m.stringId === userId ? { ...m, isConnected: true } : m)),
      },
    });

    return true;
  }

  disconnectMember(userId: string) {
    const userEntity = this.members.find(({ stringId }) => stringId === userId);
    if (!userEntity) return false;
    if (!this.connectedMemberIds.has(userId)) return;
    if (this.temporarilyDisconnectedMemberIds.has(userId)) return;

    this.connectedMemberIds.delete(userId);

    // instructor가 연결이 끊기면 youtube를 일시정지
    if (this.instructor.stringId === userId) {
      this.youtube.currentTime = this.youtube.currentTime === null
        ? null
        : this.youtube.play
          ? this.youtube.currentTime
              + (Date.now() - (this.youtube.responseTime?.getTime() ?? Date.now())) / 1000
          : this.youtube.currentTime;
      this.youtube.play = false;
    }

    // TODO: 임시적으로 끊긴 멤버 관리하기, 일정 timeout 이후에는 db에 나간 것으로 저장

    if (this.temporarilyDisconnectedMemberIds.has(userId)) return;
    this.temporarilyDisconnectedMemberIds.add(userId);
    const timeout = setTimeout(async () => {
      if (this.temporarilyDisconnectedMemberIds.has(userId)) {
        this.temporarilyDisconnectedMemberIds.delete(userId);
        // make a DB entry: attendance history entity, disconnected
        const attendanceEntity = new AttendanceHistoryEntity();
        attendanceEntity.classroom = this.entity;
        attendanceEntity.user = userEntity;
        attendanceEntity.date = new Date();
        attendanceEntity.connected = false;

        await attendanceEntity.save();

        this.temporaryDisconnectionTimeout.delete(userId);
        console.log('a member exited the classroom', userId);
      }
    }, 1.5 * 60 * 1000);
    clearTimeout(this.temporaryDisconnectionTimeout.get(userId) ?? undefined!);
    this.temporaryDisconnectionTimeout.set(userId, timeout);

    const { video, members } = this.getClassroomJSON();
    this.broadcast('classroom/PatchBroadcast', {
      hash: this.hash,
      patch: {
        video,
        members: members.map((m) => (m.stringId === userId ? { ...m, isConnected: false } : m)),
      },
    });

    this.broadcastExcept(
      'youtube/ChangePlayStatusBroadcast',
      [this.instructor.stringId],
      {
        hash: this.hash,
        play: this.youtube.play,
        videoId: video?.videoId ?? null,
        time: this.youtube.currentTime,
      },
    );

    return true;
  }

  hasMember(userId: string) {
    return this.members.some((member) => member.stringId === userId);
  }

  async letMemberJoin(userEntity: UserEntity) {
    await getConnection()
      .createQueryBuilder()
      .relation(UserEntity, 'classrooms')
      .of(userEntity)
      .add(this.entity.id);

    // broadcast to all
    const { members } = this.getClassroomJSON();
    this.broadcast('classroom/PatchBroadcast', {
      hash: this.hash,
      patch: {
        members: [
          ...members,
          {
            ...this.server.managers.user.getUserInfoJSONFromEntity(userEntity),
            isConnected: true,
          },
        ] as ClassroomMemberJSON[],
      },
    });

    this.members.push(userEntity);
  }

  async letMemberLeave(userEntity: UserEntity) {
    await getConnection()
      .createQueryBuilder()
      .relation(UserEntity, 'classrooms')
      .of(userEntity)
      .remove(this.entity.id);

    // broadcast to all
    const { members } = this.getClassroomJSON();
    this.broadcast('classroom/PatchBroadcast', {
      hash: this.hash,
      patch: {
        members: members.filter(({ stringId }) => stringId !== userEntity.stringId),
      },
    });

    this.members = this.members.filter(({ id }) => id !== userEntity.id);
  }

  async regeneratePasscode(): Promise<string> {
    this.passcode = Crypto.randomInt(1e6).toString().padStart(6, '0');
    this.entity.passcode = this.passcode;
    await this.entity.save();

    // emit to the instructor only
    const instructor = this.server.managers.user.users.get(this.instructor.stringId);
    if (instructor) {
      instructor.sockets.forEach((socket) => {
        socket.emit('classroom/PatchBroadcast', {
          hash: this.hash,
          patch: {
            passcode: this.passcode,
          },
        });
      });
    }

    return this.passcode;
  }

  async rename(name: string): Promise<void> {
    this.name = name;
    this.entity.name = name;
    await this.entity.save();

    // broadcast to all
    this.broadcast('classroom/PatchBroadcast', {
      hash: this.hash,
      patch: {
        name,
      },
    });
  }

  async start() {
    this.updatedAt = new Date();
    this.entity.updatedAt = this.updatedAt;
    await this.entity.save();

    // TODO: create ClassHistoryEntity instance and save

    const classHistoryEntity = new ClassHistoryEntity();
    classHistoryEntity.start = true;
    classHistoryEntity.date = this.updatedAt;
    classHistoryEntity.classroom = this.entity;
    await classHistoryEntity.save();

    this.isLive = true;
    this.broadcast('classroom/PatchBroadcast', {
      hash: this.hash,
      patch: {
        isLive: true,
      },
    });

    return true;
  }

  async end() {
    this.updatedAt = new Date();
    this.entity.updatedAt = this.updatedAt;
    await this.entity.save();

    // TODO: create ClassHistoryEntity instance and save
    const classHistoryEntity = new ClassHistoryEntity();
    classHistoryEntity.start = false;
    classHistoryEntity.date = this.updatedAt;
    classHistoryEntity.classroom = this.entity;
    await classHistoryEntity.save();

    this.youtube.video = null;
    this.isLive = false;

    // broadcast to all
    this.broadcast('classroom/PatchBroadcast', {
      hash: this.hash,
      patch: {
        isLive: false,
        video: null,
      },
    });
    return true;
  }

  async recordVoiceHistory(
    speakerId: string,
    startedAt: Date,
    endedAt: Date,
  ) {
    const userEntity = this.members.find(({ stringId }) => stringId === speakerId);
    if (!userEntity) return false;

    const voiceHistoryEntity = new VoiceHistoryEntity();
    voiceHistoryEntity.classroom = this.entity;
    voiceHistoryEntity.speaker = userEntity;
    voiceHistoryEntity.startedAt = startedAt;
    voiceHistoryEntity.endedAt = endedAt;
    await voiceHistoryEntity.save();

    return true;
  }

  async getChats(chatId?: string): Promise<any[]> {
    const chatRepository = getConnection().getRepository(ChatEntity);
    const lastChat = chatId ? await chatRepository.findOne({
      where: {
        uuid: chatId,
      },
    }) : undefined;

    const chatEntities = lastChat
      ? await chatRepository.createQueryBuilder('chat')
        .innerJoinAndSelect('chat.classroom', 'classroom')
        .innerJoinAndSelect('chat.author', 'author')
        .where('(chat.id < :lastChatId) AND (classroom.id = :classroomId)', {
          lastChatId: lastChat?.id ?? 0,
          classroomId: this.entity.id,
        })
        .orderBy('chat.id', 'ASC')
        .limit(50)
        .getMany()
      : await chatRepository.createQueryBuilder('chat')
        .innerJoinAndSelect('chat.classroom', 'classroom')
        .innerJoinAndSelect('chat.author', 'author')
        .where('classroom.id = :classroomId', { classroomId: this.entity.id })
        .orderBy('chat.id', 'ASC')
        .getMany();
    const beforeChat = chatEntities.length === 0
      ? undefined
      : await chatRepository.createQueryBuilder('chat')
        .innerJoinAndSelect('chat.classroom', 'classroom')
        .innerJoinAndSelect('chat.author', 'author')
        .where('(chat.id < :firstChatId) AND (classroom.id = :classroomId)', {
          firstChatId: chatEntities[0].id,
          classroomId: this.entity.id,
        })
        .orderBy('chat.id', 'DESC')
        .getOne();
    const classHistoryRepository = getConnection().getRepository(ClassHistoryEntity);
    const classHistories = await classHistoryRepository.find(
      !lastChat && !beforeChat ? undefined : {
        where: {
          date: !lastChat ? MoreThan(beforeChat!.sentAt)
            : beforeChat ? Between(beforeChat.sentAt, lastChat.sentAt)
              : LessThanOrEqual(lastChat.sentAt),
        },
      },
    );
    const chats = await Promise.all(
      chatEntities.map(async (entity) => (entity instanceof TextChatEntity ? {
        id: entity.uuid,
        type: 'text',
        sentAt: entity.sentAt.getTime(),
        sender: this.server.managers.user.getUserInfoJSONFromEntity(
          (await this.server.managers.user.getEntity(entity.author.stringId))!,
        ),
        content: {
          text: entity.text,
        },
      } as ChatContent<'text'> : entity instanceof PhotoChatEntity ? {
        id: entity.uuid,
        type: 'photo',
        sentAt: entity.sentAt.getTime(),
        sender: this.server.managers.user.getUserInfoJSONFromEntity(
          (await this.server.managers.user.getEntity(entity.author.stringId))!,
        ),
        content: {
          photo: entity.photo,
          alt: entity.alt,
        },
      } as ChatContent<'photo'> : null)),
    ).then((a) => a.filter((x) => x !== null)) as ChatContent[];

    const classHistoryChats = classHistories.map((history) => ({
      id: `FeedChat__${history.date.getTime()}`,
      type: 'feed',
      sentAt: history.date.getTime(),
      content: {
        type: 'class',
        isStart: history.start,
      },
    }));

    const allChats = [...chats, ...classHistoryChats];
    return allChats.sort((c1, c2) => c1.sentAt - c2.sentAt);
  }

  /**
   * 접속한 유저의 모든 소켓에 broadcast하는 method
   * @param eventName
   * @param message
   */
  broadcast<T>(eventName: string, message: T) {
    const sockets = Array.from(this.server.managers.user.users.values())
      .flatMap(({ sockets: userSockets }) => userSockets);
    sockets.forEach((socket) => {
      socket.emit(eventName, message);
    });
  }

  /**
   * 특정 유저를 제외하고 모든 소켓에 broadcast하는 method
   * @param eventName
   * @param message
   */
  broadcastExcept<T>(eventName: string, userIds: string[], message: T) {
    const sockets = Array.from(this.server.managers.user.users.values())
      .filter(({ info }) => !userIds.includes(info.stringId))
      .flatMap(({ sockets: userSockets }) => userSockets);
    sockets.forEach((socket) => {
      socket.emit(eventName, message);
    });
  }

  /**
   * 특정 유저를 제외하고 모든 소켓에 broadcast하는 method
   * @param eventName
   * @param message
   */
  emit<T>(eventName: string, userIds: string[], message: T) {
    const sockets = Array.from(this.server.managers.user.users.values())
      .filter(({ info }) => userIds.includes(info.stringId))
      .flatMap(({ sockets: userSockets }) => userSockets);
    sockets.forEach((socket) => {
      socket.emit(eventName, message);
    });
  }

  /**
   * 접속한 유저의 소켓 중 main 소켓에만 broadcast하는 method
   * @param eventName
   * @param message
   */
  broadcastMain<T>(eventName: string, message: T) {
    const sockets = Array.from(this.server.managers.user.users.values())
      .map(({ sockets: userSockets }) => userSockets[0])
      .filter((socket) => !!socket);
    sockets.forEach((socket) => {
      socket.emit(eventName, message);
    });
  }

  /**
   * 특정 유저를 제외하고 main 소켓에 broadcast하는 method
   * @param eventName
   * @param message
   */
  broadcastMainExcept<T>(eventName: string, userIds: string[], message: T) {
    const sockets = Array.from(this.server.managers.user.users.values())
      .filter(({ info }) => !userIds.includes(info.stringId))
      .map(({ sockets: userSockets }) => userSockets[0])
      .filter((socket) => !!socket);
    sockets.forEach((socket) => {
      socket.emit(eventName, message);
    });
  }

  getClassroomJSON(): ClassroomJSON {
    return {
      hash: this.hash,
      name: this.name,
      instructor: {
        stringId: this.instructor.stringId,
        displayName: this.instructor.displayName,
        profileImage: this.instructor.profileImage,
      },
      members: Array.from(this.members.map(
        ({ stringId, displayName, profileImage }) => ({
          stringId,
          displayName,
          profileImage,
          isConnected: this.connectedMemberIds.has(stringId),
        }),
      )),
      video: this.youtube.video ? {
        type: 'single',
        videoId: this.youtube.video.videoId,
      } : null,
      isLive: this.isLive,
      updatedAt: this.updatedAt.getTime(),
    };
  }

  getMyClassroomJSON(): ClassroomJSON {
    return {
      hash: this.hash,
      name: this.name,
      instructor: {
        stringId: this.instructor.stringId,
        displayName: this.instructor.displayName,
        profileImage: this.instructor.profileImage,
      },
      members: Array.from(this.members.map(
        ({ stringId, displayName, profileImage }) => ({
          stringId,
          displayName,
          profileImage,
          isConnected: this.connectedMemberIds.has(stringId),
        }),
      )),
      video: this.youtube.video,
      isLive: this.isLive,
      passcode: this.passcode,
      updatedAt: this.updatedAt.getTime(),
    };
  }
}
