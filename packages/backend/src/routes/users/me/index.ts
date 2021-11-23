import { ClassroomJSON, Provider, UsersMePatchError } from '@team-10/lib';
import { getConnection } from 'typeorm';

import UserEntity from '../../../entity/user';

import { isAuthenticatedOrFail } from '../../../passport';
import Server from '../../../server';
import Route from '../../route';

import ssoAccounts from './ssoAccounts';

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.accept(
    'GET /users/me',
    isAuthenticatedOrFail,
    async (params, body, user, req, res) => {
      const { managers } = server;

      const userEntity = await managers.user.getEntityOrFail(user.stringId);

      return {
        success: true,
        payload: {
          stringId: user.stringId,
          displayName: user.displayName,
          profileImage: user.profileImage,
          ssoAccounts: userEntity.ssoAccounts.map(({ provider, providerId }) => ({
            provider: provider as Provider,
            providerId,
          })),
          initialized: userEntity.initialized,
          classrooms: (await Promise.all(
            userEntity.classrooms.map(
              (classroom) => managers.classroom.getClassroomJSON(user.stringId, classroom.hash),
            ),
          )).filter((x) => !!x) as ClassroomJSON[],
        },
      };
    },
  );

  route.accept(
    'PATCH /users/me',
    isAuthenticatedOrFail,
    async (params, body, user, req, res) => {
      // Body validation
      const { stringId, displayName } = body;
      const profileImageFile = req.file; // TODO

      let error: UsersMePatchError | null = null;
      if (!['string', 'undefined'].includes(typeof stringId) || !stringId) {
        error = {
          code: 'INVALID_INFORMATION',
          statusCode: 400,
          extra: {
            field: 'stringId',
            details: 'Not a value of string type',
          },
        };
      } else if (!/^[\w\d._\-:]{3,}$/.test(stringId)) {
        error = {
          code: 'INVALID_INFORMATION',
          statusCode: 400,
          extra: {
            field: 'stringId',
            details: 'Not a valid string ID',
          },
        };
      } else if (!['string', 'undefined'].includes(typeof displayName) || !displayName) {
        error = {
          code: 'INVALID_INFORMATION',
          statusCode: 400,
          extra: {
            field: 'displayName',
            details: 'Not a value of string type',
          },
        };
      } else if (false) { // TODO: validate profileImage
        error = {
          code: 'INVALID_INFORMATION',
          statusCode: 400,
          extra: {
            field: 'displayName',
            details: 'Invalid profile image',
          },
        };
      }

      if (error) {
        return {
          success: false,
          error,
        };
      }

      const userEntity = await server.managers.user.getEntityOrFail(user.stringId);
      if (stringId) {
        userEntity.stringId = stringId;
      }
      if (displayName) {
        userEntity.displayName = displayName;
      }
      // TODO: patch user.profileImage
      userEntity.initialized = true;
      await userEntity.save();

      req.user = userEntity;

      return {
        success: true,
        payload: server.managers.user.getUserInfoJSONFromEntity(userEntity),
      };
    },
  );

  // TODO
  // route.accept(
  //   'DELETE /users/me',
  //   isAuthenticatedOrFail,
  //   async (params, body, user, req, res) => {

  //   },
  // );

  route.use(ssoAccounts);

  return route;
}
