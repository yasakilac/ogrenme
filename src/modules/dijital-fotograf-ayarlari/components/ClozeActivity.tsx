import React, { useState } from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { CLOZE_ITEMS, type ClozeItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG, CheckBar } from '../../../components/ui';

interface ClozeActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const ClozeActivity: React.FC<ClozeActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fill, setFill] = useState<(string | null)[]>([null, null]);
  const [checked, setChecked] = useState<boolean>(false);

  const item: ClozeItem = CLOZE_ITEMS[currentIndex];
  const blanksCount = item.secondBlankAnswer ? 2 : 1;
  const answers = [item.blankAnswer, item.secondBlankAnswer].slice(0, blanksCount) as string[];
  const filledCount = fill.slice(0, blanksCount).filter(Boolean).length;
  const allFilled = filledCount === blanksCount;
  const isCorrect =
    allFilled &&
    fill.slice(0, blanksCount).every((w, i) => (w ?? '').trim().toLowerCase() === answers[i].toLowerCase());

  const handleChipClick = (word: string) => {
    if (checked) return;
    const used = fill.slice(0, blanksCount).includes(word);
    if (used) return;
    const emptySlot = fill.slice(0, blanksCount).findIndex((w) => w === null);
    if (emptySlot === -1) return;
    const next = fill.slice();
    next[emptySlot] = word;
    setFill(next);
  };

  const handleBlankClick = (index: number) => {
    if (checked) return;
    const next = fill.slice();
    next[index] = null;
    setFill(next);
  };

  const handleCheck = () => {
    if (!allFilled) return;
    setChecked(true);
    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(15);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleReset = () => {
    setFill([null, null]);
  };

  const handleNext = () => {
    setFill([null, null]);
    setChecked(false);
    setCurrentIndex((prev) => (prev + 1) % CLOZE_ITEMS.length);
  };

  const blankStyle = (index: number) => {
    const word = fill[index];
    if (checked) {
      const ok = (word ?? '').trim().toLowerCase() === answers[index].toLowerCase();
      const p = ok ? CORRECT : WRONG;
      return { background: p.bg, color: p.fg, border: `3px solid ${p.border}` };
    }
    if (word) {
      return { background: 'var(--accent-light)', color: '#1C1B19', border: '2px solid var(--accent)' };
    }
    return { background: '#F7F4EE', color: '#A39C91', border: '2px dashed #C9BFAF' };
  };

  const Blank: React.FC<{ index: number }> = ({ index }) => (
    <button
      type="button"
      onClick={() => handleBlankClick(index)}
      disabled={checked || !fill[index]}
      aria-label={`Boşluk ${index + 1}${fill[index] ? `: ${fill[index]}` : ' (boş)'}`}
      style={blankStyle(index)}
      className="inline-flex items-center justify-center align-middle min-w-[92px] h-11 mx-1 my-0.5 px-3 rounded-[14px] font-extrabold text-base"
    >
      {fill[index] || '···'}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: '#6B665E' }}>
          Cümle {currentIndex + 1} / {CLOZE_ITEMS.length}
        </span>
        <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
          {item.title}
        </span>
      </div>

      <div className="rounded-[26px] bg-white p-6 flex flex-col gap-4" style={{ border: '1px solid #E6E0D6' }}>
        <p className="font-display font-semibold text-xl leading-loose" style={{ color: '#1C1B19' }}>
          {item.textBefore} <Blank index={0} /> {item.textBetween}
          {blanksCount > 1 && (
            <>
              {' '}
              <Blank index={1} />
            </>
          )}
          {item.textAfter}
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {item.options.map((opt) => {
          const used = fill.slice(0, blanksCount).includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleChipClick(opt)}
              disabled={used || checked}
              aria-label={`"${opt}" kelimesini boşluğa yerleştir`}
              className="h-[52px] px-[18px] rounded-[16px] font-extrabold text-base transition-opacity"
              style={{ background: '#FFFFFF', border: '1px solid #E6E0D6', color: '#1C1B19', opacity: used ? 0.3 : 1 }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {!checked ? (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            aria-label="Baştan"
            className="w-14 h-14 rounded-[18px] bg-white flex items-center justify-center shrink-0"
            style={{ border: '1px solid #E6E0D6' }}
          >
            <RotateCcw className="w-[22px] h-[22px]" style={{ color: '#1C1B19' }} />
          </button>
          <button
            type="button"
            onClick={handleCheck}
            disabled={!allFilled}
            className="flex-grow h-14 rounded-[18px] border-none flex items-center justify-center gap-2.5 font-bold text-base text-white disabled:opacity-40"
            style={{ background: allFilled ? '#1C1B19' : '#A39C91' }}
          >
            <Check className="w-[22px] h-[22px]" strokeWidth={2.6} />
            <span>Kontrol</span>
          </button>
        </div>
      ) : (
        <CheckBar correct={isCorrect} message={item.explanation} onNext={handleNext} />
      )}
    </div>
  );
};
