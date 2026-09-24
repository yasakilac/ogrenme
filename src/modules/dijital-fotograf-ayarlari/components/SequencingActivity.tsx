import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Check, RotateCcw } from 'lucide-react';
import { SEQUENCE_ITEMS, type SequenceItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG, PrimaryButton, CheckBar } from '../../../components/ui';

interface SequencingActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const SequencingActivity: React.FC<SequencingActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const item: SequenceItem = SEQUENCE_ITEMS[currentIndex];

  const [currentOrder, setCurrentOrder] = useState<SequenceItem['items']>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  useEffect(() => {
    const shuffled = [...item.items].sort(() => Math.random() - 0.5);
    setCurrentOrder(shuffled);
    setIsSubmitted(false);
    setIsCorrect(false);
  }, [currentIndex, item]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (isSubmitted) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const copy = [...currentOrder];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setCurrentOrder(copy);
    cameraAudio.playDialTick();
  };

  const handleCheckOrder = () => {
    const correct = currentOrder.every((elem, idx) => elem.correctOrder === idx + 1);
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(20);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleReset = () => {
    const shuffled = [...item.items].sort(() => Math.random() - 0.5);
    setCurrentOrder(shuffled);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SEQUENCE_ITEMS.length);
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-sm font-bold block" style={{ color: '#6B665E' }}>
          Sıralama {currentIndex + 1} / {SEQUENCE_ITEMS.length}
        </span>
        <h2 className="font-display text-xl font-extrabold mt-0.5" style={{ color: '#1C1B19' }}>
          {item.title}
        </h2>
        <p className="text-sm mt-0.5" style={{ color: '#6B665E' }}>
          {item.instruction}
        </p>
      </div>

      <div className="space-y-2">
        {currentOrder.map((it, idx) => {
          let style: { bg: string; border: string; fg: string } = { bg: '#FFFFFF', border: '#E6E0D6', fg: '#1C1B19' };
          if (isSubmitted) style = it.correctOrder === idx + 1 ? CORRECT : WRONG;

          return (
            <div
              key={it.id}
              style={{ background: style.bg, border: `1px solid ${style.border}` }}
              className="p-3.5 rounded-[18px] flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0"
                  style={{ background: isSubmitted ? style.border : 'var(--accent-light)', color: isSubmitted ? '#FFFFFF' : 'var(--accent)' }}
                >
                  {idx + 1}
                </span>
                <div>
                  <span className="font-bold text-sm block" style={{ color: style.fg }}>{it.label}</span>
                  <span className="text-[11px]" style={{ color: isSubmitted ? style.fg : '#7A7670' }}>{it.hint}</span>
                </div>
              </div>

              {!isSubmitted && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    aria-label="Yukarı taşı"
                    className="w-8 h-8 rounded-lg border flex items-center justify-center disabled:opacity-30"
                    style={{ borderColor: '#E6E0D6', background: '#FFFFFF' }}
                  >
                    <ArrowUp className="w-4 h-4" style={{ color: '#1C1B19' }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === currentOrder.length - 1}
                    aria-label="Aşağı taşı"
                    className="w-8 h-8 rounded-lg border flex items-center justify-center disabled:opacity-30"
                    style={{ borderColor: '#E6E0D6', background: '#FFFFFF' }}
                  >
                    <ArrowDown className="w-4 h-4" style={{ color: '#1C1B19' }} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isSubmitted ? (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            aria-label="Baştan"
            className="w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0"
            style={{ background: '#FFFFFF', border: '1px solid #E6E0D6' }}
          >
            <RotateCcw className="w-5 h-5" style={{ color: '#1C1B19' }} />
          </button>
          <PrimaryButton onClick={handleCheckOrder} icon={Check} className="flex-grow">
            Kontrol
          </PrimaryButton>
        </div>
      ) : (
        <CheckBar correct={isCorrect} message={item.explanation} onNext={handleNext} />
      )}
    </div>
  );
};
