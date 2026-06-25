import express from 'express';
import Portfolio from '../models/Portfolio.js';

const router = express.Router();

// Get all portfolios
router.get('/', async (req, res) => {
  try {
    const portfolios = await Portfolio.find().sort({ createdAt: 1 });
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new portfolio
router.post('/', async (req, res) => {
  try {
    const { name, description, targetStrategy } = req.body;
    const newPortfolio = new Portfolio({
      name,
      description,
      targetStrategy
    });
    const saved = await newPortfolio.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a portfolio
import Transaction from '../models/Transaction.js';

router.delete('/:id', async (req, res) => {
  try {
    // Check if any transactions are linked to this portfolio
    const linkedTxCount = await Transaction.countDocuments({ portfolioId: req.params.id });
    if (linkedTxCount > 0) {
      return res.status(400).json({ error: `Cannot delete: ${linkedTxCount} transactions are linked to this portfolio. Please reassign or delete them first.` });
    }

    const deleted = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Portfolio not found' });
    
    res.json({ message: 'Portfolio deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
