import { Router } from 'express';

import Server from '../../../server';

export default function generateRouter(server: Server) {
  const router = Router();

  router.get(
    '/',
    (req, res) => {
      res.redirect('/');
    },
  );

  return router;
}
