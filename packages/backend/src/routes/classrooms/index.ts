import { Router } from 'express';

import { isAuthenticatedOrFail } from '../../passport';

import Server from '../../server';

export default function generateRouter(server: Server) {
  const router = Router();

  router.post(
    '/',
    isAuthenticatedOrFail,
    async (req, res) => {
      // TODO: validation
      const { name } = req.body;
      if (!name) {
        const response = {
          success: false,
          error: {
            code: 'INVALID_INFORMATION',
            statusCode: 400,
            extra: {
              field: 'name',
              details: 'Not a value of type string',
            },
          },
        };
        return res.status(400).json(response);
      }

      const { managers } = server;
      const userId = req.user!.stringId;

      const classroom = await managers.classroom.createClassroom(userId, name);
      const response = {
        success: true,
        payload: await managers.classroom.getClassroomJSON(userId, classroom.hash),
      };
      return res.json(response);
    },
  );

  return router;
}
