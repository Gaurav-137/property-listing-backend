import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!, {
      // Add these connection options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Handle connection errors
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Handle disconnection
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

export default connectDB;