import React, { useState } from 'react';
import { Play, Volume2, Lightbulb, Check, X } from 'lucide-react';
import { SOUND_MATCH_ITEMS, type SoundMatchItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG, CheckBar } from '../../../components/ui';

interface SoundMatchingActivityProps {
  onScoreUpdate?: (points: number) => void;
}

const IDLE = { bg: '#FFFFFF', border: '#E6E0D6', fg: '#1C1B19' };
const WAVE_HEIGHTS = [10, 18, 30, 44, 26, 14, 8, 6, 8, 14, 26, 44, 30, 18, 10];

export const SoundMatchingActivity: React.FC<SoundMatchingActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});

  const currentItem: SoundMatchItem = SOUND_MATCH_ITEMS[currentIndex];
  const userResult = answers[currentItem.id];

  const handlePlaySound = () => {
    setIsPlaying(true);
    cameraAudio.playShutterSound(currentItem.shutterSpeed);
    const soundDurationMs = Math.max(150, currentItem.shutterSpeed * 1000 + 100);
    setTimeout(() => setIsPlaying(false), soundDurationMs);
  };

  const handleSelectOption = (opt: string) => {
    if (userResult) return;
    const isCorrect = opt === currentItem.correctOption;
    setAnswers((prev) => ({ ...prev, [currentItem.id]: { selected: opt, isCorrect } }));

    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(15);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SOUND_MATCH_ITEMS.length);
  };

  const totalCorrect = Object.values(answers).filter((a) => a.isCorrect).length;

  const styleFor = (opt: string) => {
    if (!userResult) return IDLE;
    if (opt === currentItem.correctOption) return CORRECT;
    if (userResult.selected === opt) return WRONG;
    return { ...IDLE, bg: '#FAF8F5', fg: '#A39C91' };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: '#6B665E' }}>
          Ses Testi {currentIndex + 1} / {SOUND_MATCH_ITEMS.length}
        </span>
        <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
          {totalCorrect} doğru
        </span>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: '#6B665E' }}>
        {currentItem.situation}
      </p>

      <div
        className="rounded-[28px] flex flex-col items-center justify-center gap-5 py-8"
        style={{ background: '#1F2A44' }}
      >
        <button
          type="button"
          onClick={handlePlaySound}
          disabled={isPlaying}
          aria-label="Deklanşör sesini çal"
          style={{ boxShadow: `0 0 0 10px ${isPlaying ? 'rgba(252,211,77,0.35)' : 'rgba(252,211,77,0.12)'}` }}
          className="w-[104px] h-[104px] rounded-full border-none bg-[#FCD34D] flex items-center justify-center transition-shadow"
        >
          {isPlaying ? (
            <Volume2 className="w-11 h-11" style={{ color: '#1F2A44' }} />
          ) : (
            <Play className="w-11 h-11 ml-1" style={{ color: '#1F2A44' }} />
          )}
        </button>
        <div className="flex items-center gap-1.5 h-12">
          {WAVE_HEIGHTS.map((h, i) => (
            <span
              key={i}
              className="block w-1.5 rounded-full transition-all"
              style={{
                height: isPlaying ? h : Math.max(6, Math.round(h / 3)),
                background: isPlaying ? '#FCD34D' : '#4A5A7D',
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 font-extrabold text-base">
        <Lightbulb className="w-[22px] h-[22px]" style={{ color: 'var(--accent)' }} />
        <span>Duyduğunuz enstantane hızı hangisi?</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {currentItem.options.map((opt, i) => {
          const tone = styleFor(opt);
          const isCorrect = opt === currentItem.correctOption;
          const isSelected = userResult?.selected === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelectOption(opt)}
              disabled={Boolean(userResult)}
              aria-label={opt}
              style={{ background: tone.bg, color: tone.fg, border: `${userResult ? 3 : 1}px solid ${tone.border}` }}
              className="min-h-[60px] rounded-[18px] px-3.5 py-2.5 flex items-center gap-3 text-left font-bold text-base transition-all"
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
              <span className="flex-grow">{opt}</span>
              {userResult && isCorrect && <Check className="w-[22px] h-[22px]" strokeWidth={3} style={{ color: CORRECT.border }} />}
              {userResult && isSelected && !isCorrect && <X className="w-[22px] h-[22px]" strokeWidth={3} style={{ color: WRONG.border }} />}
            </button>
          );
        })}
      </div>

      {userResult && (
        <CheckBar correct={userResult.isCorrect} message={currentItem.explanation} onNext={handleNext} />
      )}
    </div>
  );
};
