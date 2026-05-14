import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Award, Zap, ChevronRight, Plus, Minus } from 'lucide-react';
import { CITIES } from '../data/cities';
import { cn } from '../lib/utils';

export default function HomeTab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 0.5));

  return (
    <div className="relative w-full h-full bg-[#05070A] overflow-hidden flex items-center justify-center">
      {/* Decorative Radial Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Pannable/Zoomable Map Area */}
      <div 
        className="w-full h-full relative cursor-grab active:cursor-grabbing z-10"
        ref={containerRef}
      >
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0.2}
          animate={{ scale }}
          transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
          className="absolute top-1/2 left-1/2 w-[1200px] h-[800px] -translate-x-1/2 -translate-y-1/2 origin-center"
          style={{ 
            backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg")',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.6
          }}
        >
          {/* Mission Path SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
             <path 
               d={`M ${CITIES.map(c => `${(c.x / 100) * 1200},${(c.y / 100) * 800}`).join(' L ')}`} 
               fill="none" 
               stroke="#22d3ee" 
               strokeWidth="2" 
               strokeDasharray="4 6" 
             />
          </svg>

          {/* Cities Nodes */}
          {CITIES.map((city) => (
            <motion.div
              key={city.id}
              className="absolute group flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${city.x}%`,
                top: `${city.y}%`,
              }}
              whileHover={{ scale: 1.2, zIndex: 50 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan] cursor-pointer ring-4 ring-cyan-400/20 relative flex items-center justify-center">
                <div className="absolute top-5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 border border-white/20 px-2 py-1 rounded text-[10px] whitespace-nowrap shadow-lg text-slate-100">
                  {city.name}
                </div>
              </div>
            </motion.div>
          ))}
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
            <div className="text-xs font-semibold tracking-wide text-slate-100">跑步先锋</div>
            <div className="flex items-center text-[10px] text-cyan-300">
              <span className="mr-1">战力值:</span>
              <span className="font-mono font-bold">9,240</span>
            </div>
          </div>
        </div>

        {/* Leaderboard Button */}
        <div className="flex items-center pointer-events-auto">
          <button className="flex items-center bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg">
            <Award className="text-cyan-400 mr-1.5" size={16} />
            <span className="text-[10px] font-medium text-slate-100 uppercase tracking-widest">排行榜</span>
          </button>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute right-6 bottom-28 flex flex-col gap-2 z-20">
        <button 
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors shadow-lg active:scale-95"
        >
          <Plus size={16} />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors shadow-lg active:scale-95"
        >
          <Minus size={16} />
        </button>
      </div>

      {/* Bottom Mission Card (Teaser) */}
      <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl pointer-events-auto">
           <div className="absolute -bottom-10 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
           <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-1.5">当前剧情任务</p>
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-1 drop-shadow-sm">跑遍全世界：剧情第一季</h3>
                <p className="text-xs text-slate-400 line-clamp-1">前往东京的隐秘跑道，解锁最终徽章。</p>
              </div>
              <button className="w-10 h-10 border border-white/10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0">
                <ChevronRight className="text-cyan-400" size={20} />
              </button>
           </div>
           
           <div className="mt-5 flex items-center w-full bg-white/5 rounded-full h-1 overflow-hidden border border-white/5">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '65%' }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-full bg-cyan-400 relative"
             >
             </motion.div>
           </div>
           <p className="text-[10px] text-slate-500 text-right mt-1.5 font-mono">进度 65%</p>
        </div>
      </div>
    </div>
  );
}
