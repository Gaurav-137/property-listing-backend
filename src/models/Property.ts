import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  city: String,
  state: String,
  country: String,
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  type: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);