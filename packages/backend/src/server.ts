import http from 'http';

import cors from 'cors';
import express, { Express } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import { createConnection } from 'typeorm';
import { TypeormStore } from 'typeorm-store';

import Session from './entity/session';
import mainRouter from './routes';
import frontendRouter from './routes/frontend';

/** Class representing a server stack. */
export default class Server {
  /** Port number */
  port: number;

  /** Express.js server instance. */
  app: Express;

  /** Http server instance. */
  http: http.Server;

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
      entities: [Session],
    });
    const repository = connection.getRepository(Session);

    const sessionMiddleware = session({
      name: 'SID',
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      store: new TypeormStore({ repository }),
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

    this.app.use('/api', mainRouter);
    this.app.use(frontendRouter);
  }

  listen() {
    this.http.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`The server started on the port ${this.port}.`);
    });
  }

  close() {
    this.http.close();
    process.exit(0);
  }
}
