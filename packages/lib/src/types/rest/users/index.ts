export type Provider = 'naver';

export interface SSOAccountJSON {
  provider: Provider;
  providerId: string;
}

export interface UserInfoJSON {
  stringId: string;
  displayName: string;
  profileImage: string;
}

export * from './me';
export * from './other';
