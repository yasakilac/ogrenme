import React, { useState } from 'react';
import { Compass, Target, Check, X } from 'lucide-react';
import { SCENARIO_ITEMS, type ScenarioItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG, CheckBar } from '../../../components/ui';

interface ScenarioActivityProps {
  onScoreUpdate?: (points: number) => void;
}

const IDLE = { bg: '#FFFFFF', border: '#E6E0D6', fg: '#1C1B19' };

export const ScenarioActivity: React.FC<ScenarioActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, { optionId: string; isCorrect: boolean }>>({});

  const scenario: ScenarioItem = SCENARIO_ITEMS[currentIndex];
  const userResult = answers[scenario.id];
  const feedbackOption = userResult ? scenario.options.find((o) => o.id === userResult.optionId) : undefined;

  const handleSelectOption = (optId: string, isCorrect: boolean) => {
    if (userResult) return;
    setAnswers((prev) => ({ ...prev, [scenario.id]: { optionId: optId, isCorrect } }));

    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(20);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SCENARIO_ITEMS.length);
  };

  const styleFor = (opt: ScenarioItem['options'][number]) => {
    if (!userResult) return IDLE;
    if (opt.isCorrect) return CORRECT;
    if (userResult.optionId === opt.id) return WRONG;
    return { ...IDLE, bg: '#FAF8F5', fg: '#A39C91' };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: '#6B665E' }}>
          Görev {currentIndex + 1} / {SCENARIO_ITEMS.length}
        </span>
        <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
          {scenario.title}
        </span>
      </div>

      <div className="rounded-[28px] p-5 flex flex-col gap-3" style={{ background: 'var(--accent-light)' }}>
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 shrink-0" style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
            Saha Senaryosu
          </span>
        </div>
        <p className="text-sm font-semibold leading-relaxed" style={{ color: '#1C1B19' }}>
          {scenario.story}
        </p>
        <div
          className="flex items-center gap-2 rounded-[14px] px-3 py-2 text-xs font-bold"
          style={{ background: '#FFFFFF', color: 'var(--accent)' }}
        >
          <Target className="w-4 h-4 shrink-0" />
          <span>Hedef: {scenario.goal}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {scenario.options.map((opt, i) => {
          const tone = styleFor(opt);
          const isSelected = userResult?.optionId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
              disabled={Boolean(userResult)}
              style={{ background: tone.bg, color: tone.fg, border: `${userResult ? 3 : 1}px solid ${tone.border}` }}
              className="min-h-[66px] rounded-[20px] px-3 py-2.5 flex items-center gap-2.5 text-left transition-all"
            >
              <span
                className="w-[38px] h-[38px] rounded-xl flex items-center justify-center font-extrabold shrink-0"
                style={{
                  background: userResult ? tone.border : '#EDE6DB',
                  color: userResult ? '#FFFFFF' : '#6B665E',
                }}
              >
                {'ABCD'[i]}
              </span>
              <div className="flex-grow grid grid-cols-3 gap-1.5">
                {[opt.settings.f, opt.settings.s, opt.settings.iso].map((v, vi) => (
                  <span
                    key={vi}
                    className="h-10 rounded-xl flex items-center justify-center font-extrabold text-[13px]"
                    style={{ background: '#F7F4EE', color: '#1C1B19' }}
                  >
                    {v}
                  </span>
                ))}
              </div>
              {userResult && opt.isCorrect && <Check className="w-[22px] h-[22px] shrink-0" strokeWidth={3} style={{ color: CORRECT.border }} />}
              {userResult && isSelected && !opt.isCorrect && <X className="w-[22px] h-[22px] shrink-0" strokeWidth={3} style={{ color: WRONG.border }} />}
            </button>
          );
        })}
      </div>

      {userResult && feedbackOption && (
        <CheckBar correct={userResult.isCorrect} message={feedbackOption.feedback} onNext={handleNext} />
      )}
    </div>
  );
};
