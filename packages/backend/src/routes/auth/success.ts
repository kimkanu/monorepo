import { Router } from 'express';

const router = Router();

router.get(
  '/',
  (req, res) => {
    const { redirectUri } = req.session;
    req.session.redirectUri = undefined;

    if (req.user?.initialized) {
      res.redirect(redirectUri ?? '/');
    } else if (redirectUri) {
      res.redirect(`/welcome?redirect_uri=${redirectUri}`);
    } else {
      res.redirect('/welcome');
    }
  },
);

export default router;
