import React, { useState } from 'react';
import { Aperture, Timer, Check, X, RotateCcw, GripVertical } from 'lucide-react';
import { CATEGORIZE_ITEMS, type CategorizeItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG, PrimaryButton } from '../../../components/ui';

interface CategorizeActivityProps {
  onScoreUpdate?: (points: number) => void;
}

const IDLE = { bg: '#FFFFFF', border: '#E6E0D6', fg: '#1C1B19' };
const POOL_BG = '#EDE6DB';

type Category = CategorizeItem['correctCategory'];
const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'Diyafram (f/stop)', label: 'Diyafram', icon: <Aperture className="w-6 h-6" style={{ color: 'var(--accent)' }} /> },
  { id: 'Enstantane (Süre)', label: 'Enstantane', icon: <Timer className="w-6 h-6" style={{ color: 'var(--accent)' }} /> },
  { id: 'ISO (Hassasiyet)', label: 'ISO', icon: <span className="font-extrabold text-sm" style={{ color: 'var(--accent)' }}>ISO</span> },
];

/** E1 (Etkinlik — Sürükle Bırak) dili: 3 kutuya gruplama, tek seferde tüm öğeler + havuz + Kontrol. */
export const CategorizeActivity: React.FC<CategorizeActivityProps> = ({ onScoreUpdate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, Category>>({});
  const [checked, setChecked] = useState(false);

  const items = CATEGORIZE_ITEMS;
  const allPlaced = Object.keys(placements).length === items.length;

  const place = (cat: Category, id?: string) => {
    const targetId = id ?? selectedId;
    if (checked || !targetId) return;
    setPlacements((prev) => ({ ...prev, [targetId]: cat }));
    setSelectedId(null);
    cameraAudio.playDialTick();
  };

  const unplace = (id: string) => {
    if (checked) return;
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleCheck = () => {
    if (!allPlaced) return;
    setChecked(true);
    const correctCount = items.filter((it) => placements[it.id] === it.correctCategory).length;
    if (correctCount === items.length) {
      cameraAudio.playSuccessSound();
    } else {
      cameraAudio.playErrorSound();
    }
    if (onScoreUpdate) onScoreUpdate(correctCount * 15);
  };

  const handleReset = () => {
    setSelectedId(null);
    setPlacements({});
    setChecked(false);
  };

  const poolItems = items.filter((it) => !placements[it.id]);
  const highlight = selectedId !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: '#6B665E' }}>
          Gruplama · {Object.keys(placements).length} / {items.length}
        </span>
        {checked && (
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
            {items.filter((it) => placements[it.id] === it.correctCategory).length} doğru
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {CATEGORIES.map((cat) => {
          const inBucket = items.filter((it) => placements[it.id] === cat.id);
          return (
            <div
              key={cat.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                place(cat.id, e.dataTransfer.getData('text/plain') || undefined);
              }}
              style={{
                background: '#FFFFFF',
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: highlight ? 'var(--accent)' : '#E6E0D6',
              }}
              className="rounded-[22px] p-2 flex flex-col items-center gap-2 transition-colors"
            >
              <button
                type="button"
                onClick={() => place(cat.id)}
                aria-label={`${cat.label} kutusuna bırak`}
                className="w-full flex flex-col items-center gap-1.5 py-1"
              >
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
                  {cat.icon}
                </div>
                <span className="text-[12px] font-extrabold" style={{ color: '#1C1B19' }}>{cat.label}</span>
              </button>

              <div className="w-full flex flex-col gap-1.5 min-h-[8px]">
                {inBucket.map((it) => {
                  const isOk = checked && it.correctCategory === cat.id;
                  const isBad = checked && it.correctCategory !== cat.id;
                  const style = isOk ? CORRECT : isBad ? WRONG : IDLE;
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => unplace(it.id)}
                      disabled={checked}
                      style={{ background: style.bg, border: `1.5px solid ${style.border}`, color: style.fg }}
                      className="w-full rounded-[12px] px-1.5 py-2 text-[10px] font-bold leading-snug line-clamp-3 flex items-start gap-1"
                    >
                      <span className="flex-grow text-left">{it.text}</span>
                      {isOk && <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: style.border }} />}
                      {isBad && <X className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: style.border }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="rounded-[22px] p-3 flex flex-wrap content-start gap-2 min-h-[64px]"
        style={{ background: POOL_BG }}
      >
        {poolItems.length === 0 && (
          <span className="text-xs font-semibold m-auto" style={{ color: '#A39C91' }}>Tüm öğeler yerleştirildi</span>
        )}
        {poolItems.map((it) => {
          const isSelected = selectedId === it.id;
          return (
            <button
              key={it.id}
              type="button"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', it.id);
                setSelectedId(it.id);
              }}
              onClick={() => setSelectedId(isSelected ? null : it.id)}
              aria-pressed={isSelected}
              style={{
                background: isSelected ? '#1C1B19' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#1C1B19',
                border: isSelected ? '2px solid #1C1B19' : '1px solid #E6E0D6',
                transform: isSelected ? 'translateY(-3px)' : 'none',
              }}
              className="max-w-[150px] rounded-[16px] px-3 py-2 text-[11px] font-bold leading-snug line-clamp-2 flex items-start gap-1.5 text-left transition-all"
            >
              <GripVertical className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: isSelected ? '#FFFFFF' : '#A39C91' }} aria-hidden="true" />
              <span>{it.text}</span>
            </button>
          );
        })}
      </div>

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
        <PrimaryButton onClick={handleCheck} icon={Check} disabled={!allPlaced || checked} className="flex-grow">
          Kontrol
        </PrimaryButton>
      </div>
    </div>
  );
};
