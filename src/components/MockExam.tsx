import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { MODULE_REGISTRY } from '../modules/registry';
import { getStorageItem, setStorageItem } from '../utils/storage';

const MAX_QUESTIONS = 20;
const SCORE_KEY = 'ogrenme_mock_exam_last_score';

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  moduleId: string;
  moduleTitle: string;
}

interface LastScore {
  correct: number;
  total: number;
  percentage: number;
  completedAt: string;
}

/** Tüm modüllerin finalTest havuzunu birleştirir — yeni modül finalTest eklediğinde başka hiçbir yere
 * dokunmadan otomatik büyür (bkz. src/modules/registry.ts). */
export const EXAM_POOL: ExamQuestion[] = MODULE_REGISTRY.flatMap((m) =>
  (m.finalTest ?? []).map((q) => ({
    ...q,
    moduleId: m.meta.id,
    moduleTitle: m.meta.shortTitle ?? m.meta.title
  }))
);

export const EXAM_SOURCE_MODULE_COUNT = new Set(EXAM_POOL.map((q) => q.moduleId)).size;

export const getLastMockExamScore = (): LastScore | null => getStorageItem<LastScore | null>(SCORE_KEY, null);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Havuzdan modül bazında dengeli, en fazla MAX_QUESTIONS soru seçer (round-robin). */
function pickBalancedQuestions(pool: ExamQuestion[]): ExamQuestion[] {
  const byModule = new Map<string, ExamQuestion[]>();
  pool.forEach((q) => {
    const list = byModule.get(q.moduleId) ?? [];
    list.push(q);
    byModule.set(q.moduleId, list);
  });
  const buckets = Array.from(byModule.values()).map(shuffle);
  const picked: ExamQuestion[] = [];
  let round = 0;
  while (picked.length < MAX_QUESTIONS && buckets.some((b) => round < b.length)) {
    for (const bucket of buckets) {
      if (picked.length >= MAX_QUESTIONS) break;
      if (round < bucket.length) picked.push(bucket[round]);
    }
    round++;
  }
  return shuffle(picked);
}

interface PreparedQuestion extends ExamQuestion {
  shuffledOptions: string[];
  shuffledCorrectIndex: number;
}

function prepareQuestions(questions: ExamQuestion[]): PreparedQuestion[] {
  return questions.map((q) => {
    const order = shuffle(q.options.map((_, i) => i));
    return {
      ...q,
      shuffledOptions: order.map((i) => q.options[i]),
      shuffledCorrectIndex: order.indexOf(q.correctIndex)
    };
  });
}

interface AnswerRecord {
  question: PreparedQuestion;
  selectedIndex: number;
  isCorrect: boolean;
}

interface MockExamProps {
  onExit: () => void;
}

