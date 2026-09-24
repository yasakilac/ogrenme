import React, { useState } from 'react';
import { Flame, Star, Play, Trophy, Lock, Layers, Settings, Code2, Globe2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { UserProgressData } from '../types';
import { MODULE_REGISTRY } from '../modules/registry';
import { MockExam, EXAM_POOL } from './MockExam';
import { getStars } from '../lib/rewards';

interface LearningHubViewProps {
  progress: UserProgressData;
  onSelectModule: (moduleId: string) => void;
  onOpenSettings: () => void;
}

/** Planlanan modüller için design/ref'teki "Yakında" ızgara glifleri (metin veya ikon). */
const PLANNED_GLYPH: Record<string, { text?: string; icon?: LucideIcon }> = {
  kanji: { text: '漢' },
  korean: { text: '한' },
  python: { icon: Code2 },
  history_culture: { icon: Globe2 }
};

const RING_R = 22;
const RING_C = 2 * Math.PI * RING_R;

const ProgressRing: React.FC<{ percent: number; color: string }> = ({ percent, color }) => (
  <div className="relative w-[52px] h-[52px] shrink-0">
    <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
      <circle cx="26" cy="26" r={RING_R} fill="none" stroke="#EFEBE4" strokeWidth="5" />
      <circle
        cx="26"
        cy="26"
        r={RING_R}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={RING_C}
        strokeDashoffset={RING_C * (1 - percent / 100)}
        transform="rotate(-90 26 26)"
      />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center text-[13px] font-extrabold">
      %{percent}
    </span>
  </div>
);

export const LearningHubView: React.FC<LearningHubViewProps> = ({ progress, onSelectModule, onOpenSettings }) => {
  const [showExam, setShowExam] = useState(false);

  if (showExam) {
    return <MockExam onExit={() => setShowExam(false)} />;
  }

  const activeModules = MODULE_REGISTRY.filter((m) => m.meta.status === 'active');
  const plannedModules = MODULE_REGISTRY.filter((m) => m.meta.status === 'planned');
  const streak = progress.stats.streakDays;
  const stars = getStars();

  return (
    <div className="max-w-[480px] mx-auto pb-12">
      <header className="h-16 px-1 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-[11px] flex items-center justify-center font-display font-extrabold text-xl"
            style={{ background: '#1C1B19', color: '#F7F4EE' }}
          >
            ö
          </div>
          <span className="font-display font-extrabold text-[22px] tracking-tight">öğren</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 px-3 rounded-full bg-white border border-[#E6E0D6] flex items-center gap-1.5 font-bold text-sm">
            <Flame className="w-[18px] h-[18px]" fill="#C2410C" stroke="#C2410C" strokeWidth={1.5} />
            <span>{streak}</span>
          </div>
          <div className="h-9 px-3 rounded-full bg-white border border-[#E6E0D6] flex items-center gap-1.5 font-bold text-sm">
            <Star className="w-[18px] h-[18px]" fill="#B45309" stroke="#B45309" strokeWidth={1.5} />
            <span>{stars}</span>
          </div>
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Ayarlar"
            className="w-9 h-9 rounded-full bg-white border border-[#E6E0D6] flex items-center justify-center active:scale-95 transition-transform"
          >
            <Settings className="w-[18px] h-[18px]" style={{ color: '#6B665E' }} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <div className="px-1 pt-1 flex flex-col gap-3">
        <button
          type="button"
          id="hub-open-mock-exam"
          onClick={() => setShowExam(true)}
          disabled={EXAM_POOL.length === 0}
          className="flex items-center gap-4 p-[18px] rounded-[24px] text-left disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] transition-transform"
          style={{ background: '#1F2A44', color: '#FFFFFF' }}
        >
          <div
            className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center shrink-0"
            style={{ background: '#2E3D5F' }}
          >
            <Trophy className="w-8 h-8" style={{ color: '#FCD34D' }} strokeWidth={1.8} />
          </div>
          <span className="flex-grow font-display font-extrabold text-[21px] tracking-tight">Bilgi Yarışması</span>
          <span
            className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0"
            style={{ background: '#FCD34D' }}
          >
            <Play className="w-[22px] h-[22px]" fill="#1F2A44" style={{ color: '#1F2A44' }} />
          </span>
        </button>

        <div className="pt-3 flex items-center gap-2">
          <Layers className="w-[18px] h-[18px]" />
          <h2 className="font-display font-extrabold text-lg">Öğrenme Alanları</h2>
        </div>

        {activeModules.map((module) => {
          const { meta } = module;
          const accent = meta.accent ?? { color: '#1C1B19', light: '#EFEBE4' };
          const percent = module.getProgressPercent?.(progress) ?? 0;
          return (
            <button
              key={meta.id}
              type="button"
              id={`hub-open-${meta.id}`}
              onClick={() => onSelectModule(meta.id)}
              className="flex items-center gap-3.5 p-3.5 bg-white border border-[#E6E0D6] rounded-[22px] text-left active:scale-[0.99] transition-transform"
            >
              <div
                className="w-14 h-14 rounded-[17px] flex items-center justify-center shrink-0 font-japanese font-extrabold text-[28px]"
                style={{ background: accent.light, color: accent.color }}
              >
                {meta.icon ? <meta.icon className="w-7 h-7" strokeWidth={1.8} /> : meta.glyph ?? meta.title.charAt(0)}
              </div>
              <span className="flex-grow font-display font-extrabold text-xl truncate">
                {meta.shortTitle ?? meta.title}
              </span>
              <ProgressRing percent={percent} color={accent.color} />
            </button>
          );
        })}

        {plannedModules.length > 0 && (
          <>
            <div className="pt-2.5 flex items-center gap-2">
              <Lock className="w-4 h-4" style={{ color: '#6B665E' }} strokeWidth={2} />
              <span className="text-sm font-bold" style={{ color: '#6B665E' }}>
                Yakında
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {plannedModules.map((module) => {
                const glyph = PLANNED_GLYPH[module.meta.id];
                const Icon = glyph?.icon;
                return (
                  <div
                    key={module.meta.id}
                    className="h-[84px] rounded-[18px] flex flex-col items-center justify-center gap-1.5"
                    style={{ background: '#EFEBE4' }}
                  >
                    {Icon ? (
                      <Icon className="w-[26px] h-[26px]" style={{ color: '#77716A' }} />
                    ) : (
                      <span className="font-extrabold text-2xl" style={{ color: '#77716A' }}>
                        {glyph?.text ?? module.meta.title.charAt(0)}
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-center px-1" style={{ color: '#6B665E' }}>
                      {module.meta.shortTitle ?? module.meta.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
