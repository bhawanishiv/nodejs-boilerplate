import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import ApiError from '@/lib/api-error';

import { AUTH_PUBLIC_KEY } from '@/lib/env';
import logger from '@/lib/logger';

interface AuthenticatedRequest extends Request {
  decodedAT?: JwtPayload | string;
}

export const checkAuthToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error();

    if (!authorization.startsWith('Bearer ')) throw new Error();

    const token = authorization.split(' ')[1];
    req.decodedAT = jwt.verify(token, AUTH_PUBLIC_KEY || '');

    next();
  } catch (e) {
    logger.error('Error in checkAuthToken middleware', e);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }
};

export const checkAuthRole =
  (roles: string[] = ['ADMIN']) =>
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (
        !req.decodedAT ||
        typeof req.decodedAT !== 'object' ||
        !req.decodedAT.role ||
        !roles.includes(req.decodedAT.role.toUpperCase())
      )
        throw new Error();

      next();
    } catch (e) {
      logger.error('Error in checkAuthToken middleware', e);
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
    }
  };
