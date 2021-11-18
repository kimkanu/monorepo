import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import Classroom from './classroom';

export enum HistoryType {
  CHAT = 'chat',
  VOICE = 'voice',
  CLASS = 'class',
  ATTENDANCE = 'attendance',
  YOUTUBE = 'youtube',
}

@Entity()
export default class History extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: HistoryType,
    default: HistoryType.CHAT,
  })
  role: HistoryType;

  @OneToMany(() => Classroom, (classroom) => classroom.histories)
  classroom: Classroom;
}
