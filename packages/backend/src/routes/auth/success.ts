import { Router } from 'express';

const router = Router();

router.get(
  '/',
  (req, res) => {
    const { redirectUri } = req.session;
    req.session.redirectUri = undefined;

    console.log(redirectUri);

    if (req.user?.initialized) {
      res.redirect(redirectUri ?? '/');
    } if (redirectUri) {
      res.redirect(`/welcome?redirect_uri=${encodeURIComponent(redirectUri)}`);
    } else {
      res.redirect('/welcome');
    }
  },
);

export default router;
