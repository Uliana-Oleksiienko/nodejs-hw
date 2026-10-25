import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(logger);
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

app.use(authRoutes);
app.use(notesRoutes);
app.use(userRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

await connectMongoDB();

app.listen(PORT, '0.0.0.0', () => { 
  console.log(`Server is running on port ${PORT}`);
});