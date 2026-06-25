import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import axios from 'axios'

export default function TransactionModal({ isOpen, onClose, onSuccess, initialData = null, holdings = [], portfolios = [], activePortfolioId = '' }) {
  const [formData, setFormData] = useState({
    type: 'BUY',
    symbol: '',
    shares: '',
    buyPrice: '',
    tradeDate: new Date().toISOString().split('T')[0],
    portfolioId: activePortfolioId === 'global' && portfolios?.length > 0 ? portfolios[0]._id : activePortfolioId
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        type: initialData.type || 'BUY',
        symbol: initialData.symbol,
        shares: initialData.shares,
        buyPrice: initialData.buyPrice,
        tradeDate: new Date(initialData.tradeDate).toISOString().split('T')[0],
        portfolioId: initialData.portfolioId || (portfolios?.length > 0 ? portfolios[0]._id : '')
      })
    } else if (!isOpen) {
      setFormData({
        type: 'BUY',
        symbol: '',
        shares: '',
        buyPrice: '',
        tradeDate: new Date().toISOString().split('T')[0],
        portfolioId: activePortfolioId === 'global' && portfolios?.length > 0 ? portfolios[0]._id : activePortfolioId
      })
    }
  }, [initialData, isOpen, activePortfolioId, portfolios])

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!formData.symbol || !formData.shares || !formData.buyPrice || !formData.tradeDate || !formData.portfolioId) {
        throw new Error('Please fill in all fields')
      }

      const payload = {
        type: formData.type,
        symbol: formData.symbol.toUpperCase(),
        shares: Number(formData.shares),
        buyPrice: Number(formData.buyPrice),
        tradeDate: formData.tradeDate,
        portfolioId: formData.portfolioId
      }

      if (initialData) {
        await axios.put(`/api/transactions/${initialData._id}`, payload)
      } else {
        await axios.post('/api/transactions', payload)
      }
      
      onSuccess()
      onClose()
      setFormData({
        type: 'BUY',
        symbol: '',
        shares: '',
        buyPrice: '',
        tradeDate: new Date().toISOString().split('T')[0],
        portfolioId: activePortfolioId === 'global' && portfolios?.length > 0 ? portfolios[0]._id : activePortfolioId
      })
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0e11]/80 p-4">
      <div className="bg-surface-card w-full max-w-md rounded-xl border border-surface-elevated relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-body transition-colors"
        >
          <X size={18} />
        </button>
        
        <div className="p-5 border-b border-surface-elevated">
          <h2 className="text-lg font-bold font-sans text-text-body">{initialData ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <p className="text-xs text-text-muted mt-1">{initialData ? 'Update your stock purchase details.' : 'Record a new stock purchase.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">Portfolio</label>
            <select
              name="portfolioId"
              value={formData.portfolioId || ''}
              onChange={handleChange}
              className="w-full bg-canvas-dark border border-surface-elevated rounded-lg px-3 py-2 text-sm text-text-body focus:outline-none focus:border-primary transition-colors"
              required
            >
              <option value="" disabled>Select Portfolio</option>
              {portfolios?.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-trading-down/10 border border-trading-down/20 text-trading-down px-3 py-2 rounded-md text-xs font-medium">
              {error}
            </div>
          )}

          <div className="flex bg-surface-elevated rounded-lg p-1">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'BUY' })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${formData.type === 'BUY' ? 'bg-trading-up text-[#ffffff]' : 'text-text-muted hover:text-text-body'}`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'SELL' })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${formData.type === 'SELL' ? 'bg-trading-down text-[#ffffff]' : 'text-text-muted hover:text-text-body'}`}
            >
              SELL
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">Ticker Symbol</label>
            {formData.type === 'SELL' ? (
              <select
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                className="w-full bg-canvas-dark border border-surface-elevated rounded-lg px-3 py-2 text-sm text-text-body focus:outline-none focus:border-primary uppercase transition-colors appearance-none"
              >
                <option value="" disabled>Select an asset to sell</option>
                {holdings.filter(h => h.totalShares > 0).map(h => (
                  <option key={h.symbol} value={h.symbol}>
                    {h.symbol} ({h.totalShares} shares available)
                  </option>
                ))}
              </select>
            ) : (
              <input 
                type="text" 
                name="symbol"
                placeholder="e.g. AAPL"
                value={formData.symbol}
                onChange={handleChange}
                className="w-full bg-canvas-dark border border-surface-elevated rounded-lg px-3 py-2 text-sm text-text-body focus:outline-none focus:border-primary uppercase transition-colors"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">Shares</label>
              <input 
                type="number" 
                name="shares"
                placeholder="0"
                step="any"
                min="0.00001"
                value={formData.shares}
                onChange={handleChange}
                className="w-full bg-canvas-dark border border-surface-elevated rounded-lg px-3 py-2 text-sm text-text-body focus:outline-none focus:border-primary transition-colors font-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">{formData.type === 'BUY' ? 'Buy Price ($)' : 'Sell Price ($)'}</label>
              <input 
                type="number" 
                name="buyPrice"
                placeholder="0.00"
                step="any"
                min="0.01"
                value={formData.buyPrice}
                onChange={handleChange}
                className="w-full bg-canvas-dark border border-surface-elevated rounded-lg px-3 py-2 text-sm text-text-body focus:outline-none focus:border-primary transition-colors font-tabular"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">Trade Date</label>
            <input 
              type="date" 
              name="tradeDate"
              value={formData.tradeDate}
              onChange={handleChange}
              className="w-full bg-canvas-dark border border-surface-elevated rounded-lg px-3 py-2 text-sm text-text-body focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-text-on-primary font-bold py-2.5 rounded-md hover:bg-primary-active transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Transaction')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
