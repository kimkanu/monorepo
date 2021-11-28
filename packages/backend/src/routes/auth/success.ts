import { Router } from 'express';

const router = Router();

router.get(
  '/',
  (req, res) => {
    const { redirectUri, toast } = req.session;
    req.session.redirectUri = undefined;
    req.session.toast = undefined;

    if (toast && redirectUri === '/profile') {
      res.redirect(`/profile?toast=${toast}`);
    } else if (req.user?.initialized) {
      res.redirect(redirectUri ?? '/');
    } else if (redirectUri) {
      res.redirect(`/welcome?redirect_uri=${redirectUri}`);
    } else {
      res.redirect('/welcome');
    }
  },
);

export default router;
