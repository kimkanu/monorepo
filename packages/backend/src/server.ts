import http from 'http';

import { consoleLogHi } from '@team-10/lib';
import cors from 'cors';
import express, { Express } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import passport from 'passport';
import { Server as IOServer, Socket } from 'socket.io';
import tempy from 'tempy';
import { createConnection } from 'typeorm';
import { TypeormStore } from 'typeorm-store';

import SessionEntity from './entity/session';

import ClassroomManager from './managers/classroom';
import ImageManager from './managers/image';
import UserManager from './managers/user';

import initializePassport from './passport';

import mainRouter from './routes';
import frontendRouter from './routes/frontend';

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

  /** Multer upload */
  tempDir: string;

  upload: multer.Multer;

  /** Managers. */
  managers: {
    classroom: ClassroomManager;
    user: UserManager;
    image: ImageManager;
  };

  /**
   * Create a server stack.
   * @param {number} port - The port number to listen on.
   */
  constructor(port: number) {
    this.port = port;

    const app = express();
    this.app = app;

    this.http = http.createServer(app);

    this.managers = {
      classroom: new ClassroomManager(this),
      user: new UserManager(this),
      image: new ImageManager(this),
    };

    this.tempDir = tempy.directory();

    this.upload = multer({ dest: this.tempDir });
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
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false,
      } : undefined,
    });
    const sessionRepository = connection.getRepository(SessionEntity);

    const sessionMiddleware = session({
      name: 'SID',
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      store: new TypeormStore({ repository: sessionRepository }),
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : undefined,
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      },
    });

    this.app.set('trust proxy', 1);
    this.app.use(sessionMiddleware);
    this.app.use(morgan('short'));
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': ["'self'", "'unsafe-inline'", 'https:'], // TODO: remove 'unsafe-inline'
          'img-src': ["'self'", 'data: https:'], // TODO: remove 'unsafe-inline'
          'frame-src': ['youtube.com', 'www.youtube.com'],
        },
      },
    }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    initializePassport(connection);

    this.app.use('/api', mainRouter(this).router);
    this.app.use(frontendRouter);

    this.io = new IOServer(this.http, {
      cors: {
        origin: '*',
      },
      maxHttpBufferSize: 1e8, // 100MB
    });

    const wrap = (middleware: any) => (
      socket: Socket, next: Function,
    ) => middleware(
      socket.request, {}, next,
    );
    this.io.use(wrap(sessionMiddleware));
    this.io.use(wrap(passport.initialize()));
    this.io.use(wrap(passport.session()));
  }

  listen() {
    this.http.listen(this.port, () => {
      consoleLogHi();
      // eslint-disable-next-line no-console
      console.log('The backend server started.');
    });
  }

  close() {
    this.http.close();
    process.exit(0);
  }
}
