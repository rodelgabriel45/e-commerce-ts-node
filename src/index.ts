import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route';
import productRoutes from './routes/product.route';
import userRoutes from './routes/user.route';
import cartRoutes from './routes/cart.route';

const app: Express = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

export interface CustomError extends Error {
  statusCode: number;
  message: string;
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);

// Error handling middleware
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.log(err);

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
