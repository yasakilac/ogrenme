import React, { useState } from 'react';
import { Check, X, Award, CheckCircle2, XCircle } from 'lucide-react';
import { TRUE_FALSE_ITEMS, type TrueFalseItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';

interface TrueFalseActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const TrueFalseActivity: React.FC<TrueFalseActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, { choice: boolean; isCorrect: boolean }>>({});

  const item: TrueFalseItem = TRUE_FALSE_ITEMS[currentIndex];
  const userResult = answers[item.id];

  const handleAnswer = (choice: boolean) => {
    if (userResult) return;
    const isCorrect = choice === item.isTrue;
    setAnswers((prev) => ({
      ...prev,
      [item.id]: { choice, isCorrect },
    }));

    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(10);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TRUE_FALSE_ITEMS.length);
  };

  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#EBE7E0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
              Hızlı Karar ve Refleks Testi
            </span>
            <h3 className="text-lg font-bold text-[#1F1E1B]">Doğru / Yanlış Karar Testi</h3>
            <p className="text-sm text-[#66635E] mt-0.5">
              Optik kurallarla ilgili aşağıdaki önermeyi okuyup doğruluğunu anında belirleyin.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
            <Award className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-stone-800">
              {correctCount} / {TRUE_FALSE_ITEMS.length} Doğru
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto bg-white border border-[#EBE7E0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs text-[#8A8680]">
          <span className="font-mono">ÖNERME {currentIndex + 1} / {TRUE_FALSE_ITEMS.length}</span>
          <span className="font-semibold text-rose-600">Hızlı Refleks</span>
        </div>

        {/* İfade Kutusu */}
        <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EBE7E0] text-center">
          <p className="text-base sm:text-lg font-bold text-[#1F1E1B] leading-relaxed">
            "{item.statement}"
          </p>
        </div>

        {/* Doğru / Yanlış Butonları */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAnswer(true)}
            disabled={Boolean(userResult)}
            className={`p-4 rounded-2xl font-bold text-sm border flex items-center justify-center gap-2 transition-all ${
              userResult
                ? item.isTrue
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500/20'
                  : userResult.choice === true
                  ? 'bg-rose-50 border-rose-400 text-rose-900'
                  : 'opacity-40 bg-stone-50 border-stone-200'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}
          >
            <Check className="w-5 h-5" />
            DOĞRU
          </button>

          <button
            onClick={() => handleAnswer(false)}
            disabled={Boolean(userResult)}
            className={`p-4 rounded-2xl font-bold text-sm border flex items-center justify-center gap-2 transition-all ${
              userResult
                ? !item.isTrue
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500/20'
                  : userResult.choice === false
                  ? 'bg-rose-50 border-rose-400 text-rose-900'
                  : 'opacity-40 bg-stone-50 border-stone-200'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
            }`}
          >
            <X className="w-5 h-5" />
            YANLIŞ
          </button>
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
              {userResult.isCorrect ? '✅ Harika Çıkarım!' : 'Doğrusu Şöyledir:'}
            </strong>
            <p>{item.explanation}</p>
          </div>
        )}

        {/* Sonraki */}
        {userResult && (
          <div className="flex justify-end pt-1">
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            >
              Sonraki Önermeye Geç →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
