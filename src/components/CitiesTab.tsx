import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { CITIES, CITIES_BY_CONTINENT } from '../data/cities';
import { cn } from '../lib/utils';

export default function CitiesTab() {
  const continents = Object.keys(CITIES_BY_CONTINENT);
  const [activeContinent, setActiveContinent] = useState(continents[0]);

  // Handle smooth scroll or manual tab click
  const handleTabClick = (continent: string) => {
    setActiveContinent(continent);
    const el = document.getElementById(`continent-${continent}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full h-full bg-[#05070A] flex flex-col pt-0 text-slate-100 font-sans">
      {/* Header */}
      <div className="shrink-0 bg-black/40 backdrop-blur-md pt-safet pt-4 pb-0 border-b border-white/10 relative z-20">
        <h1 className="text-sm font-bold text-center text-cyan-400 uppercase tracking-widest mb-4">世界城市库</h1>
        
        {/* Continent Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar px-4 pb-3 gap-6 relative">
          {continents.map(continent => (
            <button
              key={continent}
              onClick={() => handleTabClick(continent)}
              className={cn(
                "whitespace-nowrap text-sm font-medium transition-colors relative",
                activeContinent === continent ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {continent}
              {activeContinent === continent && (
                <motion.div 
                  layoutId="continent-tab-indicator"
                  className="absolute -bottom-3 left-0 right-0 h-0.5 bg-cyan-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-10 pb-32 hide-scrollbar">
        {continents.map(continent => (
          <div key={continent} id={`continent-${continent}`} className="scroll-mt-24">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-cyan-500 rounded-r-full shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
              <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-widest">{continent}</h2>
              <span className="text-xs text-slate-500 font-mono ml-auto opacity-60">
                {CITIES_BY_CONTINENT[continent].length} CITIES
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {CITIES_BY_CONTINENT[continent].map((city, idx) => (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                  transition={{ delay: idx * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-lg cursor-pointer group"
                >
                  <div className="relative h-32 w-full overflow-hidden">
                    <img 
                      src={city.image} 
                      alt={city.name}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-80" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                       <div className="w-10 h-10 rounded-full bg-cyan-500/90 text-black flex items-center justify-center pl-1 shadow-[0_0_15px_rgba(34,211,238,0.6)]">
                          <Play size={18} className="fill-black" />
                       </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-white/5 to-transparent">
                    <h3 className="text-slate-100 font-bold text-sm tracking-wide">{city.name}</h3>
                    <p className="text-[10px] text-cyan-300 font-mono mt-0.5 opacity-80">{city.englishName}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
