import { ClassroomJSON } from '@team-10/lib';
import { Repository } from 'typeorm';

import ClassroomEntity from '../entity/classroom';

export interface ClassroomInfo {
  hash: string;
  instructorId: number;
  memberIds: Set<number>;
}

export async function getClassroomJSON(
  classroomRepository: Repository<ClassroomEntity>,
  cs: ClassroomEntity[],
): Promise<ClassroomJSON[]> {
  return classroomRepository.findByIds(
    cs.map((classroom) => classroom.id),
    {
      join: {
        alias: 'classroom',
        leftJoinAndSelect: {
          instructor: 'classroom.instructor',
          members: 'classroom.members',
        },
      },
    },
  ).then((classrooms) => classrooms.map((classroom) => ({
    hash: classroom.hash,
    instructorId: classroom.instructor.stringId,
    memberIds: classroom.members.map((member) => member.stringId),
  })));
}

export async function getClassroomInfo(
  classroomRepository: Repository<ClassroomEntity>,
  cs: ClassroomEntity[],
): Promise<ClassroomInfo[]> {
  return classroomRepository.findByIds(
    cs.map((classroom) => classroom.id),
    {
      join: {
        alias: 'classroom',
        leftJoinAndSelect: {
          instructor: 'classroom.instructor',
          members: 'classroom.members',
        },
      },
    },
  ).then((classrooms) => classrooms.map((classroom) => ({
    hash: classroom.hash,
    instructorId: classroom.instructor.id,
    memberIds: new Set(classroom.members.map((member) => member.id)),
  })));
}

export default class Classroom {
  hash: string;

  instructorId: number;

  memberIds: Set<number>;

  connectedMemberIds: Set<number> = new Set();

  constructor(
    info: ClassroomInfo,
    // Classroom 밖에 있는 client가 이 room에 메시지를 보낼 수 없도록 roomId는 숨겨야 합니다.
    public roomId: string,
  ) {
    this.hash = info.hash;
    this.instructorId = info.instructorId;
    this.memberIds = info.memberIds;
  }

  connectMember(userId: number) {
    this.connectedMemberIds.add(userId);
  }

  disconnectMember(userId: number) {
    this.connectedMemberIds.delete(userId);
  }
}
