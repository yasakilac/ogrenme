import React, { useState } from 'react';
import { CATEGORIZE_ITEMS, type CategorizeItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG, CheckBar } from '../../../components/ui';

interface CategorizeActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const CategorizeActivity: React.FC<CategorizeActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userChoices, setUserChoices] = useState<Record<string, { choice: string; isCorrect: boolean }>>({});

  const item: CategorizeItem = CATEGORIZE_ITEMS[currentIndex];
  const userResult = userChoices[item.id];

  const categories = ['Diyafram (f/stop)', 'Enstantane (Süre)', 'ISO (Hassasiyet)'] as const;

  const handleSelectCategory = (cat: (typeof categories)[number]) => {
    if (userResult) return;
    const isCorrect = cat === item.correctCategory;
    setUserChoices((prev) => ({
      ...prev,
      [item.id]: { choice: cat, isCorrect },
    }));

    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(15);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CATEGORIZE_ITEMS.length);
  };

  const correctCount = Object.values(userChoices).filter((c) => c.isCorrect).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: '#6B665E' }}>
          Kart {currentIndex + 1} / {CATEGORIZE_ITEMS.length}
        </span>
        <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
          {correctCount} doğru
        </span>
      </div>

      <div className="rounded-[24px] bg-white p-7 text-center space-y-2" style={{ border: '1px solid #E6E0D6' }}>
        <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: '#77716A' }}>
          Fotoğrafik Etki / Teknik
        </span>
        <p className="text-lg font-bold leading-relaxed" style={{ color: '#1C1B19' }}>
          "{item.text}"
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {categories.map((cat) => {
          const isSelected = userResult?.choice === cat;
          const isCorrectCat = cat === item.correctCategory;

          let style: { bg: string; border: string; fg: string } = { bg: '#FFFFFF', border: '#E6E0D6', fg: '#1C1B19' };
          if (userResult) {
            if (isCorrectCat) style = CORRECT;
            else if (isSelected) style = WRONG;
            else style = { bg: '#FAF8F5', border: '#E6E0D6', fg: '#A39C91' };
          }

          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleSelectCategory(cat)}
              disabled={Boolean(userResult)}
              style={{ background: style.bg, border: `2px solid ${style.border}`, color: style.fg }}
              className="h-14 rounded-[16px] text-sm font-bold transition-all"
            >
              {cat}
            </button>
          );
        })}
      </div>

      {userResult && (
        <CheckBar
          correct={userResult.isCorrect}
          message={`${userResult.isCorrect ? 'Doğru! ' : ''}${item.explanation}`}
          onNext={handleNext}
        />
      )}
    </div>
  );
};
