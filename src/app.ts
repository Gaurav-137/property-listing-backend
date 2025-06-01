import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import recommendRoutes from './routes/recommendRoutes';
import redis from './config/redis'; // ✅ Now this works

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recommend', recommendRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  // Graceful shutdown
  shutdown();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Graceful shutdown
  shutdown();
});

// Graceful shutdown function
const shutdown = async () => {
  try {
    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }

    // Close Redis connection
    await redis.quit();
    console.log('Redis connection closed');

    // Exit process
    process.exit(1);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Default route
app.get('/', (req, res) => {
  res.send('✅ Property Listing Backend API is live');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;