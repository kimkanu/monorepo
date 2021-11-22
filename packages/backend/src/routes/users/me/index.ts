import {
  ClassroomJSON,
  Provider, UsersMeGetResponse, UsersMePatchError, UsersMePatchResponse,
} from '@team-10/lib';
import { Router } from 'express';
import { getConnection } from 'typeorm';

import UserEntity from '../../../entity/user';

import { isAuthenticatedOrFail } from '../../../passport';
import Server from '../../../server';

import ssoAccounts from './ssoAccounts';

export default function generateRouter(server: Server) {
  const router = Router();

  // GET /me
  router.get(
    '/',
    isAuthenticatedOrFail,
    async (req, res) => {
      const user = req.user!;
      const userRepository = getConnection().getRepository(UserEntity);
      const { managers } = server;

      const userEntity = await userRepository.findOneOrFail({
        where: { id: user.id },
        join: {
          alias: 'user',
          leftJoinAndSelect: {
            ssoAccounts: 'user.ssoAccounts',
            classrooms: 'user.classrooms',
          },
        },
      });

      const response: UsersMeGetResponse = {
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

      res.json(response);
    },
  );

  // PATCH /me // TODO
  router.patch(
    '/',
    isAuthenticatedOrFail,
    async (req, res) => {
      // Body validation
      const { stringId, displayName } = req.body;
      const profileImageFile = req.file; // TODO

      let error: UsersMePatchError | null = null;
      if (!['string', 'undefined'].includes(typeof stringId) || !stringId) {
        error = {
          code: 'INVALID_INFORMATION',
          statusCode: 400,
          extra: {
            field: 'stringId',
            details: 'Not a value of type string',
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
            details: 'Not a value of type string',
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
        const response: UsersMePatchResponse = {
          success: false,
          error,
        };
        return res.status(response.error.statusCode).json(response);
      }

      const userRepository = getConnection().getRepository(UserEntity);

      const user = await userRepository.findOneOrFail(req.user!.id);
      if (stringId) {
        user.stringId = stringId;
      }
      if (displayName) {
        user.displayName = displayName;
      }
      // patch user.profileImage
      user.initialized = true;
      await user.save();

      const response: UsersMePatchResponse = {
        success: true,
        payload: {
          stringId: user.stringId,
          displayName: user.displayName,
          profileImage: user.profileImage,
        },
      };

      res.json(response);
    },
  );

  // DELETE /me // TODO
  router.get(
    '/',
    isAuthenticatedOrFail,
    async (req, res) => {

    },
  );

  router.use('/sso-accounts', ssoAccounts(server));

  return router;
}
