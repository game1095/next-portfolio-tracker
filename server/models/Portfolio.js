import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  targetStrategy: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

export default mongoose.model('Portfolio', portfolioSchema);
