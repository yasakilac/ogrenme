import React, { useState } from 'react';
import { PenTool, CheckCircle, HelpCircle, Sparkles, Send } from 'lucide-react';
import { WRITTEN_PROMPTS, type WrittenPromptItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';

interface WrittenResponseActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const WrittenResponseActivity: React.FC<WrittenResponseActivityProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userText, setUserText] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    evaluated: boolean;
    score: number; // 0 - 100
    matchedKeywords: string[];
    missingKeywords: string[];
  } | null>(null);

  const item: WrittenPromptItem = WRITTEN_PROMPTS[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userText.trim()) return;

    const lower = userText.toLowerCase();
    const matched = item.requiredKeywords.filter((kw) => lower.includes(kw.toLowerCase()));
    const missing = item.requiredKeywords.filter((kw) => !lower.includes(kw.toLowerCase()));

    const calculatedScore = Math.round((matched.length / item.requiredKeywords.length) * 100);

    setFeedback({
      evaluated: true,
      score: calculatedScore,
      matchedKeywords: matched,
      missingKeywords: missing,
    });

    if (calculatedScore >= 60) {
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(20);
    } else {
      cameraAudio.playErrorSound();
    }
  };

  const handleNext = () => {
    setUserText('');
    setFeedback(null);
    setCurrentIndex((prev) => (prev + 1) % WRITTEN_PROMPTS.length);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#EBE7E0]">
        <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
          Açık Uçlu Akıl Yürütme Pratiği
        </span>
        <h3 className="text-lg font-bold text-[#1F1E1B]">Yazılı Açık Uçlu Kavram Açıklaması</h3>
        <p className="text-sm text-[#66635E] mt-0.5">
          Kendi cümlelerinizle fotoğrafçılık prensiplerini açıklayın; sistem anahtar optik kavramları analiz etsin.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white border border-[#EBE7E0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs text-[#8A8680]">
          <span className="font-mono">SORU {currentIndex + 1} / {WRITTEN_PROMPTS.length}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold">
            Serbest Yazı
          </span>
        </div>

        {/* Soru Metni */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-[#1F1E1B] leading-snug">{item.question}</h2>
          <p className="text-xs text-[#66635E] italic bg-[#FAF8F5] p-3 rounded-xl border border-[#EBE7E0]">
            İpucu Bağlamı: {item.context}
          </p>
        </div>

        {/* Yazı Alanı */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1F1E1B] block">Cevabınızı Buraya Yazın:</label>
            <textarea
              rows={4}
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              disabled={feedback?.evaluated}
              placeholder="Örn: f/1.8 daha geniştir, daha fazla ışık alarak arka planı bulanıklaştırır..."
              className="w-full p-4 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-[#FAF8F5]"
            />
          </div>

          {!feedback?.evaluated ? (
            <button
              type="submit"
              disabled={!userText.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              Cevabı Değerlendir
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-stone-900 hover:bg-black text-white transition-colors"
            >
              Sonraki Soruya Geç →
            </button>
          )}
        </form>

        {/* Değerlendirme & Geri Bildirim */}
        {feedback && (
          <div className="space-y-4 pt-4 border-t border-[#F0ECE6]">
            <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span className="text-xs font-bold text-[#1F1E1B]">Kavramsal Başarı Puanı:</span>
              <span
                className={`text-sm font-extrabold ${
                  feedback.score >= 60 ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                %{feedback.score}
              </span>
            </div>

            {/* Yakalanan Anahtar Terimler */}
            <div className="text-xs space-y-1">
              <span className="font-bold text-[#1F1E1B] block">Bahsedilen Temel Terimler:</span>
              <div className="flex flex-wrap gap-1.5">
                {feedback.matchedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-[11px]"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> {kw}
                  </span>
                ))}
                {feedback.missingKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-500 border border-stone-200 text-[11px]"
                  >
                    (Eksik: {kw})
                  </span>
                ))}
              </div>
            </div>

            {/* Model Cevap */}
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs space-y-1">
              <span className="font-bold text-rose-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                Örnek Model Cevap:
              </span>
              <p className="text-rose-950 leading-relaxed">{item.sampleModelAnswer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
