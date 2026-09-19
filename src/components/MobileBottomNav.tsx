import React from 'react';
import { ActiveTab } from '../types';
import { 
  Home, 
  Grid3X3, 
  Sparkles,
  PenTool,
  Settings
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings
}) => {
  // Navigation: Exactly 4 sections (Ana Sayfa, Harf Tablosu, Alıştırmalar, Çizim)
  const navItems = [
    { id: 'home' as ActiveTab, label: 'Ana Sayfa', icon: Home },
    { id: 'table' as ActiveTab, label: 'Tablo', icon: Grid3X3 },
    { id: 'practice' as ActiveTab, label: 'Alıştırma', icon: Sparkles },
    { id: 'drawing' as ActiveTab, label: 'Çizim', icon: PenTool },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E6E1D8] px-2 py-1 shadow-lg">
      <div className="grid grid-cols-5 items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id ||
            (item.id === 'practice' && (activeTab === 'flashcards' || activeTab === 'visual_words' || activeTab === 'quiz'));

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-rose-700 font-bold'
                  : 'text-[#7A756D] hover:text-[#1F1E1B] font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-rose-600 scale-110' : 'text-[#7A756D]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-rose-600 mt-0.5" />
              )}
            </button>
          );
        })}

        {/* Settings button: ICON ONLY, no text label */}
        <button
          id="mobile-nav-settings"
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[#7A756D] hover:text-rose-600 transition-all"
          title="Ayarlar"
          aria-label="Ayarlar"
        >
          <Settings className="w-5 h-5 text-rose-600" />
        </button>
      </div>
    </div>
  );
};
