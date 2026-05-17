import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'motion/react';
import { Award, Zap, ChevronRight, X, CheckCircle2, Lock, MapPin, Route, Milestone, Activity, Plane } from 'lucide-react';
import { CITIES, CityData } from '../data/cities';
import { cn } from '../lib/utils';

export default function HomeTab({ onNavigate, completedChapters = [], targetFlight, onFlightComplete, pendingSelectionFrom, onCitySelected, litCityIds = [] }: { onNavigate?: (type: string, data: any) => void; completedChapters?: number[]; targetFlight?: {fromCityId: string, toCityId: string} | null; onFlightComplete?: () => void; pendingSelectionFrom?: string | null; onCitySelected?: (cityId: string) => void; litCityIds?: string[]; }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [showStoryPanel, setShowStoryPanel] = useState(false);
  const [showCitySelection, setShowCitySelection] = useState(false);
  const [selectableCities, setSelectableCities] = useState<CityData[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [isTreadmillConnected, setIsTreadmillConnected] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (pendingSelectionFrom) {
      const available = CITIES.filter(c => c.status !== 'lit' && c.status !== 'upcoming' && c.id !== pendingSelectionFrom);
      const shuffled = [...available].sort(() => 0.5 - Math.random());
      setSelectableCities(shuffled.slice(0, 3));
      setShowCitySelection(true);
    }
  }, [pendingSelectionFrom]);

  const litCount = CITIES.filter(c => c.status === 'lit').length;
  const inProgressCity = CITIES.find(c => c.status === 'in-progress');
  
  const numMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

  let currentChapterText = "点亮地球计划尚未开启";
  let progressWidth = '0%';
  
  if (litCityIds.length === 0) {
    currentChapterText = "未知状态：点击进入并开启计划";
    progressWidth = '0%';
  } else if (inProgressCity) {
    const cityIndexInSequence = litCityIds.indexOf(inProgressCity.id);
    const numStr = numMap[cityIndexInSequence] || (cityIndexInSequence + 1).toString();
    currentChapterText = `第${numStr}城：${inProgressCity.name}，${inProgressCity.description}`;
    progressWidth = `${(inProgressCity.completed / inProgressCity.routes) * 100}%`;
  } else if (litCount > 0 && litCount === CITIES.length) {
    currentChapterText = "所有城市已点亮（地球倒影已解锁）";
    progressWidth = '100%';
  } else {
     // If everything is lit but some are still in progress? 
     // Or if we just finished one and haven't picked next
     const lastLitId = litCityIds[litCityIds.length - 1];
     const lastLitCity = CITIES.find(c => c.id === lastLitId);
      if (lastLitCity) {
        currentChapterText = `已点亮：${lastLitCity.name}，请开启下一站`;
        progressWidth = '100%';
      }
  }

  const handleConnectTreadmill = () => {
    setIsTreadmillConnected(true);
    setToastMessage('跑步机连接功能已启用，设备已连接');
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (targetFlight) {
        const fromCity = CITIES.find(c => c.id === targetFlight.fromCityId);
        const toCity = CITIES.find(c => c.id === targetFlight.toCityId);
        if (fromCity && toCity) {
            const mapWidth = 1200;
            const mapHeight = 800;
            const startOffsetX = (0.5 - fromCity.x / 100) * mapWidth;
            const startOffsetY = (0.5 - fromCity.y / 100) * mapHeight;
            const endOffsetX = (0.5 - toCity.x / 100) * mapWidth;
            const endOffsetY = (0.5 - toCity.y / 100) * mapHeight;

             x.set(startOffsetX);
             y.set(startOffsetY);
             setScale(1.2);

             setTimeout(() => {
               animate(x, endOffsetX, { type: 'spring', bounce: 0, duration: 3 });
               animate(y, endOffsetY, { type: 'spring', bounce: 0, duration: 3 });
             }, 500);

            setTimeout(() => {
                setSelectedCity(toCity);
                if (onFlightComplete) {
                    onFlightComplete();
                }
            }, 3600);
        }
        return;
    }

    // Focus on the in-progress city on initial load if no target flight
    const inProgressCity = CITIES.find(c => c.status === 'in-progress') || CITIES[0];

    const mapWidth = 1200;
    const mapHeight = 800;
    const offsetX = (0.5 - inProgressCity.x / 100) * mapWidth;
    const offsetY = (0.5 - inProgressCity.y / 100) * mapHeight;
    
    x.set(offsetX);
    y.set(offsetY);
    setScale(1);
  }, [x, y, targetFlight, onFlightComplete]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 0.5));

  const touchDistance = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistance.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistance.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist - touchDistance.current;
      setScale(prev => Math.min(Math.max(prev + delta * 0.01, 0.5), 3));
      touchDistance.current = dist;
    }
  };

  const handleTouchEnd = () => {
    touchDistance.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      setScale(prev => Math.min(prev + 0.1, 3));
    } else {
      setScale(prev => Math.max(prev - 0.1, 0.5));
    }
  };

  const handleStartExplore = () => {
    setShowStoryPanel(false);
    
    if (inProgressCity) {
      setSelectedCity(inProgressCity);
    } else {
      // Pick 3 available cities (not lit, not upcoming)
      const available = CITIES.filter(c => c.status !== 'lit' && c.status !== 'upcoming');
      const shuffled = [...available].sort(() => 0.5 - Math.random());
      setSelectableCities(shuffled.slice(0, 3));
      setShowCitySelection(true);
    }
  };

  const handleCitySelect = (city: CityData) => {
    setShowCitySelection(false);
    
    // Set status to in-progress for selected city
    CITIES.forEach(c => {
      if (c.status === 'in-progress') {
        c.status = 'unlit';
      }
    });
    city.status = 'in-progress';

    if (onCitySelected) {
      onCitySelected(city.id);
    }
    
    if (!pendingSelectionFrom) {
      // Default map is 1200x800
      const mapWidth = 1200;
      const mapHeight = 800;
      
      // Find offset
      const offsetX = (0.5 - city.x / 100) * mapWidth;
      const offsetY = (0.5 - city.y / 100) * mapHeight;
      
      animate(x, offsetX, { type: 'spring', bounce: 0, duration: 0.8 });
      animate(y, offsetY, { type: 'spring', bounce: 0, duration: 0.8 });
      setScale(1);
      
      setTimeout(() => {
        setSelectedCity(city);
      }, 800);
    }
  };

  const handleCityClick = (city: CityData) => {
    setSelectedCity(city);
  };

  return (
    <div className="relative w-full h-full bg-[#133643] overflow-hidden flex items-center justify-center">
      {/* Decorative Radial Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Pannable/Zoomable Map Area */}
      <div 
        className="w-full h-full relative cursor-grab active:cursor-grabbing z-10 touch-none"
        ref={containerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0.2}
          style={{ 
            x, 
            y,
            backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg")',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 1,
            filter: 'contrast(1.2) brightness(2)' // Make continents brighter
          }}
          animate={{ scale }}
          transition={{ scale: { type: 'spring', bounce: 0.1, duration: 0.4 } }}
          className="absolute top-1/2 left-1/2 w-[1200px] h-[800px] -translate-x-1/2 -translate-y-1/2 origin-center"
        >
          {/* Cities Nodes */}
          {CITIES.map((city) => {
            const statusConfig = {
              'unlit': {
                dot: 'bg-[#218F8D] ring-[#218F8D]/30 shadow-[0_0_15px_#218F8D]',
                text: 'text-[#218F8D] bg-black/60 border border-[#218F8D]/30',
              },
              'in-progress': {
                dot: 'bg-amber-400 ring-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.8)]',
                text: 'text-amber-100 bg-amber-950/80 border border-amber-500/30',
              },
              'lit': {
                dot: 'bg-amber-400 ring-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.8)]',
                text: 'text-amber-100 bg-amber-950/80 border border-amber-500/30',
              },
              'upcoming': {
                dot: 'bg-slate-700/60 ring-slate-800/30 shadow-none',
                text: 'text-slate-500/80 bg-black/40',
              }
            };
            const config = statusConfig[city.status];

            return (
              <motion.div
                key={city.id}
                className="absolute group flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${city.x}%`,
                  top: `${city.y}%`,
                }}
                whileHover={{ scale: 1.2, zIndex: 50 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCityClick(city)}
              >
                <div className={cn("w-3 h-3 rounded-full cursor-pointer ring-4 relative flex items-center justify-center", config.dot)}>
                  <div className={cn(
                    "absolute px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap shadow-sm pointer-events-none transition-all duration-300", 
                    config.text,
                    city.labelPosition === 'top' ? 'bottom-5' :
                    city.labelPosition === 'bottom' ? 'top-5' :
                    city.labelPosition === 'left' ? 'right-5' :
                    city.labelPosition === 'right' ? 'left-5' : 'top-5'
                  )}>
                    {city.name}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Flight Path Animation */}
          {(() => {
            if (!targetFlight) return null;
            const fc = CITIES.find(c => c.id === targetFlight.fromCityId);
            const tc = CITIES.find(c => c.id === targetFlight.toCityId);
            if (!fc || !tc) return null;

            const x1 = (fc.x / 100) * 1200;
            const y1 = (fc.y / 100) * 800;
            const x2 = (tc.x / 100) * 1200;
            const y2 = (tc.y / 100) * 800;

            const cx = (x1 + x2) / 2 + (y2 - y1) * 0.2;
            const cy = (y1 + y2) / 2 - (x2 - x1) * 0.2;

            const pathObj = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

            return (
              <div className="absolute inset-0 pointer-events-none z-30">
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                  <motion.path 
                     d={pathObj}
                     fill="transparent"
                     strokeDasharray="8 8"
                     stroke="rgba(34,211,238, 0.6)"
                     strokeWidth="3"
                     strokeLinecap="round"
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: 1 }}
                     transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
                   />
                   <motion.path 
                     d={pathObj}
                     fill="transparent"
                     stroke="rgba(251,191,36, 0.4)"
                     strokeWidth="5"
                     strokeLinecap="round"
                     className="blur-[8px]"
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: 1 }}
                     transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
                   />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full"> 
                   <motion.div
                     className="absolute flex flex-col items-center justify-center text-white pointer-events-none"
                     style={{ 
                       top: 0, 
                       left: 0,
                       offsetPath: `path('${pathObj}')`,
                       offsetRotate: "auto 45deg"
                     }}
                     initial={{ offsetDistance: "0%", opacity: 0 }}
                     animate={{ offsetDistance: "100%", opacity: 1 }}
                     transition={{ 
                        opacity: { duration: 0.1, delay: 0.5 },
                        offsetDistance: { duration: 3, delay: 0.5, ease: "easeInOut" } 
                     }}
                   >
                     <Plane size={20} fill="white" className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ transform: 'translate(-50%, -50%)' }} />
                   </motion.div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      </div>

      {/* HUD: Top Overlay */}
      <div className="absolute top-0 left-0 right-0 px-6 py-4 z-20 flex items-center justify-between pointer-events-none bg-gradient-to-b from-black/40 to-transparent">
        
        {/* User Info */}
        <div className="flex items-center space-x-4 bg-white/5 border border-white/10 p-1.5 pr-5 rounded-full backdrop-blur-md shadow-xl pointer-events-auto">
          <div className="w-10 h-10 rounded-full border border-cyan-400 overflow-hidden bg-slate-800 p-[1px]">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" 
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <div className="text-xs font-semibold tracking-wide text-slate-100">木小六</div>
            <div className="flex items-center text-[10px] text-cyan-300">
              <span className="mr-1">光迹值:</span>
              <span className="font-mono font-bold">120</span>
            </div>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button 
            onClick={handleConnectTreadmill}
            className={cn(
              "flex items-center px-3 py-2 rounded-xl backdrop-blur-md transition-colors shadow-lg border",
              isTreadmillConnected 
                ? "bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30" 
                : "bg-white/5 border-white/10 hover:bg-white/10"
            )}
          >
            <Activity className={cn("mr-1.5", isTreadmillConnected ? "text-emerald-400" : "text-cyan-400")} size={16} />
            <span className={cn("text-[10px] font-medium uppercase tracking-widest", isTreadmillConnected ? "text-emerald-100" : "text-slate-100")}>
              {isTreadmillConnected ? "跑步机已连接" : "连接跑步机"}
            </span>
          </button>
        </div>
      </div>



      {/* Bottom Area */}
      <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none flex flex-col gap-4">
        {/* Utilities */}
        <div className="flex justify-start gap-2 pointer-events-auto">
          <button 
            className="flex items-center bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg"
            onClick={() => onNavigate && onNavigate('litRecords', null)}
          >
            <Zap className="text-cyan-400 mr-1.5" size={16} />
            <span className="text-[10px] font-medium text-slate-100 uppercase tracking-widest">点亮记录</span>
          </button>
          
          <button 
            className="flex items-center bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg"
            onClick={() => onNavigate && onNavigate('leaderboard', null)}
          >
            <Award className="text-cyan-400 mr-1.5" size={16} />
            <span className="text-[10px] font-medium text-slate-100 uppercase tracking-widest">排行榜</span>
          </button>
        </div>

        {/* Bottom Mission Card (Teaser) */}
        <div 
          className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl pointer-events-auto cursor-pointer hover:border-cyan-500/30 transition-colors w-full"
          onClick={() => setShowStoryPanel(true)}
        >
           <div className="absolute -bottom-10 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
           <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-1 drop-shadow-sm">点亮地球计划</h3>
                <p className="text-xs text-slate-400 line-clamp-1">{currentChapterText}</p>
                {inProgressCity && (
                  <div className="mt-2 text-[10px] text-cyan-400 font-mono flex items-center bg-cyan-500/10 w-fit px-2 py-1 rounded">
                    <MapPin size={12} className="mr-1" />
                    当前运动: {inProgressCity.name}({inProgressCity.completed}/{inProgressCity.routes}路线)
                  </div>
                )}
              </div>
              <button className="w-10 h-10 border border-white/10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0">
                <ChevronRight className="text-cyan-400" size={20} />
              </button>
           </div>
           
           <div className="mt-5 flex items-center w-full bg-white/5 rounded-full h-1 overflow-hidden border border-white/5">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: progressWidth }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-full bg-cyan-400 relative"
             >
             </motion.div>
           </div>
        </div>
      </div>

      {/* City Popup Card Overlay */}
      <AnimatePresence>
        {selectedCity && !showStoryPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/40 flex items-center justify-center p-6 backdrop-blur-[2px]"
            onClick={() => setSelectedCity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm bg-slate-900/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
              onClick={(e) => {
                 e.stopPropagation();
                 if (selectedCity.status !== 'upcoming') {
                   setSelectedCity(null);
                   if (onNavigate) {
                     onNavigate('cityRoutes', selectedCity);
                   }
                 }
              }}
            >
              <div className="relative h-48 w-full">
                <img src={selectedCity.image} alt={selectedCity.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCity(null);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors text-white"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-4 left-6">
                   <h3 className="text-3xl font-bold text-white tracking-widest drop-shadow-md">{selectedCity.name}</h3>
                   <p className="text-sm font-medium text-cyan-300 uppercase tracking-widest mt-1 opacity-80">{selectedCity.englishName}</p>
                </div>
              </div>
              
              <div className="p-6 pt-2">
                 {selectedCity.status === 'upcoming' ? (
                   <div className="flex flex-col items-center justify-center py-8">
                     <Lock size={32} className="text-slate-500 mb-4" />
                     <p className="text-slate-400 font-medium">即将上线时间: 2026年下半年</p>
                   </div>
                 ) : (
                   <>
                     <div className="flex justify-between text-sm mb-6 bg-white/5 rounded-xl p-4 border border-white/5">
                       <div className="flex flex-col items-center">
                         <span className="text-2xl font-bold text-slate-100 mb-1">{selectedCity.routes}</span>
                         <span className="text-[10px] text-slate-500 uppercase tracking-widest">路线</span>
                       </div>
                       <div className="w-px bg-white/10" />
                       <div className="flex flex-col items-center">
                         <span className="text-2xl font-bold text-slate-100 mb-1">{selectedCity.spots}</span>
                         <span className="text-[10px] text-slate-500 uppercase tracking-widest">景点</span>
                       </div>
                       <div className="w-px bg-white/10" />
                       <div className="flex flex-col items-center">
                         <span className="text-2xl font-bold text-slate-100 mb-1">{selectedCity.status === 'lit' ? '100%' : `${Math.round((selectedCity.completed / selectedCity.routes) * 100)}%`}</span>
                         <span className="text-[10px] text-slate-500 uppercase tracking-widest">完成度</span>
                       </div>
                     </div>

                     <div className="mb-6">
                        <div className="flex justify-between items-end mb-2">
                           <span className="text-[10px] text-slate-400">唤醒进度</span>
                           <span className="text-xs font-mono font-medium text-amber-500">{selectedCity.completed} / {selectedCity.routes}</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                           <div 
                             className="h-full bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                             style={{ width: `${(selectedCity.completed / selectedCity.routes) * 100}%` }} 
                           />
                        </div>
                     </div>

                     <button 
                       className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-colors tracking-wide shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                       onClick={(e) => {
                         e.stopPropagation();
                         setSelectedCity(null);
                         if (onNavigate) {
                           onNavigate('cityRoutes', selectedCity);
                         }
                       }}
                     >
                       进入这座城市
                     </button>
                   </>
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story Panel Overlay */}
      <AnimatePresence>
        {showStoryPanel && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 z-50 bg-[#05070A] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 pb-2 border-b border-white/5 relative bg-gradient-to-b from-cyan-900/20 to-transparent">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-1">点亮地球计划</h2>
                <p className="text-xs text-cyan-400 opacity-80 tracking-widest font-mono">MOVEVI World Light Project</p>
              </div>
              <button 
                onClick={() => setShowStoryPanel(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/10 transition-colors pointer-events-auto shadow-xl"
              >
                <X size={20} className="text-slate-300" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-6 pb-24 hide-scrollbar">
              <div className="mb-8 p-4 bg-gradient-to-r from-cyan-950/40 to-transparent rounded-xl border-l-2 border-cyan-500 shadow-md">
                <p className="text-xs text-slate-300 leading-relaxed font-medium italic mb-3">
                  "600年以后，人类早已离开地球，生活在群星之间。我们建造了新的城市、新的轨道、新的家园。"
                </p>
                <p className="text-xs text-slate-300 leading-relaxed font-medium italic mb-3">
                  "可是走向宇宙深处，人们越开始想念那颗蓝色的母星。想念巴黎清晨的雾，想念东京街口的人潮，想念开罗金字塔前吹来的热风，也想念南京城墙下，梧桐叶落在路面的声音..."
                </p>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  你，不是普通运动者。你是一名<span className="text-cyan-400 font-bold mx-1">光迹探索者 (Glowtrail Explorer)</span>。<br/>
                  你的任务，是通过每一次出发，唤醒一段地球记忆；每完成一条路线，点亮一道母星光迹。
                </p>
              </div>

              {!litCityIds.length ? (
                <div className="w-full py-12 px-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl flex flex-col items-center justify-center text-center mb-6 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
                  <Compass size={32} className="text-cyan-500 animate-pulse mb-4 relative z-10" />
                  <h3 className="text-lg font-bold text-slate-200 tracking-wider mb-2 relative z-10">母星网络尚未连接</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4 relative z-10">
                    地球的记忆仍在一片暗淡之中。<br className="hidden sm:block" />您的奔跑，是重启这些城市坐标的唯一能源。
                  </p>
                  <div className="text-xs font-mono text-cyan-500/80 bg-cyan-950/30 px-3 py-1.5 rounded relative z-10">
                    等待接收探索者指令...
                  </div>
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-slate-700 before:to-slate-800">
                  {litCityIds.map((cityId, index) => {
                    const city = CITIES.find(c => c.id === cityId);
                    if (!city) return null;
                    
                    const numStr = numMap[index] || (index + 1).toString();
                    const isLit = city.status === 'lit';
                    const isInProgress = city.status === 'in-progress';
                    const isLocked = false;

                    return (
                      <div key={city.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${!isLocked ? 'is-active' : ''}`}>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#05070A] ${isLit ? 'bg-[#2ecc71] text-slate-100 shadow-[0_0_15px_rgba(46,204,113,0.5)]' : isInProgress ? 'bg-cyan-500 text-slate-100 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-slate-800 text-slate-400'} shrink-0 z-10 font-bold text-xs relative`}>
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white/5 border ${isLit ? 'border-[#2ecc71]/30' : isInProgress ? 'border-cyan-500/30' : 'border-white/5'} rounded-2xl p-4 shadow-lg backdrop-blur-sm ${isLocked ? 'opacity-60' : ''}`}>
                           <div className="flex items-center justify-between mb-1">
                              <h3 className={`${isLit ? 'text-[#2ecc71]' : isInProgress ? 'text-cyan-400' : 'text-slate-300'} font-bold`}>第{numStr}城：{city.name}</h3>
                              {isLocked && <Lock size={14} className="text-slate-500" />}
                           </div>
                           <p className="text-xs text-slate-400 mb-3 font-mono">{city.continent} · {city.englishName}</p>
                           <p className={`text-[11px] leading-relaxed mb-3 ${isLocked ? 'text-slate-500' : 'text-slate-300'}`}>
                             {city.description}
                           </p>
                           {isLit ? (
                              <div className="flex items-center text-[10px] text-[#2ecc71] bg-[#2ecc71]/10 rounded px-2 py-1 font-mono w-fit">
                                 <CheckCircle2 size={12} className="mr-1" />
                                 已完成: 城市卡片已解锁
                              </div>
                           ) : isInProgress ? (
                              <div className="flex items-center text-[10px] text-cyan-400 bg-cyan-950/40 rounded px-2 py-1 font-mono w-fit">
                                 <Activity size={12} className="mr-1" />
                                 进行中: 唤醒进度 {city.completed}/{city.routes}
                              </div>
                           ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-black/80 backdrop-blur-md border-t border-white/5 shrink-0">
               <button 
                 onClick={handleStartExplore}
                 className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-colors tracking-wide shadow-[0_0_20px_rgba(34,211,238,0.3)]"
               >
                 {litCityIds.length === 0 ? "开始探索" : inProgressCity ? "继续探索" : "选择下一城"}
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* City Selection Overlay */}
      <AnimatePresence>
        {showCitySelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black/80 flex flex-col items-center justify-center p-6 backdrop-blur-sm"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">选择探索城市</h2>
              <p className="text-slate-400 text-sm">选择一个城市，开启你的光迹唤醒之旅</p>
            </div>
            
            <div className="w-full flex flex-col gap-4">
              {selectableCities.map((city, idx) => (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl"
                  onClick={() => handleCitySelect(city)}
                >
                  <div className="relative h-24">
                    <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-between px-6">
                      <div>
                        <h3 className="text-xl font-bold text-white drop-shadow-md">{city.name}</h3>
                        <p className="text-xs text-cyan-300 font-mono tracking-widest uppercase">{city.englishName}</p>
                      </div>
                      <ChevronRight className="text-white/50" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button
              className="mt-8 text-slate-400 text-sm hover:text-white"
              onClick={() => setShowCitySelection(false)}
            >
              取消
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500/90 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-md text-xs font-medium whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
