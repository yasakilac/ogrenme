import React, { useState, useEffect } from 'react';
import { KanaCharacter, AlphabetType, UserProgressData, PracticeWord } from '../../../types';
import { KANA_DATA } from '../data/kanaData';
import { PRACTICE_WORDS } from '../data/wordsData';
import { 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  RotateCcw, 
  Trophy, 
  ArrowRight,
  Headphones,
  FileQuestion,
  BookMarked,
  Sparkles,
  HelpCircle,
  Eye
} from 'lucide-react';
import { soundManager } from '../../../utils/sound';
import { CORRECT, WRONG } from '../../../components/ui';

type QuizMode = 'kana_to_romaji' | 'romaji_to_kana' | 'audio_quiz' | 'words';

interface Question {
  id: string;
  promptKana?: string;
  promptRomaji?: string;
  promptAudio?: string;
  targetWord?: PracticeWord;
  correctAnswer: string;
  options: string[];
  charRef?: KanaCharacter;
  explanation: string;
}

interface QuizTabProps {
  alphabet: AlphabetType;
  setAlphabet: (alp: AlphabetType) => void;
  progress: UserProgressData;
  onRecordAnswer: (alphabet: AlphabetType, kanaId: string, isCorrect: boolean) => void;
  onSessionComplete: () => void;
}

