import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { errors } from 'celebrate'; 
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

const app = express();

// Middleware
app.use(logger);
app.use(express.json());
app.use(cors());

// Routes
app.use(notesRoutes);

// 404
app.use(notFoundHandler);

app.use(errors());

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});