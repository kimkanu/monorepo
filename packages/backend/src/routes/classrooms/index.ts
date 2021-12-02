import { Empty } from '@team-10/lib';

import { isAuthenticatedOrFail } from '../../passport';

import Server from '../../server';
import Route from '../route';

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.accept(
    'POST /classrooms',
    isAuthenticatedOrFail,
    async (params, body, user) => {
      const { name } = body;
      if (!name) {
        return {
          success: false,
          error: {
            code: 'INVALID_INFORMATION',
            statusCode: 400,
            extra: {
              field: 'name',
              details: 'Not a value of string type',
            },
          },
        };
      }

      const { managers } = server;
      const classroom = await managers.classroom.create(user.stringId, name);
      return {
        success: true,
        payload: (await managers.classroom.getMyClassroomJSON(classroom.hash))!,
      };
    },
  );

  route.accept(
    'DELETE /classrooms/:hash',
    isAuthenticatedOrFail,
    async (params, body, user) => {
      const { managers } = server;
      const userId = user.stringId;
      const { hash } = params;

      const classroom = await server.managers.classroom.get(hash);
      if (!classroom) {
        return {
          success: false,
          error: {
            code: 'NONEXISTENT_CLASSROOM',
            statusCode: 400,
            extra: {} as Empty,
          },
        };
      }

      if (classroom.instructor.stringId !== userId) {
        return {
          success: false,
          error: {
            code: 'FORBIDDEN',
            statusCode: 403,
            extra: {},
          },
        };
      }

      await managers.classroom.remove(hash);
      return {
        success: true,
        payload: {},
      };
    },
  );

  route.accept(
    'PATCH /classrooms/:hash',
    isAuthenticatedOrFail,
    async (params, body, user, req, res, next) => {
      const { hash } = params;
      const { operation } = body;
      if (!hash) {
        return next();
      }

      if (!operation) {
        return {
          success: false,
          error: {
            code: 'INVALID_INFORMATION',
            statusCode: 400,
            extra: {
              field: 'operation',
              details: 'Not a value of string type',
            },
          },
        };
      }

      const { managers } = server;
      const userId = user.stringId;

      const classroom = await server.managers.classroom.get(hash);
      if (!classroom) {
        return {
          success: false,
          error: {
            code: 'NONEXISTENT_CLASSROOM',
            statusCode: 400,
            extra: {} as Empty,
          },
        };
      }

      if (operation === 'join') {
        const { passcode } = body;

        if (classroom.passcode !== passcode) {
          return {
            success: false,
            error: {
              code: 'INVALID_INFORMATION',
              statusCode: 400,
              extra: {
                field: 'passcode',
                details: 'Wrong passcode',
              },
            },
          };
        }

        if (await managers.classroom.join(userId, hash)) {
          return {
            success: true,
            payload: (await managers.classroom.getClassroomJSON(hash))!,
          };
        }

        return {
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            statusCode: 500,
            extra: {},
          },
        };
      }

      if (operation === 'leave') {
        if (await managers.classroom.leave(userId, hash)) {
          return {
            success: true,
            payload: (await managers.classroom.getClassroomJSON(hash))!,
          };
        }

        return {
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            statusCode: 500,
            extra: {},
          },
        };
      }

      if (operation === 'reset_passcode') {
        if (classroom.instructor.stringId !== userId) {
          return {
            success: false,
            error: {
              code: 'FORBIDDEN',
              statusCode: 403,
              extra: {},
            },
          };
        }

        return {
          success: true,
          payload: {
            passcode: await classroom.regeneratePasscode(),
          },
        };
      }

      if (operation === 'rename') {
        if (classroom.instructor.stringId !== userId) {
          return {
            success: false,
            error: {
              code: 'FORBIDDEN',
              statusCode: 403,
              extra: {},
            },
          };
        }

        await classroom.rename(body.name);
        return {
          success: true,
          payload: {
            name: body.name,
          },
        };
      }

      if (operation === 'toggle') {
        if (classroom.instructor.stringId !== userId) {
          return {
            success: false,
            error: {
              code: 'FORBIDDEN',
              statusCode: 403,
              extra: {},
            },
          };
        }

        if (body.start) {
          await classroom.start();
        } else {
          await classroom.end();
        }
        return {
          success: true,
          payload: {} as Empty,
        };
      }

      return {
        success: false,
        error: {
          code: 'INVALID_INFORMATION',
          statusCode: 400,
          extra: {
            field: 'operation',
            details: 'Operation should be one of `join`, `leave`, `reset_passcode`, or `rename`.',
          },
        },
      };
    },
  );

  return route;
}
