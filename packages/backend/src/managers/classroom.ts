import { ClassroomHash, ClassroomJSON } from '@team-10/lib';
import { getConnection } from 'typeorm';
import { v4 as generateUUID } from 'uuid';

import ClassroomEntity from '../entity/classroom';

import Server from '../server';
import Classroom, { ClassroomInfo } from '../types/classroom';
import { generateClassroomHash } from '../utils/classroom';

export default class ClassroomManager {
  private classrooms: Map<ClassroomHash, Classroom> = new Map();

  constructor(public server: Server) {}

  async loadClassroom(classroomHash: ClassroomHash): Promise<boolean> {
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
    console.log(classroomEntity);

    const classroomInfo: ClassroomInfo = {
      hash: classroomHash,
      name: classroomEntity.name,
      instructorId: classroomEntity.instructor.stringId,
      memberIds: new Set(classroomEntity.members.map((member) => member.stringId)),
    };
    const roomId = generateUUID();
    const classroom = new Classroom(classroomInfo, roomId);
    this.classrooms.set(classroomHash, classroom);

    return true;
  }

  async createClassroom(userId: string, name: string): Promise<Classroom> {
    const instructor = await this.server.managers.user.getEntity(userId);
    if (!instructor) {
      throw new Error();
    }

    const entity = new ClassroomEntity();
    entity.instructor = instructor;
    entity.members = [instructor];
    entity.name = name;

    while (true) {
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
    const classroom = new Classroom({
      hash: entity.hash,
      name: entity.name,
      instructorId: userId,
      memberIds: new Set([userId]),
    }, roomId);

    return classroom;
  }

  async isUserMember(userId: string, classroomHash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(classroomHash)) {
      await this.loadClassroom(classroomHash);
    }
    const classroom = this.classrooms.get(classroomHash);
    return classroom?.memberIds.has(userId) ?? false;
  }

  async isUserInstructor(userId: string, classroomHash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(classroomHash)) {
      await this.loadClassroom(classroomHash);
    }
    const classroom = this.classrooms.get(classroomHash);
    return classroom?.instructorId === userId;
  }

  async connectMember(userId: string, classroomHash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(classroomHash)) {
      await this.loadClassroom(classroomHash);
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

  async getClassroomJSON(
    userId: string, classroomHash: ClassroomHash,
  ): Promise<ClassroomJSON | null> {
    if (!this.classrooms.has(classroomHash)) {
      await this.loadClassroom(classroomHash);
    }
    const classroom = this.classrooms.get(classroomHash);
    if (!classroom) return null;
    if (!classroom.hasMember(userId)) return null;

    return {
      hash: classroomHash,
      name: classroom.name,
      instructorId: classroom.instructorId,
      memberIds: Array.from(classroom.memberIds),
      video: classroom.video,
      isLive: classroom.isLive,
    };
  }
}
