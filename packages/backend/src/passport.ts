import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as NaverStrategy, Profile as NaverProfile } from 'passport-naver-v2';
import PassportOauth2 from 'passport-oauth2';
import { Connection } from 'typeorm';

import Classroom from './entity/classroom';
import SSOAccount from './entity/sso-account';
import User from './entity/user';

export default (connection: Connection) => {
  const userRepository = connection.getRepository(User);
  const ssoAccountRepository = connection.getRepository(SSOAccount);

  passport.serializeUser(
    (req: Request, user: Express.User, done: (err: any, id: number) => void) => {
      done(null, user.id);
    },
  );

  passport.deserializeUser((id: string, done) => {
    userRepository.findOne(id).then((user) => {
      if (!user) {
        done(new Error(`User ${id} not found.`), null);
      } else {
        done(null, user);
      }
    });
  });

  const callbackURL = process.env.AUTH_NAVER_CALLBACK_URL!.replace(':80', '');

  /** Sign in with Naver. */
  passport.use(new NaverStrategy({
    callbackURL,
    clientID: process.env.AUTH_NAVER_CLIENT_ID,
    clientSecret: process.env.AUTH_NAVER_CLIENT_SECRET,
  }, (
    accessToken: string,
    refreshToken: string,
    profile: NaverProfile,
    done: PassportOauth2.VerifyCallback,
  ) => {
    ssoAccountRepository.findOne({
      where: { providerId: profile.id },
      join: {
        alias: 'ssoAccount',
        leftJoinAndSelect: {
          user: 'ssoAccount.user',
        },
      },
    }).then(async (ssoAccount) => {
      let user: User;
      if (!ssoAccount) {
        user = new User();
        user.stringId = `${profile.provider}:${profile.id}`;
        user.displayName = profile.nickname!;
        user.profileImage = profile.profileImage ?? null!;
        user.initialized = false;
        await userRepository.save(user);

        const newSSOAccount = new SSOAccount();
        newSSOAccount.provider = profile.provider;
        newSSOAccount.providerId = profile.id;
        newSSOAccount.user = user;
        await ssoAccountRepository.save(newSSOAccount);
      } else {
        user = ssoAccount.user;
      }

      return done(null, user);
    }).catch((error) => {
      console.error(error);
      done(error, undefined);
    });
  }));
};

/** Login Required middleware. */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/api/auth/naver'); // TODO: support multiple SSO
};
