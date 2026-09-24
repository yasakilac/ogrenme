import React, { useState } from 'react';
import {
  RotateCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Check,
} from 'lucide-react';
import {
  FLASHCARDS_DATA,
  TRUE_FALSE_ITEMS,
  type FlashcardItem,
  type TrueFalseItem,
} from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';

interface TopicPracticeWidgetProps {
  topicCategory: 'Diyafram' | 'Enstantane' | 'ISO';
  onScoreEarned?: (points: number) => void;
}

export const TopicPracticeWidget: React.FC<TopicPracticeWidgetProps> = ({
  topicCategory,
  onScoreEarned,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'flashcards' | 'quickTest'>('flashcards');

  // Flashcards for this topic
  const topicCards = FLASHCARDS_DATA.filter((fc) => fc.category === topicCategory);
  const [currentCardIdx, setCurrentCardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  // Quick Test (True/False & Concept questions for this topic)
  const topicQuestions = TRUE_FALSE_ITEMS.filter((tf) => {
    if (topicCategory === 'Diyafram') return tf.id === 'tf-1' || tf.id === 'tf-4';
    if (topicCategory === 'Enstantane') return tf.id === 'tf-2';
    if (topicCategory === 'ISO') return tf.id === 'tf-3';
    return true;
  });

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, boolean>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  const card = topicCards[currentCardIdx] || topicCards[0];
  const isCardMastered = card ? masteredCards[card.id] || false : false;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    cameraAudio.playDialTick();
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev + 1) % topicCards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev - 1 + topicCards.length) % topicCards.length);
  };

  const handleToggleMastered = () => {
    if (!card) return;
    const next = !isCardMastered;
    setMasteredCards((prev) => ({ ...prev, [card.id]: next }));
    if (next) {
      cameraAudio.playSuccessSound();
      if (onScoreEarned) onScoreEarned(15);
    }
  };

  const handleSelectAnswer = (qId: string, choice: boolean, correctValue: boolean) => {
    if (selectedAnswers[qId] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: choice }));
    setRevealedExplanations((prev) => ({ ...prev, [qId]: true }));
    if (choice === correctValue) {
      cameraAudio.playSuccessSound();
      if (onScoreEarned) onScoreEarned(20);
    } else {
      cameraAudio.playDialTick();
    }
  };

  return (
    <div className="bg-white border-2 border-[#EBE7E0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Başlık ve Sekme Seçimi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0ECE6] pb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md font-mono">
                Deneme & Ezberleme Kartı
              </span>
              <span className="text-xs text-stone-500 font-mono">{topicCategory} Pratiği</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1F1E1B] mt-0.5">
              {topicCategory} Ezber ve Deneme Etkinliği
            </h3>
          </div>
        </div>

        {/* İki Mod Arası Geçiş */}
        <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-2xl border border-[#EBE7E0]">
          <button
            onClick={() => setActiveSubTab('flashcards')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'flashcards'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ezber Kartları ({topicCards.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('quickTest')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'quickTest'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Hızlı Deneme ({topicQuestions.length})</span>
          </button>
        </div>
      </div>

      {/* 1. MOD: FLASHCARD EZBERLEME */}
      {activeSubTab === 'flashcards' && card && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
            <span>
              Kart {currentCardIdx + 1} / {topicCards.length}
            </span>
            <span>Öğrenilen: {Object.values(masteredCards).filter(Boolean).length}</span>
          </div>

          {/* Çevrilebilir Flashcard */}
          <div
            onClick={handleFlip}
            className="group relative min-h-[220px] sm:min-h-[200px] p-6 rounded-3xl border-2 border-[#EBE7E0] hover:border-amber-400 bg-gradient-to-br from-[#FAF8F5] to-amber-50/30 cursor-pointer transition-all duration-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold font-mono text-amber-700 bg-amber-100/60 px-2.5 py-0.5 rounded-lg">
                  {card.category} Kuralı
                </span>
                <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1 group-hover:text-stone-700 transition-colors">
                  <RotateCw className="w-3.5 h-3.5" />
                  {isFlipped ? 'Ön Yüze Dön' : 'Açıklamayı Görmek İçin Tıkla'}
                </span>
              </div>

              {!isFlipped ? (
                /* Ön Yüz */
                <div className="space-y-3 pt-2">
                  <h4 className="text-lg sm:text-xl font-black text-stone-900">{card.title}</h4>
                  <p className="text-sm text-stone-700 leading-relaxed">{card.summary}</p>
                  <div className="pt-2">
                    <span className="inline-block text-xs font-mono font-bold text-amber-900 bg-amber-200/50 px-3 py-1 rounded-xl">
                      Önemli Formül: {card.formulaOrRule}
                    </span>
                  </div>
                </div>
              ) : (
                /* Arka Yüz (Detay & Ezber Çıkarımı) */
                <div className="space-y-3 pt-1 animate-fadeIn">
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    Detaylı Optik Açıklama & Ezber İpucu
                  </div>
                  <p className="text-sm text-stone-800 leading-relaxed">{card.details}</p>
                  <div className="p-3 bg-white border border-amber-200 rounded-2xl text-xs text-amber-950 font-medium">
                    🎯 <strong>Görsel Sonuç:</strong> {card.visualEffect}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#F0ECE6] flex items-center justify-between text-xs text-stone-500">
              <span className="italic font-sans">
                {isFlipped ? 'Kartı kapatmak için tekrar dokunun' : 'Kartın arkasını çevirip ezberleyin'}
              </span>
              <span className="font-bold text-amber-700">+{isCardMastered ? '15 Puan Alındı' : '15 Puan'}</span>
            </div>
          </div>

          {/* Alt Kontroller (Önceki/Sonraki & Ezberledim Butonu) */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevCard}
                className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
                title="Önceki Kart"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextCard}
                className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
                title="Sonraki Kart"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleToggleMastered}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isCardMastered
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-900 hover:bg-black text-white'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isCardMastered ? 'Ezberlendi (Tamam)' : 'Ezberledim Olarak İşaretle'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. MOD: HIZLI DENEME TESTİ */}
      {activeSubTab === 'quickTest' && (
        <div className="space-y-4">
          <p className="text-xs text-stone-600">
            {topicCategory} ile ilgili aşağıdaki önermeleri değerlendirerek ezberinizi test edin:
          </p>

          <div className="space-y-4">
            {topicQuestions.map((q, idx) => {
              const userAnswer = selectedAnswers[q.id];
              const isAnswered = userAnswer !== undefined;
              const isCorrect = isAnswered && userAnswer === q.isTrue;

              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isAnswered
                      ? isCorrect
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-rose-50/60 border-rose-300'
                      : 'bg-[#FAF8F5] border-[#EBE7E0]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-800 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 space-y-3">
                      <p className="text-sm font-extrabold text-stone-900 leading-snug">
                        {q.statement}
                      </p>

                      {/* Doğru / Yanlış Butonları */}
                      {!isAnswered ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleSelectAnswer(q.id, true, q.isTrue)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-stone-300 hover:border-emerald-500 hover:text-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>DOĞRU</span>
                          </button>
                          <button
                            onClick={() => handleSelectAnswer(q.id, false, q.isTrue)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-stone-300 hover:border-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>YANLIŞ</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold font-mono">
                            {isCorrect ? (
                              <span className="text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                Doğru Yanıt! (+20 Puan)
                              </span>
                            ) : (
                              <span className="text-rose-700 flex items-center gap-1">
                                <XCircle className="w-4 h-4" />
                                Hatalı Seçim!
                              </span>
                            )}
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs text-stone-700 leading-relaxed">
                            💡 <strong>Öğrenme Notu:</strong> {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
