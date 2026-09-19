import React, { useState, useEffect } from 'react';
import { KanaCharacter, AlphabetType, KanaCategory, UserProgressData } from '../../../types';
import { KANA_DATA } from '../data/kanaData';
import { 
  Volume2, 
  RotateCw, 
  Check, 
  X, 
  Shuffle, 
  ArrowRight,
  ArrowLeft,
  Eye,
  Bookmark,
  VolumeX
} from 'lucide-react';
import { soundManager } from '../../../utils/sound';

interface FlashcardsTabProps {
  alphabet: AlphabetType;
  setAlphabet: (alp: AlphabetType) => void;
  progress: UserProgressData;
  onRecordAnswer: (alphabet: AlphabetType, kanaId: string, isCorrect: boolean) => void;
  onCardFlipped: () => void;
}

export const FlashcardsTab: React.FC<FlashcardsTabProps> = ({
  alphabet,
  setAlphabet,
  progress,
  onRecordAnswer,
  onCardFlipped
}) => {
  const [category, setCategory] = useState<KanaCategory | 'all' | 'weak'>('seion');
  const [direction, setDirection] = useState<'kana_to_romaji' | 'romaji_to_kana'>('kana_to_romaji');
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);

  const [cards, setCards] = useState<KanaCharacter[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  // Initialize deck based on filters
  useEffect(() => {
    let list: KanaCharacter[] = [];

    if (category === 'weak') {
      list = KANA_DATA.filter((char) => {
        const prog = progress.characters[`${alphabet}_${char.id}`];
        return prog && prog.incorrectAnswers > 0;
      });
      if (list.length === 0) {
        list = KANA_DATA.filter((c) => c.category === 'seion');
      }
    } else if (category === 'all') {
      list = [...KANA_DATA];
    } else {
      list = KANA_DATA.filter((c) => c.category === category);
    }

    setCards(list);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [category, alphabet, progress]);

  // Sound listener
  useEffect(() => {
    const unsub = soundManager.addListener((speaking) => {
      setIsPlayingSound(speaking);
    });
    return unsub;
  }, []);

  const currentCard: KanaCharacter | undefined = cards[currentIndex];

  const handleFlip = () => {
    soundManager.playFlipSound();
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    onCardFlipped();

    // If flipped to reveal, play audio if autoplay is on
    if (nextFlipped && autoPlayAudio && currentCard) {
      const textToSpeak = alphabet === 'hiragana' ? currentCard.hiragana : currentCard.katakana;
      soundManager.speak(textToSpeak);
    }
  };

  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;
    const textToSpeak = alphabet === 'hiragana' ? currentCard.hiragana : currentCard.katakana;
    soundManager.speak(textToSpeak);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!currentCard) return;

    if (isCorrect) {
      soundManager.playCorrectSound();
    } else {
      soundManager.playIncorrectSound();
    }

    onRecordAnswer(alphabet, currentCard.id, isCorrect);

    // Reset card flip and move to next
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 150);
  };

  const handleShuffle = () => {
    soundManager.playFlipSound();
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (!currentCard || cards.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E3D8] max-w-xl mx-auto shadow-xs">
        <p className="text-base font-bold text-[#1F1E1D]">Bu grupta henüz kart bulunmuyor.</p>
        <p className="text-xs text-[#7A756D] mt-1">Lütfen yukarıdaki filtrelerden "Temel" veya "Tümü" grubunu seçin.</p>
        <button
          onClick={() => setCategory('seion')}
          className="mt-4 px-4 py-2 rounded-xl bg-[#1F1E1D] text-white text-xs font-semibold"
        >
          Temel Harflere Dön
        </button>
      </div>
    );
  }

  const currentKana = alphabet === 'hiragana' ? currentCard.hiragana : currentCard.katakana;
  const alternateKana = alphabet === 'hiragana' ? currentCard.katakana : currentCard.hiragana;

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      {/* Category Pills & Direction Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-[#E8E3D8] shadow-2xs">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {[
            { id: 'seion' as const, label: 'Temel (46)' },
            { id: 'dakuon' as const, label: 'Tenten (\")' },
            { id: 'handakuon' as const, label: 'Maru (°)' },
            { id: 'yoon' as const, label: 'Bileşik' },
            { id: 'weak' as const, label: 'Hatalarım' },
            { id: 'all' as const, label: 'Tümü' }
          ].map((item) => (
            <button
              key={item.id}
              id={`filter-fc-${item.id}`}
              onClick={() => {
                setCategory(item.id);
                soundManager.playFlipSound();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                category === item.id
                  ? 'bg-[#1F1E1D] text-white shadow-xs'
                  : 'bg-[#F5F2EC] text-[#555047] hover:bg-[#EBE6DC]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Direction & Options */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            id="btn-shuffle-cards"
            onClick={handleShuffle}
            title="Kartları Karıştır"
            className="p-2 rounded-xl bg-[#F5F2EC] hover:bg-[#EBE6DC] text-[#555047] transition-colors"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            id="btn-toggle-card-dir"
            onClick={() => setDirection(direction === 'kana_to_romaji' ? 'romaji_to_kana' : 'kana_to_romaji')}
            className="px-2.5 py-1.5 rounded-xl bg-[#F5F2EC] hover:bg-[#EBE6DC] text-[#555047] text-xs font-semibold transition-colors whitespace-nowrap"
            title="Kart yönünü değiştir"
          >
            {direction === 'kana_to_romaji' ? 'Kana ➔ Okunuş' : 'Okunuş ➔ Kana'}
          </button>
        </div>

      </div>

      {/* Progress Counter & Navigation Bar */}
      <div className="flex items-center justify-between text-xs text-[#7A756D] px-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1F1E1D]">
            Kart {currentIndex + 1} / {cards.length}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold uppercase">
            {currentCard.category}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            id="btn-prev-card"
            disabled={currentIndex === 0}
            onClick={() => {
              setIsFlipped(false);
              setCurrentIndex((prev) => Math.max(0, prev - 1));
            }}
            className="p-1.5 rounded-lg disabled:opacity-30 text-[#555047] hover:bg-white transition-colors"
            title="Önceki Kart"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            id="btn-next-card"
            disabled={currentIndex === cards.length - 1}
            onClick={() => {
              setIsFlipped(false);
              setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
            }}
            className="p-1.5 rounded-lg disabled:opacity-30 text-[#555047] hover:bg-white transition-colors"
            title="Sıradaki Kart"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Card Stage */}
      <div 
        id="flashcard-interactive"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label="Kartı çevir"
        className="cursor-pointer select-none min-h-[340px] sm:min-h-[360px] relative rounded-3xl bg-white border-2 transition-all duration-300 shadow-md hover:shadow-lg flex flex-col justify-between overflow-hidden"
        style={{
          borderColor: isFlipped ? '#FDA4AF' : '#E8E3D8'
        }}
      >
        {/* Top bar on card */}
        <div className="p-5 pb-0 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#8C867B]">
            {isFlipped ? 'CEVAP & OKUNUŞ' : 'SORU KARTI'}
          </span>
          
          <button
            onClick={handleSpeak}
            title="Telaffuzu Dinle"
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 transition-all ${
              isPlayingSound 
                ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                : 'bg-[#FAF8F5] text-rose-600 hover:bg-rose-50 border-[#E8E2D6]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span className="text-xs font-bold">Dinle</span>
          </button>
        </div>

        {/* Card Body */}
        {!isFlipped ? (
          /* FRONT OF CARD */
          <div className="p-8 sm:p-10 flex flex-col items-center justify-center space-y-4 text-center">
            {direction === 'kana_to_romaji' ? (
              <>
                <div className="text-8xl sm:text-9xl font-bold text-[#1F1E1D] font-japanese leading-none">
                  {currentKana}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Karta veya aşağıdaki butona tıklayarak cevabı gör</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl sm:text-7xl font-mono font-black text-rose-600 tracking-wider">
                  {currentCard.romaji}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Japonca yazılışı görmek için tıkla</span>
                </div>
              </>
            )}
          </div>
        ) : (
          /* BACK OF CARD (REVEALED ANSWER) */
          <div className="p-6 sm:p-8 space-y-4 animate-in fade-in duration-200">
            
            {/* Main Answer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black font-mono text-rose-600">
                    {currentCard.romaji}
                  </span>
                  <span className="text-3xl font-bold text-[#1F1E1D] font-japanese">
                    {currentKana}
                  </span>
                </div>
                <span className="text-xs text-[#7A756D] mt-0.5 block">
                  Diğer alfabe: <strong className="text-sm text-[#1F1E1D] font-japanese">{alternateKana}</strong> ({alphabet === 'hiragana' ? 'Katakana' : 'Hiragana'})
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-[#8A847A] block">Çizgi Sayısı</span>
                <span className="text-lg font-bold text-[#1F1E1D]">{currentCard.strokeCount} Vuruş</span>
              </div>
            </div>

            {/* Turkish Pronunciation & Mnemonic */}
            <div className="space-y-2.5 text-left">
              <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-left">
                <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-0.5">
                  Türkçe Okunuş Rehberi:
                </div>
                <p className="text-xs sm:text-sm text-[#47433B] font-medium leading-relaxed">
                  {currentCard.trPronunciation}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/90 border border-rose-200 text-left">
                <div className="text-[11px] font-bold text-rose-900 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  <Bookmark className="w-3 h-3" />
                  Hafıza İpucu:
                </div>
                <p className="text-xs text-[#47433B] leading-relaxed">
                  {currentCard.mnemonic}
                </p>
              </div>

              {/* Sample Word */}
              {currentCard.sampleWords[0] && (
                <div className="p-2.5 rounded-xl bg-white border border-[#EAE5DA] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-sm text-[#1F1E1D] mr-1 font-japanese">
                      {currentCard.sampleWords[0].word}
                    </span>
                    <span className="text-rose-700 font-mono">
                      ({currentCard.sampleWords[0].romaji})
                    </span>
                    <span className="text-[#7A756D] ml-2">
                      - {currentCard.sampleWords[0].meaningTr}
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Card footer indicator */}
        <div className="p-3 bg-[#FAF8F5] border-t border-[#EFECE6] text-center text-[11px] text-[#8C867B] flex items-center justify-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-rose-500" />
          <span>{isFlipped ? 'Ön yüze dönmek için karta tıkla' : 'Cevabı görmek için karta tıkla'}</span>
        </div>
      </div>

      {/* DEDICATED ACTION BUTTONS: Explicit "Cevabı Göster" when not flipped */}
      {!isFlipped ? (
        <button
          id="btn-show-flashcard-answer"
          onClick={handleFlip}
          className="w-full py-4 px-6 rounded-2xl bg-[#1F1E1D] hover:bg-neutral-800 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-98"
        >
          <Eye className="w-5 h-5 text-rose-300" />
          <span>Cevabı & Okunuşu Göster</span>
        </button>
      ) : (
        /* Once flipped, allow marking Know vs Repeat */
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <button
              id="btn-flashcard-repeat"
              onClick={() => handleAnswer(false)}
              className="py-3.5 px-4 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-200 hover:border-rose-400 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <X className="w-5 h-5 text-rose-600" />
              <span>Tekrar Et (Bilemedim)</span>
            </button>

            <button
              id="btn-flashcard-know"
              onClick={() => handleAnswer(true)}
              className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Check className="w-5 h-5 text-white" />
              <span>Biliyorum! (Sıradaki)</span>
            </button>
          </div>

          <button
            onClick={handleFlip}
            className="w-full py-2 text-xs text-[#7A756D] hover:text-[#1F1E1D] text-center font-medium"
          >
            Kartı Ön Yüze Çevir
          </button>
        </div>
      )}

    </div>
  );
};
