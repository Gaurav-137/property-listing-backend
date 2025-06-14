import mongoose from 'mongoose';
const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
});
export default mongoose.model('Favorite', favoriteSchema);