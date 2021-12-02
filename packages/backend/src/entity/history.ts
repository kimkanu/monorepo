/* eslint-disable max-classes-per-file */
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  TableInheritance,
  OneToOne,
  ManyToOne,
  ChildEntity,
} from 'typeorm';

import ChatEntity from './chat';

import Classroom from './classroom';
import UserEntity from './user';

export enum HistoryType {
  CHAT = 'chat',
  VOICE = 'voice',
  CLASS = 'class',
  ATTENDANCE = 'attendance',
  YOUTUBE = 'youtube',
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export default class HistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Classroom, (classroom) => classroom.histories, { onDelete: 'CASCADE' })
  classroom: Classroom;
}

@ChildEntity()
export class ChatHistoryEntity extends HistoryEntity {
  @OneToOne(() => ChatEntity, {
    cascade: true,
  })
  chat: ChatEntity;

  @Column({ type: 'timestamptz' })
  sentAt: Date;
}

@ChildEntity()
export class VoiceHistoryEntity extends HistoryEntity {
  @Column({ type: 'timestamptz' })
  startedAt: Date;

  @Column({ type: 'timestamptz' })
  endedAt: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  speaker: UserEntity;
}
