import React from 'react';
import { ArrowLeft, Home, Play, Check } from 'lucide-react';
import { Star } from 'lucide-react';
import type { LearningModule, ModuleExerciseTile } from '../modules/types';
import type { UserProgressData } from '../types';

interface ModuleIntroScreenProps {
  module: LearningModule;
  progress: UserProgressData;
  onOpenTab: (tabId: string, activityId?: string) => void;
  onExitToHub: () => void;
}

/** Ortak "Öğrenme Alanı" giriş ekranı (design/ref: 02): stepper + devam et kartı + egzersiz ızgarası.
 * Hangi navTab'ın konu (stepper) hangisinin egzersiz (3'lü ızgara) olduğu meta.navTabs[].kind'ten gelir. */
export const ModuleIntroScreen: React.FC<ModuleIntroScreenProps> = ({
  module,
  progress,
  onOpenTab,
  onExitToHub
}) => {
  const { meta } = module;
  const accent = meta.accent ?? { color: '#1C1B19', light: '#EFEBE4' };
  const topics = (meta.navTabs ?? []).filter((t) => t.kind === 'topic');
  // exerciseTiles verilmişse (bir tab'ın alt-etkinliklerini tek tek göstermek için) o kullanılır,
  // yoksa navTabs'teki kind='exercise' olanlara düşülür (bkz. ModuleExerciseTile).
  const exerciseTiles: ModuleExerciseTile[] =
    meta.exerciseTiles ??
    (meta.navTabs ?? [])
      .filter((t) => t.kind === 'exercise')
      .map((t) => ({ id: t.id, label: t.shortLabel ?? t.label, icon: t.icon, tabId: t.id }));
  const percent = module.getProgressPercent?.(progress) ?? 0;
  const completedSteps = Math.min(topics.length, Math.round((percent / 100) * topics.length));
  const activeIndex = Math.min(completedSteps, Math.max(0, topics.length - 1));
  const activeTopic = topics[activeIndex];

  return (
    <div className="min-h-screen" style={{ background: '#F7F4EE', color: '#1C1B19' }}>
      <nav className="h-16 px-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onExitToHub}
          aria-label="Geri"
          className="w-11 h-11 rounded-[14px] bg-white border border-[#E6E0D6] flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-japanese font-black text-base"
            style={{ background: accent.color, color: '#FFFFFF' }}
          >
            {meta.icon ? <meta.icon className="w-5 h-5" /> : meta.glyph ?? meta.title.charAt(0)}
          </span>
          <span className="font-display font-extrabold text-[19px] truncate">{meta.shortTitle ?? meta.title}</span>
        </div>
        <button
          type="button"
          onClick={onExitToHub}
          aria-label="Ana sayfa"
          className="w-11 h-11 rounded-[14px] bg-white border border-[#E6E0D6] flex items-center justify-center active:scale-95 transition-transform"
        >
          <Home className="w-5 h-5" />
        </button>
      </nav>

      {topics.length > 0 && (
        <div className="px-5 pt-1 flex items-center gap-3">
          <div className="flex-grow h-2.5 rounded-full" style={{ background: '#EDE6DB' }}>
            <div
              className="h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${percent}%`, background: accent.color }}
            />
          </div>
          <div className="flex items-center gap-1 font-bold text-sm shrink-0">
            <Star className="w-4 h-4" fill={accent.color} style={{ color: accent.color }} />
            <span>{completedSteps}/{topics.length}</span>
          </div>
        </div>
      )}

      <div className="px-5">
        {topics.length > 0 && (
          <div className="mt-4 bg-white border border-[#E6E0D6] rounded-[24px] px-3 pt-[18px] pb-3.5">
            <div className="relative flex justify-between">
              <div
                className="absolute top-[26px] left-8 right-8 h-1 rounded-full"
                style={{ background: '#EDE6DB' }}
              />
              <div
                className="absolute top-[26px] left-8 h-1 rounded-full transition-all duration-300"
                style={{
                  width: topics.length > 1 ? `${(completedSteps / (topics.length - 1)) * 100}%` : '0%',
                  maxWidth: 'calc(100% - 64px)',
                  background: accent.color
                }}
              />
              {topics.map((tab, i) => {
                const Icon = tab.icon;
                const isDone = i < completedSteps;
                const isActive = i === activeIndex;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onOpenTab(tab.id)}
                    className="relative flex flex-col items-center gap-2 w-16"
                  >
                    <span
                      className="w-[52px] h-[52px] rounded-full flex items-center justify-center"
                      style={
                        isDone
                          ? { background: accent.color }
                          : isActive
                          ? { background: '#FFFFFF', border: `3px solid ${accent.color}`, boxShadow: `0 0 0 5px ${accent.light}` }
                          : { background: '#EDE6DB' }
                      }
                    >
                      {isDone ? (
                        <Check className="w-6 h-6" style={{ color: '#FFFFFF' }} />
                      ) : (
                        <Icon className="w-6 h-6" style={{ color: isActive ? accent.color : '#77716A' }} />
                      )}
                    </span>
                    <span
                      className="text-xs text-center leading-tight"
                      style={{
                        fontWeight: isActive ? 800 : 600,
                        color: isActive ? accent.color : '#6B665E'
                      }}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTopic && (
          <button
            type="button"
            onClick={() => onOpenTab(activeTopic.id)}
            className="w-full mt-3 h-[76px] rounded-[22px] pl-4 pr-3 flex items-center gap-3.5 text-left active:scale-[0.99] transition-transform"
            style={{ background: accent.color, color: '#FFFFFF' }}
          >
            <activeTopic.icon className="w-7 h-7 shrink-0" />
            <span className="flex-grow font-display font-extrabold text-xl truncate">{activeTopic.label}</span>
            <span className="w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center shrink-0">
              <Play className="w-5 h-5" fill={accent.color} style={{ color: accent.color }} />
            </span>
          </button>
        )}

        {exerciseTiles.length > 0 && (
          <>
            <div className="pt-6 flex items-center gap-2">
              <h2 className="font-display font-extrabold text-lg">Egzersizler</h2>
            </div>
            <div className="pt-3 pb-8 grid grid-cols-3 gap-2.5">
              {exerciseTiles.map((tile) => {
                const Icon = tile.icon;
                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => onOpenTab(tile.tabId, tile.activityId)}
                    className="h-24 rounded-[20px] bg-white border border-[#E6E0D6] flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <Icon className="w-7 h-7" style={{ color: accent.color }} strokeWidth={1.8} />
                    <span className="text-[12px] font-bold text-center px-1 leading-tight">{tile.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {topics.length === 0 && exerciseTiles.length === 0 && (
          <div className="py-16 text-center text-sm" style={{ color: '#6B665E' }}>
            Bu modül için henüz sekme tanımlı değil.
          </div>
        )}
      </div>
    </div>
  );
};
