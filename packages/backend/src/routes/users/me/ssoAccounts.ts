import { Provider, providers } from '@team-10/lib';
import { getConnection } from 'typeorm';

import SSOAccountEntity from '../../../entity/sso-account';

import { isAuthenticatedOrFail } from '../../../passport';
import Server from '../../../server';
import Route from '../../route';

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.accept(
    'GET /users/me/sso-accounts',
    isAuthenticatedOrFail,
    async (params, body, user) => {
      const info = (await server.managers.user
        .getSerializableUserInfoFromStringIdAsync(user.stringId)
      )!;
      return {
        success: true,
        payload: info.ssoAccounts,
      };
    },
  );

  route.accept(
    'DELETE /users/me/sso-accounts/:provider',
    isAuthenticatedOrFail,
    async (params, body, user) => {
      const { provider } = params;
      if (!(providers as string[]).includes(provider)) {
        return {
          success: false,
          error: {
            code: 'UNSUPPORTED_PROVIDER',
            statusCode: 400,
            extra: {},
          },
        };
      }

      const info = (await server.managers.user
        .getSerializableUserInfoFromStringIdAsync(user.stringId)
      )!;
      if (info.ssoAccounts.every((x) => x.provider !== provider)) {
        return {
          success: false,
          error: {
            code: 'NONEXISTENT_SSO_ACCOUNT',
            statusCode: 400,
            extra: {},
          },
        };
      }

      if (info.ssoAccounts.length === 1) {
        return {
          success: false,
          error: {
            code: 'UNIQUE_SSO_ACCOUNT',
            statusCode: 400,
            extra: {},
          },
        };
      }

      const ssoAccountRepository = getConnection().getRepository(SSOAccountEntity);
      const ssoAccount = await ssoAccountRepository
        .createQueryBuilder('ssoAccount')
        .innerJoinAndSelect('ssoAccount.user', 'user')
        .where('(user.id = :me AND ssoAccount.provider = :provider)', { me: user.id, provider })
        .getOne();

      if (!ssoAccount) {
        return {
          success: false,
          error: {
            code: 'NONEXISTENT_SSO_ACCOUNT',
            statusCode: 400,
            extra: {},
          },
        };
      }

      const sockets = server.managers.user.users.get(user.stringId)?.sockets ?? [];
      sockets.forEach((socket) => socket.emit('user/PatchBroadcast', {
        patch: {
          ssoAccounts: info.ssoAccounts.filter(({ provider: aProvider, providerId }) => (
            aProvider !== ssoAccount.provider || providerId !== ssoAccount.providerId
          )),
        },
      }));

      await ssoAccount.remove();
      return {
        success: true,
        payload: {},
      };
    },
  );

  return route;
}
