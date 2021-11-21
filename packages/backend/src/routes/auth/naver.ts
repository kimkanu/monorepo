import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get(
  '/',
  (req, res, next) => {
    console.log('redirecturi', req.query.redirect_uri);
    req.session.redirectUri = req.query.redirect_uri as string | undefined;
    next();
  },
  passport.authenticate('naver'),
  (req, res) => {
    console.log('redirecturi', req.session.redirectUri);
    res.redirect('/');
  },
);

router.get(
  '/callback',
  passport.authenticate('naver', {
    successRedirect: '/api/auth/success',
    failureRedirect: '/api/auth/failed',
  }),
);

export default router;
