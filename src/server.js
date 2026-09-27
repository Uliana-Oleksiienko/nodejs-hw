import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import pinoHttp from 'pino-http';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(
  pinoHttp({
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  })
);

// Routes
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// Test error route
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// 404 middleware
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// 500 error middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});