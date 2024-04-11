import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import ApiError from '../../lib/ApIError';
import httpStatus from 'http-status';

import { AUTH_PUBLIC_KEY } from '../../lib/env';

export const checkAuthToken = asyncHandler(async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error();

    if (!authorization.startsWith('Bearer ')) throw new Error();

    const token = authorization.split(' ')[1];
    (req as any).decodedAT = jwt.verify(token, AUTH_PUBLIC_KEY || '');

    next();
  } catch (e) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }
});

export const checkAuthRole = (roles = ['ADMIN']) =>
  asyncHandler(async (req, res, next) => {
    try {
      if (
        !(req as any).decodedAT ||
        !(req as any).decodedAT.role ||
        !roles.includes((req as any).decodedAT.role.toUpperCase())
      )
        throw new Error();

      next();
    } catch (e) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
    }
  });
