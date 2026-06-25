import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import transactionRoutes from './routes/transactions.js';
import marketRoutes from './routes/market.js';
import analyticsRoutes from './routes/analytics.js';
import portfolioRoutes from './routes/portfolios.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

import Portfolio from './models/Portfolio.js';

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not defined in .env file. Running without DB connection.");
} else {
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB');
      // Ensure at least one default portfolio exists
      const count = await Portfolio.countDocuments();
      if (count === 0) {
        await Portfolio.create({
          name: 'My Default Portfolio',
          description: 'Auto-created base portfolio',
          targetStrategy: 'Long-term Growth'
        });
        console.log('Created default portfolio');
      }
    })
    .catch((err) => console.error('MongoDB connection error:', err));
}

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/portfolios', portfolioRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Express server is running and accessible!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
