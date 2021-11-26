/* eslint-disable class-methods-use-this */
import { ClassroomHash, ClassroomJSON } from '@team-10/lib';
import { getConnection } from 'typeorm';
import { v4 as generateUUID } from 'uuid';

import ClassroomEntity from '../entity/classroom';
import HistoryEntity, { VoiceHistoryEntity } from '../entity/history';
import UserEntity from '../entity/user';

import Server from '../server';
import Classroom, { ClassroomInfo } from '../types/classroom';
import { generateClassroomHash } from '../utils/classroom';

export default class ClassroomManager {
  private classrooms: Map<ClassroomHash, Classroom> = new Map();

  constructor(public server: Server) {}

  getRaw(classroomHash: ClassroomHash): Classroom | null {
    return this.classrooms.get(classroomHash) ?? null;
  }

  async isPresent(classroomHash: ClassroomHash): Promise<boolean> {
    if (this.classrooms.has(classroomHash)) return true;
    return this.load(classroomHash);
  }

  async load(classroomHash: ClassroomHash): Promise<boolean> {
    const connection = getConnection();
    const classroomRepository = connection.getRepository(ClassroomEntity);
    const classroomEntity = await classroomRepository.findOne({
      where: { hash: classroomHash },
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
      hash: classroomHash,
      name: classroomEntity.name,
      instructorId: classroomEntity.instructor.stringId,
      memberIds: new Set(classroomEntity.members.map((member) => member.stringId)),
      passcode: classroomEntity.passcode,
      updatedAt: classroomEntity.updatedAt,
    };
    const roomId = generateUUID();
    const classroom = new Classroom(this.server, classroomEntity, classroomInfo, roomId);
    this.classrooms.set(classroomHash, classroom);

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

    const roomId = generateUUID();
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
      }, roomId,
    );

    entity.passcode = classroom.regeneratePasscode();
    await entity.save();

    return classroom;
  }

  // remove

  async join(userId: string, classroomHash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(classroomHash)) {
      await this.load(classroomHash);
    }
    const classroom = this.classrooms.get(classroomHash);
    if (!classroom) return false;
    if (classroom.memberIds.has(userId)) return true;

    const userEntity = await this.server.managers.user.getEntity(userId);
    if (!userEntity) return false;

    const classroomRepository = getConnection().getRepository(ClassroomEntity);
    const classroomEntity = await classroomRepository.findOneOrFail(
      { where: { hash: classroomHash } },
    );

    await getConnection()
      .createQueryBuilder()
      .relation(UserEntity, 'classrooms')
      .of(userEntity)
      .add(classroomEntity.id);

    await this.load(classroomHash);

    return true;
  }

  // leave

  async isUserMember(userId: string, classroomHash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(classroomHash)) {
      if (await this.load(classroomHash)) return false;
    }
    const classroom = this.classrooms.get(classroomHash);
    return classroom?.memberIds.has(userId) ?? false;
  }

  async isUserInstructor(userId: string, classroomHash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(classroomHash)) {
      if (await this.load(classroomHash)) return false;
    }
    const classroom = this.classrooms.get(classroomHash);
    return classroom?.instructorId === userId;
  }

  async connectMember(userId: string, classroomHash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(classroomHash)) {
      if (await this.load(classroomHash)) return false;
    }
    const classroom = this.classrooms.get(classroomHash);
    if (!classroom) return false;
    classroom.connectedMemberIds.add(userId);
    return true;
  }

  disconnectMember(userId: string, classroomHash: ClassroomHash): boolean {
    const classroom = this.classrooms.get(classroomHash);
    if (!classroom) return false;
    classroom.connectedMemberIds.delete(userId);
    return true;
  }

  async startClassroom(classroomHash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(classroomHash)) {
      if (await this.load(classroomHash)) return false;
    }
    const classroom = this.classrooms.get(classroomHash);
    if (!classroom) return false;
    classroom.start();
    return true;
  }

  endClassroom(classroomHash: ClassroomHash): boolean {
    const classroom = this.classrooms.get(classroomHash);
    if (!classroom) return false;
    classroom.end();
    return true;
  }

  async getClassroomJSON(
    classroomHash: ClassroomHash,
  ): Promise<ClassroomJSON | null> {
    if (!this.classrooms.has(classroomHash)) {
      await this.load(classroomHash);
    }
    const classroom = this.classrooms.get(classroomHash);
    if (!classroom) return null;

    return {
      hash: classroomHash,
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
    classroomHash: ClassroomHash,
    speakerId: string,
    startedAt: Date,
    endedAt: Date,
  ): Promise<boolean> {
    const userEntity = await this.server.managers.user.getEntity(speakerId);
    if (!userEntity) return false;

    const voiceHistoryEntity = new VoiceHistoryEntity();
    let classroomEntity = this.classrooms.get(classroomHash)?.entity;
    if (!classroomEntity) {
      await this.load(classroomHash);
      classroomEntity = this.classrooms.get(classroomHash)?.entity;
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
