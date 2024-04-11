import httpStatus from 'http-status';
import { ZodError } from 'zod';

import { ENVIRONMENT } from '../../lib/env';
import logger from '../../lib/logger';
import ApiError from '../../lib/ApIError';

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (error instanceof ZodError) {
    const [firstError] = error.errors;
    next({
      statusCode: httpStatus.BAD_REQUEST,
      error: firstError,
      stack: error.stack,
      isOperational: true,
    });
    return;
  }

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode
      ? httpStatus.BAD_REQUEST
      : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message, stack, ...restParams } = err;
  // if (ENVIRONMENT === 'production' && !err.isOperational) {
  //   statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  //   message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  // }

  res.locals.errorMessage = err.message;

  const response = {
    status: statusCode,
    message,
    ...restParams,
    ...(ENVIRONMENT === 'development' && { stack: stack }),
  };

  if (ENVIRONMENT === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export default {
  errorConverter,
  errorHandler,
};
