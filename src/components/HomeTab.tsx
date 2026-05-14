import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { Award, Zap, ChevronRight, Plus, Minus, X, CheckCircle2, Lock } from 'lucide-react';
import { CITIES } from '../data/cities';
import { cn } from '../lib/utils';

export default function HomeTab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [showStoryPanel, setShowStoryPanel] = useState(false);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 0.5));

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      setScale(prev => Math.min(prev + 0.1, 3));
    } else {
      setScale(prev => Math.max(prev - 0.1, 0.5));
    }
  };

  return (
    <div className="relative w-full h-full bg-[#05070A] overflow-hidden flex items-center justify-center">
      {/* Decorative Radial Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Pannable/Zoomable Map Area */}
      <div 
        className="w-full h-full relative cursor-grab active:cursor-grabbing z-10 touch-none"
        ref={containerRef}
        onWheel={handleWheel}
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
            opacity: 0.85,
            filter: 'contrast(1.2)'
          }}
        >
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
                <div className="absolute top-5 bg-black/60 border border-white/10 px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap text-cyan-50 shadow-sm pointer-events-none">
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
            <div className="text-xs font-semibold tracking-wide text-slate-100">光迹探索者</div>
            <div className="flex items-center text-[10px] text-cyan-300">
              <span className="mr-1">光迹碎片:</span>
              <span className="font-mono font-bold">120</span>
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
        <div 
          className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl pointer-events-auto cursor-pointer hover:border-cyan-500/30 transition-colors"
          onClick={() => setShowStoryPanel(true)}
        >
           <div className="absolute -bottom-10 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
           <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-1.5">主线计划</p>
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-1 drop-shadow-sm">点亮地球计划</h3>
                <p className="text-xs text-slate-400 line-clamp-1">第一章：第一道光（选择第一座城市，完成一条路线）</p>
              </div>
              <button className="w-10 h-10 border border-white/10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0">
                <ChevronRight className="text-cyan-400" size={20} />
              </button>
           </div>
           
           <div className="mt-5 flex items-center w-full bg-white/5 rounded-full h-1 overflow-hidden border border-white/5">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '5%' }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-full bg-cyan-400 relative"
             >
             </motion.div>
           </div>
           <p className="text-[10px] text-slate-500 text-right mt-1.5 font-mono">第 1 首发光迹待唤醒</p>
        </div>
      </div>

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
              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                通过复原600年前地球上真实存在的城市路线，让用户以运动的方式重新进入这些场景，唤醒沉睡的城市记忆，让人类重新记起母星。
              </p>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-slate-700 before:to-slate-800">
                {/* Chapter 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#05070A] bg-cyan-500 text-slate-100 shadow-[0_0_15px_rgba(34,211,238,0.5)] shrink-0 z-10 font-bold text-xs relative">
                    01
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white/5 border border-cyan-500/30 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
                     <h3 className="text-cyan-400 font-bold mb-1">第一章：第一道光</h3>
                     <p className="text-xs text-slate-400 mb-3">熟悉内容基础阶段</p>
                     <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                       用户刚加入计划，世界地图大部分是暗的。<br/>系统告诉用户：你需要选择第一座城市，完成一条路线。完成后，地球上亮起第一条光迹。
                     </p>
                     <div className="flex items-center text-[10px] text-cyan-400 bg-cyan-950/40 rounded px-2 py-1 font-mono">
                        <CheckCircle2 size={12} className="mr-1" />
                        进行中: 选择你的第一座城市
                     </div>
                  </div>
                </div>

                {/* Chapter 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#05070A] bg-slate-800 text-slate-400 shrink-0 z-10 font-bold text-xs">
                    02
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white/5 border border-white/5 rounded-2xl p-4 shadow-lg backdrop-blur-sm opacity-60">
                     <div className="flex items-center justify-between mb-1">
                        <h3 className="text-slate-300 font-bold">第二章：沉睡的城市</h3>
                        <Lock size={14} className="text-slate-500" />
                     </div>
                     <p className="text-xs text-slate-500 mb-3">单城市任务</p>
                     <p className="text-[11px] text-slate-400 leading-relaxed">
                       用户进入一座城市，比如巴黎。巴黎不是完整开放，而是有段城市记忆处于沉睡状态。每完成一条路线，就唤醒一个区域（塞纳河光迹等）。
                     </p>
                  </div>
                </div>

                {/* Chapter 3 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#05070A] bg-slate-800 text-slate-400 shrink-0 z-10 font-bold text-xs">
                    03
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white/5 border border-white/5 rounded-2xl p-4 shadow-lg backdrop-blur-sm opacity-60">
                     <div className="flex items-center justify-between mb-1">
                        <h3 className="text-slate-300 font-bold">第三章：世界光迹网络</h3>
                        <Lock size={14} className="text-slate-500" />
                     </div>
                     <p className="text-xs text-slate-500 mb-3">多城市任务开启</p>
                     <p className="text-[11px] text-slate-400 leading-relaxed">
                       当用户点亮多座城市后，开启系列城市任务。比如：点亮巴黎+伦敦+罗马，解锁：欧洲文明光带。
                     </p>
                  </div>
                </div>

                {/* Chapter 4 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#05070A] bg-slate-800 text-slate-400 shrink-0 z-10 font-bold text-xs">
                    04
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white/5 border border-white/5 rounded-2xl p-4 shadow-lg backdrop-blur-sm opacity-60">
                     <div className="flex items-center justify-between mb-1">
                        <h3 className="text-slate-300 font-bold">第四章：第100座城市</h3>
                        <Lock size={14} className="text-slate-500" />
                     </div>
                     <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
                       当用户持续点亮城市后，需要通过完成更多城市，收集获得最终勋章。长期悬念给予持续吸引力。
                     </p>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="p-4 bg-black/80 backdrop-blur-md border-t border-white/5 shrink-0">
               <button 
                 onClick={() => setShowStoryPanel(false)}
                 className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-colors tracking-wide shadow-[0_0_20px_rgba(34,211,238,0.3)]"
               >
                 开始探索
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