export const MockExam: React.FC<MockExamProps> = ({ onExit }) => {
  const [questions, setQuestions] = useState<PreparedQuestion[]>(() =>
    prepareQuestions(pickBalancedQuestions(EXAM_POOL))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const current = questions[currentIndex];
  const isFinished = questions.length > 0 && currentIndex >= questions.length;
  const correctCount = useMemo(() => answers.filter((a) => a.isCorrect).length, [answers]);

  // Bitince son puanı localStorage'a kaydet (helper zaten try/catch içeriyor).
  useEffect(() => {
    if (!isFinished) return;
    setStorageItem<LastScore>(SCORE_KEY, {
      correct: correctCount,
      total: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100),
      completedAt: new Date().toISOString()
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  const handleSelect = (optionIndex: number) => {
    if (selectedIndex !== null || !current) return;
    setSelectedIndex(optionIndex);
    setAnswers((prev) => [
      ...prev,
      { question: current, selectedIndex: optionIndex, isCorrect: optionIndex === current.shuffledCorrectIndex }
    ]);
  };

  const handleNext = () => {
    setSelectedIndex(null);
    setCurrentIndex((i) => i + 1);
  };

  const handleRestart = () => {
    setQuestions(prepareQuestions(pickBalancedQuestions(EXAM_POOL)));
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswers([]);
  };

  const moduleBreakdown = useMemo(() => {
    const byModule = new Map<string, { title: string; correct: number; total: number }>();
    answers.forEach((a) => {
      const entry = byModule.get(a.question.moduleId) ?? {
        title: a.question.moduleTitle,
        correct: 0,
        total: 0
      };
      entry.total += 1;
      if (a.isCorrect) entry.correct += 1;
      byModule.set(a.question.moduleId, entry);
    });
    return Array.from(byModule.values());
  }, [answers]);

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-4">
        <p className="text-sm text-[#5C574F]">Henüz sınav havuzunda soru yok. Önce bir öğrenme alanını tamamlayın.</p>
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Alanlara Dön
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-24 sm:pb-12">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          id="mock-exam-back"
          onClick={onExit}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E8E4DC] text-xs font-bold text-[#5C574F] hover:text-[#1F1E1B] hover:border-stone-400 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Alanlara Dön
        </button>
        {!isFinished && (
          <span className="text-xs font-bold text-[#7A756D]">
            Soru {currentIndex + 1} / {questions.length}
          </span>
        )}
      </div>

      {!isFinished && current && (
        <div className="bg-white border border-[#E8E4DC] rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-[11px] font-bold text-violet-700 bg-violet-50 border border-violet-200 w-fit px-2.5 py-1 rounded-full">
            {current.moduleTitle}
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#1F1E1B] leading-relaxed">
            {current.question}
          </h2>

          <div className="space-y-2.5">
            {current.shuffledOptions.map((opt, idx) => {
              const isCorrectOption = idx === current.shuffledCorrectIndex;
              const isSelected = selectedIndex === idx;
              let style = 'bg-[#FAF8F5] border-[#E0DCD6] text-[#1F1E1B] hover:bg-stone-100';
              if (selectedIndex !== null) {
                if (isCorrectOption) {
                  style = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                } else if (isSelected) {
                  style = 'bg-rose-50 border-rose-400 text-rose-950';
                } else {
                  style = 'opacity-50 bg-stone-50 border-stone-200';
                }
              }
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedIndex !== null}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-2.5 ${style}`}
                >
                  <span className="font-mono text-xs opacity-60 mt-0.5">{String.fromCharCode(65 + idx)})</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {selectedIndex !== null && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm ${
                selectedIndex === current.shuffledCorrectIndex
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {selectedIndex === current.shuffledCorrectIndex ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold">
                  {selectedIndex === current.shuffledCorrectIndex ? 'Doğru!' : 'Yanlış cevap.'}
                </p>
                {current.explanation && <p className="opacity-90">{current.explanation}</p>}
              </div>
            </div>
          )}

          {selectedIndex !== null && (
            <button
              type="button"
              id="mock-exam-next"
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-violet-700 hover:bg-violet-800 text-white font-bold text-xs sm:text-sm transition-all active:scale-98"
            >
              {currentIndex + 1 === questions.length ? 'Sonucu Gör' : 'Sonraki Soru'}
            </button>
          )}
        </div>
      )}

      {isFinished && (
        <div className="space-y-4">
          <div className="bg-white border-2 border-violet-200 rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-100 border border-violet-200 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-violet-700" />
            </div>
            <h2 className="text-2xl font-black text-[#1F1E1B]">
              {correctCount} / {questions.length} Doğru
            </h2>
            <p className="text-sm font-bold text-violet-700">%{Math.round((correctCount / questions.length) * 100)}</p>
          </div>

          <div className="bg-white border border-[#E8E4DC] rounded-2xl p-4 sm:p-5 space-y-2.5">
            <h3 className="text-xs font-bold text-[#5C574F] uppercase tracking-wider">Konu Bazında Sonuç</h3>
            {moduleBreakdown.map((m) => (
              <div key={m.title} className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#1F1E1B] font-semibold">{m.title}</span>
                <span className="text-[#7A756D] font-bold">
                  {m.correct} / {m.total}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              id="mock-exam-restart"
              onClick={handleRestart}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-700 hover:bg-violet-800 text-white font-bold text-xs sm:text-sm transition-all active:scale-98"
            >
              <RotateCcw className="w-4 h-4" /> Tekrar Dene
            </button>
            <button
              type="button"
              onClick={onExit}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-[#E8E4DC] text-[#5C574F] font-bold text-xs sm:text-sm hover:border-stone-400 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Alanlara Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
