import 'source-map-support/register';

import { Server } from 'http';
import express from 'express';

import logger from './lib/logger';
import bootstrap from './bootstrap';

import { PORT } from './lib/env';

let server: Server;
const app = express();

bootstrap(app).then(() => {
  logger.info('app started');
  server = app.listen(PORT, () => {
    logger.info(`listening to port ${PORT}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
