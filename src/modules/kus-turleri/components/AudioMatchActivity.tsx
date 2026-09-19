import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, RotateCcw, Music, Sparkles } from 'lucide-react';
import { TURKEY_BIRDS, BirdSpecies } from '../data/birds';
import { birdAudioSynth } from '../utils/audioSynth';
import { BirdPhoto } from './BirdPhoto';

interface AudioMatchActivityProps {
  onScoreUpdate?: (score: number) => void;
}

export const AudioMatchActivity: React.FC<AudioMatchActivityProps> = ({ onScoreUpdate }) => {
  const [targetBird, setTargetBird] = useState<BirdSpecies>(TURKEY_BIRDS[0]);
  const [options, setOptions] = useState<BirdSpecies[]>([]);
  const [selectedBirdId, setSelectedBirdId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [round, setRound] = useState(1);

  const [hasPlayedCurrentRound, setHasPlayedCurrentRound] = useState(false);

  const startNewRound = () => {
    setSelectedBirdId(null);
    setIsCorrect(null);
    setHasPlayedCurrentRound(false);

    const randomTarget = TURKEY_BIRDS[Math.floor(Math.random() * TURKEY_BIRDS.length)];
    setTargetBird(randomTarget);

    const distractors = TURKEY_BIRDS.filter((b) => b.id !== randomTarget.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const shuffled = [randomTarget, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(shuffled);
  };

  useEffect(() => {
    startNewRound();
  }, [round]);

  const handlePlaySound = (id: string = targetBird.id) => {
    setHasPlayedCurrentRound(true);
    setIsPlaying(true);
    birdAudioSynth.playBirdCall(id);
    setTimeout(() => {
      setIsPlaying(false);
    }, 2200);
  };

  const handleSelectOption = (bird: BirdSpecies) => {
    if (selectedBirdId !== null) return;

    setSelectedBirdId(bird.id);
    const correct = bird.id === targetBird.id;
    setIsCorrect(correct);

    if (correct) {
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (onScoreUpdate) onScoreUpdate(newScore);
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Skor ve Tur Başlığı */}
      <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
            <Music className="w-4 h-4" />
          </div>
          <span className="font-semibold text-stone-900">Sesi Dinle & Kuşu Teşhis Et</span>
        </div>

        <div className="flex items-center gap-3 font-medium">
          <span className="text-stone-500">Doğru Seri: <strong className="text-rose-600">{streak}</strong></span>
          <span className="text-stone-300">|</span>
          <span className="text-stone-500">Puan: <strong className="text-stone-900">{score}</strong></span>
        </div>
      </div>

      {/* Ses Çalma Kartı (Minimalist & Odaklı) */}
      <div className="p-8 bg-white rounded-3xl border border-stone-200/80 text-center shadow-xs flex flex-col items-center justify-center space-y-4">
        <p className="text-xs text-stone-500 font-medium">
          {!hasPlayedCurrentRound
            ? 'Gizemli kuşun sesini duymak için butona tıklayın'
            : 'Sesi dinlediniz. Şimdi aşağıdaki seçeneklerden doğru kuşu seçin'}
        </p>

        {/* Ana Ses Butonu */}
        <button
          id="play-mystery-call-btn"
          onClick={() => handlePlaySound()}
          className={`flex items-center justify-center w-20 h-20 rounded-full transition-all active:scale-95 shadow-md ${
            isPlaying
              ? 'bg-rose-600 text-white ring-8 ring-rose-100 shadow-rose-200 animate-pulse'
              : !hasPlayedCurrentRound
              ? 'bg-rose-600 text-white hover:bg-rose-700 ring-4 ring-rose-100'
              : 'bg-stone-900 text-white hover:bg-stone-800'
          }`}
        >
          <Volume2 className={`w-8 h-8 ${isPlaying ? 'scale-110' : ''}`} />
        </button>

        {/* Ses Dalgaları */}
        <div className="flex items-center gap-1.5 h-6">
          {[12, 22, 30, 18, 28, 32, 20, 14].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying ? 'bg-rose-500' : 'bg-stone-200'
              }`}
              style={{
                height: isPlaying ? `${Math.max(6, (h * (1 + Math.sin(i * 1.8))) % 26)}px` : '4px'
              }}
            />
          ))}
        </div>

        <button
          id="replay-call-btn"
          onClick={() => handlePlaySound()}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 pt-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Sesi Tekrar Çal</span>
        </button>
      </div>

      {/* 4 Gerçek Görselli Kuş Seçeneği */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selectedBirdId === option.id;
          const isTarget = option.id === targetBird.id;

          let btnBorder = 'border-stone-200 hover:border-stone-400 bg-white';

          if (selectedBirdId !== null) {
            if (isTarget) {
              btnBorder = 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-200';
            } else if (isSelected && !isTarget) {
              btnBorder = 'border-rose-400 bg-rose-50/50';
            } else {
              btnBorder = 'border-stone-100 opacity-40';
            }
          }

          return (
            <button
              key={option.id}
              id={`audio-option-${option.id}`}
              disabled={selectedBirdId !== null}
              onClick={() => handleSelectOption(option)}
              className={`p-2.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${btnBorder}`}
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                <BirdPhoto
                  src={option.imageUrl}
                  fallbackSrc={option.fallbackImageUrl}
                  alt={option.name}
                  birdId={option.id}
                  aspectRatio="square"
                  className="w-full h-full rounded-xl"
                />
              </div>

              <div className="grow min-w-0">
                <span className="font-bold text-xs text-stone-900 block truncate">{option.name}</span>
                <span className="text-[11px] text-stone-500 block truncate">{option.category}</span>
              </div>

              {selectedBirdId !== null && isTarget && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {selectedBirdId !== null && isSelected && !isTarget && (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sonuç & Sonraki Adım */}
      {selectedBirdId !== null && (
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-3 text-xs animate-fade-in">
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <div>
              <span className="font-bold text-stone-900 block">
                {isCorrect ? 'Doğru cevap!' : `Doğru: ${targetBird.name}`}
              </span>
              <span className="text-stone-500 text-[11px]">{targetBird.voiceDescription}</span>
            </div>
          </div>

          <button
            id="next-sound-round-btn"
            onClick={() => setRound((prev) => prev + 1)}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 font-semibold whitespace-nowrap"
          >
            Sonraki Soru →
          </button>
        </div>
      )}
    </div>
  );
};
