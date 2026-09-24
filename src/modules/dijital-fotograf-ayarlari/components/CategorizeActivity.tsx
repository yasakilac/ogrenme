import React, { useState } from 'react';
import { Layers, CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';
import { CATEGORIZE_ITEMS, type CategorizeItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';

interface CategorizeActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const CategorizeActivity: React.FC<CategorizeActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userChoices, setUserChoices] = useState<Record<string, { choice: string; isCorrect: boolean }>>({});

  const item: CategorizeItem = CATEGORIZE_ITEMS[currentIndex];
  const userResult = userChoices[item.id];

  const categories = [
    'Diyafram (f/stop)',
    'Enstantane (Süre)',
    'ISO (Hassasiyet)',
  ] as const;

  const handleSelectCategory = (cat: typeof categories[number]) => {
    if (userResult) return;
    const isCorrect = cat === item.correctCategory;
    setUserChoices((prev) => ({
      ...prev,
      [item.id]: { choice: cat, isCorrect },
    }));

    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(15);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CATEGORIZE_ITEMS.length);
  };

  const correctCount = Object.values(userChoices).filter((c) => c.isCorrect).length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#EBE7E0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
              Pozlama Bileşenleri Pratiği
            </span>
            <h3 className="text-lg font-bold text-[#1F1E1B]">Kategorize Etme & Gruplama</h3>
            <p className="text-sm text-[#66635E] mt-0.5">
              Verilen optik sonucun veya tekniğin hangi temel kamera ayarına ait olduğunu gruplayın.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
            <Award className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-stone-800">
              {correctCount} / {CATEGORIZE_ITEMS.length} Başarılı
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto bg-white border border-[#EBE7E0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs text-[#8A8680]">
          <span className="font-mono">KART {currentIndex + 1} / {CATEGORIZE_ITEMS.length}</span>
          <span className="font-semibold text-rose-600">Gruplama Modu</span>
        </div>

        {/* Gruplanacak Cümle */}
        <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EBE7E0] text-center space-y-2">
          <span className="text-xs font-bold text-[#8A8680] uppercase tracking-wider block">
            FOTOĞRAFİK ETKİ / TEKNİK
          </span>
          <p className="text-base sm:text-lg font-bold text-[#1F1E1B] leading-relaxed">
            "{item.text}"
          </p>
        </div>

        {/* Kategori Seçenekleri (3 Temel Sütun) */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
            Bu etki doğrudan hangi ayara aittir?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {categories.map((cat) => {
              const isSelected = userResult?.choice === cat;
              const isCorrect = cat === item.correctCategory;

              let style = 'bg-[#FAF8F5] border-[#E0DCD6] text-[#1F1E1B] hover:bg-stone-100';
              if (userResult) {
                if (isCorrect) {
                  style = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                } else if (isSelected) {
                  style = 'bg-rose-50 border-rose-400 text-rose-950';
                } else {
                  style = 'opacity-40 bg-stone-50 border-stone-200';
                }
              }

              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  disabled={Boolean(userResult)}
                  className={`p-3.5 rounded-xl border text-center text-xs font-semibold transition-all ${style}`}
                >
                  <span className="block truncate">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Açıklama */}
        {userResult && (
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
              userResult.isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <strong className="block font-bold">
              {userResult.isCorrect ? '✅ Doğru Kategori!' : 'Açıklama:'}
            </strong>
            <p>{item.explanation}</p>
          </div>
        )}

        {/* İlerle */}
        {userResult && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            >
              Sonraki Kategorize Kartı →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
