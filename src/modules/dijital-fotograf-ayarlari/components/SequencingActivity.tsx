import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import { SEQUENCE_ITEMS, type SequenceItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';

interface SequencingActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const SequencingActivity: React.FC<SequencingActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const item: SequenceItem = SEQUENCE_ITEMS[currentIndex];

  // Karışık başlangıç sırası
  const [currentOrder, setCurrentOrder] = useState<SequenceItem['items']>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  useEffect(() => {
    // Rastgele karıştır
    const shuffled = [...item.items].sort(() => Math.random() - 0.5);
    setCurrentOrder(shuffled);
    setIsSubmitted(false);
    setIsCorrect(false);
  }, [currentIndex, item]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (isSubmitted) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const copy = [...currentOrder];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setCurrentOrder(copy);
    cameraAudio.playDialTick();
  };

  const handleCheckOrder = () => {
    const correct = currentOrder.every((elem, idx) => elem.correctOrder === idx + 1);
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(20);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SEQUENCE_ITEMS.length);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#EBE7E0]">
        <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
          Optik Değerler & Basamak Düzeni
        </span>
        <h3 className="text-lg font-bold text-[#1F1E1B]">Basamak & Değer Sıralama Etkinliği</h3>
        <p className="text-sm text-[#66635E] mt-0.5">
          Diyafram veya enstantane basamaklarını mantıksal ışık ve süre sırasına göre doğru dizin.
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-white border border-[#EBE7E0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-[#F0ECE6] pb-3">
          <span className="text-xs font-mono text-[#8A8680] block mb-1">
            SIRALAMA TESTİ {currentIndex + 1} / {SEQUENCE_ITEMS.length}
          </span>
          <h2 className="text-base font-bold text-[#1F1E1B]">{item.title}</h2>
          <p className="text-xs text-[#66635E] mt-1">{item.instruction}</p>
        </div>

        {/* Sıralama Listesi */}
        <div className="space-y-2">
          {currentOrder.map((it, idx) => {
            let itemBorder = 'border-stone-200 bg-[#FAF8F5]';
            if (isSubmitted) {
              itemBorder =
                it.correctOrder === idx + 1
                  ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950'
                  : 'border-rose-300 bg-rose-50/70 text-rose-950';
            }

            return (
              <div
                key={it.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${itemBorder}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-sm block">{it.label}</span>
                    <span className="text-[11px] text-[#7A7670]">{it.hint}</span>
                  </div>
                </div>

                {!isSubmitted && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveItem(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-30"
                      title="Yukarı Taşı"
                    >
                      <ArrowUp className="w-4 h-4 text-stone-700" />
                    </button>
                    <button
                      onClick={() => moveItem(idx, 'down')}
                      disabled={idx === currentOrder.length - 1}
                      className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-30"
                      title="Aşağı Taşı"
                    >
                      <ArrowDown className="w-4 h-4 text-stone-700" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Butonlar */}
        {!isSubmitted ? (
          <button
            onClick={handleCheckOrder}
            className="w-full py-3 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-sm"
          >
            Sıralamayı Doğrula
          </button>
        ) : (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <strong className="block font-bold">
                {isCorrect ? '🎉 Kusursuz Sıralama!' : '📌 Sıralama Kuralı:'}
              </strong>
              <p>{item.explanation}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl font-bold text-xs bg-stone-900 hover:bg-black text-white transition-colors"
            >
              Sonraki Sıralama Görevi →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
