/* eslint-disable class-methods-use-this */
import { ClassroomHash, ClassroomJSON } from '@team-10/lib';
import { getConnection } from 'typeorm';

import ClassroomEntity from '../entity/classroom';

import Server from '../server';
import Classroom from '../types/classroom';
import { generateClassroomHash } from '../utils/classroom';

export default class ClassroomManager {
  private classrooms: Map<ClassroomHash, Classroom> = new Map();

  constructor(public server: Server) {}

  getWithoutLoad(hash: ClassroomHash): Classroom | null {
    return this.classrooms.get(hash) ?? null;
  }

  async get(hash: ClassroomHash): Promise<Classroom | null> {
    if (this.classrooms.has(hash)) {
      return this.classrooms.get(hash)!;
    }
    await this.load(hash);
    return this.classrooms.get(hash) ?? null;
  }

  async isPresent(hash: ClassroomHash): Promise<boolean> {
    if (this.classrooms.has(hash)) return true;
    return this.load(hash);
  }

  async load(hash: ClassroomHash): Promise<boolean> {
    if (this.classrooms.has(hash)) return true;

    const connection = getConnection();
    const classroomRepository = connection.getRepository(ClassroomEntity);
    const classroomEntity = await classroomRepository.findOne({
      where: { hash },
      join: {
        alias: 'classroom',
        leftJoinAndSelect: {
          instructor: 'classroom.instructor',
          members: 'classroom.members',
        },
      },
    });
    if (!classroomEntity) return false;

    const classroom = new Classroom(this.server, classroomEntity);
    this.classrooms.set(hash, classroom);

    return true;
  }

  async create(userId: string, name: string): Promise<Classroom> {
    const instructor = await this.server.managers.user.getEntity(userId);
    if (!instructor) {
      throw new Error();
    }

    const entity = new ClassroomEntity();
    entity.instructor = instructor;
    entity.members = [instructor];
    entity.name = name;
    entity.updatedAt = new Date();
    entity.passcode = '000000'; // Will be updated later

    for (;;) {
      try {
        entity.hash = generateClassroomHash();
        // eslint-disable-next-line no-await-in-loop
        await entity.save();
        break;
      } catch (e) {
        // retry
      }
    }

    const classroom = new Classroom(this.server, entity);
    await classroom.regeneratePasscode();

    return classroom;
  }

  async remove(hash: ClassroomHash) {
    const classroom = this.classrooms.get(hash);
    if (!classroom) return;

    await classroom.entity.remove();
    this.classrooms.delete(hash);
  }

  async join(userId: string, hash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(hash)) {
      await this.load(hash);
    }

    const classroom = this.classrooms.get(hash);
    if (!classroom) return false;
    if (classroom.hasMember(userId)) return true;

    const userEntity = await this.server.managers.user.getEntity(userId);
    if (!userEntity) return false;

    await classroom.letMemberJoin(userEntity);
    return true;
  }

  // leave
  async leave(userId: string, hash: ClassroomHash): Promise<boolean> {
    const classroom = this.classrooms.get(hash);
    if (!classroom) return false;
    if (classroom.hasMember(userId)) return true;

    const userEntity = await this.server.managers.user.getEntity(userId);
    if (!userEntity) return false;

    await classroom.letMemberLeave(userEntity);
    return true;
  }

  async isUserMember(userId: string, hash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(hash)) {
      if (await this.load(hash)) return false;
    }
    const classroom = this.classrooms.get(hash);
    return classroom?.hasMember(userId) ?? false;
  }

  async isUserInstructor(userId: string, hash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(hash)) {
      await this.load(hash);
    }
    const classroom = this.classrooms.get(hash);
    return classroom?.instructor.stringId === userId;
  }

  async connectMember(userId: string, hash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(hash)) {
      if (await this.load(hash)) return false;
    }
    const classroom = this.classrooms.get(hash);
    if (!classroom) return false;
    classroom.connectMember(userId);
    return true;
  }

  async disconnectMember(userId: string, hash: ClassroomHash): Promise<boolean> {
    const classroom = this.classrooms.get(hash);
    if (!classroom) return false;
    classroom.disconnectMember(userId);
    return true;
  }

  async disconnectMemberFromAll(userId: string): Promise<void> {
    const user = await this.server.managers.user.getSerializableUserInfoFromStringIdAsync(userId);
    if (!user) return;

    await Promise.all(user.classroomHashes.map((hash) => {
      const classroom = this.classrooms.get(hash);
      if (!classroom) return false;
      classroom.disconnectMember(userId);
      return true;
    }));
  }

  async startClassroom(hash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(hash)) {
      if (await this.load(hash)) return false;
    }
    const classroom = this.classrooms.get(hash);
    if (!classroom) return false;
    await classroom.start();
    return true;
  }

  async endClassroom(hash: ClassroomHash): Promise<boolean> {
    const classroom = this.classrooms.get(hash);
    if (!classroom) return false;
    await classroom.end();
    return true;
  }

  async getClassroomJSON(
    hash: ClassroomHash,
  ): Promise<ClassroomJSON | null> {
    if (!this.classrooms.has(hash)) {
      await this.load(hash);
    }
    const classroom = this.classrooms.get(hash);
    if (!classroom) return null;

    return {
      hash,
      name: classroom.name,
      instructor: {
        stringId: classroom.instructor.stringId,
        displayName: classroom.instructor.displayName,
        profileImage: classroom.instructor.profileImage,
      },
      members: Array.from(classroom.members.map(
        ({ stringId, displayName, profileImage }) => ({
          stringId,
          displayName,
          profileImage,
          isConnected: classroom.connectedMemberIds.has(stringId),
        }),
      )),
      video: classroom.youtube.video,
      isLive: classroom.isLive,
      updatedAt: classroom.updatedAt.getTime(),
    };
  }

  async getMyClassroomJSON(
    hash: ClassroomHash,
  ): Promise<ClassroomJSON | null> {
    if (!this.classrooms.has(hash)) {
      await this.load(hash);
    }
    const classroom = this.classrooms.get(hash);
    if (!classroom) return null;

    return {
      hash,
      name: classroom.name,
      instructor: {
        stringId: classroom.instructor.stringId,
        displayName: classroom.instructor.displayName,
        profileImage: classroom.instructor.profileImage,
      },
      members: Array.from(classroom.members.map(
        ({ stringId, displayName, profileImage }) => ({
          stringId,
          displayName,
          profileImage,
          isConnected: classroom.connectedMemberIds.has(stringId),
        }),
      )),
      video: classroom.youtube.video,
      isLive: classroom.isLive,
      passcode: classroom.passcode,
      updatedAt: classroom.updatedAt.getTime(),
    };
  }

  async recordVoiceHistory(
    hash: ClassroomHash,
    speakerId: string,
    startedAt: Date,
    endedAt: Date,
  ): Promise<boolean> {
    const classroom = await this.get(hash);
    if (!classroom) return false;

    return classroom.recordVoiceHistory(speakerId, startedAt, endedAt);
  }
}
