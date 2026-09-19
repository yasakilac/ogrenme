import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  PenTool, 
  BookOpen, 
  LayoutDashboard, 
  ShieldCheck, 
  User, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ActiveTab } from '../types';

interface MoreDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenUserModal: () => void;
  onOpenAdminModal: () => void;
}

export const MoreDrawerModal: React.FC<MoreDrawerModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenUserModal,
  onOpenAdminModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white border border-[#E6E1D8] rounded-t-3xl sm:rounded-3xl w-full max-w-sm shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#E6E1D8]">
          <span className="font-black text-base text-[#1F1E1B]">Diğer Bölümler & Ayarlar</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#F2EFE9] flex items-center justify-center text-[#7A756D]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => { onSelectTab('drawing'); onClose(); }}
            className="w-full p-3 rounded-2xl bg-[#FAF8F5] hover:bg-white border border-[#E6E1D8] flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#1F1E1B] block">Çizim Tuvali</span>
                <span className="text-xs text-[#7A756D]">Doğru fırça vuruşlarıyla el yazısı pratiği</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#7A756D]" />
          </button>

          <button
            onClick={() => { onSelectTab('guide'); onClose(); }}
            className="w-full p-3 rounded-2xl bg-[#FAF8F5] hover:bg-white border border-[#E6E1D8] flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#1F1E1B] block">Konu Anlatımı & Rehber</span>
                <span className="text-xs text-[#7A756D]">Japonca alfabe kuralları ve ipuçları</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#7A756D]" />
          </button>

          <button
            onClick={() => { onSelectTab('dashboard'); onClose(); }}
            className="w-full p-3 rounded-2xl bg-[#FAF8F5] hover:bg-white border border-[#E6E1D8] flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#1F1E1B] block">Detaylı İstatistikler</span>
                <span className="text-xs text-[#7A756D]">Başarı grafiği ve harf ustalık dökümü</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#7A756D]" />
          </button>
        </div>

        <div className="pt-2 border-t border-[#E6E1D8] space-y-2">
          <button
            onClick={() => { onClose(); onOpenUserModal(); }}
            className="w-full p-3 rounded-2xl bg-white border border-[#E6E1D8] flex items-center justify-between text-left hover:border-rose-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#1F1E1B] block">Kullanıcı / Profil Değiştir</span>
                <span className="text-xs text-[#7A756D]">Farklı öğrenci profilleri yönet</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#7A756D]" />
          </button>

          <button
            onClick={() => { onClose(); onOpenAdminModal(); }}
            className="w-full p-3 rounded-2xl bg-[#1F1E1B] text-white flex items-center justify-between text-left hover:bg-black transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Yönetici Paneli (Admin)</span>
                <span className="text-xs text-gray-300">Yeni kelimeler, ses ayarları, veri yedekleme</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
