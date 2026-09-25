import React, { useState } from 'react';
import { HelpCircle, Check, Sparkles, Send } from 'lucide-react';
import { WRITTEN_PROMPTS, type WrittenPromptItem } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG } from '../../../components/ui';

interface WrittenResponseActivityProps {
  onScoreUpdate?: (points: number) => void;
}

const DARK = '#1F2A44';

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
  const lowerText = userText.toLowerCase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userText.trim()) return;

    const matched = item.requiredKeywords.filter((kw) => lowerText.includes(kw.toLowerCase()));
    const missing = item.requiredKeywords.filter((kw) => !lowerText.includes(kw.toLowerCase()));
    const calculatedScore = Math.round((matched.length / item.requiredKeywords.length) * 100);

    setFeedback({ evaluated: true, score: calculatedScore, matchedKeywords: matched, missingKeywords: missing });

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
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-bold" style={{ color: '#6B665E' }}>
        <span>Soru {currentIndex + 1} / {WRITTEN_PROMPTS.length}</span>
        <span className="px-2.5 py-0.5 rounded-full font-bold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          Serbest Yazı
        </span>
      </div>

      <div className="rounded-[24px] bg-white p-4.5 flex items-center gap-3.5" style={{ border: '1px solid #E6E0D6' }}>
        <div className="w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0" style={{ background: DARK }}>
          <HelpCircle className="w-[30px] h-[30px]" style={{ color: '#FCD34D' }} />
        </div>
        <div>
          <p className="font-display font-extrabold text-lg leading-snug">{item.question}</p>
          <p className="text-xs mt-1" style={{ color: '#6B665E' }}>İpucu: {item.context}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="cevap" className="sr-only">Cevabın</label>
        <textarea
          id="cevap"
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          disabled={Boolean(feedback?.evaluated)}
          rows={6}
          placeholder="Örn: f/1.8 daha geniştir, daha fazla ışık alarak arka planı bulanıklaştırır..."
          className="w-full box-border rounded-[24px] p-4.5 text-base leading-relaxed"
          style={{ border: '2px solid #E6E0D6', color: '#1C1B19', resize: 'none' }}
        />

        <div className="flex flex-wrap gap-2">
          {item.requiredKeywords.map((kw) => {
            const on = feedback ? feedback.matchedKeywords.includes(kw) : lowerText.includes(kw.toLowerCase());
            return (
              <span
                key={kw}
                className="h-11 px-3.5 rounded-2xl flex items-center gap-1.5 font-extrabold text-sm"
                style={{
                  background: on ? CORRECT.bg : '#FFFFFF',
                  color: on ? CORRECT.fg : '#6B665E',
                  border: on ? `2px solid ${CORRECT.border}` : '1px solid #E6E0D6',
                }}
              >
                {on && <Check className="w-4 h-4" strokeWidth={3} style={{ color: CORRECT.border }} />}
                {kw}
              </span>
            );
          })}
        </div>

        {!feedback?.evaluated ? (
          <button
            type="submit"
            disabled={!userText.trim()}
            aria-label="Cevabı değerlendir"
            className="w-full h-14 rounded-[18px] border-none flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-40 transition-all"
            style={{ background: '#1C1B19', color: '#FFFFFF' }}
          >
            <Send className="w-4 h-4" />
            Cevabı Değerlendir
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="w-full h-14 rounded-[18px] border-none font-bold text-sm"
            style={{ background: '#1C1B19', color: '#FFFFFF' }}
          >
            Sonraki Soruya Geç →
          </button>
        )}
      </form>

      {feedback && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between rounded-[16px] p-3" style={{ background: '#FAF8F5', border: '1px solid #E6E0D6' }}>
            <span className="text-xs font-bold">Kavramsal Başarı Puanı</span>
            <span className="text-sm font-extrabold" style={{ color: feedback.score >= 60 ? CORRECT.border : WRONG.border }}>
              %{feedback.score}
            </span>
          </div>

          <div className="rounded-[16px] p-4 flex items-start gap-2 text-xs leading-relaxed" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">Örnek Model Cevap:</strong>
              <p>{item.sampleModelAnswer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
