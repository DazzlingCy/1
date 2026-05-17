import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, BarChart2, Globe2, Lock } from 'lucide-react';
import { CityData } from '../data/cities';

import { getRouteData } from '../data/cities';

interface CityRoutesViewProps {
  city: CityData;
  onBack: () => void;
  onRouteClick: (routeIndex: number) => void;
  onExploreNext?: (currentCityId: string) => void;
}

export default function CityRoutesView({ city, onBack, onRouteClick, onExploreNext }: CityRoutesViewProps) {
  const [showLitModal, setShowLitModal] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isLightingUp, setIsLightingUp] = useState(false);
  const [activeTab, setActiveTab] = useState(city.id === '1' ? '环西湖' : '精选推荐');

  const tabs = city.id === '1' 
    ? ['环西湖', '文化类', '现代类', '自然类'] 
    : ['精选推荐', '文化探索', '现代都市', '自然风光'];

  useEffect(() => {
    if (city.justLit) {
      setIsCardFlipped(false);
      setShowLitModal(true);
    }
  }, [city.justLit]);

  const handleCloseLitModal = () => {
    setShowLitModal(false);
    city.justLit = false;
    if (onExploreNext) {
      onExploreNext(city.id);
    } else {
      onBack();
    }
  };



  return (
    <div className="w-full h-full bg-[#f4f6f8] overflow-y-auto text-slate-800 font-sans hide-scrollbar relative pb-12">
      {/* Hero Header Area */}
      <div className="relative w-full h-[40vh] shrink-0">
        <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Header Icons */}
        <div className="absolute top-0 left-0 right-0 pt-safeb px-4 py-4 z-20 flex justify-between items-center text-white">
          <button onClick={onBack} className="p-2 -ml-2 drop-shadow-md">
            <ChevronLeft size={32} />
          </button>
          <button className="p-2 -mr-2 drop-shadow-md">
            <BarChart2 size={24} />
          </button>
        </div>

        {/* City Title and Button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-10">
          <div className="relative flex flex-col items-center">
            <h1 className="text-5xl sm:text-6xl font-black text-white/90 tracking-widest drop-shadow-lg uppercase" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>
              {city.englishName || 'CITY'}
            </h1>
            <h2 className="text-3xl font-bold text-white drop-shadow-md mt-1 mb-8" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {city.name}
            </h2>
          </div>
          
          <button className="px-8 py-2.5 rounded-full bg-gradient-to-b from-[#ff8c5a] to-[#f45c2c] text-white font-bold tracking-widest border-2 border-white/40 shadow-[0_5px_15px_rgba(244,92,44,0.4)] text-lg">
            路线概览图
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#f4f6f8] rounded-t-3xl -mt-6 relative z-20 px-4 pt-6 pb-2">
        <div className="flex justify-between items-center mb-4 px-2">
          {tabs.map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[15px] font-medium transition-colors ${activeTab === tab ? 'text-[#f45c2c]' : 'text-slate-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Tab Indicator */}
        <div className="flex justify-center items-center mb-2 px-2">
           <div className="h-px bg-slate-200 flex-1" />
           <span className="px-4 text-xs text-slate-400">{activeTab}</span>
           <div className="h-px bg-slate-200 flex-1" />
        </div>
      </div>

      {/* Route List */}
      <div className="px-4 space-y-4">
        {Array.from({ length: Math.max(city.routes, 3) }).map((_, i) => {
          // Adjust logic so earlier routes are completed/unlocked for demo purpose
          const routeId = i + 1;
          const isCompleted = city.completedRouteIndices?.includes(routeId);
          // Unlock the first one, or ones that are completed, or the one next to the last completed
          const lastCompleted = (city.completedRouteIndices || []).reduce((max, cur) => Math.max(max, cur), 0);
          const isUnlocked = routeId === 1 || isCompleted || routeId === lastCompleted + 1;

          const routeData = getRouteData(city.id, routeId);
          const numSpots = routeData.spots.split('—').length || 3;
          const runners = 1890 - i * 300;

          return (
            <div 
              key={i} 
              onClick={() => isUnlocked && onRouteClick(routeId)}
              className={`bg-white rounded-2xl p-4 flex gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${!isUnlocked ? 'opacity-70 grayscale-[20%]' : 'cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all'}`}
            >
              {/* Left Image Area */}
              <div className="w-[100px] h-[130px] bg-slate-100 rounded-xl overflow-hidden shrink-0 relative shadow-inner">
                <img src={city.image} alt="Route" className="absolute inset-0 w-full h-full object-cover" />
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-gradient-to-b from-[#ffb48f] to-[#ff8c5a] p-2.5 rounded-full shadow-lg border-2 border-white/80">
                      <Lock size={18} className="text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Content Area */}
              <div className="flex-1 overflow-hidden flex flex-col justify-between py-1">
                <h3 className="text-[15px] font-bold text-slate-800 line-clamp-2 leading-snug">
                  路线{routeId}: {routeData.title}
                </h3>
                
                <div className="bg-[#fff9f0] rounded px-3 py-2 my-2 border border-[#fef0dd]">
                  <p className="text-[11px] text-[#b39c82] line-clamp-1">{routeData.spots}</p>
                </div>

                <div className="grid grid-cols-2 gap-y-2 mt-auto">
                   <div className="text-[11px] text-slate-500 flex items-center gap-1">
                     景点总数 <span className="font-semibold text-slate-700 text-xs">{numSpots}个</span>
                   </div>
                   <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                     运动时长 <span className="font-semibold text-slate-700 text-xs font-mono">{routeData.duration}</span>
                   </div>
                   <div className="text-[11px] text-slate-500 flex items-center gap-1">
                     路线评分 <span className="font-bold text-[#f45c2c] text-xs">{routeData.rating}分</span>
                   </div>
                   <div className="flex justify-end items-center gap-1.5">
                      <div className="flex -space-x-1">
                        <img src={`https://i.pravatar.cc/100?img=${(i * 3 + 1) % 70}`} alt="avatar" className="w-[14px] h-[14px] rounded-full border border-white" />
                        <img src={`https://i.pravatar.cc/100?img=${(i * 3 + 2) % 70}`} alt="avatar" className="w-[14px] h-[14px] rounded-full border border-white" />
                        <img src={`https://i.pravatar.cc/100?img=${(i * 3 + 3) % 70}`} alt="avatar" className="w-[14px] h-[14px] rounded-full border border-white" />
                      </div>
                      <span className="text-[10px] text-slate-400 scale-90 origin-right">{runners}人跑过</span>
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* City Lit Modal */}
      <AnimatePresence>
        {showLitModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 perspective-[1000px]"
          >
             <motion.div
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full max-w-sm flex flex-col items-center"
             >
                <div className="w-full text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-widest">{isCardFlipped ? "获得城市卡片" : "城市已点亮！"}</h2>
                  <p className="text-cyan-400 text-sm">{isCardFlipped ? "CITY CARD ACQUIRED" : "点击卡片翻开你的奖励"}</p>
                </div>

                <div 
                   className="relative w-64 h-[360px] [transform-style:preserve-3d] cursor-pointer transition-transform duration-700 hover:scale-105"
                   onClick={() => {
                     if (isCardFlipped || isLightingUp) return;
                     setIsLightingUp(true);
                     setTimeout(() => {
                       setIsLightingUp(false);
                       setIsCardFlipped(true);
                     }, 800);
                   }}
                   style={{ transform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                >
                   <AnimatePresence>
                     {isLightingUp && (
                       <motion.div
                         initial={{ opacity: 0, scale: 0.1 }}
                         animate={{ opacity: [0, 1, 1, 0], scale: [0.1, 1.5, 3, 4] }}
                         exit={{ opacity: 0 }}
                         transition={{ duration: 0.8, times: [0, 0.4, 0.7, 1], ease: "easeOut" }}
                         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-400 mix-blend-screen blur-[30px] rounded-full z-50 pointer-events-none"
                       />
                     )}
                   </AnimatePresence>

                   {/* Card Back */}
                   <div className="absolute inset-0 [backface-visibility:hidden] bg-slate-800 border-2 border-white/20 rounded-2xl shadow-2xl flex flex-col items-center justify-center">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 rounded-2xl"></div>
                     <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-4 border border-white/10 relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent animate-pulse" />
                       <Globe2 size={40} className="text-slate-400" />
                     </div>
                     <p className="text-slate-400 text-xs font-mono mb-2 tracking-widest relative z-10">TAP TO REVEAL</p>
                     <div className="text-white/30 text-3xl animate-bounce mt-4 relative z-10">👆</div>
                   </div>

                   {/* Card Front */}
                   <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.4)] overflow-hidden bg-slate-900 border border-white/20 flex flex-col">
                      <div className="h-[60%] relative">
                        <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                      </div>
                      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center -mt-6 relative z-10">
                         <h3 className="text-3xl font-bold text-white mb-1 drop-shadow-md">{city.name}</h3>
                         <div className="text-xs text-slate-400 font-mono tracking-widest uppercase">{city.englishName}</div>
                         <div className="mt-4 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] rounded-full uppercase tracking-widest">
                           {city.routes} Routes Completed
                         </div>
                      </div>
                   </div>
                </div>

                <AnimatePresence>
                  {isCardFlipped && (
                    <motion.button 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      onClick={handleCloseLitModal}
                      className="mt-10 px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95"
                    >
                      继续探索世界
                    </motion.button>
                  )}
                </AnimatePresence>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
