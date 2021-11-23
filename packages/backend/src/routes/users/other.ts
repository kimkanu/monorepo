import { ClassroomJSON } from '@team-10/lib';
import { getConnection } from 'typeorm';

import ClassroomEntity from '../../entity/classroom';

import { isAuthenticatedOrFail } from '../../passport';
import Server from '../../server';
import Route from '../route';

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  const { managers } = server;

  route.accept(
    'GET /users/:id',
    isAuthenticatedOrFail,
    async (params, body, user, req, res, next) => {
      const stringId = req.params.id;
      if (!stringId || stringId === 'me') {
        return next();
      }

      if (stringId === user.stringId) {
      // Unreachable
        return res.redirect('/api/users/me');
      }

      const userEntity = await server.managers.user.getEntity(stringId);
      if (!userEntity) {
        return {
          success: false,
          error: {
            code: 'NONEXISTENT_USER',
            statusCode: 404,
            extra: {},
          },
        };
      }

      const classroomRepository = getConnection().getRepository(ClassroomEntity);
      const commonClassrooms = await classroomRepository
        .createQueryBuilder('classroom')
        .innerJoinAndSelect('classroom.members', 'members')
        .where(':me IN (members.id)', { me: user.id })
        .getMany();

      return {
        success: true,
        payload: {
          stringId: user.stringId,
          displayName: user.displayName,
          profileImage: user.profileImage,
          commonClassrooms: (await Promise.all(
            commonClassrooms.map(
              (classroom) => managers.classroom.getClassroomJSON(user.stringId, classroom.hash),
            ),
          )).filter((x) => !!x) as ClassroomJSON[],
        },
      };
    },
  );

  return route;
}
