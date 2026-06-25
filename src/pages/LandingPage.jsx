import { Link } from 'react-router-dom';
import { TrendingUp, Activity, Bell, FolderTree, LineChart, Target, ArrowRight, ArrowUpRight, Check, MessageCircle, Code, Mail } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { value: 4000 }, { value: 4200 }, { value: 3800 }, { value: 5000 }, 
  { value: 5200 }, { value: 4900 }, { value: 6000 }, { value: 6500 }, 
  { value: 7200 }, { value: 6800 }, { value: 8000 }, { value: 8500 }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas-dark text-text-body font-sans selection:bg-primary/30 overflow-hidden relative">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>
      
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-surface-elevated">
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-700">
          <TrendingUp className="text-primary w-8 h-8" />
          <span className="text-2xl font-bold tracking-tight">OmniPort</span>
        </div>
        <Link 
          to="/dashboard"
          className="bg-primary text-text-on-primary px-6 py-2.5 rounded-md font-bold hover:bg-primary-active transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-primary/20 animate-in fade-in slide-in-from-top-4 duration-700 delay-100"
        >
          เข้าใช้งานระบบ
          <ArrowRight size={18} />
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copy & CTA */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-card border border-surface-elevated text-primary text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 hover:border-primary/50 transition-colors cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              Live Market Data Integrated
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.1] animate-in fade-in zoom-in-95 duration-1000 delay-150">
              The Ultimate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ffed4a]">US Stock</span> Portfolio Tracker
            </h1>
            
            <p className="text-xl md:text-2xl text-text-muted mb-12 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              เปลี่ยนการลงทุนให้เป็นเรื่องง่ายและทรงพลัง ด้วยระบบติดตามและวิเคราะห์พอร์ตหุ้นอเมริกาแบบเจาะลึก 
              แยกพอร์ตย่อยได้อิสระ พร้อมระบบแจ้งเตือนอัจฉริยะในที่เดียว
            </p>

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
              <Link 
                to="/dashboard"
                className="group relative inline-flex items-center justify-center gap-3 bg-primary text-text-on-primary px-10 py-5 rounded-xl font-bold text-lg hover:bg-primary-active transition-all hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(252,213,53,0.3)] hover:shadow-[0_0_60px_-15px_rgba(252,213,53,0.5)] overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
                <span className="relative z-10 flex items-center gap-3">
                  เข้าจัดการพอร์ตของคุณ
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>

          {/* Right: Mock UI Graphic */}
          <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-500 hidden md:block">
            {/* Background decorative blob */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full transform -rotate-12 translate-x-10 translate-y-10"></div>
            
            {/* Floating Glass Card */}
            <div className="relative bg-surface-card/80 backdrop-blur-xl border border-surface-elevated p-8 rounded-2xl shadow-2xl shadow-black/50 transform rotate-2 hover:rotate-0 transition-all duration-500">
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-text-muted font-bold mb-1">Total Global Portfolio</p>
                  <h2 className="text-5xl font-extrabold text-text-body font-sans">$142,500.00</h2>
                </div>
                <div className="bg-trading-up/10 text-trading-up px-4 py-2 rounded-lg font-bold flex items-center gap-1">
                  <ArrowUpRight size={20} />
                  +12.4%
                </div>
              </div>

              {/* Chart container */}
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FCD535" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FCD535" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#FCD535" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#heroGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Mock table rows */}
              <div className="mt-8 space-y-4">
                {[
                  { sym: 'AAPL', name: 'Apple Inc.', val: '$45,200', change: '+2.4%' },
                  { sym: 'MSFT', name: 'Microsoft Corp.', val: '$38,100', change: '+1.8%' },
                  { sym: 'IVV', name: 'iShares Core S&P 500', val: '$59,200', change: '+0.9%' }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-canvas-dark rounded-xl border border-surface-elevated/50 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center font-bold text-sm">
                        {item.sym[0]}
                      </div>
                      <div>
                        <div className="font-bold">{item.sym}</div>
                        <div className="text-xs text-text-muted">{item.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{item.val}</div>
                      <div className="text-sm text-trading-up">{item.change}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
            
            {/* Floating Mini Badges */}
            <div className="absolute -left-12 top-20 bg-canvas-dark border border-surface-elevated px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="bg-trading-up/20 p-2 rounded-full">
                <Bell size={20} className="text-trading-up" />
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold">Dividend Alert</p>
                <p className="text-sm font-bold">AAPL goes Ex-Div tomorrow</p>
              </div>
            </div>

            <div className="absolute -right-8 bottom-32 bg-canvas-dark border border-surface-elevated px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <div className="bg-primary/20 p-2 rounded-full">
                <Target size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold">DCA Target</p>
                <p className="text-sm font-bold">$1,000 / Month Achieved</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="relative bg-surface-card border-y border-surface-elevated py-32 z-10 overflow-hidden">
        {/* Subtle background glow for features */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-primary/5 blur-[150px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">ระบบที่คิดมาเพื่อ <span className="text-primary">นักลงทุนตัวจริง</span></h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">ฟีเจอร์ระดับ Pro ที่แอปเทรดทั่วไปไม่มีให้คุณ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            
            {/* Feature 1: Live Dashboard (Wide) */}
            <div className="group relative bg-canvas-dark border border-surface-elevated rounded-3xl overflow-hidden hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 animate-in fade-in zoom-in-95 duration-700 delay-100 md:col-span-2 p-8 md:p-10 flex flex-col justify-between">
              {/* Graphic background */}
              <div className="absolute right-0 bottom-0 w-2/3 h-full opacity-10 group-hover:opacity-20 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
              
              <div className="relative z-10">
                <div className="bg-surface-elevated w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <Activity size={28} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Live Dashboard & P/L</h3>
                <p className="text-text-muted leading-relaxed text-lg max-w-md">
                  ติดตามมูลค่าพอร์ตแบบ Real-time พร้อมคำนวณผลกระทบจากค่าเงิน (USD/THB) ทันที
                </p>
              </div>

              {/* Mini UI Snippet */}
              <div className="absolute -bottom-6 -right-6 md:right-8 bg-surface-card border border-surface-elevated p-4 rounded-xl shadow-xl w-64 group-hover:-translate-y-2 transition-transform duration-500">
                <p className="text-xs text-text-muted mb-1">Unrealized P/L</p>
                <p className="text-2xl font-bold text-trading-up">+$12,450 <span className="text-sm">USD</span></p>
                <div className="text-xs text-trading-down mt-1">FX Impact: -1.2% (THB)</div>
              </div>
            </div>

            {/* Feature 2: Smart Alerts (Tall) */}
            <div className="group relative bg-canvas-dark border border-surface-elevated rounded-3xl overflow-hidden hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 animate-in fade-in zoom-in-95 duration-700 delay-200 md:row-span-2 p-8 md:p-10 flex flex-col">
              <div className="bg-surface-elevated w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Bell size={28} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Smart Alerts</h3>
              <p className="text-text-muted leading-relaxed text-lg mb-8">
                คอยเตือนจังหวะปรับพอร์ต (Rebalance), วันปันผล XD และเตือนโอกาสทำ Tax-Loss Harvesting
              </p>

              {/* Stack of mock alerts */}
              <div className="mt-auto space-y-3 relative z-10">
                <div className="bg-surface-card border border-surface-elevated p-3 rounded-lg flex items-center gap-3 transform group-hover:-translate-y-2 transition-transform duration-500 delay-75">
                  <div className="w-2 h-2 rounded-full bg-trading-up"></div>
                  <span className="text-sm font-bold">AAPL Ex-Dividend</span>
                </div>
                <div className="bg-surface-card border border-surface-elevated p-3 rounded-lg flex items-center gap-3 transform group-hover:-translate-y-2 transition-transform duration-500 delay-150">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm font-bold">Tech Sector &gt; 40%</span>
                </div>
                <div className="bg-surface-card border border-surface-elevated p-3 rounded-lg flex items-center gap-3 transform group-hover:-translate-y-2 transition-transform duration-500 delay-200">
                  <div className="w-2 h-2 rounded-full bg-trading-down"></div>
                  <span className="text-sm font-bold">TSLA down &gt; 15% (Tax)</span>
                </div>
              </div>
            </div>

            {/* Feature 3: Multi-Portfolio (Square) */}
            <div className="group relative bg-canvas-dark border border-surface-elevated rounded-3xl overflow-hidden hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 animate-in fade-in zoom-in-95 duration-700 delay-300 p-8 flex flex-col justify-center">
              <div className="bg-surface-elevated w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <FolderTree size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Multi-Portfolio</h3>
              <p className="text-text-muted leading-relaxed">
                แยกกลยุทธ์การลงทุนได้อิสระ (พอร์ตระยะยาว, พอร์ตซิ่ง) ดูรวมหรือแยกก็ได้
              </p>
            </div>

            {/* Feature 4: Pro Analytics (Square) */}
            <div className="group relative bg-canvas-dark border border-surface-elevated rounded-3xl overflow-hidden hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 animate-in fade-in zoom-in-95 duration-700 delay-400 p-8 flex flex-col justify-center">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary to-transparent"></div>
              <div className="relative z-10">
                <div className="bg-surface-elevated w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <LineChart size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Pro Analytics</h3>
                <p className="text-text-muted leading-relaxed">
                  วัดความผันผวน (Beta), Max Drawdown และเทียบ Benchmark
                </p>
              </div>
            </div>

            {/* Feature 5: DCA Tracker (Wide Bottom) */}
            <div className="group relative bg-canvas-dark border border-surface-elevated rounded-3xl overflow-hidden hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 animate-in fade-in zoom-in-95 duration-700 delay-500 md:col-span-3 p-8 md:p-10 flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2">
                <div className="bg-surface-elevated w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <Target size={28} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">DCA Tracker & Forecast</h3>
                <p className="text-text-muted leading-relaxed text-lg">
                  ระบบติดตามวินัยการออม (DCA) รายเดือน พร้อม AI จำลองคาดการณ์การเติบโตแบบ Logarithmic Trend ในระยะยาว 1-5 ปี
                </p>
              </div>
              
              {/* Mock DCA Progress Bar */}
              <div className="w-full md:w-1/2 bg-surface-card border border-surface-elevated p-6 rounded-2xl group-hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-text-muted text-sm font-bold">เป้าหมายลงทุนเดือนนี้</p>
                    <p className="text-xl font-bold">$750 / $1,000</p>
                  </div>
                  <span className="text-primary font-bold text-xl">75%</span>
                </div>
                <div className="w-full bg-canvas-dark h-4 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ultra Premium CTA Section */}
      <section className="relative w-full py-40 mt-20 overflow-hidden border-t border-surface-elevated flex items-center justify-center min-h-[70vh]">
        
        {/* Deep Animated Background */}
        <div className="absolute inset-0 bg-canvas-dark"></div>
        
        {/* CSS Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)'
          }}
        ></div>

        {/* Ambient Moving Glows */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-[30rem] h-[30rem] bg-[#ffed4a]/10 rounded-full blur-[150px] -translate-y-1/2 animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>

        {/* Floating Success Metric 1 */}
        <div className="absolute top-32 left-10 md:left-32 bg-surface-card border border-surface-elevated px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 transform -rotate-6 animate-bounce hidden md:flex" style={{ animationDuration: '5s' }}>
          <div className="bg-trading-up/20 p-3 rounded-xl">
            <TrendingUp size={24} className="text-trading-up" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">YTD Return</p>
            <p className="text-xl font-extrabold text-trading-up">+24.8%</p>
          </div>
        </div>

        {/* Floating Success Metric 2 */}
        <div className="absolute bottom-32 right-10 md:right-32 bg-surface-card border border-surface-elevated px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 transform rotate-6 animate-bounce hidden md:flex" style={{ animationDuration: '6s', animationDelay: '1s' }}>
          <div className="bg-primary/20 p-3 rounded-xl">
            <Target size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Passive Income</p>
            <p className="text-xl font-extrabold text-white">$450 / Mo</p>
          </div>
        </div>

        {/* Main Content Center */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated/50 border border-primary/30 text-primary text-sm font-bold mb-10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            Stop Tracking. Start Mastering.
          </div>
          
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
            Take Control of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCD535] via-[#ffed4a] to-[#ffffff] bg-[length:200%_auto] animate-[pulse_4s_ease-in-out_infinite]">
              Your Wealth
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-text-muted mb-12 max-w-2xl leading-relaxed font-medium">
            แพลตฟอร์มการจัดการพอร์ตโฟลิโอที่หลอมรวมความเรียบง่าย เข้ากับเครื่องมือวิเคราะห์เชิงลึกระดับสถาบัน
          </p>
          
          <div className="relative group">
            {/* Massive button glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-[#ffed4a] rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            
            <Link 
              to="/dashboard"
              className="relative flex items-center justify-center gap-4 bg-surface-card border-2 border-primary text-white px-14 py-6 rounded-2xl font-black text-2xl transition-all duration-300 hover:bg-primary hover:text-black overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-4">
                LAUNCH OMNIPORT
                <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Link>
          </div>
          
          <div className="mt-8 flex items-center gap-6 text-sm text-text-muted font-semibold">
            <span className="flex items-center gap-2"><Check size={16} className="text-primary"/> No Credit Card Required</span>
            <span className="flex items-center gap-2"><Check size={16} className="text-primary"/> Real-time Market Data</span>
          </div>

        </div>
      </section>

      {/* Global Footer */}
      <footer className="border-t border-surface-elevated bg-canvas-dark pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-primary w-8 h-8" />
                <span className="text-2xl font-bold tracking-tight text-white">OmniPort</span>
              </div>
              <p className="text-text-muted leading-relaxed max-w-sm mb-8">
                สุดยอดระบบติดตามและบริหารจัดการพอร์ตโฟลิโอหุ้นอเมริกา 
                ออกแบบมาเพื่อให้นักลงทุนรายย่อยมีเครื่องมือระดับมืออาชีพ
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-surface-card border border-surface-elevated flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 transition-colors">
                  <MessageCircle size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-surface-card border border-surface-elevated flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 transition-colors">
                  <Code size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-surface-card border border-surface-elevated flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 transition-colors">
                  <Mail size={18} />
                </a>
              </div>
            </div>

            {/* Links Column 1 */}
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Features</a></li>
                <li><a href="#" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Live Dashboard</a></li>
                <li><a href="#" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Smart Alerts</a></li>
                <li><a href="#" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Pricing (Free)</a></li>
              </ul>
            </div>

            {/* Links Column 2 */}
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-text-muted hover:text-white transition-colors text-sm font-medium">Privacy Policy</a></li>
                <li><a href="#" className="text-text-muted hover:text-white transition-colors text-sm font-medium">Terms of Service</a></li>
                <li><a href="#" className="text-text-muted hover:text-white transition-colors text-sm font-medium">Cookie Policy</a></li>
              </ul>
            </div>
            
          </div>

          {/* Copyright Row */}
          <div className="pt-8 border-t border-surface-elevated flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-muted text-sm font-medium">
              &copy; {new Date().getFullYear()} OmniPort Tracker. All rights reserved.
            </p>
            <div className="text-text-muted text-sm font-medium flex items-center gap-1">
              Made with <span className="text-primary">♥</span> for Investors
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
