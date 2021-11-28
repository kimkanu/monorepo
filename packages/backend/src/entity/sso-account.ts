import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import User from './user';

@Entity()
export default class SSOAccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.ssoAccounts)
  @JoinTable()
  user: User;

  @Column({ nullable: false })
  provider: string;

  @Column({ nullable: false })
  providerId: string;
}
