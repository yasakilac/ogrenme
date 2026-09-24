import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Search, HelpCircle, Wrench } from 'lucide-react';
import { ERROR_FINDING_ITEMS, type ErrorFindingItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';

interface ErrorFindingActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const ErrorFindingActivity: React.FC<ErrorFindingActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, { selectedIndex: number; isCorrect: boolean }>>({});

  const item: ErrorFindingItem = ERROR_FINDING_ITEMS[currentIndex];
  const userResult = answers[item.id];

  const handleSelect = (idx: number) => {
    if (userResult) return;
    const isCorrect = idx === item.correctOptionIndex;
    setAnswers((prev) => ({
      ...prev,
      [item.id]: { selectedIndex: idx, isCorrect },
    }));

    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(20);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ERROR_FINDING_ITEMS.length);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#EBE7E0]">
        <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
          EXIF Analizi & Kusur Teşhisi
        </span>
        <h3 className="text-lg font-bold text-[#1F1E1B]">Hata Bulma & Teşhis (Kamera Dedektifi)</h3>
        <p className="text-sm text-[#66635E] mt-0.5">
          Hatalı çekilmiş fotoğrafın EXIF verilerini ve belirtisini inceleyerek temel teknik kusuru saptayın.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white border border-[#EBE7E0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs text-[#8A8680]">
          <span className="font-mono">VAKA {currentIndex + 1} / {ERROR_FINDING_ITEMS.length}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold">
            Teşhis & Analiz
          </span>
        </div>

        {/* Vaka Senaryosu */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7E0] space-y-2">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
              Olay / Çekim Senaryosu:
            </span>
            <p className="text-sm text-[#1F1E1B] leading-relaxed font-medium">{item.scenario}</p>
          </div>

          {/* EXIF Bilgi Kutusu */}
          <div className="bg-stone-900 text-stone-200 p-4 rounded-2xl font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-stone-800 pb-1.5 text-stone-400">
              <span>EXIF METAVERİSİ</span>
              <span>{item.photoExif.condition}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-amber-400 font-bold">
              <div>Diyafram: <span className="text-white">{item.photoExif.aperture}</span></div>
              <div>Enstantane: <span className="text-white">{item.photoExif.shutter}</span></div>
              <div>ISO: <span className="text-white">{item.photoExif.iso}</span></div>
              <div>Lens: <span className="text-white">{item.photoExif.lens}</span></div>
            </div>
            <div className="pt-1 text-stone-400 flex items-center gap-1.5 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Gözlemlenen Belirti: <strong className="text-rose-300">{item.symptom}</strong></span>
            </div>
          </div>
        </div>

        {/* Çoktan Seçmeli Hata Tespiti */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
            Bu hatanın temel sebebi nedir?
          </label>
          <div className="space-y-2">
            {item.options.map((opt, idx) => {
              const isSelected = userResult?.selectedIndex === idx;
              const isCorrect = idx === item.correctOptionIndex;

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
                  key={opt}
                  onClick={() => handleSelect(idx)}
                  disabled={Boolean(userResult)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start justify-between gap-2 ${style}`}
                >
                  <span>{opt}</span>
                  {userResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                  {userResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Çözüm ve Açıklama */}
        {userResult && (
          <div className="space-y-3 pt-2">
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
                userResult.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <strong className="block font-bold">
                {userResult.isCorrect ? '🎯 Kusursuz Teşhis!' : 'Teşhis Analizi:'}
              </strong>
              <p>{item.explanation}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-xs flex items-start gap-2 text-stone-800">
              <Wrench className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Önerilen Çözüm (Fix):</strong>
                <span>{item.recommendedFix}</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-stone-900 hover:bg-black text-white transition-colors"
              >
                Sonraki Vakaya Geç →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
