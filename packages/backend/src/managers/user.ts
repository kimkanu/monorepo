/* eslint-disable class-methods-use-this */
import { SSOAccountJSON } from '@team-10/lib';
import { Socket } from 'socket.io';
import { getConnection } from 'typeorm';

import UserEntity from '../entity/user';

import Server from '../server';

interface UserEntry {
  info: SerializableUserInfo;
  sockets: Socket[]; // 제일 앞에 있는 게 main
}

interface SerializableUserInfo {
  id: number;
  stringId: string;
  ssoAccounts: SSOAccountJSON[];
  displayName: string;
  profileImage: string;
  initialized: boolean;
  classroomIds: string[];
  myClassroomIds: string[];
}

export default class UserManager {
  private users: Map<string, UserEntry> = new Map();

  constructor(public server: Server) {}

  // userId는 중복 가능
  async add(userId: string, socket: Socket): Promise<boolean> {
    const userRepository = getConnection().getRepository(UserEntity);
    const userEntity = await userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.classrooms', 'classrooms')
      .innerJoinAndSelect('user.myClassrooms', 'myClassrooms')
      .leftJoinAndSelect('classrooms.id', 'classroomIds')
      .leftJoinAndSelect('myClassrooms.id', 'myClassroomIds')
      .leftJoinAndSelect('user.ssoAccounts', 'ssoAccounts')
      .where({ stringId: userId })
      .getOne();

    console.log(this.users.size);
    console.log(userEntity);

    return false;
  }

  remove(userId: string, socket: Socket): boolean {
    const entry = this.users.get(userId);
    if (!entry) return false;

    this.users.delete(userId);
    return true;
  }

  async getEntity(userId: string): Promise<UserEntity | null> {
    const userRepository = getConnection().getRepository(UserEntity);
    return await userRepository.findOne({
      where: { stringId: userId },
    }) ?? null;
  }
}
