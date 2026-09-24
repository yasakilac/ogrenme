import React, { useState } from 'react';
import { Network, Droplets, Lightbulb, CheckCircle2, XCircle, Award } from 'lucide-react';
import {
  ANALOGY_ITEMS,
  METAPHOR_DATA,
  SEMANTIC_MAP_DATA,
  type AnalogyItem,
  type SemanticNode,
} from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG } from '../../../components/ui';

interface AnalogyMetaphorActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const AnalogyMetaphorActivity: React.FC<AnalogyMetaphorActivityProps> = ({ onScoreUpdate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'metaphor' | 'analogy' | 'webbing'>('metaphor');

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
    setAnalogyAnswers((prev) => ({
      ...prev,
      [currentAnalogy.id]: { choice: opt, isCorrect },
    }));

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

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Sekmeler */}
      <div className="bg-white p-5 rounded-[20px] border border-[#EBE7E0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block">
              Görsel Modeller ve Zihinsel Harita
            </span>
            <h3 className="text-lg font-bold text-[#1F1E1B]">Metafor, Analoji ve Semantik Ağ</h3>
            <p className="text-sm text-[#66635E] mt-0.5">
              Soyut fotoğrafçılık kavramlarını günlük hayattaki benzerlikler ve zihinsel haritalarla pekiştirin.
            </p>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-[16px]">
            <button
              onClick={() => setActiveSubTab('metaphor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeSubTab === 'metaphor' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-black'
              }`}
            >
              Su Kovası Metaforu
            </button>
            <button
              onClick={() => setActiveSubTab('analogy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeSubTab === 'analogy' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-black'
              }`}
            >
              Analoji Tamamlama
            </button>
            <button
              onClick={() => setActiveSubTab('webbing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeSubTab === 'webbing' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-black'
              }`}
            >
              Semantik Ağ
            </button>
          </div>
        </div>
      </div>

      {/* 1. Su Kovası ve Musluk Metaforu */}
      {activeSubTab === 'metaphor' && (
        <div className="bg-white border border-[#EBE7E0] rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#F0ECE6] pb-4">
            <div className="w-10 h-10 rounded-[20px] bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1F1E1B]">{METAPHOR_DATA.title}</h2>
              <p className="text-xs text-[#66635E]">{METAPHOR_DATA.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {METAPHOR_DATA.elements.map((item, idx) => (
              <div
                key={item.concept}
                className="p-5 rounded-[20px] bg-[#FAF8F5] border border-[#EBE7E0] space-y-2 hover:border-[var(--accent)] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#1F1E1B]">{item.concept}</span>
                  <span className="text-xs font-bold text-[var(--accent)] bg-[var(--accent-light)] px-2 py-0.5 rounded-md">
                    Adım {idx + 1}
                  </span>
                </div>
                <div className="text-xs text-[#66635E]">
                  <strong className="text-stone-700 block mb-0.5">Metafor Karşılığı:</strong>
                  {item.metaphor}
                </div>
                <div className="text-xs text-stone-800 bg-white p-3 rounded-[16px] border border-stone-200 mt-2">
                  <strong className="text-[var(--accent)] block mb-0.5">Işık ve Fotoğrafa Yansıması:</strong>
                  {item.effect}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Analoji Tamamlama */}
      {activeSubTab === 'analogy' && (
        <div className="max-w-xl mx-auto bg-white border border-[#EBE7E0] rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between text-xs text-[#8A8680]">
            <span className="">ANALOJİ {analogyIndex + 1} / {ANALOGY_ITEMS.length}</span>
            <span className="font-bold text-[var(--accent)]">Disiplinlerarası Mantık</span>
          </div>

          <div className="p-6 rounded-[20px] bg-[#FAF8F5] border border-[#EBE7E0] space-y-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              Analoji Kalıbı:
            </span>
            <p className="text-sm sm:text-base font-bold text-[#1F1E1B] leading-relaxed">
              "{currentAnalogy.premiseA}", <span className="text-[var(--accent)] font-extrabold">{currentAnalogy.premiseB}</span> için ne anlama geliyorsa;
            </p>
            <p className="text-sm sm:text-base font-bold text-[#1F1E1B]">
              "{currentAnalogy.targetC}" de fotoğrafçılıkta neyin karşılığıdır?
            </p>
          </div>

          {/* Seçenekler */}
          <div className="space-y-2">
            {currentAnalogy.options.map((opt) => {
              const isSelected = analogyResult?.choice === opt;
              const isCorrect = opt === currentAnalogy.correctOption;

              let style: React.CSSProperties = { background: '#FAF8F5', borderColor: '#E0DCD6', color: '#1F1E1B' };
              if (analogyResult) {
                if (isCorrect) {
                  style = { background: CORRECT.bg, borderColor: CORRECT.border, color: CORRECT.fg, fontWeight: 700 };
                } else if (isSelected) {
                  style = { background: WRONG.bg, borderColor: WRONG.border, color: WRONG.fg };
                } else {
                  style = { background: '#FAFAF9', borderColor: '#E7E5E4', opacity: 0.4 };
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectAnalogyOption(opt)}
                  disabled={Boolean(analogyResult)}
                  style={style}
                  className="w-full p-4 rounded-[16px] border text-left text-xs font-semibold transition-all flex items-center justify-between"
                >
                  <span>{opt}</span>
                  {analogyResult && isCorrect && <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: CORRECT.border }} />}
                  {analogyResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 shrink-0" style={{ color: WRONG.border }} />}
                </button>
              );
            })}
          </div>

          {analogyResult && (
            <div className="space-y-3 pt-2">
              <div
                className="p-4 rounded-[16px] border text-xs leading-relaxed space-y-1"
                style={{
                  background: analogyResult.isCorrect ? CORRECT.bg : WRONG.bg,
                  borderColor: analogyResult.isCorrect ? CORRECT.border : WRONG.border,
                  color: analogyResult.isCorrect ? CORRECT.fg : WRONG.fg
                }}
              >
                <strong className="block font-bold">
                  {analogyResult.isCorrect ? '✅ Harika Çıkarım!' : 'Analoji Analizi:'}
                </strong>
                <p>{currentAnalogy.explanation}</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextAnalogy}
                  className="px-5 py-2.5 rounded-[16px] font-bold text-xs bg-[var(--accent)] hover:bg-[var(--accent)] text-white transition-colors"
                >
                  Sonraki Analojiye Geç →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Semantik Ağ / Webbing */}
      {activeSubTab === 'webbing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-[#EBE7E0] rounded-[24px] p-6 shadow-sm space-y-4">
            <span className="text-xs font-bold text-[#8A8680] uppercase tracking-wider block">
              Kavram Ağ Düğümleri (Tıklayarak İlişkileri İnceleyin):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SEMANTIC_MAP_DATA.nodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      setSelectedNode(node);
                      cameraAudio.playDialTick();
                    }}
                    className={`p-3 rounded-[16px] border text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)] font-bold shadow-sm'
                        : 'bg-[#FAF8F5] border-[#E0DCD6] text-stone-800 hover:bg-stone-100 font-medium'
                    }`}
                  >
                    <span className="block truncate">{node.label}</span>
                    <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-[var(--accent)]' : 'text-[#8A8680]'}`}>
                      {node.group.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* İki Kavram Arasındaki Bağlantılar */}
            <div className="pt-4 border-t border-[#F0ECE6]">
              <span className="text-xs font-bold text-stone-700 block mb-2">
                Bu Kavramın Diğer Kavramlarla Bağlantıları:
              </span>
              <div className="space-y-1.5">
                {SEMANTIC_MAP_DATA.links
                  .filter((l) => l.source === selectedNode.id || l.target === selectedNode.id)
                  .map((l, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-center justify-between"
                    >
                      <span className="font-semibold text-[var(--accent)]">{l.relationship}</span>
                      <span className="text-[11px] text-stone-500">
                        {l.source} ↔ {l.target}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#EBE7E0] rounded-[24px] p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block">
                SEÇİLİ KAVRAM DÜĞÜMÜ
              </span>
              <h2 className="text-2xl font-extrabold text-[#1F1E1B]">{selectedNode.label}</h2>
              <p className="text-sm text-[#66635E] leading-relaxed">{selectedNode.description}</p>
            </div>

            <div className="p-4 rounded-[20px] bg-white border border-[#EBE7E0] text-xs space-y-1">
              <span className="font-bold text-[#1F1E1B] block">Pedagojik Fayda:</span>
              <p className="text-[#66635E] leading-relaxed">
                Zihninizde fotoğrafçılık ayarlarını bağımsız mekanikler olarak değil, birbirini tetikleyen bir ağ olarak görmenizi sağlar.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
