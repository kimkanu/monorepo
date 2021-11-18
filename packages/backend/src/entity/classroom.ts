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

import History from './history';
import User from './user';

@Entity()
export default class Classroom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  hash: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.myClassrooms, {
    cascade: true,
  })
  @JoinTable()
  instructor: User;

  @ManyToMany(() => User, (user) => user.classrooms, {
    cascade: true,
  })
  @JoinTable()
  members: User[];

  @OneToMany(() => History, (history) => history.classroom)
  histories: History[];
}
