import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import httpStatus from 'http-status';
import { Express } from 'express';

import { ENVIRONMENT } from '@/lib/env';
import ApiError from '@/lib/api-error';
import morgan from '@/lib/morgan';
import errorMiddleware from '@/api/middlewares/error';
import routes from '@/api/routes';

const rest = (app: Express) => {
  if (ENVIRONMENT !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
  }

  // set security HTTP headers
  app.use(helmet());

  // parse json request body
  app.use(bodyParser.json());

  // parse urlencoded request body
  app.use(bodyParser.urlencoded({ extended: true }));

  // enable cors
  const corsMiddleware = cors({});
  app.use(corsMiddleware);
  app.options(/(.*)/, corsMiddleware);

  app.use(routes);

  // send back a 404 error for any unknown api request
  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  // convert error to ApiError, if needed
  app.use(errorMiddleware.errorConverter);

  // handle error
  app.use(errorMiddleware.errorHandler);
};

export default rest;
