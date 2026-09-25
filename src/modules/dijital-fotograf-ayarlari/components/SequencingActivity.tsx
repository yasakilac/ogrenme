import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Check, X, RotateCcw, Zap, Clock } from 'lucide-react';
import { SEQUENCE_ITEMS, type SequenceItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG, PrimaryButton, CheckBar } from '../../../components/ui';

interface SequencingActivityProps {
  onScoreUpdate?: (points: number) => void;
}

type SeqSlotItem = SequenceItem['items'][number];

/** E4 (Etkinlik — Sıralama) dili: havuzdan dokunarak sıradaki boş slota ekleme, dokunarak geri alma. */
export const SequencingActivity: React.FC<SequencingActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const item: SequenceItem = SEQUENCE_ITEMS[currentIndex];

  const [order, setOrder] = useState<SeqSlotItem[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  useEffect(() => {
    setOrder([]);
    setIsSubmitted(false);
    setIsCorrect(false);
  }, [currentIndex, item]);

  const pool = item.items.filter((it) => !order.some((o) => o.id === it.id));

  const handlePut = (it: SeqSlotItem) => {
    if (isSubmitted) return;
    setOrder((prev) => [...prev, it]);
    cameraAudio.playDialTick();
  };

  const handleRemove = (it: SeqSlotItem) => {
    if (isSubmitted) return;
    setOrder((prev) => prev.filter((o) => o.id !== it.id));
  };

  const handleCheckOrder = () => {
    const correct = order.every((elem, idx) => elem.correctOrder === idx + 1);
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
    setOrder([]);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SEQUENCE_ITEMS.length);
  };

  const done = order.length === item.items.length;

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

      <div className="flex items-center justify-between px-1">
        <span className="flex items-center gap-1.5 text-sm font-extrabold" style={{ color: 'var(--accent)' }}>
          <Zap className="w-4 h-4" />
          Hızlı
        </span>
        <ArrowUpDown className="w-4 h-4 rotate-90" style={{ color: '#A39C91' }} aria-hidden="true" />
        <span className="flex items-center gap-1.5 text-sm font-extrabold" style={{ color: '#6B665E' }}>
          Yavaş
          <Clock className="w-4 h-4" />
        </span>
      </div>

      <div className="space-y-2.5">
        {[0, 1, 2, 3, 4].slice(0, item.items.length).map((slotIdx) => {
          const it = order[slotIdx];
          const filled = Boolean(it);
          const isOk = isSubmitted && it && it.correctOrder === slotIdx + 1;
          const isBad = isSubmitted && it && it.correctOrder !== slotIdx + 1;
          const style = isOk ? CORRECT : isBad ? WRONG : filled ? IDLE_FILLED : IDLE_EMPTY;

          return (
            <button
              key={slotIdx}
              type="button"
              onClick={() => it && handleRemove(it)}
              disabled={!filled || isSubmitted}
              style={{
                background: style.bg,
                color: style.fg,
                borderWidth: 2,
                borderStyle: filled ? 'solid' : 'dashed',
                borderColor: style.border,
              }}
              className="w-full h-16 rounded-[20px] pl-2.5 pr-4 flex items-center gap-3.5 font-extrabold text-lg transition-all"
            >
              <span
                className="w-10 h-10 rounded-[13px] flex items-center justify-center text-sm shrink-0"
                style={{ background: '#EDE6DB', color: '#6B665E' }}
              >
                {slotIdx + 1}
              </span>
              <span className="flex-grow text-left truncate">{it?.label ?? ''}</span>
              {isOk && <Check className="w-[22px] h-[22px] shrink-0" strokeWidth={3} style={{ color: style.border }} />}
              {isBad && <X className="w-[22px] h-[22px] shrink-0" strokeWidth={3} style={{ color: style.border }} />}
            </button>
          );
        })}
      </div>

      <div
        className="min-h-[76px] rounded-[22px] p-3 flex flex-wrap gap-2 content-start"
        style={{ background: '#EDE6DB' }}
      >
        {pool.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => handlePut(it)}
            style={{ background: '#FFFFFF', border: '1px solid #E6E0D6', color: '#1C1B19' }}
            className="h-[52px] px-4 rounded-[16px] font-extrabold text-base"
          >
            {it.label}
          </button>
        ))}
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
          <PrimaryButton onClick={handleCheckOrder} icon={Check} disabled={!done} className="flex-grow">
            Kontrol
          </PrimaryButton>
        </div>
      ) : (
        <CheckBar correct={isCorrect} message={item.explanation} onNext={handleNext} />
      )}
    </div>
  );
};

const IDLE_EMPTY = { bg: 'transparent', border: '#DDD5C8', fg: '#1C1B19' };
const IDLE_FILLED = { bg: '#FFFFFF', border: '#E6E0D6', fg: '#1C1B19' };
