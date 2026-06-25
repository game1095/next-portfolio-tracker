import { useState } from 'react';
import { X, Trash2, Plus, Folder } from 'lucide-react';
import axios from 'axios';

export default function PortfolioModal({ isOpen, onClose, portfolios, fetchPortfolios, activePortfolioId, setActivePortfolioId }) {
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newPortfolioName.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/portfolios', {
        name: newPortfolioName.trim(),
        description: '',
        targetStrategy: ''
      });
      setNewPortfolioName('');
      await fetchPortfolios();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this portfolio?")) return;
    
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/portfolios/${id}`);
      if (activePortfolioId === id) {
        setActivePortfolioId('global');
      }
      await fetchPortfolios();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0e11]/90 p-4">
      <div className="bg-surface-card w-full max-w-md rounded-xl border border-surface-elevated overflow-hidden">
        
        <div className="flex justify-between items-center p-4 border-b border-surface-elevated bg-canvas-dark">
          <h2 className="text-xl font-bold text-text-body font-sans flex items-center gap-2">
            <Folder className="text-primary" size={20} />
            Manage Portfolios
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-body transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-trading-down/10 border border-trading-down/20 text-trading-down px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold text-text-muted mb-3 uppercase tracking-wider">Your Portfolios</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {portfolios.map(p => (
                <div key={p._id} className="flex items-center justify-between bg-canvas-dark p-3 rounded-lg border border-surface-elevated">
                  <span className="font-semibold text-text-body">{p.name}</span>
                  <button 
                    onClick={() => handleDelete(p._id)}
                    disabled={loading}
                    className="text-text-muted hover:text-trading-down transition-colors"
                    title="Delete Portfolio"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {portfolios.length === 0 && (
                <p className="text-text-muted text-sm text-center py-4">No portfolios created yet.</p>
              )}
            </div>
          </div>

          <div className="border-t border-surface-elevated pt-4">
            <form onSubmit={handleCreate} className="flex gap-2">
              <input 
                type="text" 
                placeholder="New portfolio name..." 
                value={newPortfolioName}
                onChange={(e) => setNewPortfolioName(e.target.value)}
                className="flex-1 bg-canvas-dark border border-surface-elevated rounded-lg px-4 py-2 text-text-body focus:outline-none focus:border-primary transition-colors text-sm"
                required
              />
              <button 
                type="submit" 
                disabled={loading || !newPortfolioName.trim()}
                className="bg-primary text-text-on-primary px-4 py-2 rounded-md font-bold hover:bg-primary-active transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
              >
                <Plus size={18} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
