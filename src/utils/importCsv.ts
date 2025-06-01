import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/Property';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || '');

fs.createReadStream('csv/properties.csv') // Place your file in root folder
  .pipe(csv())
  .on('data', async (row) => {
    try {
      await Property.create(row);
    } catch (err) {
      console.log('Error inserting row:', err);
    }
  })
  .on('end', () => {
    console.log('CSV imported to DB!');
    mongoose.disconnect();
  });