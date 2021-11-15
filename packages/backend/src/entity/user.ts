import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import Classroom from './classroom';

import SSOAccount from './sso-account';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  stringId: string;

  @OneToMany(() => SSOAccount, (ssoAccount) => ssoAccount.user)
  ssoAccounts: SSOAccount[];

  @Column({ nullable: false })
  displayName: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ default: false })
  initialized: boolean;

  @ManyToMany(() => Classroom, (classroom) => classroom.members)
  classrooms: Classroom[];

  @OneToMany(() => Classroom, (classroom) => classroom.instructor)
  myClassrooms: Classroom[];
}
