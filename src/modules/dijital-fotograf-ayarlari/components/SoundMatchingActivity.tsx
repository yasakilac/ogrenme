import React, { useState } from 'react';
import { Volume2, Play, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import { SOUND_MATCH_ITEMS, type SoundMatchItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';

interface SoundMatchingActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const SoundMatchingActivity: React.FC<SoundMatchingActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});

  const currentItem: SoundMatchItem = SOUND_MATCH_ITEMS[currentIndex];
  const userResult = answers[currentItem.id];

  const handlePlaySound = () => {
    setIsPlaying(true);
    cameraAudio.playShutterSound(currentItem.shutterSpeed);
    const soundDurationMs = Math.max(150, currentItem.shutterSpeed * 1000 + 100);
    setTimeout(() => {
      setIsPlaying(false);
    }, soundDurationMs);
  };

  const handleSelectOption = (opt: string) => {
    if (userResult) return;
    const isCorrect = opt === currentItem.correctOption;
    setSelectedOption(opt);
    setAnswers((prev) => ({
      ...prev,
      [currentItem.id]: { selected: opt, isCorrect },
    }));

    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(15);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setCurrentIndex((prev) => (prev + 1) % SOUND_MATCH_ITEMS.length);
  };

  const totalCorrect = Object.values(answers).filter((a) => a.isCorrect).length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#EBE7E0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
              İşitsel Perde Hızı Pratiği
            </span>
            <h3 className="text-lg font-bold text-[#1F1E1B]">Deklanşör Sesi ile Enstantane Eşleştirme</h3>
            <p className="text-sm text-[#66635E] mt-0.5">
              Mekanik deklanşör sesini dinleyin ve perdenin açık kalma süresini doğru tahmin edin.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
            <Award className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-stone-800">
              Skor: {totalCorrect} / {SOUND_MATCH_ITEMS.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto bg-white border border-[#EBE7E0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#F0ECE6] pb-3">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Ses Testi {currentIndex + 1} / {SOUND_MATCH_ITEMS.length}
          </span>
          <span className="text-xs text-rose-600 font-semibold">{currentItem.situation}</span>
        </div>

        {/* Ses Çalma Butonu */}
        <div className="flex flex-col items-center justify-center py-6 space-y-3 bg-[#FAF8F5] rounded-2xl border border-[#EBE7E0]">
          <button
            onClick={handlePlaySound}
            disabled={isPlaying}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
              isPlaying
                ? 'bg-rose-500 text-white scale-105 animate-pulse'
                : 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-500/20'
            }`}
          >
            {isPlaying ? <Volume2 className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          <span className="text-xs font-bold text-stone-700">
            {isPlaying ? 'Deklanşör çalışıyor...' : 'Sesi Dinlemek İçin Dokunun'}
          </span>
          <span className="text-[11px] text-stone-500 font-mono">
            {currentItem.shutterSpeed >= 1
              ? `${currentItem.shutterSpeed} saniyelik çift vuruş aralığı`
              : 'Milisaniyelik mekanik perde sesi'}
          </span>
        </div>

        {/* Seçenekler */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
            Duyduğunuz enstantane hızı hangisi?
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {currentItem.options.map((opt) => {
              const isSelected = userResult?.selected === opt;
              const isCorrect = opt === currentItem.correctOption;

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
                  onClick={() => handleSelectOption(opt)}
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

        {/* Sonuç & Açıklama */}
        {userResult && (
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
              userResult.isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <strong className="block font-bold">
              {userResult.isCorrect ? '✅ Doğru Tespit!' : '❌ Tekrar Dinleyin:'}
            </strong>
            <p>{currentItem.explanation}</p>
          </div>
        )}

        {/* Sonraki Soru */}
        {userResult && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            >
              Sonraki Ses Testi →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
