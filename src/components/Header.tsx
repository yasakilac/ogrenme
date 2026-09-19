import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab, AlphabetType } from '../types';
import { 
  Home,
  Grid3X3, 
  Sparkles,
  PenTool,
  Settings,
  ChevronDown,
  GraduationCap,
  Layers,
  ArrowLeft,
  Check
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  alphabet: AlphabetType;
  onOpenSettings: () => void;
  currentProject: 'japanese' | 'hub';
  onSelectProject: (proj: 'japanese' | 'hub') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  alphabet,
  onOpenSettings,
  currentProject,
  onSelectProject
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const desktopTabs = [
    { id: 'home' as ActiveTab, label: 'Ana Sayfa', icon: Home },
    { id: 'table' as ActiveTab, label: 'Harf Tablosu', icon: Grid3X3 },
    { id: 'practice' as ActiveTab, label: 'Alıştırmalar', icon: Sparkles },
    { id: 'drawing' as ActiveTab, label: 'Çizim', icon: PenTool },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6E1D8] shadow-2xs">
      
      {/* 1. ÜST SEVİYE ÖĞRENME ALANI / PROJE SEÇİCİ ÇUBUĞU (TOP BAR) */}
      <div className="bg-[#1F1E1B] text-[#F4F1EA] text-xs py-1.5 px-3 sm:px-6 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Sol Kısım: Öğrenme Platformu & Proje Seçici Açılır Menü */}
          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            <button
              type="button"
              id="top-menu-hub-button"
              onClick={() => onSelectProject('hub')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-medium ${
                activeTab === 'hub' 
                  ? 'bg-rose-700 text-white font-bold' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Öğrenme Alanları:</span>
              <span>Ana Menü</span>
            </button>

            <span className="text-stone-600">/</span>

            {/* Proje Değiştirici Dropdown */}
            <div className="relative">
              <button
                type="button"
                id="top-menu-project-dropdown"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-bold transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{currentProject === 'japanese' ? '1. Proje: Japonca Öğren' : 'Öğrenme Merkezi'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-64 rounded-2xl bg-white text-[#1F1E1B] border border-[#E6E1D8] shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#7A756D]">
                    Öğrenme Projeleri
                  </div>
                  
                  {/* Proje 1: Japonca (Aktif) */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectProject('japanese');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                      currentProject === 'japanese' && activeTab !== 'hub'
                        ? 'bg-rose-50 border border-rose-200 text-rose-950 font-bold'
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-600 text-white font-japanese text-sm font-black flex items-center justify-center">
                        日
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1F1E1B]">Japonca Öğren</div>
                        <div className="text-[10px] text-[#7A756D]">Hiragana & Katakana</div>
                      </div>
                    </div>
                    {currentProject === 'japanese' && activeTab !== 'hub' && (
                      <Check className="w-4 h-4 text-rose-600" />
                    )}
                  </button>

                  {/* Tüm Alanlar (Hub) */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectProject('hub');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors mt-1 ${
                      activeTab === 'hub'
                        ? 'bg-stone-100 border border-stone-200 text-stone-900 font-bold'
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1F1E1B]">Tüm Öğrenme Alanları</div>
                        <div className="text-[10px] text-[#7A756D]">Gelecek konular ve keşif</div>
                      </div>
                    </div>
                    {activeTab === 'hub' && (
                      <Check className="w-4 h-4 text-stone-900" />
                    )}
                  </button>

                  {/* Gelecek projeler önizlemesi */}
                  <div className="mt-2 pt-2 border-t border-stone-100 px-2 py-1">
                    <span className="text-[10px] text-stone-400 font-semibold block">
                      + Yeni diller & alanlar yakında eklenecek
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sağ Kısım: Hızlı Durum */}
          <div className="flex items-center gap-3">
            {activeTab === 'hub' ? (
              <button
                type="button"
                onClick={() => onSelectProject('japanese')}
                className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <span>Japonca'ya Dön</span>
                <span className="text-xs">→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSelectProject('hub')}
                className="text-[11px] font-bold text-stone-400 hover:text-white flex items-center gap-1"
              >
                <span>Başka Bir Şey Öğren</span>
                <span className="text-xs">↗</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. JAPONCA ÖĞRENME KANA ALTI MENÜSÜ */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Brand & Proje Başlığı */}
          <div 
            onClick={() => {
              if (activeTab === 'hub') {
                onSelectProject('japanese');
              } else {
                setActiveTab('home');
              }
            }}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none shrink-0 group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center font-bold text-base shadow-2xs border border-rose-700/20 font-japanese group-hover:scale-105 transition-transform">
              {alphabet === 'hiragana' ? 'あ' : 'ア'}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black text-[#1F1E1B] tracking-tight">
                Japonca Öğren
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800">
                {alphabet === 'hiragana' ? 'Hiragana' : 'Katakana'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          {activeTab !== 'hub' ? (
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
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectProject('japanese')}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Japonca Bölümüne Geç</span>
              </button>
            </div>
          )}

          {/* Settings Icon */}
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
