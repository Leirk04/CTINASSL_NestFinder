import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

// Route modules
import authRoutes from './src/routes/auth.js';
import visitRoutes from './src/routes/visits.js';
// Middleware
import { globalLimiter, authLimiter } from './src/middleware/rateLimiter.js';
// DB config
import { connectDB } from './src/config/db.js';

// Load environment variables 
dotenv.config();

const app = express();

// Add standard security headers
app.use(helmet());

// Allow requests only from local dev frontends (adjust origins when you deploy)
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost',
    ],
  })
);

// Parse incoming JSON bodies (for login, register, schedule visit, etc.)
app.use(express.json());

// Apply middlewares and routes
app.use(globalLimiter);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/visits', visitRoutes);

// Simple health‑check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Villa API running' });
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
