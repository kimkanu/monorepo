import { ClassroomsHashPatchResponse, Empty } from '@team-10/lib';

import { isAuthenticatedOrFail } from '../../passport';

import Server from '../../server';
import Route from '../route';

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.accept(
    'POST /classrooms',
    isAuthenticatedOrFail,
    async (params, body, user) => {
      // TODO: validation
      const { name } = body;
      if (!name) {
        return {
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
      }

      const { managers } = server;
      const classroom = await managers.classroom.create(user.stringId, name);
      return {
        success: true,
        payload: (await managers.classroom.getClassroomJSON(user.stringId, classroom.hash))!,
      };
    },
  );

  route.accept(
    'PATCH /classrooms/:hash',
    isAuthenticatedOrFail,
    async (params, body, user, req, res, next) => {
      // TODO: validation
      const { hash } = params;
      const { operation } = body;
      if (!hash) {
        return next();
      }

      if (!operation || ['join'].includes(operation)) {
        return {
          success: false,
          error: {
            code: 'INVALID_INFORMATION',
            statusCode: 400,
            extra: {
              field: 'operation',
              details: 'Not a value of type string',
            },
          },
        };
      }

      const { managers } = server;
      const userId = req.user!.stringId;

      const isPresent = await managers.classroom.isPresent(hash);
      if (!isPresent) {
        return {
          success: false,
          error: {
            code: 'NONEXISTENT_CLASSROOM',
            statusCode: 400,
            extra: {} as Empty,
          },
        };
      }

      const classroom = managers.classroom.getRaw(hash)!;

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
            payload: (await managers.classroom.getClassroomJSON(userId, hash))!,
          };
        }

        return {
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            statusCode: 500,
            extra: {},
          },
        } as ClassroomsHashPatchResponse;
      }

      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          statusCode: 500,
          extra: {
            details: 'Not implemented',
          },
        },
      } as ClassroomsHashPatchResponse;
    },
  );

  return route;
}
