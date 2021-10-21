import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import SSOAccount from './sso-account';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => SSOAccount, (ssoAccount) => ssoAccount.user)
  ssoAccounts: SSOAccount[];

  @Column({ nullable: false })
  displayName: string;

  @Column({ nullable: true })
  profileImage: string;
}
