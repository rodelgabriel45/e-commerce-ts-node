import { NextFunction, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { CustomError } from '..';
import prisma from '../../prisma/db';
import { errorHandler } from '../middlewares/error';
import { signUpSchema } from '../schema/users';
import { User } from '@prisma/client';
import { CustomRequest } from '../middlewares/verifyUser';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    const validation = signUpSchema.safeParse({ email, password, name });

    if (!validation.success) {
      const error = validation.error.errors.map((err) => err.message);
      return next(errorHandler(400, error[0]));
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return next(errorHandler(400, 'User already exists'));
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(errorHandler(400, 'Invalid Credentials'));
    }

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return next(errorHandler(400, 'Invalid Credentials'));
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
    const { password: _, ...userWithoutPassword } = user;

    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(userWithoutPassword);
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};

export const getMe = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, ...rest } = req.user!;
    res.status(200).json(rest);
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};
