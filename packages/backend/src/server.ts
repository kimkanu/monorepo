import http from 'http';

import { consoleLogHi } from '@team-10/lib';
import cors from 'cors';
import express, { Express } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import { Server as IOServer, Socket } from 'socket.io';
import { createConnection } from 'typeorm';
import { TypeormStore } from 'typeorm-store';

import Classroom from './entity/classroom';
import Session from './entity/session';
import SSOAccount from './entity/sso-account';
import User from './entity/user';
import initializePassport from './passport';
import mainRouter from './routes';
import frontendRouter from './routes/frontend';
import Room from './types/room';
import { generateClassroomHash } from './utils/classroom';

const DROP_SCHEMA = false;

/** Class representing a server stack. */
export default class Server {
  /** Port number */
  port: number;

  /** Express.js server instance. */
  app: Express;

  /** Http server instance. */
  http: http.Server;

  /** Socket.io server instance. */
  io: IOServer;

  /** The collection of rooms. */
  rooms: Map<string, Room>;

  /**
   * Create a server stack.
   * @param {number} port - The port number to listen on.
   */
  constructor(port: number) {
    this.port = port;

    const app = express();
    this.app = app;

    this.http = http.createServer(app);
  }

  /**
   * Initialize the server stack.
   */
  async initialize() {
    const connection = await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      dropSchema: DROP_SCHEMA,
      entities: ['src/entity/**/*.ts'],
    });
    const sessionRepository = connection.getRepository(Session);
    const ssoAccountRepository = connection.getRepository(SSOAccount);
    const classroomRepository = connection.getRepository(Classroom);
    const userRepository = connection.getRepository(User);

    const sessionMiddleware = session({
      name: 'SID',
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      store: new TypeormStore({ repository: sessionRepository }),
      cookie: {
        sameSite: false,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
      },
    });

    this.app.use(sessionMiddleware);
    this.app.use(morgan('short'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': ["'self'", "'unsafe-inline'"], // TODO: remove 'unsafe-inline'
        },
      },
    }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    initializePassport(connection);

    this.app.use('/api', mainRouter);
    this.app.use(frontendRouter);

    this.io = new IOServer(this.http, {
      cors: {
        origin: '*',
      },
    });

    const wrap = (middleware: any) => (
      socket: Socket, next: Function,
    ) => middleware(
      socket.request, {}, next,
    );
    this.io.use(wrap(sessionMiddleware));
    this.io.use(wrap(passport.initialize()));
    this.io.use(wrap(passport.session()));

    // Construct test data
    if (DROP_SCHEMA) {
      console.log('=========== Constructing Test Data ===========');

      const user = new User();
      user.stringId = 'naver:NzYgpUnFPklAHLIrLBw5ic7PvJy64SFpLmPiMWfz4Go';
      user.displayName = 'uto****';
      user.profileImage = 'https://phinf.pstatic.net/contact/20191025_133/1572004399046UqQgO_PNG/image.png';
      await userRepository.save(user);

      const ssoAccount = new SSOAccount();
      ssoAccount.provider = 'naver';
      ssoAccount.providerId = 'NzYgpUnFPklAHLIrLBw5ic7PvJy64SFpLmPiMWfz4Go';
      ssoAccount.user = user;
      await ssoAccountRepository.save(ssoAccount);

      const testClassroom = new Classroom();
      testClassroom.hash = generateClassroomHash();
      testClassroom.name = 'Test Classroom';
      testClassroom.instructor = user;
      testClassroom.members = [user];
      testClassroom.histories = [];
      await classroomRepository.save(testClassroom);
    }

    console.log(await classroomRepository.find());
  }

  listen() {
    this.http.listen(this.port, () => {
      // eslint-disable-next-line no-console
      consoleLogHi();
      console.log('The backend server started.');
    });
  }

  close() {
    this.http.close();
    process.exit(0);
  }
}
