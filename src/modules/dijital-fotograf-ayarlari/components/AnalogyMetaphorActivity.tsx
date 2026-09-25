import React, { useState } from 'react';
import { Lightbulb, Network, ArrowRight, Aperture, Timer, Box, RotateCcw } from 'lucide-react';
import {
  ANALOGY_ITEMS,
  METAPHOR_DATA,
  SEMANTIC_MAP_DATA,
  type AnalogyItem,
  type SemanticNode,
} from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG, CheckBar } from '../../../components/ui';

interface AnalogyMetaphorActivityProps {
  onScoreUpdate?: (points: number) => void;
}

const IDLE = { bg: '#FFFFFF', border: '#E6E0D6', fg: '#1C1B19' };
const DARK = '#1F2A44';
const BUCKET_LABELS = METAPHOR_DATA.elements.map((el) => el.concept.split(' (')[0]);
const BUCKET_ICONS = [Aperture, Timer, Box] as const;

export const AnalogyMetaphorActivity: React.FC<AnalogyMetaphorActivityProps> = ({ onScoreUpdate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'metaphor' | 'analogy' | 'webbing'>('metaphor');

  // Su Kovası (metafor) durumu — vana(diyafram)/süre(enstantane)/kova(ISO), 1-3 seviye
  const [levels, setLevels] = useState<{ a: number; s: number; i: number }>({ a: 1, s: 1, i: 1 });

  // Analoji Durumu
  const [analogyIndex, setAnalogyIndex] = useState<number>(0);
  const [analogyAnswers, setAnalogyAnswers] = useState<Record<string, { choice: string; isCorrect: boolean }>>({});

  // Semantik Ağ Durumu
  const [selectedNode, setSelectedNode] = useState<SemanticNode>(SEMANTIC_MAP_DATA.nodes[0]);

  const currentAnalogy: AnalogyItem = ANALOGY_ITEMS[analogyIndex];
  const analogyResult = analogyAnswers[currentAnalogy.id];

  const handleSelectAnalogyOption = (opt: string) => {
    if (analogyResult) return;
    const isCorrect = opt === currentAnalogy.correctOption;
    setAnalogyAnswers((prev) => ({ ...prev, [currentAnalogy.id]: { choice: opt, isCorrect } }));

    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(15);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNextAnalogy = () => {
    setAnalogyIndex((prev) => (prev + 1) % ANALOGY_ITEMS.length);
  };

  const optionTone = (opt: string) => {
    if (!analogyResult) return IDLE;
    if (opt === currentAnalogy.correctOption) return CORRECT;
    if (analogyResult.choice === opt) return WRONG;
    return { ...IDLE, bg: '#FAF8F5', fg: '#A39C91' };
  };

  const answerTone = analogyResult ? (analogyResult.isCorrect ? CORRECT : WRONG) : null;

  // Su kovası hesapları (Vana + Süre + Kova toplamı: 3 = az, 6 = tam, >6 = taştı)
  const sum = levels.a + levels.s + levels.i;
  const setLevel = (key: 'a' | 's' | 'i', delta: number) => () =>
    setLevels((prev) => ({ ...prev, [key]: Math.min(3, Math.max(1, prev[key] + delta)) }));
  const waterLevel = sum >= 6 ? 100 : Math.round(((sum - 2) / 4) * 100);
  const isOverflow = sum > 6;
  const isFull = sum === 6;
  const bucketSize = 190 - levels.i * 30;
  const streamWidth = 6 + levels.a * 8;
  const bucketRows: { key: 'a' | 's' | 'i'; label: string; Icon: (typeof BUCKET_ICONS)[number]; value: number }[] = [
    { key: 'a', label: BUCKET_LABELS[0] ?? 'Vana · Diyafram', Icon: BUCKET_ICONS[0], value: levels.a },
    { key: 's', label: BUCKET_LABELS[1] ?? 'Süre · Enstantane', Icon: BUCKET_ICONS[1], value: levels.s },
    { key: 'i', label: BUCKET_LABELS[2] ?? 'Kova · ISO', Icon: BUCKET_ICONS[2], value: levels.i },
  ];

  return (
    <div className="space-y-4">
      {/* Alt Sekmeler */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-[18px]" style={{ background: '#EDE6DB' }}>
        {([
          ['metaphor', 'Su Kovası'],
          ['analogy', 'Benzetme'],
          ['webbing', 'Semantik Ağ'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveSubTab(key)}
            className="h-[42px] rounded-[14px] border-none font-extrabold text-[13px] transition-colors"
            style={{ background: activeSubTab === key ? '#1C1B19' : 'transparent', color: activeSubTab === key ? '#FFFFFF' : '#1C1B19' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 1. Su Kovası ve Musluk Metaforu — etkileşimli simülasyon */}
      {activeSubTab === 'metaphor' && (
        <div className="space-y-3">
          <p className="text-xs leading-relaxed" style={{ color: '#6B665E' }}>
            {METAPHOR_DATA.description}
          </p>

          <div
            className="rounded-[28px] relative overflow-hidden flex flex-col items-center justify-end gap-0"
            style={{ background: DARK, height: 260, paddingBottom: 20 }}
          >
            <div
              className="absolute top-0 rounded-b-[6px]"
              style={{ left: '50%', marginLeft: -streamWidth / 2, width: streamWidth, height: 70, background: '#7DD3FC' }}
            />
            <div className="absolute top-0 rounded-b-[8px]" style={{ left: '50%', marginLeft: -45, width: 90, height: 16, background: '#6B7AA0' }} />
            <div
              className="relative overflow-hidden box-border"
              style={{
                width: bucketSize,
                height: bucketSize,
                border: '5px solid #C7D0E4',
                borderTop: 'none',
                borderRadius: '0 0 22px 22px',
              }}
            >
              <div className="absolute left-0 right-0 bottom-0 transition-all" style={{ height: `${waterLevel}%`, background: '#38BDF8' }} />
            </div>
            <div
              className="absolute right-3 top-3 h-9 px-3 rounded-full flex items-center font-extrabold text-sm"
              style={{
                background: isOverflow ? WRONG.bg : isFull ? CORRECT.bg : '#2E3D5F',
                color: isOverflow ? WRONG.fg : isFull ? CORRECT.fg : '#FFFFFF',
              }}
            >
              {isOverflow ? 'Taştı · +EV' : isFull ? 'Tam · 0 EV' : 'Az · −EV'}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {bucketRows.map(({ key, label, Icon, value }) => (
              <div key={key} className="h-16 rounded-[20px] bg-white flex items-center gap-2.5 pl-3.5 pr-2" style={{ border: '1px solid #E6E0D6' }}>
                <Icon className="w-6 h-6 shrink-0" style={{ color: 'var(--accent)' }} />
                <span className="flex-grow font-extrabold text-[15px]">{label}</span>
                <button
                  type="button"
                  onClick={setLevel(key, -1)}
                  aria-label={`${label} azalt`}
                  className="w-11 h-11 rounded-[14px] font-extrabold text-xl"
                  style={{ border: '1px solid #E6E0D6', background: '#F7F4EE', color: '#1C1B19' }}
                >
                  −
                </button>
                <div className="flex gap-1">
                  {[1, 2, 3].map((n) => (
                    <span key={n} className="block w-2.5 h-[22px] rounded-sm" style={{ background: n <= value ? 'var(--accent)' : '#EDE6DB' }} />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={setLevel(key, 1)}
                  aria-label={`${label} artır`}
                  className="w-11 h-11 rounded-[14px] font-extrabold text-xl"
                  style={{ border: '1px solid #E6E0D6', background: '#F7F4EE', color: '#1C1B19' }}
                >
                  +
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setLevels({ a: 1, s: 1, i: 1 })}
            aria-label="Baştan"
            className="w-full h-14 rounded-[18px] border-none flex items-center justify-center gap-2 font-bold text-sm"
            style={{ background: '#1C1B19', color: '#FFFFFF' }}
          >
            <RotateCcw className="w-5 h-5" />
            Baştan
          </button>
        </div>
      )}

      {/* 2. Analoji Tamamlama */}
      {activeSubTab === 'analogy' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold" style={{ color: '#6B665E' }}>
            <span>Analoji {analogyIndex + 1} / {ANALOGY_ITEMS.length}</span>
          </div>

          <div className="grid gap-2.5 items-center" style={{ gridTemplateColumns: '1fr 32px 1fr' }}>
            <div className="h-[120px] rounded-[24px] flex flex-col items-center justify-center gap-2 px-2 text-center" style={{ background: 'var(--accent-light)', border: '1px solid #E6E0D6' }}>
              <Lightbulb className="w-9 h-9" style={{ color: 'var(--accent)' }} />
              <span className="font-extrabold text-[13px] leading-tight">{currentAnalogy.premiseA}</span>
            </div>
            <ArrowRight className="w-7 h-7 mx-auto" style={{ color: '#6B665E' }} />
            <div className="h-[120px] rounded-[24px] flex flex-col items-center justify-center gap-2 px-2 text-center bg-white" style={{ border: '1px solid #E6E0D6' }}>
              <Network className="w-9 h-9" style={{ color: '#1C1B19' }} />
              <span className="font-extrabold text-[13px] leading-tight">{currentAnalogy.premiseB}</span>
            </div>

            <div className="h-[120px] rounded-[24px] flex flex-col items-center justify-center gap-2 px-2 text-center" style={{ background: 'var(--accent-light)', border: '1px solid #E6E0D6' }}>
              <Lightbulb className="w-9 h-9" style={{ color: 'var(--accent)' }} />
              <span className="font-extrabold text-[13px] leading-tight">{currentAnalogy.targetC}</span>
            </div>
            <ArrowRight className="w-7 h-7 mx-auto" style={{ color: '#6B665E' }} />
            <div
              className="h-[120px] rounded-[24px] flex flex-col items-center justify-center gap-1 px-2 text-center"
              style={{
                background: answerTone ? answerTone.bg : '#F7F4EE',
                border: answerTone ? `3px solid ${answerTone.border}` : '2px dashed #C9BFAF',
              }}
            >
              {analogyResult ? (
                <span className="font-extrabold text-[13px] leading-tight" style={{ color: answerTone!.fg }}>
                  {analogyResult.choice}
                </span>
              ) : (
                <span className="font-display font-extrabold text-4xl" style={{ color: '#A39C91' }}>
                  ?
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {currentAnalogy.options.map((opt) => {
              const tone = optionTone(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectAnalogyOption(opt)}
                  disabled={Boolean(analogyResult)}
                  style={{ background: tone.bg, color: tone.fg, border: `${analogyResult ? 3 : 1}px solid ${tone.border}` }}
                  className="min-h-[110px] rounded-[22px] px-2 py-3 flex items-center justify-center text-center font-extrabold text-[13px] leading-snug transition-all"
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {analogyResult && (
            <CheckBar correct={analogyResult.isCorrect} message={currentAnalogy.explanation} onNext={handleNextAnalogy} />
          )}
        </div>
      )}

      {/* 3. Semantik Ağ / Webbing */}
      {activeSubTab === 'webbing' && (
        <div className="space-y-4">
          <span className="text-xs font-bold block" style={{ color: '#6B665E' }}>
            Kavram düğümlerine dokunarak ilişkileri inceleyin:
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {SEMANTIC_MAP_DATA.nodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => {
                    setSelectedNode(node);
                    cameraAudio.playDialTick();
                  }}
                  className="p-3 rounded-[16px] text-left transition-all"
                  style={{
                    background: isSelected ? 'var(--accent)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#1C1B19',
                    border: `1px solid ${isSelected ? 'var(--accent)' : '#E6E0D6'}`,
                  }}
                >
                  <span className="block truncate text-xs font-bold">{node.label}</span>
                  <span className="block mt-0.5 text-[10px]" style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : '#6B665E' }}>
                    {node.group.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-[24px] p-5 flex flex-col gap-3" style={{ background: '#FAF8F5', border: '1px solid #E6E0D6' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
              Seçili düğüm
            </span>
            <h3 className="font-display text-xl font-extrabold">{selectedNode.label}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#6B665E' }}>{selectedNode.description}</p>

            <div className="pt-3 space-y-1.5" style={{ borderTop: '1px solid #E6E0D6' }}>
              {SEMANTIC_MAP_DATA.links
                .filter((l) => l.source === selectedNode.id || l.target === selectedNode.id)
                .map((l, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white flex items-center justify-between text-xs" style={{ border: '1px solid #E6E0D6' }}>
                    <span className="font-bold" style={{ color: 'var(--accent)' }}>{l.relationship}</span>
                    <span style={{ color: '#6B665E' }}>{l.source} ↔ {l.target}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
