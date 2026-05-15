import { useState } from 'react';
import { Compass, Trophy, Map as MapIcon, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HomeTab from './components/HomeTab';
import EventsTab from './components/EventsTab';
import { CITIES } from './data/cities';
import CitiesTab from './components/CitiesTab';
import ProfileTab from './components/ProfileTab';
import CityRoutesView from './components/CityRoutesView';
import RouteDetailView from './components/RouteDetailView';
import RunPlaybackView from './components/RunPlaybackView';
import LitRecordsView from './components/LitRecordsView';
import LeaderboardView from './components/LeaderboardView';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [fullScreenPage, setFullScreenPage] = useState<{type: 'cityRoutes' | 'routeDetail' | 'runPlayback' | 'litRecords' | 'leaderboard', data?: any} | null>(null);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [targetFlight, setTargetFlight] = useState<{fromCityId: string, toCityId: string} | null>(null);
  const [userStats, setUserStats] = useState({
    completedCities: 3,
    completedRoutes: 36,
    totalDistance: 62.0,
    totalTimeHours: 12.0
  });

  const tabs = [
    { id: 'home', label: '首页', icon: Compass },
    { id: 'events', label: '活动', icon: Trophy },
    { id: 'cities', label: '城市', icon: MapIcon },
    { id: 'profile', label: '我的', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab onNavigate={(type, data) => setFullScreenPage({ type, data })} completedChapters={completedChapters} targetFlight={targetFlight} onFlightComplete={() => {
          if (targetFlight) {
            const nextCity = CITIES.find(c => c.id === targetFlight.toCityId);
            if (nextCity && nextCity.status === 'unlit') {
              nextCity.status = 'in-progress';
            }
          }
          setTargetFlight(null);
        }} />;
      case 'events':
        return <EventsTab />;
      case 'cities':
        return <CitiesTab onCityClick={(city) => setFullScreenPage({ type: 'cityRoutes', data: city })} />;
      case 'profile':
        return <ProfileTab userStats={userStats} />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-[#05070A] text-slate-100 overflow-hidden relative font-sans shadow-2xl sm:h-[800px] sm:mt-10 sm:rounded-[40px] sm:border-[8px] sm:border-slate-800">
      <main className="flex-1 relative overflow-hidden bg-[#05070A]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="px-6 py-3 shrink-0 bg-black/80 backdrop-blur-2xl border-t border-white/10 pb-3 sm:pb-3 z-50">
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-white'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : ''} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Full Screen Pages overlays on top of everything including bottom nav */}
      <AnimatePresence>
        {fullScreenPage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 z-[100] bg-[#05070A]"
          >
            {fullScreenPage.type === 'cityRoutes' && (
               <CityRoutesView 
                 city={fullScreenPage.data} 
                 onBack={() => setFullScreenPage(null)} 
                 onRouteClick={(routeIndex) => setFullScreenPage({ 
                   type: 'routeDetail', 
                   data: { cityId: fullScreenPage.data.id, routeIndex, image: fullScreenPage.data.image, previousCityData: fullScreenPage.data } 
                 })} 
                 onExploreNext={(currentCityId) => {
                   const currentIndex = CITIES.findIndex(c => c.id === currentCityId);
                   let nextIndex = (currentIndex + 1) % CITIES.length;
                   while (CITIES[nextIndex].status === 'lit' && nextIndex !== currentIndex) {
                     nextIndex = (nextIndex + 1) % CITIES.length;
                   }
                   const nextCity = CITIES[nextIndex];
                   setTargetFlight({ fromCityId: currentCityId, toCityId: nextCity.id });
                   setFullScreenPage(null);
                   setActiveTab('home');
                 }}
               />
            )}
            {fullScreenPage.type === 'routeDetail' && (
               <RouteDetailView 
                 {...fullScreenPage.data}
                 onBack={() => setFullScreenPage({ type: 'cityRoutes', data: fullScreenPage.data.previousCityData })}
                 onStart={() => setFullScreenPage({ type: 'runPlayback', data: fullScreenPage.data })}
               />
            )}
            {fullScreenPage.type === 'runPlayback' && (
               <RunPlaybackView 
                 {...fullScreenPage.data}
                 onExit={() => setFullScreenPage({ type: 'routeDetail', data: fullScreenPage.data })}
                 onComplete={(stats) => {
                   // Update user stats
                   setUserStats(prev => ({
                     ...prev,
                     totalDistance: prev.totalDistance + stats.distance,
                     totalTimeHours: prev.totalTimeHours + (stats.duration / 3600),
                     // completedRoutes and completedCities could be updated later below if it's a new route
                   }));

                   const { previousCityData, routeIndex } = fullScreenPage.data;
                   const currentCompleted = previousCityData.completedRouteIndices || [];
                   
                   if (!currentCompleted.includes(routeIndex)) {
                     previousCityData.completedRouteIndices = [...currentCompleted, routeIndex];
                     previousCityData.completed = Math.min(previousCityData.completed + 1, previousCityData.routes);
                     
                     // If this is a newly completed route, increment completedRoutes counter
                     setUserStats(prev => ({ ...prev, completedRoutes: prev.completedRoutes + 1 }));
                   }
                   
                   if (previousCityData.completed === previousCityData.routes && previousCityData.status !== 'lit') {
                     previousCityData.status = 'lit';
                     previousCityData.justLit = true;
                     // Increment completed cities counter
                     setUserStats(prev => ({ ...prev, completedCities: prev.completedCities + 1 }));
                   }

                   setCompletedChapters(prev => {
                     const newChapters = [...prev];
                     // Chapter 1: Complete 1 route
                     if (!newChapters.includes(1)) newChapters.push(1);
                     // Chapter 2: Complete 1 city
                     if (previousCityData.status === 'lit' && !newChapters.includes(2)) {
                       newChapters.push(2);
                     }
                     
                     const litCount = CITIES.filter(c => c.status === 'lit').length;
                     if (litCount >= 3) {
                       if (!newChapters.includes(3)) newChapters.push(3);
                     }
                     if (litCount >= CITIES.length) {
                       if (!newChapters.includes(4)) newChapters.push(4);
                     }
                     
                     return newChapters;
                   });

                   // Navigate back to cityRoutes with the updated data
                   setFullScreenPage({ type: 'cityRoutes', data: { ...previousCityData } });
                 }}
               />
            )}
            {fullScreenPage.type === 'litRecords' && (
              <LitRecordsView onBack={() => setFullScreenPage(null)} />
            )}
            {fullScreenPage.type === 'leaderboard' && (
              <LeaderboardView onBack={() => setFullScreenPage(null)} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
