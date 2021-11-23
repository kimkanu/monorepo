import {
  Endpoints, FetchMethods, PathParams, RequestBodyType, ResponseType,
} from '@team-10/lib';
import {
  IRouterMatcher, NextFunction, Router, Request, Response,
} from 'express';

import Server from '../server';

/**
 * Router를 wrapping하는 클래스입니다.
 *
 * Route를 하나 만드시려면 다음과 같이 하시면 됩니다:
 *
 * 1. `@team-10/lib`에 route 타입을 만듧니다.
 *
 *    `@team-10/lib/src/types/rest` 아래에 있는 타입 네 개를 채워줍니다.
 *    `Endpoints`, `PathParams`, `RequestBodyType`, `ResponseType`
 *
 * 2. Example route를 복사해서 파일로 만듧니다. `./example.ts`
 *
 * 3. `.accept(...)` 안의 내용을 수정하거나 `.use(...)`를 이용해 sub-route를 만듧니다.
 */
export default class Route {
  router: Router;

  constructor(public server: Server) {
    this.router = Router();
  }

  use(route: (server: Server) => Route) {
    this.router.use(route(this.server).router);
  }

  accept<E extends Endpoints>(
    endpoint: E,
    middleware: (
      params: PathParams[E] & Record<string, string>,
      body: RequestBodyType[E],
      user: Express.User | undefined,
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<ResponseType[E] | void>,
  ): void;

  accept<E extends Endpoints>(
    endpoint: E,
    authenticationMiddleware: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => any,
    middleware: (
      params: PathParams[E] & Record<string, string>,
      body: RequestBodyType[E],
      user: Express.User,
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<ResponseType[E] | void>,
  ): void;

  accept<E extends Endpoints>(endpoint: E, middleware1: any, middleware2?: any) {
    if (!middleware2) {
      this.acceptInternal(endpoint, (req, res, next) => next(), middleware1);
    } else {
      this.acceptInternal(endpoint, middleware1, middleware2);
    }
  }

  private async acceptInternal<E extends Endpoints, User>(
    endpoint: E,
    authenticationMiddleware: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => any,
    middleware: (
      params: PathParams[E] & Record<string, string>,
      body: RequestBodyType[E],
      user: User,
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<ResponseType[E] | void>,
  ) {
    const urls = endpoint.split(' ');
    const method = urls[0] as FetchMethods;
    const url = urls.slice(1).join(' ');

    const listener: IRouterMatcher<Router> = {
      GET: this.router.get,
      POST: this.router.post,
      PATCH: this.router.patch,
      DELETE: this.router.delete,
    }[method];

    listener(
      url,
      authenticationMiddleware,
      async (req, res, next) => {
        const params = { ...req.query, ...req.params } as PathParams[E] & Record<string, string>;
        const response = await middleware(
          params,
          req.body,
          req.user as unknown as User,
          req,
          res,
          next,
        );

        if (!response) return next();

        const statusCode = response.success ? 200 : response.error.statusCode;
        return res.status(statusCode).json(response);
      },
    );
  }
}
