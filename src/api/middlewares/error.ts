import httpStatus from 'http-status';
import { ZodError, ZodIssue } from 'zod';
import { Request, Response, NextFunction } from 'express';

import { ENVIRONMENT } from '@/lib/env';
import logger from '@/lib/logger';
import ApiError from '@/lib/api-error';

interface CustomError extends Error {
  statusCode?: number;
  stack?: string;
}

const errorConverter = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let error: CustomError;

  if (err instanceof ZodError) {
    const [firstError] = err.errors as ZodIssue[];
    next({
      statusCode: httpStatus.BAD_REQUEST,
      message: firstError.message,
      stack: err.stack,
    });
    return;
  }

  if (err instanceof ApiError) {
    error = err;
  } else {
    const statusCode = (err as CustomError).statusCode
      ? httpStatus.BAD_REQUEST
      : httpStatus.INTERNAL_SERVER_ERROR;
    const message = (err as CustomError).message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, (err as CustomError).stack);
  }

  next(error);
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
  const {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR,
    message,
    stack,
    ...restParams
  } = err;

  res.locals.errorMessage = message;

  const response = {
    status: statusCode,
    message,
    ...restParams,
    ...(ENVIRONMENT === 'development' && { stack }),
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
