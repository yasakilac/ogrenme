import React, { useState } from 'react';
import { Search, Award } from 'lucide-react';
import { VISUAL_MATCH_ITEMS, type VisualMatchItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG, CheckBar } from '../../../components/ui';

interface VisualMatchingActivityProps {
  onScoreUpdate?: (points: number) => void;
}

const IDLE = { bg: '#FFFFFF', fg: '#1C1B19', border: '1px solid #E6E0D6', kbg: '#EDE6DB', kfg: '#6B665E' };

export const VisualMatchingActivity: React.FC<VisualMatchingActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});

  const item: VisualMatchItem = VISUAL_MATCH_ITEMS[currentIndex];
  const userResult = answers[item.id];

  const handleSelect = (opt: string) => {
    if (userResult) return;
    const isCorrect = opt === item.correctAnswer;
    setAnswers((prev) => ({
      ...prev,
      [item.id]: { selected: opt, isCorrect },
    }));

    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(15);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % VISUAL_MATCH_ITEMS.length);
  };

  const totalScore = Object.values(answers).filter((a) => a.isCorrect).length;

  const toneFor = (opt: string) => {
    if (!userResult) return IDLE;
    if (opt === item.correctAnswer) {
      return { bg: CORRECT.bg, fg: CORRECT.fg, border: `3px solid ${CORRECT.border}`, kbg: CORRECT.border, kfg: '#FFFFFF' };
    }
    if (userResult.selected === opt) {
      return { bg: WRONG.bg, fg: WRONG.fg, border: `3px solid ${WRONG.border}`, kbg: WRONG.border, kfg: '#FFFFFF' };
    }
    return IDLE;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: '#6B665E' }}>
          Soru {currentIndex + 1} / {VISUAL_MATCH_ITEMS.length}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: 'var(--accent)' }}>
          <Award className="w-4 h-4" />
          {totalScore} / {VISUAL_MATCH_ITEMS.length} doğru
        </span>
      </div>

      <div className="h-[250px] rounded-[28px] overflow-hidden relative" style={{ background: '#1F2A44' }}>
        <img
          src={item.photoUrl}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect fill="%231F2A44" width="600" height="400"/><text fill="%23C7D0E4" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20">Fotoğraf yüklenemedi</text></svg>';
          }}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-4">
          <span className="font-bold text-sm text-white block">{item.title}</span>
          <span className="text-xs text-white/90">{item.effectDescription}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 font-extrabold text-[17px]" style={{ color: '#1C1B19' }}>
        <Search className="w-[22px] h-[22px]" style={{ color: 'var(--accent)' }} />
        <span>Hangi ayar?</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {item.options.map((opt, idx) => {
          const tone = toneFor(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              disabled={Boolean(userResult)}
              style={{ background: tone.bg, color: tone.fg, border: tone.border }}
              className="min-h-[60px] rounded-[18px] py-2.5 pl-2.5 pr-3.5 flex items-center gap-3 text-left font-bold text-base"
            >
              <span
                className="w-[38px] h-[38px] rounded-[12px] flex items-center justify-center font-extrabold shrink-0"
                style={{ background: tone.kbg, color: tone.kfg }}
              >
                {'ABCD'[idx]}
              </span>
              <span className="flex-grow">{opt}</span>
            </button>
          );
        })}
      </div>

      {userResult && (
        <CheckBar correct={userResult.isCorrect} message={item.explanation} onNext={handleNext} />
      )}
    </div>
  );
};
