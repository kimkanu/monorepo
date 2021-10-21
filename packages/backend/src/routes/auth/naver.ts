import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get(
  '/',
  passport.authenticate('naver'),
  (req, res) => {
    // authentication was successful.
    res.redirect('/');
  },
);

router.get(
  '/callback',
  passport.authenticate('naver', {
    successRedirect: '/',
    failureRedirect: '/api/auth/failed',
  }),
);

export default router;
