import UserEntity from './entity/user';

export {};

declare global {
  namespace Express {
    interface User extends Omit<UserEntity, 'ssoAccounts' | 'classrooms' | 'myClassrooms'> {}
  }
}
