import React from 'react';
import { ActiveTab, AlphabetType } from '../types';
import { 
  Home,
  Grid3X3, 
  Sparkles,
  PenTool,
  Settings
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  alphabet: AlphabetType;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  alphabet,
  onOpenSettings
}) => {
  // Only 4 main sections requested: Ana Sayfa, Harf Tablosu, Alıştırmalar, Çizim
  const desktopTabs = [
    { id: 'home' as ActiveTab, label: 'Ana Sayfa', icon: Home },
    { id: 'table' as ActiveTab, label: 'Harf Tablosu', icon: Grid3X3 },
    { id: 'practice' as ActiveTab, label: 'Alıştırmalar', icon: Sparkles },
    { id: 'drawing' as ActiveTab, label: 'Çizim', icon: PenTool },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6E1D8] shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Brand & Identity */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none shrink-0 group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center font-bold text-base shadow-2xs border border-rose-700/20 font-japanese group-hover:scale-105 transition-transform">
              {alphabet === 'hiragana' ? 'あ' : 'ア'}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black text-[#1F1E1B] tracking-tight">
                Japonca Kana
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800">
                {alphabet === 'hiragana' ? 'Hiragana' : 'Katakana'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation: Exactly 4 sections */}
          <nav className="hidden md:flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
            {desktopTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id || 
                (tab.id === 'practice' && (activeTab === 'flashcards' || activeTab === 'visual_words' || activeTab === 'quiz'));

              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 ${
                    isActive
                      ? 'bg-white text-rose-700 shadow-2xs border border-[#E6E1D8]'
                      : 'text-[#5C574F] hover:text-[#1F1E1B] hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-[#7A756D]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Settings Icon: ONLY icon, no text label */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-navbar-settings"
              onClick={onOpenSettings}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#E6E1D8] hover:border-rose-300 text-[#1F1E1B] flex items-center justify-center transition-all shadow-2xs active:scale-95 group"
              title="Ayarlar & Tercihler"
              aria-label="Ayarlar"
            >
              <Settings className="w-5 h-5 text-rose-600 group-hover:rotate-45 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
