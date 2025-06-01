import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import connectDB from './config/db';
require('dotenv').config(); // For local .env

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
connectDB();

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

