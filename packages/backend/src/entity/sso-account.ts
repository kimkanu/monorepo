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
export default class SSOAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.ssoAccounts, {
    cascade: true,
  })
  @JoinTable()
  user: User;

  @Column({ nullable: false })
  provider: string;

  @Column({ nullable: false })
  providerId: string;
}
