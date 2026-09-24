import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award } from 'lucide-react';
import { CLOZE_ITEMS, type ClozeItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG } from '../../../components/ui';

interface ClozeActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const ClozeActivity: React.FC<ClozeActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [blank1, setBlank1] = useState<string>('');
  const [blank2, setBlank2] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const item: ClozeItem = CLOZE_ITEMS[currentIndex];

  const isCorrect =
    blank1.trim().toLowerCase() === item.blankAnswer.toLowerCase() &&
    (!item.secondBlankAnswer || blank2.trim().toLowerCase() === item.secondBlankAnswer.toLowerCase());

  const handleCheck = () => {
    if (!blank1) return;
    setSubmitted(true);
    if (isCorrect) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(15);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setBlank1('');
    setBlank2('');
    setSubmitted(false);
    setCurrentIndex((prev) => (prev + 1) % CLOZE_ITEMS.length);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-[20px] border border-[#EBE7E0]">
        <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block">
          Kavram & Cümle Tamamlama
        </span>
        <h3 className="text-lg font-bold text-[#1F1E1B]">Boşluk Doldurma (Cloze Test)</h3>
        <p className="text-sm text-[#66635E] mt-0.5">
          Pozlama kuralları ve kilit kavram cümlelerindeki eksik yerleri doğru terimlerle tamamlayın.
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-white border border-[#EBE7E0] rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs text-[#8A8680]">
          <span className="">ETKİNLİK {currentIndex + 1} / {CLOZE_ITEMS.length}</span>
          <span className="font-bold text-[#1F1E1B]">{item.title}</span>
        </div>

        {/* Cloze Metni */}
        <div className="p-5 rounded-[20px] bg-[#FAF8F5] border border-[#EBE7E0] text-sm sm:text-base leading-relaxed text-[#1F1E1B]">
          {item.textBefore}{' '}
          <select
            value={blank1}
            disabled={submitted}
            onChange={(e) => setBlank1(e.target.value)}
            className="inline-block px-3 py-1 font-bold rounded-lg border border-stone-300 bg-white text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          >
            <option value="">(Seçiniz...)</option>
            {item.options.slice(0, 3).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>{' '}
          {item.textBetween}{' '}
          {item.secondBlankAnswer && (
            <select
              value={blank2}
              disabled={submitted}
              onChange={(e) => setBlank2(e.target.value)}
              className="inline-block px-3 py-1 font-bold rounded-lg border border-stone-300 bg-white text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            >
              <option value="">(Seçiniz...)</option>
              {item.options.slice(3).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
          {item.textAfter}
        </div>

        {/* Kontrol Butonu */}
        {!submitted ? (
          <button
            onClick={handleCheck}
            disabled={!blank1 || (Boolean(item.secondBlankAnswer) && !blank2)}
            className="w-full py-3 rounded-[16px] font-bold text-xs bg-[var(--accent)] hover:bg-[var(--accent)] text-white transition-all disabled:opacity-50"
          >
            Cevabı Kontrol Et
          </button>
        ) : (
          <div className="space-y-4">
            <div
              className="p-4 rounded-[16px] border text-xs leading-relaxed"
              style={{
                background: isCorrect ? CORRECT.bg : WRONG.bg,
                borderColor: isCorrect ? CORRECT.border : WRONG.border,
                color: isCorrect ? CORRECT.fg : WRONG.fg
              }}
            >
              <strong className="block font-bold">
                {isCorrect ? '✅ Harika Doldurdunuz!' : '💡 Doğru Çözüm:'}
              </strong>
              <p>{item.explanation}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-[16px] font-bold text-xs bg-stone-900 hover:bg-black text-white transition-colors"
            >
              Sonraki Boşluk Doldurma →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
