import {
  ClassroomJSON, Provider, Theme, UsersMePatchError,
} from '@team-10/lib';

import { isAuthenticatedOrFail } from '../../../passport';
import Server from '../../../server';
import Classroom from '../../../types/classroom';
import Route from '../../route';

import language from './language';
import ssoAccounts from './ssoAccounts';

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.accept(
    'GET /users/me',
    isAuthenticatedOrFail,
    async (params, body, user) => {
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
          theme: userEntity.theme as Theme,
          initialized: userEntity.initialized,
          classrooms: (await Promise.all(
            userEntity.classrooms.map(
              (classroom) => (
                userEntity.myClassrooms.some(({ id }) => id === classroom.id)
                  ? managers.classroom.getMyClassroomJSON(classroom.hash)
                  : managers.classroom.getClassroomJSON(classroom.hash)
              ),
            ),
          )).filter((x) => !!x) as ClassroomJSON[],
        },
      };
    },
  );

  route.accept(
    'PATCH /users/me',
    isAuthenticatedOrFail,
    async (params, body, user, req) => {
      // Body validation
      const { stringId, displayName, theme } = body;
      const { file } = req; // TODO

      let error: UsersMePatchError | null = null;
      if (!['string', 'undefined'].includes(typeof stringId)) {
        error = {
          code: 'INVALID_INFORMATION',
          statusCode: 400,
          extra: {
            field: 'stringId',
            details: 'Not a value of string type',
          },
        };
      } else if (stringId && !/^[\w\d._\-:]{3,}$/.test(stringId)) {
        error = {
          code: 'INVALID_INFORMATION',
          statusCode: 400,
          extra: {
            field: 'stringId',
            details: 'Not a valid string ID',
          },
        };
      } else if (!!theme && !['violet', 'pink', 'green', 'blue'].includes(theme)) {
        error = {
          code: 'INVALID_INFORMATION',
          statusCode: 400,
          extra: {
            field: 'theme',
            details: 'Invalid theme value',
          },
        };
      } else if (stringId && !/^[\w\d._\-:]{3,}$/.test(stringId)) {
        error = {
          code: 'INVALID_INFORMATION',
          statusCode: 400,
          extra: {
            field: 'stringId',
            details: 'Not a valid string ID',
          },
        };
      } else if (file && !['image/png', 'image/jpeg', 'image/gif', 'image/tiff'].includes(file.mimetype)) {
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

      const profileImageUploadResponse = file ? await server.managers.image.upload(file) : null;
      if (file && !profileImageUploadResponse) {
        return {
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            statusCode: 500,
            extra: {
              details: 'Failed to upload the profile image',
            },
          },
        };
      }

      const userEntity = await server.managers.user.getEntityOrFail(user.stringId);
      if (stringId) {
        userEntity.stringId = stringId;
      }
      if (displayName) {
        userEntity.displayName = displayName;
      }
      if (theme) {
        userEntity.theme = theme;
      }
      if (profileImageUploadResponse) {
        if (userEntity.profileImageDeleteHash) {
          await server.managers.image.delete(userEntity.profileImageDeleteHash);
        }
        userEntity.profileImage = profileImageUploadResponse.link;
        userEntity.profileImageDeleteHash = profileImageUploadResponse.deletehash ?? null!;
      }

      userEntity.initialized = true;
      await userEntity.save();

      req.user = userEntity;

      const sockets = server.managers.user.users.get(user.stringId)?.sockets ?? [];
      sockets.forEach((socket) => socket.emit('user/PatchBroadcast', {
        patch: {
          stringId: userEntity.stringId,
          displayName: userEntity.displayName,
          profileImage: userEntity.profileImage,
          theme: userEntity.theme,
        },
      }));

      const myClassrooms = await Promise.all(
        (await server.managers.user.getEntityOrFail(user.stringId))
          .classrooms.map(({ hash }) => server.managers.classroom.get(hash)),
      ).then((classrooms) => classrooms.filter((c) => c !== null)) as Classroom[];

      myClassrooms.forEach((classroom) => {
        classroom.broadcast('classroom/PatchBroadcast', {
          hash: classroom.hash,
          patch: {
            members: classroom
              .getClassroomJSON()
              .members
              .map((m) => (
                m.stringId === userEntity.stringId ? {
                  ...m,
                  stringId: userEntity.stringId,
                  displayName: userEntity.displayName,
                  profileImage: userEntity.profileImage,
                } : m
              )),
          },
        });
      });

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

  route.use(language);
  route.use(ssoAccounts);

  return route;
}
