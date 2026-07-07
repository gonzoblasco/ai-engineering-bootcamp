import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

export const app = express();

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);