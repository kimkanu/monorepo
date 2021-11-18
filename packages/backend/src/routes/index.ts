import { Router } from 'express';

import { isAuthenticated } from '../passport';

import auth from './auth';

const router = Router();

router.get(
  '/',
  (req, res) => {
    res.sendStatus(200);
  },
);

router.get(
  '/profile',
  isAuthenticated,
  (req, res) => {
    res.json(req.user);
  },
);

router.use('/auth', auth);

export default router;
