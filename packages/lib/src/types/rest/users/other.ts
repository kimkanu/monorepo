import { Response } from '..';
import { ClassroomJSON } from '../classroom';

import { UserInfoJSON } from '.';

export interface UserInfoOther extends UserInfoJSON {
  commonClassrooms: ClassroomJSON[];
}

export type UsersOtherGetResponse = Response<UserInfoOther, UserInfoOtherGetError>;
type UserInfoOtherGetError = {
  code: 'NONEXISTENT_USER';
  statusCode: 404;
  extra: Record<string, never>;
};
