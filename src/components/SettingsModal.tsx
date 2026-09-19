import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  X, 
  Volume2, 
  Flame, 
  User, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Lock,
  LogOut,
  ChevronRight,
  Award
} from 'lucide-react';
import { AlphabetType, UserProgressData, UserProfile } from '../types';
import { soundManager } from '../utils/sound';
import { loadProfiles, getActiveUserId, setActiveUserId } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alphabet: AlphabetType;
  setAlphabet: (alp: AlphabetType) => void;
  progress: UserProgressData;
  onOpenUserModal: () => void;
  onOpenAdminModal: () => void;
  onUserChanged: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  alphabet,
  setAlphabet,
  progress,
  onOpenUserModal,
  onOpenAdminModal,
  onUserChanged
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');

  const profiles = loadProfiles();
  const activeUserId = getActiveUserId();
  const activeProfile = profiles.find((p) => p.id === activeUserId) || profiles[0];
  const isAdmin = activeProfile?.role === 'admin';

  useEffect(() => {
    const unsub = soundManager.addListener((speaking) => {
      setIsPlayingAudio(speaking);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleTestAudio = () => {
    soundManager.speak(alphabet === 'hiragana' ? 'あ' : 'ア');
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Accept standard admin pins: "admin", "1234", or "ilyas"
    const cleaned = adminPin.trim().toLowerCase();
    if (cleaned === 'admin' || cleaned === '1234' || cleaned === 'ilyas') {
      // Find or activate admin profile
      let adminProfile = profiles.find((p) => p.role === 'admin');
      if (adminProfile) {
        setActiveUserId(adminProfile.id);
      }
      setAdminPin('');
      setPinError('');
      setShowAdminLogin(false);
      onUserChanged();
    } else {
      setPinError('Geçersiz yönetici şifresi. (Varsayılan: admin veya 1234)');
    }
  };

  const handleAdminLogout = () => {
    // Switch to first student profile
    const studentProfile = profiles.find((p) => p.role === 'student') || profiles[0];
    if (studentProfile) {
      setActiveUserId(studentProfile.id);
      onUserChanged();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-[#E6E1D8] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E6E1D8] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1F1E1B]">Ayarlar ve Tercihler</h2>
              <p className="text-xs text-[#7A756D]">Alfabe seçimi, ses ayarları ve profil</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-[#F2EFE9] flex items-center justify-center text-[#7A756D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          
          {/* 1. ALFABE SEÇİMİ (HIRAGANA / KATAKANA) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#7A756D] uppercase tracking-wider block">
              Aktif Çalışma Alfabesi
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                id="settings-select-hiragana"
                onClick={() => setAlphabet('hiragana')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  alphabet === 'hiragana'
                    ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200 shadow-2xs'
                    : 'bg-[#FAF8F5] border-[#E6E1D8] hover:bg-white hover:border-rose-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E6E1D8] flex items-center justify-center text-rose-700 font-japanese font-black text-xl shadow-2xs">
                    あ
                  </div>
                  <div>
                    <span className="font-black text-sm text-[#1F1E1B] block">Hiragana</span>
                    <span className="text-[11px] text-[#7A756D]">Temel Hece Sistemi</span>
                  </div>
                </div>
                {alphabet === 'hiragana' && (
                  <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>

              <button
                type="button"
                id="settings-select-katakana"
                onClick={() => setAlphabet('katakana')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  alphabet === 'katakana'
                    ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-200 shadow-2xs'
                    : 'bg-[#FAF8F5] border-[#E6E1D8] hover:bg-white hover:border-amber-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E6E1D8] flex items-center justify-center text-amber-700 font-japanese font-black text-xl shadow-2xs">
                    ア
                  </div>
                  <div>
                    <span className="font-black text-sm text-[#1F1E1B] block">Katakana</span>
                    <span className="text-[11px] text-[#7A756D]">Yabancı Kelimeler</span>
                  </div>
                </div>
                {alphabet === 'katakana' && (
                  <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* 2. DOĞAL SES & HOPARLÖR TESTİ */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D8] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#1F1E1B] block">Doğal İnsan Sesi Testi</span>
                <span className="text-xs text-[#7A756D]">Tokyo yerlisi stüdyo kayıt sesini kontrol et</span>
              </div>
            </div>

            <button
              type="button"
              id="settings-test-audio-btn"
              onClick={handleTestAudio}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0 ${
                isPlayingAudio
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-white border border-[#E6E1D8] hover:border-rose-300 text-rose-700'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? 'Çalınıyor...' : 'Sesi Test Et'}</span>
            </button>
          </div>

          {/* 3. ÇALIŞMA SERİSİ & İSTATİSTİK ÖZETİ */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <Flame className="w-5 h-5 text-amber-600 fill-amber-500" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-900 block">Çalışma Serisi</span>
                <span className="text-sm sm:text-base font-black text-amber-950">
                  {progress.stats.streakDays} Gün
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-900 block">Tamamlanan Test</span>
                <span className="text-sm sm:text-base font-black text-emerald-950">
                  {progress.stats.totalQuizzesCompleted} Oturum
                </span>
              </div>
            </div>
          </div>

          {/* 4. KULLANICI / ÖĞRENCİ PROFİLİ */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D8] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#7A756D] uppercase tracking-wider">
                Aktif Kullanıcı
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenUserModal();
                }}
                className="text-xs font-bold text-rose-700 hover:text-rose-800 transition-colors"
              >
                Profil Değiştir
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E6E1D8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeProfile.avatar}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#1F1E1B]">{activeProfile.name}</span>
                    {isAdmin ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        Yönetici
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                        Öğrenci
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#7A756D]">
                    {isAdmin ? 'Tam yönetim ve kelime yetkisi' : 'Öğrenci çalışma modu'}
                  </span>
                </div>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={handleAdminLogout}
                  className="p-2 text-[#7A756D] hover:text-rose-700 transition-colors"
                  title="Yönetici modundan çık (Öğrenciye geç)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 5. YÖNETİCİ PANELİ: SADECE ADMİN GİRİŞİ YAPILDIĞINDA GÖZÜKÜR */}
          {isAdmin ? (
            <div className="p-4 rounded-2xl bg-[#1F1E1B] text-white space-y-3 shadow-sm border border-stone-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-black text-sm text-white">Yönetici Paneli</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Admin Açık
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Kelimeleri düzenleyin, yeni görseller ekleyin, stüdyo seslerini yönetin veya yedek alın.
              </p>
              <button
                type="button"
                id="settings-open-admin-btn"
                onClick={() => {
                  onClose();
                  onOpenAdminModal();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Yönetici Panelini Aç</span>
              </button>
            </div>
          ) : (
            /* Admin Girişi Yapma Alanı (Normalde sadece gizli bir giriş seçeneği) */
            <div className="pt-2 border-t border-[#F0ECE4]">
              {!showAdminLogin ? (
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(true)}
                  className="text-xs font-semibold text-[#8C877E] hover:text-[#1F1E1B] flex items-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Yönetici Girişi</span>
                </button>
              ) : (
                <form onSubmit={handleAdminLoginSubmit} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D8] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F1E1B] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-rose-600" />
                      Yönetici Şifresi
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAdminLogin(false)}
                      className="text-xs text-[#7A756D] hover:text-black"
                    >
                      Kapat
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      placeholder="Şifre girin (örn: admin)"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#E6E1D8] text-xs text-[#1F1E1B] focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-all shadow-2xs"
                    >
                      Giriş
                    </button>
                  </div>
                  {pinError && (
                    <span className="text-[11px] text-rose-600 font-semibold block">{pinError}</span>
                  )}
                </form>
              )}
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
