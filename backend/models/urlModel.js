import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  visits: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Url', UrlSchema);