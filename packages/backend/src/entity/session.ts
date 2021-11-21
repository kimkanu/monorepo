import {
  BaseEntity, Column, Entity, PrimaryColumn,
} from 'typeorm';
import { SessionEntity as TypeormSessionEntity } from 'typeorm-store';

@Entity()
export default class SessionEntity extends BaseEntity implements TypeormSessionEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  expiresAt: number;

  @Column()
  data: string;
}
