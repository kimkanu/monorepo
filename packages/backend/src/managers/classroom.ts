/* eslint-disable class-methods-use-this */
import { ClassroomHash, ClassroomJSON } from '@team-10/lib';
import { getConnection } from 'typeorm';

import ClassroomEntity from '../entity/classroom';
import { VoiceHistoryEntity } from '../entity/history';
import UserEntity from '../entity/user';

import Server from '../server';
import Classroom, { ClassroomInfo } from '../types/classroom';
import { generateClassroomHash } from '../utils/classroom';

export default class ClassroomManager {
  private classrooms: Map<ClassroomHash, Classroom> = new Map();

  constructor(public server: Server) {}

  getRaw(hash: ClassroomHash): Classroom | null {
    return this.classrooms.get(hash) ?? null;
  }

  async isPresent(hash: ClassroomHash): Promise<boolean> {
    if (this.classrooms.has(hash)) return true;
    return this.load(hash);
  }

  async load(hash: ClassroomHash): Promise<boolean> {
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

    const classroomInfo: ClassroomInfo = {
      hash,
      name: classroomEntity.name,
      instructorId: classroomEntity.instructor.stringId,
      memberIds: new Set(classroomEntity.members.map((member) => member.stringId)),
      passcode: classroomEntity.passcode,
      updatedAt: classroomEntity.updatedAt,
    };

    // pass the internal states
    const classroom = new Classroom(this.server, classroomEntity, classroomInfo);
    const prevClassroom = this.classrooms.get(hash);
    if (prevClassroom) {
      classroom.state = prevClassroom.state;
    }

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

    const classroom = new Classroom(
      this.server,
      entity,
      {
        hash: entity.hash,
        name: entity.name,
        instructorId: userId,
        memberIds: new Set([userId]),
        passcode: entity.passcode,
        updatedAt: entity.updatedAt,
      },
    );

    await classroom.regeneratePasscode();

    return classroom;
  }

  async remove(hash: ClassroomHash) {
    const classroom = this.getRaw(hash);
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
    if (classroom.memberIds.has(userId)) return true;

    const userEntity = await this.server.managers.user.getEntity(userId);
    if (!userEntity) return false;

    await getConnection()
      .createQueryBuilder()
      .relation(UserEntity, 'classrooms')
      .of(userEntity)
      .add(classroom.entity.id);

    await this.load(hash);

    return true;
  }

  // leave
  async leave(userId: string, hash: ClassroomHash): Promise<boolean> {
    const classroom = this.classrooms.get(hash);
    if (!classroom) return false;

    const userEntity = await this.server.managers.user.getEntity(userId);
    if (!userEntity) return false;

    await getConnection()
      .createQueryBuilder()
      .relation(UserEntity, 'classrooms')
      .of(userEntity)
      .remove(classroom.entity.id);

    await this.load(hash);

    return true;
  }

  async isUserMember(userId: string, hash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(hash)) {
      if (await this.load(hash)) return false;
    }
    const classroom = this.classrooms.get(hash);
    return classroom?.memberIds.has(userId) ?? false;
  }

  async isUserInstructor(userId: string, hash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(hash)) {
      if (await this.load(hash)) return false;
    }
    const classroom = this.classrooms.get(hash);
    return classroom?.instructorId === userId;
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

  async connectMemberToAll(userId: string): Promise<void> {
    const user = await this.server.managers.user.getSerializableUserInfoFromStringIdAsync(userId);
    if (!user) return;

    user.classroomHashes.forEach((hash) => {
      const classroom = this.classrooms.get(hash);
      if (!classroom) return false;
      console.log(`connecting ${userId} to ${hash}`);
      classroom.connectMember(userId);
    });
  }

  disconnectMember(userId: string, hash: ClassroomHash): boolean {
    const classroom = this.classrooms.get(hash);
    if (!classroom) return false;
    classroom.disconnectMember(userId);
    return true;
  }

  async disconnectMemberFromAll(userId: string): Promise<void> {
    const user = await this.server.managers.user.getSerializableUserInfoFromStringIdAsync(userId);
    if (!user) return;

    user.classroomHashes.forEach((hash) => {
      const classroom = this.classrooms.get(hash);
      if (!classroom) return false;
      classroom.disconnectMember(userId);
    });
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
      instructorId: classroom.instructorId,
      memberIds: Array.from(classroom.memberIds),
      video: classroom.video,
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
    const userEntity = await this.server.managers.user.getEntity(speakerId);
    if (!userEntity) return false;

    const voiceHistoryEntity = new VoiceHistoryEntity();
    let classroomEntity = this.classrooms.get(hash)?.entity;
    if (!classroomEntity) {
      await this.load(hash);
      classroomEntity = this.classrooms.get(hash)?.entity;
    }
    if (!classroomEntity) return false;

    voiceHistoryEntity.classroom = classroomEntity;
    voiceHistoryEntity.speaker = userEntity;
    voiceHistoryEntity.startedAt = startedAt;
    voiceHistoryEntity.endedAt = endedAt;
    await voiceHistoryEntity.save();

    return true;
  }
}
