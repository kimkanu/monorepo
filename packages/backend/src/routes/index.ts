import { Router } from 'express';

import Server from '../server';

import auth from './auth';
import users from './users';

export default function generateRouter(server: Server) {
  const router = Router();

  router.get(
    '/',
    (req, res) => {
      res.sendStatus(200);
    },
  );

  router.use('/auth', auth);
  router.use('/users', users(server));

  return router;
}
