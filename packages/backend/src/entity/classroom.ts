import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';

import ChatEntity from './chat';
import History from './history';
import User from './user';

@Entity()
export default class ClassroomEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  hash: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.myClassrooms, { onDelete: 'CASCADE' })
  @JoinTable()
  instructor: User;

  @ManyToMany(() => User, (user) => user.classrooms)
  @JoinTable()
  members: User[];

  @OneToMany(() => History, (history) => history.classroom)
  histories: History[];

  @OneToMany(() => ChatEntity, (chat) => chat.classroom)
  chats: ChatEntity[];

  @Column()
  passcode: string;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;
}
