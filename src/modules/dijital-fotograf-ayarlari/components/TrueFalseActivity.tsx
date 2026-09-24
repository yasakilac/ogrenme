import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { TRUE_FALSE_ITEMS, type TrueFalseItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG, CheckBar } from '../../../components/ui';

interface TrueFalseActivityProps {
  onScoreUpdate?: (points: number) => void;
}

const IDLE = { bg: '#FFFFFF', border: '#E6E0D6', fg: '#1C1B19' };

export const TrueFalseActivity: React.FC<TrueFalseActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, { choice: boolean; isCorrect: boolean }>>({});

  const item: TrueFalseItem = TRUE_FALSE_ITEMS[currentIndex];
  const userResult = answers[item.id];

  const handleAnswer = (choice: boolean) => {
    if (userResult) return;
    const isCorrect = choice === item.isTrue;
    setAnswers((prev) => ({
      ...prev,
      [item.id]: { choice, isCorrect },
    }));

    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(10);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TRUE_FALSE_ITEMS.length);
  };

  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;

  const styleFor = (choice: boolean) => {
    if (!userResult) return IDLE;
    if (item.isTrue === choice) return CORRECT;
    if (userResult.choice === choice) return WRONG;
    return { ...IDLE, bg: '#FAF8F5', fg: '#A39C91' };
  };

  const trueStyle = styleFor(true);
  const falseStyle = styleFor(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: '#6B665E' }}>
          Önerme {currentIndex + 1} / {TRUE_FALSE_ITEMS.length}
        </span>
        <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
          {correctCount} doğru
        </span>
      </div>

      <div
        className="rounded-[24px] bg-white p-7 flex flex-col items-center gap-5"
        style={{ border: '1px solid #E6E0D6' }}
      >
        <p className="text-lg font-bold text-center leading-relaxed" style={{ color: '#1C1B19' }}>
          "{item.statement}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleAnswer(true)}
          disabled={Boolean(userResult)}
          aria-label="Doğru"
          style={{ background: trueStyle.bg, border: `3px solid ${trueStyle.border}`, color: trueStyle.fg }}
          className="h-[132px] rounded-[26px] flex flex-col items-center justify-center gap-2 font-extrabold text-base transition-all"
        >
          <Check className="w-[38px] h-[38px]" strokeWidth={2.4} />
          <span>Doğru</span>
        </button>

        <button
          type="button"
          onClick={() => handleAnswer(false)}
          disabled={Boolean(userResult)}
          aria-label="Yanlış"
          style={{ background: falseStyle.bg, border: `3px solid ${falseStyle.border}`, color: falseStyle.fg }}
          className="h-[132px] rounded-[26px] flex flex-col items-center justify-center gap-2 font-extrabold text-base transition-all"
        >
          <X className="w-[38px] h-[38px]" strokeWidth={2.4} />
          <span>Yanlış</span>
        </button>
      </div>

      {userResult && (
        <CheckBar correct={userResult.isCorrect} message={item.explanation} onNext={handleNext} />
      )}
    </div>
  );
};
