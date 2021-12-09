// import { UsersLangPatchError } from '@team-10/lib';
import { isAuthenticatedOrFail } from '../../../passport';
import Server from '../../../server';
import Route from '../../route';

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.accept(
    'GET /users/me/language',
    isAuthenticatedOrFail,
    async (params, body, user) => {
      const { managers } = server;

      const userEntity = await managers.user.getEntityOrFail(user.stringId);
      console.log('user id', userEntity.displayName);

      return {
        success: true,
        payload: {
          language: userEntity.language,
        },
      };
    },
  );

  route.accept(
    'PATCH /users/me/language',
    isAuthenticatedOrFail,
    async (params, body, user, req) => {
      // Body validation
      const { language } = body;

      const acceptableLanguages = new Set(['ko', 'en']);

      const userEntity = await server.managers.user.getEntityOrFail(user.stringId);
      if (!acceptableLanguages.has(language)) {
        return {
          success: false,
          error: {
            code: 'UNSUPPORTED_LANGUAGE',
            statusCode: 400,
            extra: {},
          },
        };
      }

      userEntity.language = language;
      await userEntity.save();

      return {
        success: true,
        payload: {
          language,
        },
      };
    },
  );

  return route;
}
