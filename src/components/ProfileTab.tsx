import { Settings, Shield, ChevronRight, Activity, Flame, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfileTab() {
  const stats = [
    { label: '总里程 (km)', value: '1,248.5', icon: Activity, color: 'text-indigo-400' },
    { label: '消耗卡路里', value: '45,200', icon: Flame, color: 'text-orange-400' },
    { label: '运动时长 (h)', value: '124.3', icon: Clock, color: 'text-emerald-400' },
  ];

  const menuItems = [
    { icon: Shield, label: '我的徽章', value: '12 个' },
    { icon: Activity, label: '跑步记录', value: '86 次' },
    { icon: Settings, label: '系统设置', value: '' },
  ];

  return (
    <div className="w-full h-full bg-[#05070A] overflow-y-auto pb-24 text-slate-100 font-sans">
      {/* Header Profile Info */}
      <div className="relative pt-16 pb-12 px-6 bg-gradient-to-b from-cyan-900/10 to-transparent border-b border-white/5">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none blur-3xl" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-20 h-20 rounded-full border-2 border-cyan-400 p-1 relative shadow-[0_0_20px_rgba(34,211,238,0.2)] bg-[#05070A]">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200" 
              alt="Avatar" 
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-cyan-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#05070A]">
              Lv.24
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-100 tracking-wide">跑步先锋</h1>
            <p className="text-xs text-cyan-300 mt-1 font-mono opacity-80">ID: MUWEI-8942</p>
            
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div className="w-[70%] h-full bg-cyan-400" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">70%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Board */}
      <div className="p-6">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 shadow-xl backdrop-blur-xl -mt-10 relative z-10 mb-8 grid grid-cols-3 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            // Map original colors to cyan if indigo, or keep amber/emerald style but subdued
            const iconColor = stat.color === 'text-indigo-400' ? 'text-cyan-400' 
                            : stat.color === 'text-orange-400' ? 'text-amber-400'
                            : 'text-emerald-400';
            const iconBg = stat.color === 'text-indigo-400' ? 'bg-cyan-500/10 border border-cyan-500/20' 
                            : stat.color === 'text-orange-400' ? 'bg-amber-500/10 border border-amber-500/20'
                            : 'bg-emerald-500/10 border border-emerald-500/20';

            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center text-center gap-2"
              >
                <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} shadow-inner`}>
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-100 font-mono tracking-wider">{stat.value}</div>
                  <div className="text-[10px] text-slate-400">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 flex items-center gap-4 border border-white/5"
              >
                <div className="p-2.5 rounded-xl bg-black/40 text-cyan-400 border border-white/10 shadow-inner">
                  <Icon size={18} />
                </div>
                <div className="flex-1 text-left text-slate-200 font-medium text-sm tracking-wide">
                  {item.label}
                </div>
                {item.value && (
                  <div className="text-[11px] font-mono text-cyan-500 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
                    {item.value}
                  </div>
                )}
                <ChevronRight size={18} className="text-slate-600" />
              </motion.button>
            );
          })}
        </div>

        {/* Sync Device Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full mt-10 bg-cyan-500 hover:bg-cyan-400 text-black font-bold tracking-widest rounded-2xl py-4 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2 uppercase text-sm"
        >
          <Activity size={18} />
          连接木卫六跑步机
        </motion.button>
      </div>
    </div>
  );
}
