import React, { useState } from 'react';
import { Columns, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';
import { COMPARISON_MATRIX, type ComparisonMatrixItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';

interface ComparisonActivityProps {
  onScoreUpdate?: (points: number) => void;
}

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

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#EBE7E0]">
        <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
          Parametre Karşılaştırma Analizi
        </span>
        <h3 className="text-lg font-bold text-[#1F1E1B]">Karşılaştırma & Zıtlık Matrisi</h3>
        <p className="text-sm text-[#66635E] mt-0.5">
          Uç ayar değerlerinin ışık geçirgenliği, görsel optik sonucu ve ideal kullanım senaryolarını kıyaslayın.
        </p>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-2 border-b border-[#EBE7E0] pb-2 overflow-x-auto">
        {COMPARISON_MATRIX.map((item, idx) => (
          <button
            key={item.parameter}
            onClick={() => handleSelectTab(idx)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-colors ${
              selectedIndex === idx
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white border border-[#EBE7E0] text-[#1F1E1B] hover:bg-stone-100'
            }`}
          >
            {item.parameter}
          </button>
        ))}
      </div>

      {/* Karşılaştırma Tablosu (2 Yan Yana Sütun) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Sol Kolon: Düşük / Açık Değer */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              AÇIK / DÜŞÜK UÇ
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 font-extrabold text-xs">
              {currentComparison.lowValue.label}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <strong className="text-stone-500 block text-[11px] uppercase tracking-wide">
                Işık Girişi:
              </strong>
              <p className="text-sm font-bold text-[#1F1E1B] mt-0.5">
                {currentComparison.lowValue.lightIntake}
              </p>
            </div>

            <div>
              <strong className="text-stone-500 block text-[11px] uppercase tracking-wide">
                Görsel İmzası:
              </strong>
              <p className="text-[#1F1E1B] mt-0.5 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                {currentComparison.lowValue.visualEffect}
              </p>
            </div>

            <div>
              <strong className="text-stone-500 block text-[11px] uppercase tracking-wide">
                En Uygun Çekim Alanı:
              </strong>
              <p className="text-[#1F1E1B] mt-0.5 font-medium">
                {currentComparison.lowValue.idealScenario}
              </p>
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Yüksek / Kısık Değer */}
        <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-blue-100">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              KISIK / YÜKSEK UÇ
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 font-extrabold text-xs">
              {currentComparison.highValue.label}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <strong className="text-stone-500 block text-[11px] uppercase tracking-wide">
                Işık Girişi:
              </strong>
              <p className="text-sm font-bold text-[#1F1E1B] mt-0.5">
                {currentComparison.highValue.lightIntake}
              </p>
            </div>

            <div>
              <strong className="text-stone-500 block text-[11px] uppercase tracking-wide">
                Görsel İmzası:
              </strong>
              <p className="text-[#1F1E1B] mt-0.5 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                {currentComparison.highValue.visualEffect}
              </p>
            </div>

            <div>
              <strong className="text-stone-500 block text-[11px] uppercase tracking-wide">
                En Uygun Çekim Alanı:
              </strong>
              <p className="text-[#1F1E1B] mt-0.5 font-medium">
                {currentComparison.highValue.idealScenario}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
