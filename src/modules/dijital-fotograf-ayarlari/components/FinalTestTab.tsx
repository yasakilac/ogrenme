import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
import type { FinalTestQuestion } from '../../types';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG } from '../../../components/ui';

interface FinalTestTabProps {
  questions?: FinalTestQuestion[];
  onFinish?: (score: number) => void;
}

export const FinalTestTab: React.FC<FinalTestTabProps> = ({ questions = [], onFinish }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showExplanations, setShowExplanations] = useState<boolean>(false);

  const safeQuestions = Array.isArray(questions) ? questions : [];

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    cameraAudio.playDialTick();
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = safeQuestions.length > 0 && answeredCount === safeQuestions.length;

  const calculateScore = () => {
    let correct = 0;
    safeQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: safeQuestions.length,
      percentage: safeQuestions.length > 0 ? Math.round((correct / safeQuestions.length) * 100) : 0,
    };
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowExplanations(true);
    const result = calculateScore();
    if (result.percentage >= 70) {
      cameraAudio.playSuccessSound();
    } else {
      cameraAudio.playErrorSound();
    }
    if (onFinish) onFinish(result.percentage);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setShowExplanations(false);
    cameraAudio.playDialTick();
  };

  const result = calculateScore();

  return (
    <div className="space-y-6">
      {/* Üst Kart */}
      <div className="bg-white p-5 rounded-[20px] border border-[#EBE7E0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block">
              Zorunlu Bitirme Değerlendirmesi
            </span>
            <h3 className="text-lg font-bold text-[#1F1E1B]">Ders Bitirme Sınavı</h3>
            <p className="text-sm text-[#66635E] mt-0.5">
              Diyafram, enstantane, ISO ve pozlama dengesini kapsayan {safeQuestions.length} soruluk resmi modül testi.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[#7A7670]">
              Cevaplanan: <strong className="text-stone-900">{answeredCount}</strong> / {safeQuestions.length}
            </span>
            {isSubmitted && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[16px] border border-stone-200 bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Tekrar Çöz
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sınav Sonuç Özeti (Tamamlandığında Çıkar) */}
      {isSubmitted && (
        <div
          className="p-6 sm:p-8 rounded-[24px] border-2 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm"
          style={{
            background: `${result.percentage >= 70 ? CORRECT.bg : WRONG.bg}CC`,
            borderColor: result.percentage >= 70 ? CORRECT.border : WRONG.border,
            color: result.percentage >= 70 ? CORRECT.fg : WRONG.fg
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-[20px] flex items-center justify-center text-white"
              style={{ background: result.percentage >= 70 ? CORRECT.border : WRONG.border }}
            >
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">
                {result.percentage >= 70 ? '🎉 MODÜL BAŞARIYLA TAMAMLANDI' : '📚 GELİŞTİRİLMESİ GEREKEN ALANLAR VAR'}
              </span>
              <h2 className="text-2xl font-extrabold mt-0.5">
                {result.correct} / {result.total} Doğru (%{result.percentage})
              </h2>
              <p className="text-xs mt-1 max-w-md opacity-90">
                {result.percentage >= 70
                  ? 'Tebrikler! Pozlama üçgeninin tüm parametrelerine hakimsiniz. Dijital fotoğraf makinesi ayarları modülünü başarıyla bitirdiniz.'
                  : 'Bazı kavramlarda takıldınız. Simülatörü ve kavram flashcardlarını tekrar incelemenizi öneririz.'}
              </p>
            </div>
          </div>

          {result.percentage >= 70 && (
            <button
              onClick={() => {
                cameraAudio.playDialTick();
                window.dispatchEvent(new CustomEvent('open-certificate-modal'));
              }}
              className="shrink-0 px-5 py-3 rounded-[20px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer border border-[var(--accent)] animate-pulse"
            >
              <Award className="w-4 h-4 text-stone-950" />
              <span>Ustalık Sertifikasını Görüntüle</span>
            </button>
          )}
        </div>
      )}

      {/* Soru Listesi */}
      <div className="space-y-6">
        {safeQuestions.map((q, qIndex) => {
          const userAnswer = selectedAnswers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = isAnswered && userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className="bg-white border border-[#EBE7E0] rounded-[24px] p-6 sm:p-7 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#F0ECE6] pb-3 text-xs text-[#8A8680]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900">SORU {qIndex + 1}</span>
                </div>
                {isSubmitted && (
                  <span
                    className="font-bold flex items-center gap-1"
                    style={{ color: isCorrect ? CORRECT.border : WRONG.border }}
                  >
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {isCorrect ? 'Doğru' : 'Yanlış'}
                  </span>
                )}
              </div>

              {/* Soru Metni */}
              <h4 className="font-bold text-base text-[#1F1E1B] leading-relaxed">{q.question}</h4>

              {/* Seçenekler */}
              <div className="space-y-2">
                {q.options.map((opt, optIndex) => {
                  const isThisSelected = userAnswer === optIndex;
                  const isThisTheCorrectAnswer = optIndex === q.correctIndex;

                  let style: React.CSSProperties = { background: '#FAF8F5', borderColor: '#E0DCD6', color: '#1F1E1B' };

                  if (isSubmitted) {
                    if (isThisTheCorrectAnswer) {
                      style = { background: CORRECT.bg, borderColor: CORRECT.border, color: CORRECT.fg, fontWeight: 700 };
                    } else if (isThisSelected) {
                      style = { background: WRONG.bg, borderColor: WRONG.border, color: WRONG.fg };
                    } else {
                      style = { background: '#FAFAF9', borderColor: '#E7E5E4', opacity: 0.4 };
                    }
                  } else if (isThisSelected) {
                    // Henüz gönderilmedi: doğru/yanlış değil, sadece nötr "seçili" durumu (modül aksanı).
                    style = { background: 'var(--accent-light)', borderColor: 'var(--accent)', color: 'var(--accent)', fontWeight: 700 };
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelect(q.id, optIndex)}
                      disabled={isSubmitted}
                      style={style}
                      className="w-full p-4 rounded-[16px] border text-left text-xs sm:text-sm font-medium transition-all flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-xs opacity-60 mt-0.5">
                          {String.fromCharCode(65 + optIndex)})
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Çözüm Açıklaması */}
              {showExplanations && q.explanation && (
                <div className="p-3.5 rounded-[16px] bg-stone-50 border border-stone-200 text-xs text-stone-800 space-y-1">
                  <span className="font-bold text-[var(--accent)] block">Eğitmen Açıklaması:</span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sınavı Tamamla Butonu */}
      {!isSubmitted && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={!isAllAnswered}
            className="w-full sm:w-96 py-4 rounded-[20px] font-bold text-sm bg-[var(--accent)] hover:bg-[var(--accent)] text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAllAnswered
              ? 'Sınavı Tamamla ve Sonucu Gör'
              : `Lütfen Kalan ${safeQuestions.length - answeredCount} Soruyu Yanıtlayın`}
          </button>
        </div>
      )}
    </div>
  );
};
