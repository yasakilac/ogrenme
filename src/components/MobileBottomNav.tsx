import React from 'react';
import { ActiveTab } from '../types';
import { 
  Home, 
  Grid3X3, 
  Image as ImageIcon, 
  Layers, 
  HelpCircle,
  MoreHorizontal
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenMoreMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMoreMenu
}) => {
  const navItems = [
    { id: 'home' as ActiveTab, label: 'Ana Sayfa', icon: Home },
    { id: 'visual_words' as ActiveTab, label: 'Görsel', icon: ImageIcon, badge: 'Yeni' },
    { id: 'table' as ActiveTab, label: 'Tablo', icon: Grid3X3 },
    { id: 'flashcards' as ActiveTab, label: 'Kartlar', icon: Layers },
    { id: 'quiz' as ActiveTab, label: 'Test', icon: HelpCircle },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E6E1D8] px-2 py-1.5 shadow-lg">
      <div className="grid grid-cols-6 items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-rose-700 font-bold'
                  : 'text-[#7A756D] hover:text-[#1F1E1B] font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-rose-600 scale-110' : 'text-[#7A756D]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[8px] font-black bg-rose-600 text-white uppercase">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-rose-600 mt-0.5" />
              )}
            </button>
          );
        })}

        {/* More Menu button */}
        <button
          onClick={onOpenMoreMenu}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[#7A756D] hover:text-[#1F1E1B] transition-all"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Diğer</span>
        </button>
      </div>
    </div>
  );
};
