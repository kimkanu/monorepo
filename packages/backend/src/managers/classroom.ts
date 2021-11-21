import { ClassroomHash } from '@team-10/lib';
import { getConnection } from 'typeorm';

import ClassroomEntity from '../entity/classroom';

import Server from '../server';
import Classroom, { ClassroomInfo } from '../types/classroom';

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
      instructorId: classroomEntity.instructor.id,
      memberIds: new Set(classroomEntity.members.map((member) => member.id)),
    };
    const roomId = 'sample';
    const classroom = new Classroom(classroomInfo, roomId);
    this.classrooms.set(classroomHash, classroom);

    return true;
  }

  async isUserMember(userId: number, classroomHash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(classroomHash)) {
      await this.loadClassroom(classroomHash);
    }
    const classroom = this.classrooms.get(classroomHash);
    return classroom?.memberIds.has(userId) ?? false;
  }

  async isUserInstructor(userId: number, classroomHash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(classroomHash)) {
      await this.loadClassroom(classroomHash);
    }
    const classroom = this.classrooms.get(classroomHash);
    return classroom?.instructorId === userId;
  }

  // clearClassrooms() {
  // }

  async connectMember(userId: number, classroomHash: ClassroomHash): Promise<boolean> {
    if (!this.classrooms.has(classroomHash)) {
      await this.loadClassroom(classroomHash);
    }
    const classroom = this.classrooms.get(classroomHash);
    if (!classroom) return false;
    classroom.connectedMemberIds.add(userId);
    return true;
  }

  disconnectMember(userId: number, classroomHash: ClassroomHash): boolean {
    const classroom = this.classrooms.get(classroomHash);
    if (!classroom) return false;
    classroom.connectedMemberIds.delete(userId);
    return true;
  }
}
