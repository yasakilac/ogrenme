import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, X, Plus, Check, ShieldCheck, Lock } from 'lucide-react';
import { UserProfile } from '../types';
import { loadProfiles, getActiveUserId, setActiveUserId, createProfile } from '../utils/storage';

interface UserRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserChanged: () => void;
  onOpenAdmin: () => void;
}

export const UserRegisterModal: React.FC<UserRegisterModalProps> = ({
  isOpen,
  onClose,
  onUserChanged,
  onOpenAdmin
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(loadProfiles());
  const [activeId, setActiveId] = useState<string>(getActiveUserId());
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🌸');

  // Admin PIN prompt state
  const [pendingAdminProfileId, setPendingAdminProfileId] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  if (!isOpen) return null;

  const currentProfile = profiles.find((p) => p.id === activeId);
  const isAdmin = currentProfile?.role === 'admin';

  const handleSelect = (profile: UserProfile) => {
    if (profile.role === 'admin' && profile.id !== activeId) {
      // Require PIN to switch to admin
      setPendingAdminProfileId(profile.id);
      setPinInput('');
      setPinError('');
      return;
    }

    setActiveUserId(profile.id);
    setActiveId(profile.id);
    onUserChanged();
    onClose();
  };

  const handleAdminPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = pinInput.trim().toLowerCase();
    if (cleaned === 'admin' || cleaned === '1234' || cleaned === 'ilyas') {
      if (pendingAdminProfileId) {
        setActiveUserId(pendingAdminProfileId);
        setActiveId(pendingAdminProfileId);
        setPendingAdminProfileId(null);
        setPinInput('');
        setPinError('');
        onUserChanged();
        onClose();
      }
    } else {
      setPinError('Hatalı şifre. (Varsayılan: admin veya 1234)');
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newP = createProfile(name.trim(), avatar, 'student');
    setProfiles(loadProfiles());
    setActiveId(newP.id);
    setName('');
    setIsRegistering(false);
    onUserChanged();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-[#E6E1D8] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
              <User className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="font-black text-lg text-[#1F1E1B]">
                Öğrenci & Profil Seçimi
              </h3>
              <p className="text-xs text-[#7A756D]">
                İlerlemen profilin altında güvenle saklanır
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#F2EFE9] flex items-center justify-center text-[#7A756D]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Admin PIN Verification dialog if admin profile clicked */}
        {pendingAdminProfileId && (
          <form onSubmit={handleAdminPinSubmit} className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-700" />
                Yönetici Şifresi Gereklidir
              </span>
              <button
                type="button"
                onClick={() => setPendingAdminProfileId(null)}
                className="text-xs text-amber-800 hover:text-black"
              >
                İptal
              </button>
            </div>
            <p className="text-xs text-amber-800">
              Yönetici hesabına geçmek için şifreyi girin:
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Yönetici şifresi..."
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs text-[#1F1E1B] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all"
              >
                Onayla
              </button>
            </div>
            {pinError && (
              <span className="text-[11px] text-rose-600 font-semibold block">{pinError}</span>
            )}
          </form>
        )}

        {/* Existing profiles */}
        <div className="space-y-2">
          {profiles.map((p) => {
            const isCurrent = p.id === activeId;
            return (
              <div
                key={p.id}
                onClick={() => handleSelect(p)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200'
                    : 'bg-[#FAF8F5] border-[#E6E1D8] hover:border-[#D1CABE]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.avatar}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#1F1E1B]">{p.name}</span>
                      {p.role === 'admin' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                          Yönetici
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#7A756D]">
                      {isCurrent ? 'Şu Anki Profilin' : 'Geçiş Yapmak İçin Tıkla'}
                    </span>
                  </div>
                </div>

                {isCurrent && (
                  <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Register form or open register */}
        {isRegistering ? (
          <form onSubmit={handleCreate} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D8] space-y-3">
            <span className="text-xs font-bold text-[#1F1E1B] block">Yeni Profil Bilgileri</span>
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adın veya takma adın..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6E1D8] text-xs text-[#1F1E1B]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#7A756D] block mb-1">Avatar Emojisi</label>
              <div className="flex gap-2">
                {['🌸', '🎌', '⛩️', '🦊', '🍣', '🍙', '🥋'].map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setAvatar(emoji)}
                    className={`text-xl p-1.5 rounded-xl border transition-all ${
                      avatar === emoji ? 'bg-white border-rose-500 scale-110' : 'bg-white/50 border-transparent'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#5C574F]"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-rose-700 text-white text-xs font-bold hover:bg-rose-800"
              >
                Kaydet & Başla
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsRegistering(true)}
            className="w-full py-2.5 rounded-2xl border border-dashed border-[#D1CABE] text-xs font-bold text-[#5C574F] hover:text-rose-700 hover:border-rose-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Öğrenci Profili Ekle</span>
          </button>
        )}

        {/* Only show Admin shortcut if currently logged in as ADMIN! */}
        {isAdmin && (
          <div className="pt-2 border-t border-[#E6E1D8] flex items-center justify-between text-xs">
            <span className="text-[#7A756D]">Yönetici Hesabı Açık:</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Yönetici Paneli</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
