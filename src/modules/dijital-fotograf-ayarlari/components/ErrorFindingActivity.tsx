import React, { useState } from 'react';
import { Search, AlertTriangle, Wrench } from 'lucide-react';
import { ERROR_FINDING_ITEMS, type ErrorFindingItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG, CheckBar } from '../../../components/ui';

interface ErrorFindingActivityProps {
  onScoreUpdate?: (points: number) => void;
}

const IDLE = { bg: '#FFFFFF', fg: '#1C1B19', border: '1px solid #E6E0D6' };

export const ErrorFindingActivity: React.FC<ErrorFindingActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, { selectedIndex: number; isCorrect: boolean }>>({});

  const item: ErrorFindingItem = ERROR_FINDING_ITEMS[currentIndex];
  const userResult = answers[item.id];

  const handleSelect = (idx: number) => {
    if (userResult) return;
    const isCorrect = idx === item.correctOptionIndex;
    setAnswers((prev) => ({
      ...prev,
      [item.id]: { selectedIndex: idx, isCorrect },
    }));

    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(20);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ERROR_FINDING_ITEMS.length);
  };

  const toneFor = (idx: number) => {
    if (!userResult) return IDLE;
    if (idx === item.correctOptionIndex) return { bg: CORRECT.bg, fg: CORRECT.fg, border: `3px solid ${CORRECT.border}` };
    if (userResult.selectedIndex === idx) return { bg: WRONG.bg, fg: WRONG.fg, border: `3px solid ${WRONG.border}` };
    return { ...IDLE, fg: '#A39C91' };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: '#6B665E' }}>
          Vaka {currentIndex + 1} / {ERROR_FINDING_ITEMS.length}
        </span>
      </div>

      <div className="rounded-[28px] p-5 flex flex-col gap-3.5" style={{ background: '#1F2A44' }}>
        <div
          className="self-start h-[34px] px-3 rounded-[17px] flex items-center gap-1.5 font-bold text-sm"
          style={{ background: '#2E3D5F', color: '#FFFFFF' }}
        >
          <AlertTriangle className="w-4 h-4" style={{ color: '#FCD34D' }} />
          <span>{item.photoExif.condition}</span>
        </div>
        <p className="text-sm leading-relaxed font-medium" style={{ color: '#FFFFFF' }}>
          {item.scenario}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold" style={{ color: '#FCD34D' }}>
          <div>Diyafram: <span style={{ color: '#FFFFFF' }}>{item.photoExif.aperture}</span></div>
          <div>Enstantane: <span style={{ color: '#FFFFFF' }}>{item.photoExif.shutter}</span></div>
          <div>ISO: <span style={{ color: '#FFFFFF' }}>{item.photoExif.iso}</span></div>
          <div>Lens: <span style={{ color: '#FFFFFF' }}>{item.photoExif.lens}</span></div>
        </div>
        <div className="self-start h-[34px] px-3 rounded-[17px] flex items-center gap-1.5 font-extrabold text-sm" style={{ background: '#FFEDD5', color: '#7C2D12' }}>
          <AlertTriangle className="w-4 h-4" />
          <span>{item.symptom}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 font-extrabold text-[17px]" style={{ color: '#1C1B19' }}>
        <Search className="w-[22px] h-[22px]" style={{ color: 'var(--accent)' }} />
        <span>Hatalı ayar?</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {item.options.map((opt, idx) => {
          const tone = toneFor(idx);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(idx)}
              disabled={Boolean(userResult)}
              style={{ background: tone.bg, color: tone.fg, border: tone.border }}
              className="min-h-[60px] rounded-[18px] p-3.5 flex items-start gap-2.5 text-left font-semibold text-sm"
            >
              <span
                className="w-7 h-7 rounded-[10px] flex items-center justify-center font-extrabold text-xs shrink-0"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                {'ABCD'[idx]}
              </span>
              <span className="flex-grow">{opt}</span>
            </button>
          );
        })}
      </div>

      {userResult && (
        <div className="space-y-3">
          <CheckBar correct={userResult.isCorrect} message={item.explanation} onNext={handleNext} />
          <div className="rounded-[18px] p-3.5 flex items-start gap-2" style={{ background: '#F7F4EE', border: '1px solid #E6E0D6' }}>
            <Wrench className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
            <p className="text-xs leading-relaxed" style={{ color: '#1C1B19' }}>
              <strong className="font-bold block">Önerilen Çözüm:</strong>
              {item.recommendedFix}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
