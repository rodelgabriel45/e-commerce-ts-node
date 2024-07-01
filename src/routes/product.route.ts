import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../controllers/product.controller';
import { verifyUser } from '../middlewares/verifyUser';

const router = express.Router();

router.post('/create', verifyUser, createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.delete('/delete/:id', verifyUser, deleteProduct);
router.patch('/update/:id', verifyUser, updateProduct);

export default router;
