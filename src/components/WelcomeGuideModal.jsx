import { useState, useEffect } from 'react';
import { Rocket, Lightbulb, TrendingUp, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const slides = [
  {
    icon: <Rocket className="text-primary w-12 h-12 mb-4" />,
    title: 'ยินดีต้อนรับสู่ OmniPort 🚀',
    subtitle: 'ศูนย์บัญชาการพอร์ตหุ้นต่างประเทศของคุณ',
    items: [
      'ติดตามมูลค่าพอร์ตและกำไร/ขาดทุนแบบ Real-time ทันทีที่เปิดแอป',
      'Multi-Portfolio: แยกพอร์ตการลงทุนได้อิสระ (เช่น พอร์ตซิ่ง, พอร์ตปันผล) และดูภาพรวมได้ในหน้าเดียว',
      'Monthly DCA Tracker: ตั้งเป้าหมายออมเงินประจำเดือนและติดตามความคืบหน้าให้ไปถึงเส้นชัย'
    ]
  },
  {
    icon: <Lightbulb className="text-primary w-12 h-12 mb-4" />,
    title: 'ผู้ช่วยแจ้งเตือนอัจฉริยะ 💡',
    subtitle: 'ให้ระบบช่วยจับตาดูโอกาสและความเสี่ยงแทนคุณ (Smart Alerts)',
    items: [
      'Rebalance Alert: แจ้งเตือนเมื่อสัดส่วนหุ้นบางตัวหรือกลุ่มอุตสาหกรรม เริ่มเยอะเกินลิมิตที่คุณรับได้',
      'Dividend & Events: คอยเตือนวันขึ้นเครื่องหมาย XD เพื่อไม่ให้พลาดปันผลสำคัญ',
      'Tax-Loss Harvesting: ช่วยค้นหาโอกาสประหยัดภาษี เมื่อมีหุ้นตกหนักถึงเกณฑ์ที่ตั้งไว้'
    ]
  },
  {
    icon: <TrendingUp className="text-primary w-12 h-12 mb-4" />,
    title: 'เครื่องมือวิเคราะห์ระดับโปร 📊',
    subtitle: 'เจาะลึกทุกมิติของการลงทุนด้วย Pro Analytics',
    items: [
      'Currency Impact (FX P/L): แยกผลกำไรของตัวหุ้น ออกจากผลกระทบของค่าเงินบาท (USD/THB) ได้ชัดเจน',
      'Performance Benchmarking: เทียบผลตอบแทนพอร์ตของคุณกับดัชนีตลาด (เช่น S&P 500) เพื่อวัดฝีมือ',
      'Portfolio Beta: วัดระดับความผันผวนและความเสี่ยงรวมของพอร์ตคุณเมื่อเทียบกับตลาดรวม'
    ]
  }
];

export default function WelcomeGuideModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('omniport_welcome_seen');
    if (!hasSeenGuide) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('omniport_welcome_seen', 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  const slide = slides[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0e11]/90 p-4">
      <div className="bg-surface-card w-full max-w-lg rounded-xl border border-surface-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        <div className="p-8 flex flex-col items-center text-center">
          {slide.icon}
          <h2 className="text-2xl font-bold text-text-body font-sans mb-2">{slide.title}</h2>
          <p className="text-text-muted text-sm font-semibold mb-6">{slide.subtitle}</p>
          
          <div className="space-y-4 w-full text-left">
            {slide.items.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start bg-canvas-dark p-4 rounded-lg border border-surface-elevated">
                <Check className="text-trading-up shrink-0 mt-0.5" size={18} />
                <span className="text-text-body text-sm leading-relaxed font-sans">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-canvas-dark border-t border-surface-elevated">
          
          {/* Progress Indicators */}
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-primary' : 'w-2 bg-surface-elevated'}`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button 
                onClick={handlePrev}
                className="px-4 py-2 text-text-muted hover:text-text-body font-bold text-sm transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={16} /> ย้อนกลับ
              </button>
            )}
            
            <button 
              onClick={handleNext}
              className="px-5 py-2.5 bg-primary text-text-on-primary rounded-md font-bold text-sm hover:bg-primary-active transition-colors flex items-center gap-1"
            >
              {currentStep === slides.length - 1 ? 'เริ่มต้นใช้งาน' : 'ถัดไป'} 
              {currentStep < slides.length - 1 && <ChevronRight size={16} />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
