// import { UsersLangPatchError } from '@team-10/lib';
import { isAuthenticatedOrFail } from '../passport';
import Server from '../server';

import Route from './route';

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.accept(
    'GET /lang',
    isAuthenticatedOrFail,
    async (params, body, user) => {
      const { managers } = server;

      const userEntity = await managers.user.getEntityOrFail(user.stringId);
      console.log('user id', userEntity.displayName);

      return {
        success: true,
        payload: {
          lang: userEntity.language,
        },
      };
    },
  );

  route.accept(
    'PATCH /lang',
    isAuthenticatedOrFail,
    async (params, body, user, req) => {
      // Body validation
      const { stringId, language } = body;

      // let error: UsersLangPatchError | null = null;
      // if (!['string', 'undefined'].includes(typeof stringId)) {
      //   error = {
      //     code: 'INVALID_INFORMATION',
      //     statusCode: 400,
      //     extra: {},
      //   };
      // } else if (stringId && !/^[\w\d._\-:]{3,}$/.test(stringId)) {
      //   error = {
      //     code: 'INVALID_INFORMATION',
      //     statusCode: 400,
      //     extra: {},
      //   };
      // } else if (!['string', 'undefined'].includes(typeof language)) {
      //   error = {
      //     code: 'INVALID_INFORMATION',
      //     statusCode: 400,
      //     extra: {},
      //   };
      // }
      // if (error) {
      //   return {
      //     success: false,
      //     error,
      //   };
      // }
      const userEntity = await server.managers.user.getEntityOrFail(user.stringId);
      if (stringId) {
        userEntity.stringId = stringId;
      }
      if (language) {
        userEntity.language = language;
      }
      userEntity.initialized = true;
      await userEntity.save();

      return {
        success: true,
        payload: server.managers.user.getUserLangJSONFromEntity(userEntity),
      };
    },
  );

  return route;
}
