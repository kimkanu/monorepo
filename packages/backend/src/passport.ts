import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as NaverStrategy, Profile as NaverProfile } from 'passport-naver-v2';
import PassportOauth2 from 'passport-oauth2';
import { Connection } from 'typeorm';

import SSOAccount from './entity/sso-account';

import User from './entity/user';

export default (connection: Connection) => {
  const userRepository = connection.getRepository(User);
  const ssoAccountRepository = connection.getRepository(SSOAccount);

  passport.serializeUser((req, user, done) => {
    done(null, user);
  });
  passport.deserializeUser((id: string, done) => {
    userRepository.findOne(id).then((user) => {
      if (!user) {
        done(new Error(`User ${id} not found.`), null);
      } else {
        done(null, user);
      }
    });
  });

  const callbackURL = process.env.AUTH_NAVER_CALLBACK_URL!.endsWith(':80')
    ? process.env.AUTH_NAVER_CALLBACK_URL!.slice(0, -3)
    : process.env.AUTH_NAVER_CALLBACK_URL!;

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
      if (!ssoAccount) {
        const user = new User();
        user.displayName = profile.nickname!;
        user.profileImage = profile.profileImage ?? null!;
        await userRepository.save(user);

        const newSSOAccount = new SSOAccount();
        newSSOAccount.provider = 'naver';
        newSSOAccount.providerId = profile.id;
        newSSOAccount.user = user;
        await ssoAccountRepository.save(newSSOAccount);

        return done(null, user);
      }

      return done(null, ssoAccount.user);
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
