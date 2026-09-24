import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Home, Heart, Star, SkipForward, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { MODULE_REGISTRY, getModule } from '../modules/registry';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { addStars } from '../lib/rewards';

const MAX_QUESTIONS = 10;
const MAX_LIVES = 3;
const QUESTION_SECONDS = 20;
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
  selectedIndex: number | null;
  isCorrect: boolean;
}

interface MockExamProps {
  onExit: () => void;
}

const RING_R = 27;
const RING_C = 2 * Math.PI * RING_R;

const TimerRing: React.FC<{ secondsLeft: number }> = ({ secondsLeft }) => (
  <div className="relative w-16 h-16 shrink-0">
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r={RING_R} fill="none" stroke="#2E3D5F" strokeWidth="6" />
      <circle
        cx="32"
        cy="32"
        r={RING_R}
        fill="none"
        stroke="#FCD34D"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={RING_C}
        strokeDashoffset={RING_C * (1 - secondsLeft / QUESTION_SECONDS)}
        transform="rotate(-90 32 32)"
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center font-extrabold text-lg">{secondsLeft}</span>
  </div>
);

export const MockExam: React.FC<MockExamProps> = ({ onExit }) => {
  const [questions, setQuestions] = useState<PreparedQuestion[]>(() =>
    prepareQuestions(pickBalancedQuestions(EXAM_POOL))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [fiftyUsed, setFiftyUsed] = useState(false);
  const [hiddenIndexes, setHiddenIndexes] = useState<number[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);

  const current = questions[currentIndex];
  const outOfLives = lives <= 0;
  const isFinished = (questions.length > 0 && currentIndex >= questions.length) || outOfLives;
  const correctCount = useMemo(() => answers.filter((a) => a.isCorrect).length, [answers]);

  const handleSelect = (optionIndex: number | null) => {
    if (selectedIndex !== null || !current) return;
    setSelectedIndex(optionIndex);
    const isCorrect = optionIndex !== null && optionIndex === current.shuffledCorrectIndex;
    setAnswers((prev) => [...prev, { question: current, selectedIndex: optionIndex, isCorrect }]);
    if (isCorrect) {
      setScore((s) => s + 10);
      addStars(10);
    } else {
      setLives((l) => Math.max(0, l - 1));
    }
  };

  // Soru başına 20 sn geri sayım; süre biterse otomatik yanlış sayılır.
  useEffect(() => {
    if (isFinished || !current || selectedIndex !== null) return;
    if (secondsLeft <= 0) {
      handleSelect(null);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, currentIndex, isFinished, selectedIndex]);

  // Bitince son puanı localStorage'a kaydet.
  useEffect(() => {
    if (!isFinished) return;
    const total = answers.length;
    if (total === 0) return;
    setStorageItem<LastScore>(SCORE_KEY, {
      correct: correctCount,
      total,
      percentage: Math.round((correctCount / total) * 100),
      completedAt: new Date().toISOString()
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  const handleNext = () => {
    setSelectedIndex(null);
    setHiddenIndexes([]);
    setSecondsLeft(QUESTION_SECONDS);
    setCurrentIndex((i) => i + 1);
  };

  const handleSkip = () => {
    if (selectedIndex !== null) {
      handleNext();
      return;
    }
    setHiddenIndexes([]);
    setSecondsLeft(QUESTION_SECONDS);
    setCurrentIndex((i) => i + 1);
  };

  const handleFifty = () => {
    if (fiftyUsed || selectedIndex !== null || !current) return;
    const wrongIndexes = shuffle(
      current.shuffledOptions.map((_, i) => i).filter((i) => i !== current.shuffledCorrectIndex)
    ).slice(0, 2);
    setHiddenIndexes(wrongIndexes);
    setFiftyUsed(true);
  };

  const handleRestart = () => {
    setQuestions(prepareQuestions(pickBalancedQuestions(EXAM_POOL)));
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswers([]);
    setLives(MAX_LIVES);
    setScore(0);
    setFiftyUsed(false);
    setHiddenIndexes([]);
    setSecondsLeft(QUESTION_SECONDS);
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1F2A44', color: '#FFFFFF' }}>
        <div className="max-w-sm text-center py-16 space-y-4 px-6">
          <p className="text-sm" style={{ color: '#C7D0E4' }}>
            Henüz sınav havuzunda soru yok. Önce bir öğrenme alanını tamamlayın.
          </p>
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs"
            style={{ background: '#2E3D5F' }}
          >
            <ArrowLeft className="w-4 h-4" /> Alanlara Dön
          </button>
        </div>
      </div>
    );
  }

  const activeModule = current ? getModule(current.moduleId) : undefined;
  const accentColor = activeModule?.meta.accent?.color ?? '#FCD34D';

  return (
    <div className="min-h-screen" style={{ background: '#1F2A44', color: '#FFFFFF' }}>
      <div className="max-w-[480px] mx-auto">
        <nav className="h-16 px-4 flex items-center justify-between gap-2">
          <button
            type="button"
            id="mock-exam-back"
            onClick={onExit}
            aria-label="Geri"
            className="w-11 h-11 rounded-[14px] flex items-center justify-center active:scale-95 transition-transform"
            style={{ background: '#2E3D5F' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3.5">
            <div className="flex gap-[3px]" aria-label={`${lives} can`}>
              {[0, 1, 2].map((i) => (
                <Heart
                  key={i}
                  className="w-5 h-5"
                  fill={i < lives ? '#FB7185' : '#4A5A7D'}
                  stroke="none"
                />
              ))}
            </div>
            <div className="flex items-center gap-[5px] font-extrabold text-base">
              <Star className="w-[18px] h-[18px]" fill="#FCD34D" stroke="none" />
              <span>{score}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onExit}
            aria-label="Ana sayfa"
            className="w-11 h-11 rounded-[14px] flex items-center justify-center active:scale-95 transition-transform"
            style={{ background: '#2E3D5F' }}
          >
            <Home className="w-5 h-5" />
          </button>
        </nav>

        {!isFinished && current && (
          <>
            <div className="px-5 pt-3 flex items-center justify-between">
              <div
                className="h-9 pl-2.5 pr-3.5 rounded-full flex items-center gap-2 font-bold text-sm"
                style={{ background: '#2E3D5F' }}
              >
                <span
                  className="w-5 h-5 rounded flex items-center justify-center font-japanese text-xs font-black shrink-0"
                  style={{ color: accentColor }}
                >
                  {activeModule?.meta.icon ? (
                    <activeModule.meta.icon className="w-4 h-4" />
                  ) : (
                    activeModule?.meta.glyph ?? '•'
                  )}
                </span>
                <span>{current.moduleTitle}</span>
              </div>
              <span className="font-bold text-sm" style={{ color: '#C7D0E4' }}>
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            <div className="px-5 pt-5 flex items-center gap-4">
              <TimerRing secondsLeft={secondsLeft} />
              <h1 className="font-display font-extrabold text-[21px] leading-snug">{current.question}</h1>
            </div>

            <div className="px-5 pt-6 flex flex-col gap-3">
              {current.shuffledOptions.map((opt, idx) => {
                const isCorrectOption = idx === current.shuffledCorrectIndex;
                const isSelected = selectedIndex === idx;
                const isHidden = hiddenIndexes.includes(idx);
                let bg = '#FFFFFF';
                let fg = '#1C1B19';
                let border = 'none';
                let badgeBg = '#EEF1F7';
                let badgeFg = '#1F2A44';
                if (selectedIndex !== null && isCorrectOption) {
                  bg = '#DBEAFE';
                  fg = '#1E3A8A';
                  border = '3px solid #1D4ED8';
                  badgeBg = '#1D4ED8';
                  badgeFg = '#FFFFFF';
                } else if (isSelected) {
                  bg = '#FFEDD5';
                  fg = '#7C2D12';
                  border = '3px solid #C2410C';
                  badgeBg = '#C2410C';
                  badgeFg = '#FFFFFF';
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={selectedIndex !== null || isHidden}
                    onClick={() => handleSelect(idx)}
                    style={{ background: bg, color: fg, border, opacity: isHidden ? 0.25 : 1 }}
                    className="h-16 rounded-[20px] pl-2.5 pr-4 flex items-center gap-3.5 text-left font-bold text-[17px] transition-all active:scale-[0.99] disabled:active:scale-100"
                  >
                    <span
                      className="w-10 h-10 rounded-[13px] flex items-center justify-center font-extrabold text-base shrink-0"
                      style={{ background: badgeBg, color: badgeFg }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-grow">{opt}</span>
                  </button>
                );
              })}
            </div>

            <footer className="px-5 pt-5 pb-8 flex items-center gap-3">
              <button
                type="button"
                onClick={handleFifty}
                disabled={fiftyUsed || selectedIndex !== null}
                aria-label="Yarı yarıya joker"
                style={{ background: '#2E3D5F', opacity: fiftyUsed ? 0.4 : 1 }}
                className="w-16 h-14 rounded-[18px] font-extrabold text-sm"
              >
                50:50
              </button>
              <button
                type="button"
                onClick={handleSkip}
                disabled={selectedIndex !== null}
                aria-label="Pas geç"
                style={{ background: '#2E3D5F', opacity: selectedIndex !== null ? 0.4 : 1 }}
                className="w-16 h-14 rounded-[18px] flex items-center justify-center"
              >
                <SkipForward className="w-[22px] h-[22px]" />
              </button>
              {selectedIndex !== null && (
                <button
                  type="button"
                  id="mock-exam-next"
                  onClick={handleNext}
                  aria-label="Sonraki soru"
                  className="flex-grow h-14 rounded-[18px] flex items-center justify-center"
                  style={{ background: '#FCD34D' }}
                >
                  <ArrowRight className="w-6 h-6" style={{ color: '#1F2A44' }} />
                </button>
              )}
            </footer>
          </>
        )}

        {isFinished && (
          <div className="px-5 pt-6 pb-12 space-y-4">
            <div
              className="rounded-[28px] p-7 text-center space-y-3"
              style={{ background: '#2E3D5F' }}
            >
              <div
                className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
                style={{ background: '#1F2A44' }}
              >
                <Trophy className="w-7 h-7" style={{ color: '#FCD34D' }} />
              </div>
              <h2 className="font-display font-extrabold text-2xl">
                {correctCount} / {answers.length} Doğru
              </h2>
              <p className="text-sm font-bold" style={{ color: '#FCD34D' }}>
                {answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0}% · {score} puan
              </p>
              {outOfLives && (
                <p className="text-xs" style={{ color: '#C7D0E4' }}>
                  Canlar bitti, sınav burada sona erdi.
                </p>
              )}
            </div>

            {moduleBreakdown.length > 0 && (
              <div className="rounded-2xl p-4 space-y-2.5" style={{ background: '#2E3D5F' }}>
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#C7D0E4' }}>
                  Konu Bazında Sonuç
                </h3>
                {moduleBreakdown.map((m) => (
                  <div key={m.title} className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{m.title}</span>
                    <span className="font-bold" style={{ color: '#C7D0E4' }}>
                      {m.correct} / {m.total}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                id="mock-exam-restart"
                onClick={handleRestart}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm active:scale-98"
                style={{ background: '#FCD34D', color: '#1F2A44' }}
              >
                <RotateCcw className="w-4 h-4" /> Tekrar Dene
              </button>
              <button
                type="button"
                onClick={onExit}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm active:scale-98"
                style={{ background: '#2E3D5F' }}
              >
                <ArrowLeft className="w-4 h-4" /> Alanlara Dön
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
