import React, { useState } from 'react';
import { Compass, CheckCircle2, XCircle, Award } from 'lucide-react';
import { SCENARIO_ITEMS, type ScenarioItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';

interface ScenarioActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const ScenarioActivity: React.FC<ScenarioActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, { optionId: string; isCorrect: boolean }>>({});

  const scenario: ScenarioItem = SCENARIO_ITEMS[currentIndex];
  const userResult = answers[scenario.id];

  const handleSelectOption = (optId: string, isCorrect: boolean) => {
    if (userResult) return;
    setAnswers((prev) => ({
      ...prev,
      [scenario.id]: { optionId: optId, isCorrect },
    }));

    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(20);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SCENARIO_ITEMS.length);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#EBE7E0]">
        <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
          Gerçek Çekim Koşulları Pratiği
        </span>
        <h3 className="text-lg font-bold text-[#1F1E1B]">Saha Senaryoları & Ayar Kararı</h3>
        <p className="text-sm text-[#66635E] mt-0.5">
          Gerçek hayattaki zorlu çekim koşullarında en uygun Diyafram, Enstantane ve ISO kombinasyonunu seçin.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white border border-[#EBE7E0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs text-[#8A8680]">
          <span className="font-mono">GÖREV {currentIndex + 1} / {SCENARIO_ITEMS.length}</span>
          <span className="font-bold text-[#1F1E1B]">{scenario.title}</span>
        </div>

        {/* Senaryo Hikayesi */}
        <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7E0] space-y-3">
          <p className="text-sm sm:text-base text-[#1F1E1B] leading-relaxed font-medium">
            {scenario.story}
          </p>
          <div className="text-xs font-bold text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            🎯 Hedefiniz: {scenario.goal}
          </div>
        </div>

        {/* Ayar Seçenekleri */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
            Hangi ayar kombinasyonunu seçersiniz?
          </label>
          <div className="space-y-2">
            {scenario.options.map((opt) => {
              const isSelected = userResult?.optionId === opt.id;

              let style = 'bg-[#FAF8F5] border-[#E0DCD6] text-[#1F1E1B] hover:bg-stone-100';
              if (userResult) {
                if (opt.isCorrect) {
                  style = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                } else if (isSelected) {
                  style = 'bg-rose-50 border-rose-400 text-rose-950';
                } else {
                  style = 'opacity-40 bg-stone-50 border-stone-200';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                  disabled={Boolean(userResult)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${style}`}
                >
                  <div>
                    <span className="font-mono font-bold text-sm block">{opt.label}</span>
                    <span className="text-[11px] opacity-75">
                      Diyafram: {opt.settings.f} • Süre: {opt.settings.s} • ISO: {opt.settings.iso}
                    </span>
                  </div>
                  {userResult && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {userResult && isSelected && !opt.isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Geri Bildirim */}
        {userResult && (
          <div className="space-y-3 pt-2">
            {scenario.options.map((opt) => {
              if (opt.id === userResult.optionId) {
                return (
                  <div
                    key={opt.id}
                    className={`p-4 rounded-xl border text-xs leading-relaxed ${
                      opt.isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50 border-amber-200 text-amber-950'
                    }`}
                  >
                    <strong className="block font-bold">
                      {opt.isCorrect ? '✅ Harika Saha Kararı!' : 'Hata Analizi:'}
                    </strong>
                    <p>{opt.feedback}</p>
                  </div>
                );
              }
              return null;
            })}

            <div className="flex justify-end pt-1">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                Sonraki Saha Senaryosu →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
