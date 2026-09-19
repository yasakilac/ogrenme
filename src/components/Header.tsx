import React, { useState, useEffect } from 'react';
import { ActiveTab, AlphabetType, UserProfile } from '../types';
import { 
  Home,
  Grid3X3, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  Volume2, 
  Flame,
  Image as ImageIcon,
  ShieldCheck,
  User,
  PenTool
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import { loadProfiles, getActiveUserId } from '../utils/storage';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  alphabet: AlphabetType;
  setAlphabet: (alp: AlphabetType) => void;
  streakDays: number;
  onOpenUserModal: () => void;
  onOpenAdminModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  alphabet,
  setAlphabet,
  streakDays,
  onOpenUserModal,
  onOpenAdminModal
}) => {
  const [isPlayingTestSound, setIsPlayingTestSound] = useState(false);
  const profiles = loadProfiles();
  const activeUserId = getActiveUserId();
  const activeProfile = profiles.find((p) => p.id === activeUserId) || profiles[0];

  useEffect(() => {
    const unsub = soundManager.addListener((speaking) => {
      setIsPlayingTestSound(speaking);
    });
    return unsub;
  }, []);

  const desktopTabs = [
    { id: 'home' as ActiveTab, label: 'Başlangıç & Müfredat', icon: Home },
    { id: 'table' as ActiveTab, label: 'Harf Tablosu', icon: Grid3X3 },
    { id: 'visual_words' as ActiveTab, label: 'Resimli Kelimeler', icon: ImageIcon, badge: 'Yeni' },
    { id: 'flashcards' as ActiveTab, label: 'Ezber Kartları', icon: Layers },
    { id: 'quiz' as ActiveTab, label: 'Alıştırmalar', icon: HelpCircle },
    { id: 'drawing' as ActiveTab, label: 'Çizim', icon: PenTool },
    { id: 'guide' as ActiveTab, label: 'Rehber', icon: BookOpen },
  ];

  const handleTestAudio = () => {
    soundManager.speak(alphabet === 'hiragana' ? 'あ' : 'ア');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6E1D8] shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Navbar Top Row */}
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
          
          {/* Brand & Identity */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center font-bold text-xl shadow-xs border border-rose-700/20 font-japanese">
              {alphabet === 'hiragana' ? 'あ' : 'ア'}
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-black text-[#1F1E1B] tracking-tight">
                  Japonca Kana
                </span>
                <span className="px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-full bg-rose-100 text-rose-800">
                  {alphabet === 'hiragana' ? 'Hiragana' : 'Katakana'}
                </span>
              </div>
              <p className="text-[11px] text-[#7A756D] hidden md:block">
                Gerçek insan sesleri, konu takibi ve resimli kelime ezberi
              </p>
            </div>
          </div>

          {/* Right Controls: User Profile + Audio Test + Alphabet Switcher + Admin Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Alphabet Toggle Pill */}
            <div className="hidden sm:flex items-center bg-[#EBE7DF] p-1 rounded-2xl border border-[#DDD6CB]">
              <button
                id="btn-select-hiragana"
                onClick={() => setAlphabet('hiragana')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  alphabet === 'hiragana'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-[#6C675E] hover:text-[#1F1E1D]'
                }`}
              >
                あ Hiragana
              </button>
              
              <button
                id="btn-select-katakana"
                onClick={() => setAlphabet('katakana')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  alphabet === 'katakana'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-[#6C675E] hover:text-[#1F1E1D]'
                }`}
              >
                ア Katakana
              </button>
            </div>

            {/* Natural Audio Speaker Test Button */}
            <button
              id="btn-audio-check"
              onClick={handleTestAudio}
              title="Gerçek insan sesini test et"
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isPlayingTestSound 
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                  : 'bg-[#EBE7DF]/80 text-[#555047] hover:bg-[#EBE7DF] border-[#DDD6CB]'
              }`}
            >
              <Volume2 className="w-4 h-4 text-rose-600" />
              <span className="hidden lg:inline">Doğal Ses</span>
            </button>

            {/* Streak Counter */}
            <div 
              id="streak-badge"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold"
              title="Günlük çalışma seriniz"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{streakDays}g</span>
            </div>

            {/* User Profile Button */}
            <button
              id="btn-user-profile"
              onClick={onOpenUserModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-[#E6E1D8] text-xs font-bold text-[#1F1E1B] hover:bg-[#F2EFE9] transition-all shadow-xs"
              title="Kullanıcı / Öğrenci Değiştir"
            >
              <span className="text-base">{activeProfile.avatar}</span>
              <span className="hidden sm:inline max-w-[80px] truncate">{activeProfile.name}</span>
            </button>

            {/* Admin Panel Button */}
            <button
              id="btn-open-admin"
              onClick={onOpenAdminModal}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#1F1E1B] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              title="Yönetici Paneli (Kelime & Veri Yönetimi)"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Yönetim</span>
            </button>
          </div>
        </div>

        {/* Desktop Tab Navigation Bar */}
        <nav className="hidden md:flex space-x-1 border-t border-[#E6E1D8]/60 py-1.5 overflow-x-auto no-scrollbar">
          {desktopTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-rose-700 shadow-2xs border border-[#E6E1D8]'
                    : 'text-[#5C574F] hover:text-[#1F1E1B] hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-600' : 'text-[#7A756D]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-600 text-white uppercase">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
