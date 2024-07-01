import express from 'express';
import { getMe, login, signup } from '../controllers/auth.controller';
import { verifyUser } from '../middlewares/verifyUser';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', verifyUser, getMe);

export default router;
