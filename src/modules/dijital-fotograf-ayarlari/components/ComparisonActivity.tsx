import React, { useState } from 'react';
import { Sun, Sparkles, MapPin } from 'lucide-react';
import { COMPARISON_MATRIX, type ComparisonMatrixItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';

interface ComparisonActivityProps {
  onScoreUpdate?: (points: number) => void;
}

const DARK = '#1F2A44';
const DARK_CHIP = '#2E3D5F';

export const ComparisonActivity: React.FC<ComparisonActivityProps> = ({ onScoreUpdate }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [viewedTabs, setViewedTabs] = useState<Record<number, boolean>>({ 0: true });

  const currentComparison: ComparisonMatrixItem = COMPARISON_MATRIX[selectedIndex];

  const handleSelectTab = (idx: number) => {
    setSelectedIndex(idx);
    cameraAudio.playDialTick();
    if (!viewedTabs[idx]) {
      setViewedTabs((prev) => ({ ...prev, [idx]: true }));
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(10);
    }
  };

  const sides: { value: ComparisonMatrixItem['lowValue']; dark: boolean }[] = [
    { value: currentComparison.lowValue, dark: false },
    { value: currentComparison.highValue, dark: true },
  ];

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed" style={{ color: '#6B665E' }}>
        Uç ayar değerlerinin ışık geçirgenliği, görsel sonucu ve ideal kullanım senaryosunu kıyaslayın.
      </p>

      <div className="grid gap-1.5 p-1.5 rounded-[18px]" style={{ background: '#EDE6DB', gridTemplateColumns: `repeat(${COMPARISON_MATRIX.length}, minmax(0, 1fr))` }}>
        {COMPARISON_MATRIX.map((item, idx) => (
          <button
            key={item.parameter}
            type="button"
            onClick={() => handleSelectTab(idx)}
            className="h-[46px] rounded-[14px] border-none font-extrabold text-[13px] px-1 transition-colors"
            style={{ background: selectedIndex === idx ? '#1C1B19' : 'transparent', color: selectedIndex === idx ? '#FFFFFF' : '#1C1B19' }}
          >
            {item.parameter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {sides.map(({ value, dark }) => (
          <div
            key={value.label}
            className="rounded-[24px] p-4 flex flex-col gap-3.5"
            style={{ background: dark ? DARK : '#FFFFFF', color: dark ? '#FFFFFF' : '#1C1B19', border: dark ? 'none' : '1px solid #E6E0D6' }}
          >
            <span className="font-display font-extrabold text-[15px] leading-tight">{value.label}</span>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 font-bold text-[11px] opacity-80">
                <Sun className="w-3.5 h-3.5" />
                <span>Işık Girişi</span>
              </div>
              <p className="text-xs font-bold">{value.lightIntake}</p>
            </div>

            <div
              className="rounded-[14px] p-2.5 flex items-start gap-2 text-[11px] font-semibold leading-relaxed"
              style={{ background: dark ? DARK_CHIP : 'var(--accent-light)' }}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{value.visualEffect}</span>
            </div>

            <div
              className="rounded-[14px] p-2.5 flex items-start gap-2 text-[11px] font-semibold leading-relaxed"
              style={{ background: dark ? DARK_CHIP : 'var(--accent-light)' }}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{value.idealScenario}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
