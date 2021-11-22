import { Router } from 'express';

import Server from '../../server';

import me from './me';
import other from './other';

export default function generateRouter(server: Server) {
  const router = Router();

  router.use('/me', me(server));
  router.use('/', other(server));

  return router;
}
