import React, { useState } from 'react';
import {
  RotateCw,
  CheckCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { FLASHCARDS_DATA, type FlashcardItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';

interface FlashcardActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const FlashcardActivity: React.FC<FlashcardActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  const card: FlashcardItem = FLASHCARDS_DATA[currentIndex];
  const isMastered = masteredCards[card.id] || false;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    cameraAudio.playDialTick();
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % FLASHCARDS_DATA.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + FLASHCARDS_DATA.length) % FLASHCARDS_DATA.length);
  };

  const handleToggleMastered = () => {
    const next = !isMastered;
    setMasteredCards((prev) => ({ ...prev, [card.id]: next }));
    if (next) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(10);
    }
  };

  const masteredCount = Object.values(masteredCards).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Üst Durum & İlerleme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-[20px] border border-[#EBE7E0]">
        <div>
          <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block">
            Kavram Ezberleme Kartları
          </span>
          <h3 className="text-lg font-bold text-[#1F1E1B]">Kavram Flashcardları</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[#7A7670]">
            Öğrenilen: <strong className="text-[var(--accent)] font-bold">{masteredCount}</strong> / {FLASHCARDS_DATA.length}
          </span>
          <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-300"
              style={{ width: `${(masteredCount / FLASHCARDS_DATA.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Kart Konteyneri */}
      <div className="max-w-xl mx-auto perspective-1000">
        <div
          onClick={handleFlip}
          className={`relative min-h-[340px] cursor-pointer rounded-[24px] p-6 sm:p-8 transition-all duration-500 transform shadow-md hover:shadow-lg flex flex-col justify-between select-none ${
            isFlipped
              ? 'bg-[#1F1E1B] text-[#FAF8F5] border-2 border-stone-700'
              : 'bg-white text-[#1F1E1B] border-2 border-[#EBE7E0]'
          }`}
        >
          {/* Kart Üst Başlık & Kategori */}
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isFlipped ? 'bg-stone-800 text-[var(--accent)]' : 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30'
              }`}
            >
              {card.category}
            </span>
            <span className="text-xs opacity-60">
              {currentIndex + 1} / {FLASHCARDS_DATA.length}
            </span>
          </div>

          {/* Kart İçeriği (Ön vs Arka) */}
          <div className="my-auto py-4 text-center">
            {!isFlipped ? (
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#8A8680] uppercase tracking-widest block">KAVRAM</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1E1B]">{card.title}</h2>
                <p className="text-sm text-[#66635E] max-w-md mx-auto leading-relaxed">{card.summary}</p>
                <div className="pt-4 text-xs font-semibold text-[var(--accent)] flex items-center justify-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" /> Detaylar ve kural için karta dokunun
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                <div>
                  <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block mb-1">
                    OPTİK DETAY & MEKANİZMA
                  </span>
                  <p className="text-sm text-stone-300 leading-relaxed">{card.details}</p>
                </div>
                <div className="p-3 bg-stone-900 rounded-[16px] border border-stone-800">
                  <span className="text-xs font-bold text-[var(--accent)] block mb-0.5">Altın Kural:</span>
                  <p className="text-xs text-stone-200 ">{card.formulaOrRule}</p>
                </div>
                <div className="text-xs text-stone-400">
                  <strong>Fotoğraftaki İmzası:</strong> {card.visualEffect}
                </div>
              </div>
            )}
          </div>

          {/* Kart Alt Çevirme İpucu */}
          <div className="pt-2 border-t border-current/10 flex items-center justify-between text-xs opacity-75">
            <span>{isFlipped ? 'Ön yüze dönmek için tıkla' : 'Açıklama ve formül için tıkla'}</span>
            <span className="text-[11px]">Çift Yönlü Kart</span>
          </div>
        </div>

        {/* Navigasyon & Öğrenildi Butonları */}
        <div className="flex items-center justify-between mt-5 px-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-[16px] bg-white border border-[#EBE7E0] hover:bg-stone-100 text-[#1F1E1B] transition-colors"
              title="Önceki Kart"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-[16px] bg-white border border-[#EBE7E0] hover:bg-stone-100 text-[#1F1E1B] transition-colors"
              title="Sonraki Kart"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleToggleMastered}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[16px] font-bold text-xs border transition-all ${
              isMastered
                ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                : 'bg-white text-stone-700 border-[#EBE7E0] hover:bg-[var(--accent-light)] hover:text-[var(--accent)]'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {isMastered ? 'Öğrenildi Olarak İşaretlendi' : 'Bu Kavramı Öğrendim (+10 Puan)'}
          </button>
        </div>
      </div>
    </div>
  );
};