export const QuizTab: React.FC<QuizTabProps> = ({
  alphabet,
  setAlphabet,
  progress,
  onRecordAnswer,
  onSessionComplete
}) => {
  const [mode, setMode] = useState<QuizMode>('kana_to_romaji');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const unsub = soundManager.addListener((speaking) => {
      setIsPlayingAudio(speaking);
    });
    return unsub;
  }, []);

  // Generate 10 randomized quiz questions
  const generateQuestions = (selectedMode: QuizMode) => {
    setSelectedOption(null);
    setIsAnswered(false);
    setScore({ correct: 0, incorrect: 0 });
    setIsCompleted(false);
    setCurrentIndex(0);

    const generated: Question[] = [];
    const questionCount = 10;

    if (selectedMode === 'words') {
      const wordsPool = PRACTICE_WORDS.filter((w) => w.alphabet === alphabet);
      const shuffled = [...wordsPool].sort(() => Math.random() - 0.5).slice(0, questionCount);

      shuffled.forEach((word) => {
        const otherMeanings = wordsPool
          .filter((w) => w.id !== word.id)
          .map((w) => `${w.meaningTr} (${w.romaji})`);
        const distractors = otherMeanings.sort(() => Math.random() - 0.5).slice(0, 3);
        const correctOpt = `${word.meaningTr} (${word.romaji})`;
        const options = [...distractors, correctOpt].sort(() => Math.random() - 0.5);

        generated.push({
          id: word.id,
          promptKana: word.kana,
          targetWord: word,
          correctAnswer: correctOpt,
          options,
          explanation: `"${word.kana}" (${word.romaji}) = "${word.meaningTr}".`
        });
      });
    } else {
      const kanaPool = [...KANA_DATA].sort(() => Math.random() - 0.5).slice(0, questionCount);

      kanaPool.forEach((char) => {
        const currentKana = alphabet === 'hiragana' ? char.hiragana : char.katakana;

        if (selectedMode === 'kana_to_romaji') {
          const distractors = KANA_DATA
            .filter((c) => c.id !== char.id)
            .map((c) => c.romaji)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
          const options = [...distractors, char.romaji].sort(() => Math.random() - 0.5);

          generated.push({
            id: char.id,
            promptKana: currentKana,
            correctAnswer: char.romaji,
            options,
            charRef: char,
            explanation: `${currentKana} karakteri "${char.romaji}" olarak okunur. ${char.trPronunciation}`
          });
        } else if (selectedMode === 'romaji_to_kana') {
          const distractors = KANA_DATA
            .filter((c) => c.id !== char.id)
            .map((c) => (alphabet === 'hiragana' ? c.hiragana : c.katakana))
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
          const options = [...distractors, currentKana].sort(() => Math.random() - 0.5);

          generated.push({
            id: char.id,
            promptRomaji: char.romaji,
            correctAnswer: currentKana,
            options,
            charRef: char,
            explanation: `"${char.romaji}" hecesinin ${alphabet === 'hiragana' ? 'Hiragana' : 'Katakana'} karşılığı ${currentKana} karakteridir.`
          });
        } else if (selectedMode === 'audio_quiz') {
          const distractors = KANA_DATA
            .filter((c) => c.id !== char.id)
            .map((c) => (alphabet === 'hiragana' ? c.hiragana : c.katakana))
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
          const options = [...distractors, currentKana].sort(() => Math.random() - 0.5);

          generated.push({
            id: char.id,
            promptAudio: currentKana,
            correctAnswer: currentKana,
            options,
            charRef: char,
            explanation: `Duyduğun ses "${char.romaji}" (${currentKana}) karakteridir. Türkçe: ${char.trPronunciation}`
          });
        }
      });
    }

    setQuestions(generated);

    if (selectedMode === 'audio_quiz' && generated[0]?.promptAudio) {
      setTimeout(() => {
        soundManager.speak(generated[0].promptAudio!);
      }, 350);
    }
  };

  useEffect(() => {
    generateQuestions(mode);
  }, [mode, alphabet]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      soundManager.playCorrectSound();
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      soundManager.playIncorrectSound();
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    if (currentQ.charRef) {
      onRecordAnswer(alphabet, currentQ.charRef.id, isCorrect);
    }

    // Speak pronunciation after answer
    if (currentQ.promptKana) {
      soundManager.speak(currentQ.promptKana);
    } else if (currentQ.charRef) {
      const kanaToSpeak = alphabet === 'hiragana' ? currentQ.charRef.hiragana : currentQ.charRef.katakana;
      soundManager.speak(kanaToSpeak);
    }
  };

  // Direct Show Answer button for users who are stuck
  const handleRevealAnswer = () => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(currentQ.correctAnswer);
    setIsAnswered(true);
    soundManager.playFlipSound();

    if (currentQ.charRef) {
      const kanaToSpeak = alphabet === 'hiragana' ? currentQ.charRef.hiragana : currentQ.charRef.katakana;
      soundManager.speak(kanaToSpeak);
    }
  };

  const handleNext = () => {
    soundManager.playFlipSound();
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setIsAnswered(false);

      if (mode === 'audio_quiz' && questions[nextIdx]?.promptAudio) {
        setTimeout(() => {
          soundManager.speak(questions[nextIdx].promptAudio!);
        }, 250);
      }
    } else {
      setIsCompleted(true);
      onSessionComplete();
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      {/* Mode Selector Tabs */}
      <div className="p-1.5 rounded-[20px] bg-white border border-[#E8E3D8] shadow-2xs flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'kana_to_romaji' as const, label: 'Karakter ➔ Okunuş', icon: FileQuestion },
          { id: 'romaji_to_kana' as const, label: 'Okunuş ➔ Karakter', icon: FileQuestion },
          { id: 'audio_quiz' as const, label: 'Sesli Dinleme', icon: Headphones },
          { id: 'words' as const, label: 'Kelime Okuma', icon: BookMarked },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              id={`quiz-mode-${m.id}`}
              onClick={() => {
                setMode(m.id);
                soundManager.playFlipSound();
              }}
              className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-[16px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                mode === m.id
                  ? 'bg-[#1F1E1D] text-white shadow-xs'
                  : 'text-[#615C53] hover:bg-[#F5F2EC]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="truncate">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* COMPLETED RESULTS SCREEN */}
      {isCompleted ? (
        <div className="p-8 rounded-[24px] bg-white border border-[#E8E3D8] shadow-md text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-[20px] bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30 flex items-center justify-center mx-auto shadow-xs">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#1F1E1D]">Alıştırma Tamamlandı!</h3>
            <p className="text-xs text-[#7A756D] mt-1">
              Sonuçlar çalışma geçmişine kaydedildi.
            </p>
          </div>

          {/* Score Pills */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <div className="p-3 rounded-[20px] border" style={{ background: CORRECT.bg, borderColor: CORRECT.border }}>
              <span className="text-[10px] font-bold uppercase" style={{ color: CORRECT.fg }}>Doğru</span>
              <div className="text-2xl font-black" style={{ color: CORRECT.border }}>{score.correct}</div>
            </div>
            <div className="p-3 rounded-[20px] border" style={{ background: WRONG.bg, borderColor: WRONG.border }}>
              <span className="text-[10px] font-bold uppercase" style={{ color: WRONG.fg }}>Yanlış</span>
              <div className="text-2xl font-black" style={{ color: WRONG.border }}>{score.incorrect}</div>
            </div>
          </div>

          <div className="text-xs text-[#7A756D]">
            Başarı: %{Math.round((score.correct / questions.length) * 100)}
          </div>

          <div className="pt-3 border-t border-[#EAE5DA]">
            <button
              id="btn-retry-quiz"
              onClick={() => generateQuestions(mode)}
              className="w-full py-3 rounded-[16px] bg-[#1F1E1D] hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yeni Test Başlat</span>
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE QUESTION SCREEN */
        currentQ && (
          <div className="space-y-4">
            
            {/* Session Progress bar & Score */}
            <div className="flex items-center justify-between text-xs text-[#7A756D] px-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1F1E1D]">
                  Soru {currentIndex + 1} / {questions.length}
                </span>
                <span className="font-semibold" style={{ color: CORRECT.border }}>• {score.correct} Doğru</span>
                <span className="font-semibold" style={{ color: WRONG.border }}>• {score.incorrect} Yanlış</span>
              </div>

              {/* Progress bar */}
              <div className="w-24 h-1.5 bg-[#EFECE6] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--accent)] transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card Box */}
            <div className="p-6 sm:p-8 rounded-[24px] bg-white border border-[#E8E3D8] shadow-md text-center space-y-5">
              
              {/* Question Prompts depending on mode */}
              {mode === 'kana_to_romaji' && (
                <div>
                  <span className="text-[11px] font-semibold text-[#8C867B] uppercase tracking-wider block mb-2">
                    Bu karakterin okunuşu hangisidir?
                  </span>
                  <div className="text-7xl sm:text-8xl font-bold text-[#1F1E1D] font-japanese">
                    {currentQ.promptKana}
                  </div>
                  <button
                    onClick={() => soundManager.speak(currentQ.promptKana!)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] text-xs text-[var(--accent)] font-semibold border border-[#E8E2D6] hover:bg-[var(--accent-light)]"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Telaffuzu Dinle</span>
                  </button>
                </div>
              )}

              {mode === 'romaji_to_kana' && (
                <div>
                  <span className="text-[11px] font-semibold text-[#8C867B] uppercase tracking-wider block mb-2">
                    "{currentQ.promptRomaji}" sesinin {alphabet === 'hiragana' ? 'Hiragana' : 'Katakana'} karşılığı hangisidir?
                  </span>
                  <div className="text-6xl sm:text-7xl font-black text-[var(--accent)]">
                    {currentQ.promptRomaji}
                  </div>
                </div>
              )}

              {mode === 'audio_quiz' && (
                <div className="space-y-3 py-2">
                  <span className="text-xs font-semibold text-[#8C867B] uppercase tracking-wider block">
                    Dinlediğin ses hangi karaktere aittir?
                  </span>
                  <button
                    id="btn-replay-audio"
                    onClick={() => soundManager.speak(currentQ.promptAudio!)}
                    className={`py-4 px-6 rounded-[20px] border-2 transition-all mx-auto flex items-center justify-center gap-2.5 shadow-xs ${
                      isPlayingAudio 
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)] animate-pulse'
                        : 'bg-[var(--accent-light)] hover:bg-[var(--accent-light)] text-[var(--accent)] border-[var(--accent)]/30'
                    }`}
                  >
                    <Volume2 className="w-6 h-6" />
                    <span className="font-bold text-sm">Sesi Tekrar Çal</span>
                  </button>
                </div>
              )}

              {mode === 'words' && currentQ.targetWord && (
                <div>
                  <span className="text-[11px] font-semibold text-[#8C867B] uppercase tracking-wider block mb-1">
                    Bu kelimenin anlamı nedir?
                  </span>
                  <div className="text-5xl font-bold text-[#1F1E1D] font-japanese mb-2">
                    {currentQ.targetWord.kana}
                  </div>
                  <button
                    onClick={() => soundManager.speak(currentQ.targetWord!.kana)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] text-xs text-[var(--accent)] font-semibold border border-[#E8E2D6] hover:bg-[var(--accent-light)]"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Kelime Telaffuzu</span>
                  </button>
                </div>
              )}

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {currentQ.options.map((option, idx) => {
                  let optionStyle: React.CSSProperties = { background: '#FAF8F5', color: '#1F1E1D', borderColor: '#E8E3D8' };

                  if (isAnswered) {
                    if (option === currentQ.correctAnswer) {
                      optionStyle = { background: CORRECT.border, color: '#FFFFFF', borderColor: CORRECT.border, fontWeight: 700 };
                    } else if (option === selectedOption) {
                      optionStyle = { background: WRONG.border, color: '#FFFFFF', borderColor: WRONG.border, fontWeight: 700 };
                    } else {
                      optionStyle = { background: '#F3F4F6', color: '#9CA3AF', borderColor: '#E5E7EB', opacity: 0.5 };
                    }
                  }

                  return (
                    <button
                      key={idx}
                      id={`quiz-option-${idx}`}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(option)}
                      style={optionStyle}
                      className="py-3.5 px-4 rounded-[16px] border-2 text-center text-base sm:text-lg font-bold transition-all duration-150 flex items-center justify-center gap-2 hover:bg-white hover:border-[var(--accent)]"
                    >
                      <span className="font-japanese">{option}</span>
                      {isAnswered && option === currentQ.correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      )}
                      {isAnswered && option === selectedOption && option !== currentQ.correctAnswer && (
                        <XCircle className="w-5 h-5 text-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Stuck? Reveal answer button */}
              {!isAnswered && (
                <div className="pt-1">
                  <button
                    onClick={handleRevealAnswer}
                    className="text-xs text-[#8A847A] hover:text-[#1F1E1D] inline-flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Cevabı Bilmiyorum, Göster</span>
                  </button>
                </div>
              )}

              {/* Feedback Explanation & Next Button */}
              {isAnswered && (
                <div className="p-4 rounded-[20px] bg-[#F6F3EC] border border-[#E4DED4] text-left space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-[#1F1E1D]">
                        Doğru Cevap: <span style={{ color: CORRECT.border }}>{currentQ.correctAnswer}</span>
                      </div>
                      <p className="text-xs text-[#47433B] mt-0.5 leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      id="btn-quiz-next"
                      onClick={handleNext}
                      className="px-5 py-2.5 rounded-[16px] bg-[#1F1E1D] hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-xs"
                    >
                      <span>{currentIndex < questions.length - 1 ? 'Sıradaki Soru' : 'Sonuçları Gör'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )
      )}

    </div>
  );
};
