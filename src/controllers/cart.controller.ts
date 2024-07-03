import { NextFunction, Response } from 'express';
import { CustomError } from '..';
import { CustomRequest } from '../middlewares/verifyUser';
import { cartSchema, changeQuantitySchema } from '../schema/cart';
import { errorHandler } from '../middlewares/error';
import prisma from '../../prisma/db';

export const addToCart = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = cartSchema.safeParse({ ...req.body });

    if (!validation.success) {
      const error = validation.error.errors.map((err) => err.message);
      return next(errorHandler(400, error[0]));
    }

    const product = await prisma.product.findUnique({
      where: { id: req.body.productId },
    });

    if (!product) {
      return next(errorHandler(404, 'Product not found'));
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: req.user!.id,
        productId: product.id,
      },
    });

    let cartItem;
    if (existingCartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + req.body.quantity,
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.user!.id,
          productId: product.id,
          quantity: req.body.quantity,
        },
      });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};

export const deleteFromCart = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemToDelete = await prisma.cartItem.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!itemToDelete) {
      return next(errorHandler(404, 'Product not found'));
    }

    if (itemToDelete.userId !== req.user!.id) {
      return next(
        errorHandler(400, 'You can only delete items in your own cart.')
      );
    }

    await prisma.cartItem.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(200).json('Item successfully deleted');
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};

export const changeQuantity = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = changeQuantitySchema.safeParse({ ...req.body });

    if (!validation.success) {
      const error = validation.error.errors.map((err) => err.message);
      return next(errorHandler(400, error[0]));
    }

    const cartItemToUpdate = await prisma.cartItem.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!cartItemToUpdate) {
      return next(errorHandler(404, 'Cart Item not found'));
    }

    if (cartItemToUpdate.userId !== req.user!.id) {
      return next(errorHandler(400, 'You can only update your own cart.'));
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: parseInt(req.params.id) },
      data: {
        quantity: req.body.quantity,
      },
    });

    res.status(200).json(updatedCartItem);
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};

export const getCart = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = await prisma.cartItem.findMany({
      where: { userId: req.user!.id },
      include: {
        product: true,
      },
    });

    res.status(200).json(cart);
  } catch (error) {
    const err = error as CustomError;
    next(err);
  }
};
