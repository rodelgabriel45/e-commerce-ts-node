import { NextFunction, Request, Response } from 'express';
import { CustomError } from '..';
import prisma from '../../prisma/db';
import { productSchema, updateProductSchema } from '../schema/products';
import { errorHandler } from '../middlewares/error';
import { CustomRequest } from '../middlewares/verifyUser';

export const createProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return next(errorHandler(400, 'Unauthorized to do admin actions'));
    }

    const validation = productSchema.safeParse({ ...req.body });

    if (!validation.success) {
      const error = validation.error.errors.map((err) => err.message);
      return next(errorHandler(400, error[0]));
    }

    const product = await prisma.product.create({
      data: {
        ...req.body,
        tags: req.body.tags.join(','),
      },
    });

    res.status(201).json(product);
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;

    const count = await prisma.product.count();
    const products = await prisma.product.findMany({
      skip,
      take: 5,
    });

    res.status(200).json({ count, data: products });
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!product) {
      return next(errorHandler(404, 'Product not found'));
    }

    res.status(200).json(product);
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};

export const deleteProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return next(errorHandler(400, 'Unauthorized to do admin actions'));
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: parseInt(req.params.id) },
    });

    res
      .status(200)
      .json({ message: 'Product deleted successfully', data: deletedProduct });
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};

export const updateProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return next(errorHandler(400, 'Unauthorized to do admin actions'));
    }

    const validation = updateProductSchema.safeParse({ ...req.body });

    if (!validation.success) {
      const error = validation.error.errors.map((err) => err.message);
      return next(errorHandler(400, error[0]));
    }

    if (req.body.tags) {
      req.body.tags = req.body.tags.join(',');
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...req.body,
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};
