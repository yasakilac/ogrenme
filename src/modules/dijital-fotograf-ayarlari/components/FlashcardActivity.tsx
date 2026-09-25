import React, { useState } from 'react';
import { RotateCcw, Check, ChevronLeft, ChevronRight, Aperture, Timer, Sparkles, SunMedium } from 'lucide-react';
import { FLASHCARDS_DATA, type FlashcardItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';

interface FlashcardActivityProps {
  onScoreUpdate?: (points: number) => void;
}

const CATEGORY_ICON: Record<FlashcardItem['category'], React.ElementType> = {
  Diyafram: Aperture,
  Enstantane: Timer,
  ISO: Sparkles,
  Pozlama: SunMedium,
};

export const FlashcardActivity: React.FC<FlashcardActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  const card: FlashcardItem = FLASHCARDS_DATA[currentIndex];
  const isMastered = masteredCards[card.id] || false;
  const CategoryIcon = CATEGORY_ICON[card.category];

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    cameraAudio.playDialTick();
  };

  const goTo = (index: number) => {
    setIsFlipped(false);
    setCurrentIndex((index + FLASHCARDS_DATA.length) % FLASHCARDS_DATA.length);
  };

  const handleAgain = () => {
    cameraAudio.playDialTick();
    goTo(currentIndex + 1);
  };

  const handleKnow = () => {
    if (!isMastered) {
      setMasteredCards((prev) => ({ ...prev, [card.id]: true }));
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(10);
    }
    goTo(currentIndex + 1);
  };

  const masteredCount = Object.values(masteredCards).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => goTo(currentIndex - 1)}
          aria-label="Önceki kart"
          className="w-11 h-11 rounded-full bg-white border shrink-0 flex items-center justify-center"
          style={{ borderColor: '#E6E0D6' }}
        >
          <ChevronLeft className="w-5 h-5" style={{ color: '#1C1B19' }} />
        </button>
        <div className="text-center">
          <span className="text-sm font-bold block" style={{ color: '#6B665E' }}>
            Kart {currentIndex + 1} / {FLASHCARDS_DATA.length}
          </span>
          <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
            {masteredCount} öğrenildi
          </span>
        </div>
        <button
          type="button"
          onClick={() => goTo(currentIndex + 1)}
          aria-label="Sonraki kart"
          className="w-11 h-11 rounded-full bg-white border shrink-0 flex items-center justify-center"
          style={{ borderColor: '#E6E0D6' }}
        >
          <ChevronRight className="w-5 h-5" style={{ color: '#1C1B19' }} />
        </button>
      </div>

      <button
        type="button"
        onClick={handleFlip}
        aria-label="Kartı çevir"
        className="w-full min-h-[440px] rounded-[30px] border-none p-7 flex flex-col items-center justify-center gap-5 relative transition-colors"
        style={{ background: isFlipped ? '#1F2A44' : '#FFFFFF', color: isFlipped ? '#FFFFFF' : '#1C1B19' }}
      >
        <span
          className="absolute top-[18px] right-[18px] w-10 h-10 rounded-[20px] flex items-center justify-center"
          style={{ background: isFlipped ? '#2E3D5F' : '#F7F4EE' }}
          aria-hidden="true"
        >
          <RotateCcw className="w-5 h-5" style={{ color: isFlipped ? '#FFFFFF' : '#1C1B19' }} />
        </span>

        {!isFlipped ? (
          <>
            <span
              className="w-[120px] h-[120px] rounded-[36px] flex items-center justify-center"
              style={{ background: 'var(--accent-light)' }}
            >
              <CategoryIcon className="w-[60px] h-[60px]" style={{ color: 'var(--accent)' }} strokeWidth={1.6} />
            </span>
            <span className="font-display font-extrabold text-[34px] leading-tight text-center" style={{ letterSpacing: '-0.02em' }}>
              {card.title}
            </span>
            <span className="font-bold text-[17px] text-center" style={{ color: '#6B665E' }}>
              {card.summary}
            </span>
          </>
        ) : (
          <div className="w-full max-w-[290px] flex flex-col gap-3.5">
            <div className="rounded-[20px] p-4 flex flex-col gap-2 text-left" style={{ background: '#2E3D5F' }}>
              <span className="font-display font-extrabold text-lg" style={{ color: '#FCD34D' }}>
                Optik Detay
              </span>
              <span className="font-bold text-[15px]" style={{ color: '#C7D0E4' }}>
                {card.details}
              </span>
            </div>
            <div className="rounded-[20px] p-4 flex flex-col gap-2 text-left" style={{ background: '#2E3D5F' }}>
              <span className="font-display font-extrabold text-lg" style={{ color: '#FCD34D' }}>
                Altın Kural
              </span>
              <span className="font-bold text-[15px]" style={{ color: '#FFFFFF' }}>
                {card.formulaOrRule}
              </span>
              <span className="font-semibold text-sm" style={{ color: '#C7D0E4' }}>
                {card.visualEffect}
              </span>
            </div>
          </div>
        )}
      </button>

      <div className="flex justify-center flex-wrap gap-1.5 px-4">
        {FLASHCARDS_DATA.map((c, i) => (
          <span
            key={c.id}
            aria-hidden="true"
            className="block h-2 rounded-full transition-all"
            style={{
              width: i === currentIndex ? 28 : 8,
              background: i <= currentIndex ? 'var(--accent)' : '#DDD5C8',
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleAgain}
          aria-label="Tekrar çalış"
          className="h-[60px] rounded-[18px] flex items-center justify-center gap-2 font-extrabold text-base"
          style={{ background: '#FFEDD5', border: '2px solid #C2410C', color: '#7C2D12' }}
        >
          <RotateCcw className="w-5 h-5" strokeWidth={2.4} />
          <span>Tekrar</span>
        </button>
        <button
          type="button"
          onClick={handleKnow}
          aria-label="Bu kavramı biliyorum"
          className="h-[60px] rounded-[18px] flex items-center justify-center gap-2 font-extrabold text-base"
          style={{ background: '#DBEAFE', border: '2px solid #1D4ED8', color: '#1E3A8A' }}
        >
          <Check className="w-5 h-5" strokeWidth={3} />
          <span>Biliyorum</span>
        </button>
      </div>
    </div>
  );
};
