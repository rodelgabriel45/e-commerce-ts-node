import express from 'express';
import {
  addAddress,
  deleteAddress,
  listAddress,
} from '../controllers/user.controller';
import { verifyUser } from '../middlewares/verifyUser';

const router = express.Router();

router.post('/address/add', verifyUser, addAddress);
router.delete('/address/delete/:id', verifyUser, deleteAddress);
router.get('/address', verifyUser, listAddress);

export default router;
