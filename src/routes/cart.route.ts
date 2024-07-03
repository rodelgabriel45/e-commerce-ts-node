import express from 'express';
import { verifyUser } from '../middlewares/verifyUser';
import {
  addToCart,
  changeQuantity,
  deleteFromCart,
  getCart,
} from '../controllers/cart.controller';

const router = express.Router();

router.post('/add', verifyUser, addToCart);
router.delete('/:id', verifyUser, deleteFromCart);
router.patch('/:id', verifyUser, changeQuantity);
router.get('/', verifyUser, getCart);

export default router;
