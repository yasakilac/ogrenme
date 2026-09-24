import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Search,
  Clock,
  GraduationCap
} from 'lucide-react';
import { UserProgressData } from '../types';
import { MODULE_REGISTRY } from '../modules/registry';
import { MockExam, EXAM_POOL, EXAM_SOURCE_MODULE_COUNT, getLastMockExamScore } from './MockExam';

interface LearningHubViewProps {
  progress: UserProgressData;
  onSelectModule: (moduleId: string) => void;
}

/** Kart teması: opsiyonel `colorTheme` meta alanından, yoksa index'e göre döngüyle atanır.
 * Tailwind v4 dinamik class üretmediği için tam class string'leri burada sabitlenir. */
const CARD_THEMES = {
  rose: {
    card: 'bg-rose-50 border-rose-200 hover:border-rose-300',
    icon: 'bg-rose-100 border-rose-200 text-rose-700',
    progressBox: 'bg-rose-100/70 border-rose-200/70',
    progressText: 'text-rose-900',
    progressTrack: 'bg-rose-200/70',
    progressFill: 'bg-rose-600',
    button: 'bg-rose-700 hover:bg-rose-800'
  },
  sky: {
    card: 'bg-sky-50 border-sky-200 hover:border-sky-300',
    icon: 'bg-sky-100 border-sky-200 text-sky-700',
    progressBox: 'bg-sky-100/70 border-sky-200/70',
    progressText: 'text-sky-900',
    progressTrack: 'bg-sky-200/70',
    progressFill: 'bg-sky-600',
    button: 'bg-sky-700 hover:bg-sky-800'
  },
  emerald: {
    card: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300',
    icon: 'bg-emerald-100 border-emerald-200 text-emerald-700',
    progressBox: 'bg-emerald-100/70 border-emerald-200/70',
    progressText: 'text-emerald-900',
    progressTrack: 'bg-emerald-200/70',
    progressFill: 'bg-emerald-600',
    button: 'bg-emerald-700 hover:bg-emerald-800'
  },
  amber: {
    card: 'bg-amber-50 border-amber-200 hover:border-amber-300',
    icon: 'bg-amber-100 border-amber-200 text-amber-800',
    progressBox: 'bg-amber-100/70 border-amber-200/70',
    progressText: 'text-amber-900',
    progressTrack: 'bg-amber-200/70',
    progressFill: 'bg-amber-600',
    button: 'bg-amber-800 hover:bg-amber-900'
  },
  violet: {
    card: 'bg-violet-50 border-violet-200 hover:border-violet-300',
    icon: 'bg-violet-100 border-violet-200 text-violet-700',
    progressBox: 'bg-violet-100/70 border-violet-200/70',
    progressText: 'text-violet-900',
    progressTrack: 'bg-violet-200/70',
    progressFill: 'bg-violet-600',
    button: 'bg-violet-700 hover:bg-violet-800'
  }
} as const;

const THEME_CYCLE: (keyof typeof CARD_THEMES)[] = ['rose', 'sky', 'emerald', 'amber', 'violet'];

/** Planlanan (henüz açılmamış) modüller daha soluk/nötr kalır. */
const NEUTRAL_THEME = {
  card: 'bg-[#FAF8F5] border-[#E8E4DC] opacity-90 hover:opacity-100 hover:border-stone-300 hover:bg-white',
  icon: 'bg-stone-100 border-stone-200 text-stone-400'
};

const getCardTheme = (colorTheme: string | undefined, registryIndex: number) => {
  if (colorTheme && colorTheme in CARD_THEMES) return CARD_THEMES[colorTheme as keyof typeof CARD_THEMES];
  return CARD_THEMES[THEME_CYCLE[registryIndex % THEME_CYCLE.length]];
};

