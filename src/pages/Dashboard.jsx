import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { ArrowRightLeft, TrendingUp, Settings, Clock, Newspaper } from 'lucide-react'
import TransactionModal from '../components/TransactionModal'
import DashboardSummary from '../components/DashboardSummary'
import HoldingsTable from '../components/HoldingsTable'
import TransactionHistory from '../components/TransactionHistory'
import SectorHeatmap from '../components/SectorHeatmap'
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard'
import SmartAlerts from '../components/SmartAlerts'
import MonthlyDCATracker from '../components/MonthlyDCATracker'
import TopMovers from '../components/TopMovers'
import PortfolioModal from '../components/PortfolioModal'
import PortfolioSelector from '../components/PortfolioSelector'
import WelcomeGuideModal from '../components/WelcomeGuideModal'
import NewsDashboard from '../components/news/NewsDashboard'

export default function Dashboard() {
  const [serverStatus, setServerStatus] = useState('Connecting...')
  const [data, setData] = useState(null)
  const [deepData, setDeepData] = useState(null)
  const [newsData, setNewsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState(null)
  const [currency, setCurrency] = useState('USD')
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard', 'analytics'
  const [dcaTarget, setDcaTarget] = useState(1000)
  const [portfolios, setPortfolios] = useState([])
  const [activePortfolioId, setActivePortfolioId] = useState('global')
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchPortfolios = useCallback(async () => {
    try {
      const res = await axios.get('/api/portfolios')
      setPortfolios(res.data)
    } catch (err) {
      console.error('Failed to fetch portfolios', err)
    }
  }, [])

  useEffect(() => {
    fetchPortfolios()
  }, [fetchPortfolios])

  useEffect(() => {
    const saved = localStorage.getItem('omniport_dca_target')
    if (saved) setDcaTarget(Number(saved))
  }, [])

  const fetchData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true)
      // Test basic server connection
      const testRes = await axios.get('/api/test')
      setServerStatus(testRes.data.message)

      // Fetch core dashboard data first to make loading significantly faster
      const txRes = await axios.get(`/api/transactions?portfolioId=${activePortfolioId}`)
      setData(txRes.data)
      
      // Fetch heavy data in the background so it doesn't block the UI
      if (!isBackground) {
        axios.get(`/api/analytics/deep?portfolioId=${activePortfolioId}`)
          .then(res => setDeepData(res.data))
          .catch(e => { console.error('Deep analytics failed', e); setDeepData(null); });
          
        const activeSymbols = [...new Set((txRes.data.holdings || []).filter(h => h.totalShares > 0).map(h => h.symbol))];
        if (activeSymbols.length > 0) {
          axios.post('/api/market/news', { symbols: activeSymbols })
            .then(res => setNewsData(res.data.news || []))
            .catch(e => { console.error('News failed', e); setNewsData([]); });
        } else {
          setNewsData([]);
        }
      }
    } catch (err) {
      console.error(err)
      setServerStatus('Failed to connect to backend.')
    } finally {
      if (!isBackground) setLoading(false)
    }
  }, [activePortfolioId])

  useEffect(() => {
    fetchData()
    // Poll for live data every 60 seconds
    const intervalId = setInterval(() => {
      fetchData(true)
    }, 60000)
    return () => clearInterval(intervalId)
  }, [fetchData, activePortfolioId])

  return (
    <div className="min-h-screen bg-canvas-dark">
      {/* Top Navigation Bar — full width, flat separation */}
      <header className="border-b border-surface-elevated bg-surface-card">
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between h-14">
          
          {/* Left: Logo + Nav Tabs */}
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-text-body font-sans flex items-center gap-2 tracking-tight">
              <TrendingUp className="text-primary" size={20} />
              OmniPort
            </h1>
            
            <div className="h-5 w-px bg-surface-elevated"></div>
            
            <nav className="flex items-center gap-1">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 font-semibold text-sm transition-colors rounded-md ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text-body'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1.5 font-semibold text-sm transition-colors rounded-md ${activeTab === 'analytics' ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text-body'}`}
              >
                Deep Analytics
              </button>
              <button 
                onClick={() => setActiveTab('news')}
                className={`px-3 py-1.5 font-semibold text-sm transition-colors rounded-md ${activeTab === 'news' ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text-body'}`}
              >
                News
              </button>
            </nav>
          </div>

          {/* Right: Time + Portfolio Selector + Add Transaction */}
          <div className="flex gap-4 items-center">
            
            <div className="hidden md:flex items-center gap-1.5 text-text-muted px-2">
              <Clock size={14} className="opacity-70" />
              <span className="text-xs font-tabular font-medium">
                {currentTime.toLocaleTimeString('en-GB', { timeZone: 'Asia/Bangkok' })} BKK
              </span>
            </div>

            <div className="flex items-center bg-canvas-dark border border-surface-elevated rounded-lg">
              <PortfolioSelector 
                portfolios={portfolios} 
                activeId={activePortfolioId} 
                onChange={setActivePortfolioId} 
              />
              <div className="w-px h-5 bg-surface-elevated"></div>
              <button 
                onClick={() => setIsPortfolioModalOpen(true)}
                className="p-2 text-text-muted hover:text-primary rounded-md transition-colors"
                title="Manage Portfolios"
              >
                <Settings size={16} />
              </button>
            </div>

            <button 
              onClick={() => {
                setTransactionToEdit(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-primary text-text-on-primary px-4 py-2 rounded-md font-bold text-sm hover:bg-primary-active transition-colors"
            >
              <ArrowRightLeft size={16} />
              Add Transaction
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1440px] mx-auto px-6 py-6">

        {activeTab === 'dashboard' && (
          <>
            {/* Summary Cards — Full Width */}
            <DashboardSummary summary={data?.summary} loading={loading} currency={currency} setCurrency={setCurrency} />
            
            {/* 8/4 Grid Layout */}
            <div className="grid grid-cols-12 gap-6">
              
              {/* Left Column: 8 cols — Primary content */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                <HoldingsTable data={data} loading={loading} currency={currency} />
                <TransactionHistory 
                  transactions={data?.rawTransactions} 
                  loading={loading} 
                  onRefresh={fetchData} 
                  onEdit={(t) => {
                    setTransactionToEdit(t);
                    setIsModalOpen(true);
                  }}
                />
              </div>

              {/* Right Column: 4 cols — Sidebar widgets */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <SmartAlerts alerts={(() => {
                  const dynamicAlerts = [...(data?.summary?.smartAlerts || [])];
                  if (data && data.summary.totalValue > 0 && data.summary.currentMonthInvested < dcaTarget) {
                    dynamicAlerts.push({
                      type: 'neutral',
                      message: `Monthly DCA target pending: $${data.summary.currentMonthInvested.toLocaleString()} / $${dcaTarget.toLocaleString()}`
                    });
                  }
                  return dynamicAlerts;
                })()} />

                <MonthlyDCATracker 
                  invested={data?.summary?.currentMonthInvested} 
                  target={dcaTarget} 
                  onTargetChange={(val) => {
                    setDcaTarget(val);
                    localStorage.setItem('omniport_dca_target', val);
                  }}
                />

                <TopMovers gainers={data?.summary?.topGainers} losers={data?.summary?.topLosers} />
                
                <SectorHeatmap data={data} loading={loading} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard data={data} currency={currency} deepData={deepData} />
        )}

        {activeTab === 'news' && (
          <NewsDashboard holdings={data?.holdings} newsData={newsData} />
        )}
      </main>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
        initialData={transactionToEdit}
        holdings={data?.holdings}
        portfolios={portfolios}
        activePortfolioId={activePortfolioId}
      />

      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        portfolios={portfolios}
        fetchPortfolios={fetchPortfolios}
        activePortfolioId={activePortfolioId}
        setActivePortfolioId={setActivePortfolioId}
      />

      <WelcomeGuideModal />
    </div>
  )
}
