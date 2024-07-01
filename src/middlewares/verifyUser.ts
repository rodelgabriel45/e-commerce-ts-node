import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { errorHandler } from './error';
import { CustomError } from '..';
import prisma from '../../prisma/db';
import { User } from '@prisma/client';

export interface CustomRequest extends Request {
  user?: User;
}

export const verifyUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof payload === 'object' && 'id' in payload) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(payload.id) },
      });

      if (!user) {
        return next(errorHandler(404, 'User not found'));
      }

      req.user = user;
      next();
    } else {
      return next(errorHandler(403, 'Forbidden'));
    }
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};
