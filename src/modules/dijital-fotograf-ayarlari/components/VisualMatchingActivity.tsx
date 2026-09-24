import React, { useState } from 'react';
import { Image as ImageIcon, CheckCircle2, XCircle, Award } from 'lucide-react';
import { VISUAL_MATCH_ITEMS, type VisualMatchItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';

interface VisualMatchingActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const VisualMatchingActivity: React.FC<VisualMatchingActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});

  const item: VisualMatchItem = VISUAL_MATCH_ITEMS[currentIndex];
  const userResult = answers[item.id];

  const handleSelect = (opt: string) => {
    if (userResult) return;
    const isCorrect = opt === item.correctAnswer;
    setAnswers((prev) => ({
      ...prev,
      [item.id]: { selected: opt, isCorrect },
    }));

    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(15);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % VISUAL_MATCH_ITEMS.length);
  };

  const totalScore = Object.values(answers).filter((a) => a.isCorrect).length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#EBE7E0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
              Görsel Algı & Optik Etki Eşleştirme
            </span>
            <h3 className="text-lg font-bold text-[#1F1E1B]">Görseldeki Optik Etkiyi Bulma</h3>
            <p className="text-sm text-[#66635E] mt-0.5">
              Fotoğraftaki optik etkiyi analiz edin ve buna sebep olan temel ayarı bulun.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
            <Award className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-stone-800">
              {totalScore} / {VISUAL_MATCH_ITEMS.length} Doğru
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white border border-[#EBE7E0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs text-[#8A8680] font-mono">
          <span>SORU {currentIndex + 1} / {VISUAL_MATCH_ITEMS.length}</span>
          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold font-sans">
            Kategori: {item.primarySetting}
          </span>
        </div>

        {/* Görsel Kartı */}
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-stone-900 border border-stone-200 shadow-inner group">
            <img
              src={item.photoUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                // Fallback SVG if offline
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect fill="%23222" width="600" height="400"/><text fill="%23aaa" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20">Fotoğraf Yüklenemedi (Optik Simülasyon)</text></svg>';
              }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white text-xs">
              <span className="font-bold block text-sm">{item.title}</span>
              <span className="opacity-90">{item.effectDescription}</span>
            </div>
          </div>
        </div>

        {/* Seçenekler */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
            Bu görsel etkiyi hangi ayar oluşturmuştur?
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {item.options.map((opt) => {
              const isSelected = userResult?.selected === opt;
              const isCorrect = opt === item.correctAnswer;

              let btnStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';
              if (userResult) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                } else {
                  btnStyle = 'opacity-50 bg-stone-50 border-stone-200';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={Boolean(userResult)}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {userResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {userResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
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
              {userResult.isCorrect ? '✨ Doğru Eşleştirme!' : 'İpucu:'}
            </strong>
            <p>{item.explanation}</p>
          </div>
        )}

        {/* İlerleme */}
        {userResult && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            >
              Sonraki Görsel Eşleştirme →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
