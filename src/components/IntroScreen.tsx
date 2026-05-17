import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  return (
    <motion.div 
      className="absolute inset-0 z-[200] bg-[#05070A] flex flex-col justify-between p-8 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-cyan-900/40 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-amber-900/20 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 space-y-8 mt-20">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.5 }}
           className="flex items-center gap-2 mb-12"
        >
          <Sparkles className="text-cyan-400" size={24} />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            星迹跃迁计划
          </h1>
        </motion.div>

        <motion.p 
          className="text-lg text-slate-300 leading-relaxed font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          公元3026年，人类早已星际移民。
        </motion.p>
        
        <motion.p 
          className="text-lg text-slate-300 leading-relaxed font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.5 }}
        >
          可是当人们走向宇宙深处，却越发想念那颗蓝色的母星。想念巴黎清晨的雾，想念东京街口的人潮，想念开罗金字塔前吹来的热风，也想念南京城墙下，梧桐叶落在路面的声音...
        </motion.p>
        
        <motion.p 
          className="text-lg text-slate-300 leading-relaxed font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 6 }}
        >
          你，不是普通运动者。你是一名<span className="text-cyan-400 font-bold mx-1">光迹探索者 (Glowtrail Explorer)</span>。<br/><br/>
          你的任务，是通过每一次出发，唤醒一段地球记忆；每完成一条路线，点亮一道母星光迹。
        </motion.p>
      </div>

      <motion.div 
        className="relative z-10 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 8.5 }}
      >
        <button 
          onClick={onComplete}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-lg rounded-2xl transition-colors tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.2)] flex items-center justify-center group"
        >
          <span>接受任务</span>
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
}
