import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['BUY', 'SELL'],
    default: 'BUY'
  },
  shares: {
    type: Number,
    required: true,
  },
  buyPrice: {
    type: Number,
    required: true,
  },
  tradeDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  // Added for analytics based on function.md
  exchangeRateAtTrade: {
    type: Number, // USD/THB rate at trade date
  },
  benchmarkPriceAtTrade: {
    type: Number,
    required: false
  },
  realizedPl: {
    type: Number,
    required: false
  },
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: false // Optional for legacy transactions, but ideally required for new ones
  }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
