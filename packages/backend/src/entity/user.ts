import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import ChatEntity from './chat';

import ClassroomEntity from './classroom';
import SSOAccountEntity from './sso-account';

@Entity()
export default class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  stringId: string;

  @OneToMany(() => SSOAccountEntity, (ssoAccount) => ssoAccount.user, {
    cascade: true,
  })
  ssoAccounts: SSOAccountEntity[];

  @Column({ nullable: false })
  displayName: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  profileImageDeleteHash: string;

  @Column({ default: false })
  initialized: boolean;

  @ManyToMany(() => ClassroomEntity, (classroom) => classroom.members, {
    cascade: true,
  })
  classrooms: ClassroomEntity[];

  @OneToMany(() => ClassroomEntity, (classroom) => classroom.instructor, {
    cascade: true,
  })
  myClassrooms: ClassroomEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.author, {
    cascade: true,
  })
  chats: ChatEntity[];

  @Column({ nullable: true })
  language: string;
}