export const LearningHubView: React.FC<LearningHubViewProps> = ({
  progress,
  onSelectModule
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'languages' | 'tech' | 'culture'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExam, setShowExam] = useState(false);

  const filteredAreas = MODULE_REGISTRY.filter(({ meta }) => {
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'languages' && meta.category === 'Dil') ||
      (selectedFilter === 'tech' && meta.category === 'Teknoloji') ||
      (selectedFilter === 'culture' && meta.category === 'Kültür & Sanat');

    const matchesSearch =
      meta.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meta.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meta.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (showExam) {
    return <MockExam onExit={() => setShowExam(false)} />;
  }

  const lastScore = getLastMockExamScore();

  return (
    <div className="space-y-6 pb-24 sm:pb-12 max-w-5xl mx-auto">

      {/* 1. DENEME SINAVI GİRİŞ KARTI */}
      <button
        type="button"
        id="hub-open-mock-exam"
        onClick={() => setShowExam(true)}
        disabled={EXAM_POOL.length === 0}
        className="w-full text-left relative overflow-hidden bg-violet-50 border border-violet-200 hover:border-violet-300 rounded-3xl p-5 sm:p-6 shadow-2xs transition-all flex items-center justify-between gap-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-100 border border-violet-200 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-violet-700" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#1F1E1B]">Deneme Sınavı</h2>
            <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5">
              {EXAM_SOURCE_MODULE_COUNT} konudan {EXAM_POOL.length} soru
              {lastScore ? ` · Son puan: %${lastScore.percentage}` : ''}
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-violet-700 shrink-0" />
      </button>

      {/* 2. ARAMA VE KATEGORİ FİLTRELERİ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A09A8F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            id="hub-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Öğrenme alanı ara (örn: Japonca, Kodlama, Korece)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E4DC] text-xs sm:text-sm text-[#1F1E1B] placeholder:text-[#A09A8F] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {[
            { id: 'all' as const, label: 'Tüm Alanlar' },
            { id: 'languages' as const, label: 'Diller' },
            { id: 'tech' as const, label: 'Teknoloji & Kod' },
            { id: 'culture' as const, label: 'Kültür & Sanat' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              id={`hub-filter-${tab.id}`}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedFilter === tab.id
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white border border-[#E8E4DC] text-[#5C574F] hover:text-[#1F1E1B] hover:border-stone-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. ÖĞRENME ALANLARI LİSTESİ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAreas.map((module) => {
          const item = module.meta;
          const isActive = item.status === 'active';
          const progressPercent = module.getProgressPercent?.(progress) ?? 0;
          const registryIndex = MODULE_REGISTRY.indexOf(module);
          const theme = isActive ? getCardTheme(item.colorTheme, registryIndex) : null;

          return (
            <div
              key={item.id}
              id={`hub-card-${item.id}`}
              className={`rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between relative ${
                isActive ? theme!.card : NEUTRAL_THEME.card
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        {item.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                      }`}>
                        {item.tag}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-[#1F1E1B] mt-2 tracking-tight">
                      {item.title}
                    </h2>
                    <span className="text-xs font-semibold text-[#7A756D] block mt-0.5">
                      {item.subtitle}
                    </span>
                  </div>

                  {isActive ? (
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-japanese font-black text-2xl shrink-0 shadow-2xs ${theme!.icon}`}>
                      {item.glyph ?? item.title.charAt(0)}
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${NEUTRAL_THEME.icon}`}>
                      <Clock className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#5C574F] leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Key Features Chips */}
                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                  {item.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium px-2 py-0.8 rounded-lg bg-stone-100/80 text-stone-700"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>

                {/* Progress bar if active */}
                {isActive && (
                  <div className={`border rounded-xl p-3 mb-4 ${theme!.progressBox}`}>
                    <div className={`flex items-center justify-between text-xs font-bold mb-1.5 ${theme!.progressText}`}>
                      <span>{item.labels?.progress ?? `${item.title} İlerlemeniz`}</span>
                      <span>%{progressPercent}</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${theme!.progressTrack}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${theme!.progressFill}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-[#F0ECE4]">
                {isActive ? (
                  <button
                    type="button"
                    id={`btn-open-${item.id}-module`}
                    onClick={() => onSelectModule(item.id)}
                    className={`w-full py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-98 ${theme!.button}`}
                  >
                    <span>{item.labels?.cta ?? `${item.title} • Başla / Devam Et`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-full py-2.5 px-4 rounded-xl bg-stone-100 text-stone-500 font-bold text-xs flex items-center justify-center gap-2 select-none">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Geliştirme Aşamasında • Yakında Eklenecek</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. ALT BİLGİ VE YOL HARİTASI NOTU */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#7A756D]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Yeni öğrenme alanları ve ders modülleri bu ana merkeze eklenecektir. İstediğiniz an üst menüden Japonca ve diğer alanlar arasında geçiş yapabilirsiniz.
          </span>
        </div>
      </div>

    </div>
  );
};
