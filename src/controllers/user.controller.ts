import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma/db';
import { addressSchema } from '../schema/address';
import { errorHandler } from '../middlewares/error';
import { CustomRequest } from '../middlewares/verifyUser';
import { CustomError } from '..';

export const addAddress = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = addressSchema.safeParse({ ...req.body });

    if (!validation.success) {
      const error = validation.error.errors.map((err) => err.message);
      return next(errorHandler(400, error[0]));
    }

    const address = await prisma.address.create({
      data: {
        ...req.body,
        userId: req.user!.id,
      },
    });

    res.status(201).json(address);
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};

export const deleteAddress = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const addressToBeDeleted = await prisma.address.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!addressToBeDeleted) {
      return next(errorHandler(404, 'Address not found'));
    }

    if (addressToBeDeleted.userId !== req.user!.id) {
      return next(errorHandler(400, 'You can only delete your own address'));
    }

    await prisma.address.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(200).json('Address deleted successfully');
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};

export const listAddress = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
    });

    res.status(200).json(addresses);
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};
