import Crypto from 'crypto';

import { YouTubeVideo } from '@team-10/lib';

import ClassroomEntity from '../entity/classroom';
import Server from '../server';

export interface ClassroomInfo {
  hash: string;
  name: string;
  instructorId: string;
  memberIds: Set<string>;
  passcode: string;
  updatedAt: Date;
}

export default class Classroom {
  hash: string;

  name: string;

  instructorId: string;

  memberIds: Set<string>;

  connectedMemberIds: Set<string> = new Set();

  passcode: string;

  updatedAt: Date;

  video: YouTubeVideo | null = null;

  isLive: boolean = false;

  constructor(
    public server: Server,
    public entity: ClassroomEntity,
    info: ClassroomInfo,
    // Classroom 밖에 있는 client가 이 room에 메시지를 보낼 수 없도록 roomId는 숨겨야 합니다.
    public roomId: string,
  ) {
    this.hash = info.hash;
    this.name = info.name;
    this.instructorId = info.instructorId;
    this.memberIds = info.memberIds;
    this.passcode = info.passcode;
    this.updatedAt = info.updatedAt;
  }

  connectMember(userId: string) {
    this.connectedMemberIds.add(userId);
  }

  disconnectMember(userId: string) {
    this.connectedMemberIds.delete(userId);
  }

  hasMember(userId: string) {
    return this.memberIds.has(userId);
  }

  regeneratePasscode(): string {
    this.passcode = Crypto.randomInt(1e6).toString().padStart(6, '0');
    return this.passcode;
  }

  setName(name: string) {
    this.name = name;
  }

  start() {
    this.isLive = true;
    this.updatedAt = new Date();
  }

  end() {
    this.isLive = false;
    this.updatedAt = new Date();
  }

  /**
   * 수업 중인 classroom에 들어온 socket에게 보내는 메시지의 집합
   * @param userId
   */
  // eslint-disable-next-line class-methods-use-this
  async emitWelcome(userId: string) {
    // TODO
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
}
