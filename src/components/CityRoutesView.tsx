import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, MapPin, Route, Milestone, Zap, Globe2 } from 'lucide-react';
import { CityData } from '../data/cities';

interface CityRoutesViewProps {
  city: CityData;
  onBack: () => void;
  onRouteClick: (routeIndex: number) => void;
  onExploreNext?: (currentCityId: string) => void;
}

export default function CityRoutesView({ city, onBack, onRouteClick, onExploreNext }: CityRoutesViewProps) {
  const [showLitModal, setShowLitModal] = useState(false);

  useEffect(() => {
    if (city.justLit) {
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
    <div className="w-full h-full bg-[#05070A] overflow-y-auto pb-24 text-slate-100 font-sans hide-scrollbar relative">
      <div className="sticky top-0 z-20 bg-black/40 backdrop-blur-md pt-safeb flex items-center px-4 py-4 border-b border-white/10">
        <button 
          onClick={onBack} 
          className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="rotate-180" size={20} />
        </button>
        <h1 className="flex-1 text-center font-bold tracking-widest text-slate-100 pr-8">{city.name}光迹探索</h1>
      </div>
      
      <div className="relative w-full h-64 overflow-hidden">
        <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/50 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-3xl font-bold text-white tracking-widest mb-2 shadow-sm">{city.name}</h2>
          <div className="flex gap-4 text-sm font-medium">
            <span className="flex items-center text-slate-300"><Route size={16} className="mr-1.5 opacity-70"/> {city.routes} 路线</span>
            <span className="flex items-center text-slate-300"><MapPin size={16} className="mr-1.5 opacity-70"/> {city.spots} 景点</span>
          </div>
          <div className="mt-4">
             <div className="flex justify-between items-end mb-1">
               <span className="text-[10px] text-slate-400">唤醒进度</span>
               <span className="text-[10px] text-amber-500 font-mono font-medium">{city.completed}/{city.routes}</span>
             </div>
             <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
               <div 
                 className="h-full bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
                 style={{ width: `${(city.completed / city.routes) * 100}%` }} 
               />
             </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-4 flex items-center">
          <Zap size={16} className="mr-2" /> 待唤醒路线
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => {
            const isAwakened = city.completedRouteIndices?.includes(i + 1);
            return (
              <div 
                key={i} 
                onClick={() => onRouteClick(i + 1)}
                className={`border rounded-2xl p-4 flex gap-4 cursor-pointer transition-colors shadow-lg ${isAwakened ? 'bg-cyan-950/30 border-cyan-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <div className="w-20 h-20 bg-slate-800 rounded-xl overflow-hidden shrink-0 relative">
                  <img src={city.image} alt="Route" className={`absolute inset-0 w-full h-full object-cover ${isAwakened ? 'opacity-100' : 'opacity-60'}`} />
                  <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm text-[8px] px-1.5 py-0.5 rounded text-slate-300">
                    路线 {i + 1}
                  </div>
                </div>
                <div className="flex-1 overflow-hidden py-1 flex flex-col">
                   <h3 className={`text-sm font-bold mb-1 truncate ${isAwakened ? 'text-cyan-400' : 'text-slate-100'}`}>
                      {city.name}精粹路线 0{i + 1}
                   </h3>
                   <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-2">
                     <span className="flex items-center"><Milestone size={12} className="mr-1"/> 5.2 km</span>
                     <span className="flex items-center"><MapPin size={12} className="mr-1"/> 8 景点</span>
                   </div>
                   <div className="mt-auto">
                      {isAwakened ? (
                         <div className="text-xs text-cyan-400 font-bold flex items-center">
                           <Zap size={12} className="mr-1" /> 已唤醒
                         </div>
                      ) : (
                         <button className="text-xs bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-400 py-1.5 px-3 rounded-lg border border-cyan-500/20 transition-colors w-full tracking-wide">
                           开启探索
                         </button>
                      )}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* City Lit Modal */}
      <AnimatePresence>
        {showLitModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
             <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 w-full max-w-sm shadow-[0_0_50px_rgba(245,158,11,0.2)] flex flex-col items-center text-center relative overflow-hidden"
             >
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-amber-500/20 to-transparent pointer-events-none" />
                
                <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.8)] relative z-10">
                  <Globe2 size={40} className="text-amber-400" />
                  <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full scale-50 animate-ping" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-100 mb-1 tracking-widest relative z-10">城市已点亮！</h2>
                <p className="text-amber-400 text-xs font-mono mb-6 relative z-10">CITY AWAKENED</p>

                <p className="text-sm text-slate-300 leading-relaxed font-medium mb-8">
                  {city.name} 的所有光迹均已唤醒。这座城市的隐藏形态已解锁，地球因你而闪耀。
                </p>

                <button 
                  onClick={handleCloseLitModal}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/30 active:scale-95"
                >
                  继续探索其他城市
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
