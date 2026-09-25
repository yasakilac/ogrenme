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
  Layers,
  Bookmark
} from 'lucide-react';
import { soundManager } from '../../../utils/sound';
import { CORRECT, WRONG } from '../../../components/ui';

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
  const [autoPlayAudio] = useState(true);

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
      <div className="p-12 text-center bg-white rounded-[24px] border border-[#E6E0D6] max-w-xl mx-auto">
        <p className="text-base font-bold text-[#1C1B19]">Bu grupta henüz kart bulunmuyor.</p>
        <p className="text-xs text-[#6B665E] mt-1">Lütfen yukarıdaki filtrelerden "Temel" veya "Tümü" grubunu seçin.</p>
        <button
          onClick={() => setCategory('seion')}
          className="mt-4 px-4 py-2 rounded-[16px] bg-[#1C1B19] text-white text-xs font-semibold"
        >
          Temel Harflere Dön
        </button>
      </div>
    );
  }

  const currentKana = alphabet === 'hiragana' ? currentCard.hiragana : currentCard.katakana;
  const alternateKana = alphabet === 'hiragana' ? currentCard.katakana : currentCard.hiragana;

  return (
    <div className="max-w-xl mx-auto space-y-4 animate-in fade-in duration-200">

      {/* Icon box + title (design screen header) */}
      <div className="flex items-center gap-2.5 px-1">
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: 'var(--accent)' }}>
          <Layers className="w-[22px] h-[22px] text-white" />
        </div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight" style={{ color: '#1C1B19' }}>Kartlar</h1>
      </div>

      {/* Category Pills & Direction Selector (mevcut özellik, tasarım dilinde korunur) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-[18px] bg-white border border-[#E6E0D6]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {[
            { id: 'seion' as const, label: 'Temel' },
            { id: 'dakuon' as const, label: 'Tenten' },
            { id: 'handakuon' as const, label: 'Maru' },
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
              className={`px-3 py-1.5 rounded-[14px] text-xs font-bold whitespace-nowrap transition-all ${
                category === item.id ? 'bg-[#1C1B19] text-white' : 'bg-[#F5F2EC] text-[#555047]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            id="btn-shuffle-cards"
            aria-label="Kartları karıştır"
            onClick={handleShuffle}
            className="w-9 h-9 rounded-[12px] bg-[#F5F2EC] text-[#555047] flex items-center justify-center shrink-0"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            id="btn-toggle-card-dir"
            aria-label="Kart yönünü değiştir"
            onClick={() => setDirection(direction === 'kana_to_romaji' ? 'romaji_to_kana' : 'kana_to_romaji')}
            className="px-2.5 py-1.5 rounded-[12px] bg-[#F5F2EC] text-[#555047] text-xs font-bold whitespace-nowrap"
          >
            {direction === 'kana_to_romaji' ? 'Kana ➔ Okunuş' : 'Okunuş ➔ Kana'}
          </button>
        </div>
      </div>

      {/* Progress Counter & Navigation */}
      <div className="flex items-center justify-between text-xs text-[#6B665E] px-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1C1B19]">Kart {currentIndex + 1} / {cards.length}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-bold uppercase" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            {currentCard.category}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            id="btn-prev-card"
            aria-label="Önceki kart"
            disabled={currentIndex === 0}
            onClick={() => {
              setIsFlipped(false);
              setCurrentIndex((prev) => Math.max(0, prev - 1));
            }}
            className="p-1.5 rounded-lg disabled:opacity-30 text-[#555047]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            id="btn-next-card"
            aria-label="Sonraki kart"
            disabled={currentIndex === cards.length - 1}
            onClick={() => {
              setIsFlipped(false);
              setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
            }}
            className="p-1.5 rounded-lg disabled:opacity-30 text-[#555047]"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Card Stage — design E5: 470px, flip button, audio chip top-right */}
      <div
        id="flashcard-interactive"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label="Kartı çevir"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleFlip(); } }}
        className="cursor-pointer select-none min-h-[420px] sm:min-h-[470px] relative rounded-[30px] transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden"
        style={{
          background: isFlipped ? '#1F2A44' : '#FFFFFF',
          border: isFlipped ? 'none' : '1px solid #E6E0D6'
        }}
      >
        {/* Audio chip (tasarımdaki üst-sağ ikon rozeti, sesli okuma için kullanılır) */}
        <button
          type="button"
          onClick={handleSpeak}
          aria-label="Telaffuzu dinle"
          className="absolute top-[18px] right-[18px] w-10 h-10 rounded-[20px] flex items-center justify-center transition-all"
          style={{
            background: isFlipped ? '#2E3D5F' : 'var(--accent-light)',
            color: isFlipped ? '#FFFFFF' : 'var(--accent)'
          }}
        >
          <Volume2 className={`w-5 h-5 ${isPlayingSound ? 'animate-pulse' : ''}`} />
        </button>

        {!isFlipped ? (
          /* FRONT OF CARD */
          <div className="px-8 flex flex-col items-center justify-center gap-4 text-center">
            {direction === 'kana_to_romaji' ? (
              <>
                <div className="w-[120px] h-[120px] rounded-[36px] flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
                  <span className="text-6xl font-bold font-japanese leading-none" style={{ color: '#1C1B19' }}>{currentKana}</span>
                </div>
                <span className="font-display font-extrabold text-[28px] tracking-tight" style={{ color: 'var(--accent)' }}>{currentCard.romaji}</span>
              </>
            ) : (
              <>
                <div className="w-[120px] h-[120px] rounded-[36px] flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
                  <span className="font-display font-extrabold text-5xl tracking-tight" style={{ color: 'var(--accent)' }}>{currentCard.romaji}</span>
                </div>
                <span className="text-lg font-bold text-[#6B665E]">Japonca yazılışı görmek için tıkla</span>
              </>
            )}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <RotateCw className="w-3.5 h-3.5" />
              <span>Cevabı görmek için karta dokun</span>
            </div>
          </div>
        ) : (
          /* BACK OF CARD (REVEALED ANSWER) */
          <div className="w-[290px] flex flex-col gap-3.5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white">{currentCard.romaji}</span>
                <span className="text-2xl font-bold text-white/90 font-japanese">{currentKana}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold text-white/60 block uppercase">Vuruş</span>
                <span className="text-base font-bold text-white">{currentCard.strokeCount}</span>
              </div>
            </div>

            <div className="rounded-[20px] p-4 flex flex-col gap-1.5" style={{ background: '#2E3D5F' }}>
              <span className="font-display font-extrabold text-xl" style={{ color: '#FCD34D' }}>{alternateKana}</span>
              <span className="font-bold text-[15px] text-white">Diğer alfabe ({alphabet === 'hiragana' ? 'Katakana' : 'Hiragana'})</span>
              <span className="font-semibold text-[13px] text-[#C7D0E4] leading-relaxed">{currentCard.trPronunciation}</span>
            </div>

            <div className="rounded-[20px] p-4 flex flex-col gap-1.5" style={{ background: '#2E3D5F' }}>
              <span className="font-bold text-[13px] text-white flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                Hafıza İpucu
              </span>
              <span className="font-semibold text-[13px] text-[#C7D0E4] leading-relaxed">{currentCard.mnemonic}</span>
              {currentCard.sampleWords[0] && (
                <span className="font-semibold text-[13px] text-[#C7D0E4] pt-1 border-t border-white/10 mt-1">
                  <span className="font-japanese text-white font-bold">{currentCard.sampleWords[0].word}</span>
                  {' '}({currentCard.sampleWords[0].romaji}) - {currentCard.sampleWords[0].meaningTr}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DEDICATED ACTION BUTTONS: show-answer prompt, then Tekrar/Biliyorum (design E5 footer) */}
      {!isFlipped ? (
        <button
          id="btn-show-flashcard-answer"
          onClick={handleFlip}
          className="w-full h-14 rounded-[18px] bg-[#1C1B19] text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all active:scale-98"
        >
          <span>Cevabı & Okunuşu Göster</span>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            id="btn-flashcard-repeat"
            aria-label="Tekrar et"
            onClick={() => handleAnswer(false)}
            style={{ background: WRONG.bg, border: `2px solid ${WRONG.border}`, color: WRONG.fg }}
            className="h-[60px] rounded-[18px] font-extrabold text-base flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <X className="w-5 h-5" style={{ color: WRONG.border }} />
            <span>Tekrar</span>
          </button>
          <button
            id="btn-flashcard-know"
            aria-label="Biliyorum"
            onClick={() => handleAnswer(true)}
            style={{ background: CORRECT.bg, border: `2px solid ${CORRECT.border}`, color: CORRECT.fg }}
            className="h-[60px] rounded-[18px] font-extrabold text-base flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Check className="w-5 h-5" style={{ color: CORRECT.border }} />
            <span>Biliyorum</span>
          </button>
        </div>
      )}

    </div>
  );
};
