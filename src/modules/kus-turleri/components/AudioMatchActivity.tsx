import React, { useState, useEffect } from 'react';
import { Volume2, Check, X, RotateCcw } from 'lucide-react';
import { TURKEY_BIRDS, BirdSpecies } from '../data/birds';
import { birdAudioSynth } from '../utils/audioSynth';
import { BirdPhoto } from './BirdPhoto';
import { CORRECT, WRONG, CheckBar } from '../../../components/ui';

interface AudioMatchActivityProps {
  onScoreUpdate?: (score: number) => void;
}

const WAVE_HEIGHTS = [12, 22, 30, 18, 28, 32, 20, 14, 24, 16, 26, 10];

/** E7 (Etkinlik — Ses Eşleme) dili: koyu ses kartı + dalga formu, altında tek sütun seçenek listesi. */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const handlePlaySound = (id: string = targetBird.id) => {
    setHasPlayedCurrentRound(true);
    setIsPlaying(true);
    birdAudioSynth.playBirdCall(id);
    setTimeout(() => setIsPlaying(false), 2200);
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
    <div className="space-y-4">
      {/* Skor ve seri */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: '#6B665E' }}>
          Doğru seri: <strong style={{ color: 'var(--accent)' }}>{streak}</strong>
        </span>
        <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{score} puan</span>
      </div>

      {/* Koyu ses kartı */}
      <div
        className="h-[220px] rounded-[28px] flex flex-col items-center justify-center gap-4"
        style={{ background: '#1F2A44' }}
      >
        <button
          type="button"
          onClick={() => handlePlaySound()}
          aria-label={hasPlayedCurrentRound ? 'Sesi tekrar çal' : 'Gizemli kuşun sesini çal'}
          className="w-24 h-24 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{
            background: 'var(--accent)',
            boxShadow: `0 0 0 10px ${isPlaying ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          <Volume2 className="w-9 h-9" style={{ color: '#FFFFFF' }} />
        </button>
        <div className="flex items-center gap-1.5 h-8">
          {WAVE_HEIGHTS.map((h, i) => (
            <span
              key={i}
              className="block w-1.5 rounded-full transition-all duration-150"
              style={{
                height: isPlaying ? `${h}px` : '4px',
                background: isPlaying ? 'var(--accent)' : '#4A5A7D',
              }}
            />
          ))}
        </div>
        <p className="text-xs font-semibold" style={{ color: '#C7D0E4' }}>
          {!hasPlayedCurrentRound ? 'Sesi duymak için dokunun' : 'Şimdi doğru kuşu seçin'}
        </p>
      </div>

      {/* Seçenek listesi (gerçek fotoğraflı) */}
      <div className="space-y-2.5">
        {options.map((option) => {
          const isSelected = selectedBirdId === option.id;
          const isTarget = option.id === targetBird.id;

          let style: { bg: string; border: string; fg: string } = { bg: '#FFFFFF', border: '#E6E0D6', fg: '#1C1B19' };
          let borderWidth = 1;
          if (selectedBirdId !== null) {
            if (isTarget) {
              style = CORRECT;
              borderWidth = 3;
            } else if (isSelected) {
              style = WRONG;
              borderWidth = 3;
            } else {
              style = { bg: '#FFFFFF', border: '#F2EEE7', fg: '#A39C91' };
            }
          }

          return (
            <button
              key={option.id}
              id={`audio-option-${option.id}`}
              disabled={selectedBirdId !== null}
              onClick={() => handleSelectOption(option)}
              style={{ background: style.bg, borderWidth, borderStyle: 'solid', borderColor: style.border, color: style.fg }}
              className="w-full min-h-[64px] rounded-[18px] pl-2.5 pr-4 py-2 flex items-center gap-3 text-left transition-all"
            >
              <div className="w-12 h-12 rounded-[14px] overflow-hidden shrink-0" style={{ background: '#F7F4EE' }}>
                <BirdPhoto
                  src={option.imageUrl}
                  fallbackSrc={option.fallbackImageUrl}
                  alt={option.name}
                  birdId={option.id}
                  aspectRatio="square"
                  className="w-full h-full rounded-[14px]"
                />
              </div>
              <div className="flex-grow min-w-0">
                <span className="font-bold text-sm block truncate">{option.name}</span>
                <span className="text-[11px] block truncate" style={{ color: selectedBirdId !== null ? style.fg : '#6B665E' }}>
                  {option.category}
                </span>
              </div>
              {selectedBirdId !== null && isTarget && <Check className="w-5 h-5 shrink-0" strokeWidth={3} style={{ color: style.border }} />}
              {selectedBirdId !== null && isSelected && !isTarget && <X className="w-5 h-5 shrink-0" strokeWidth={3} style={{ color: style.border }} />}
            </button>
          );
        })}
      </div>

      {selectedBirdId !== null && (
        <CheckBar
          correct={Boolean(isCorrect)}
          message={isCorrect ? 'Doğru cevap!' : `Doğru: ${targetBird.name} — ${targetBird.voiceDescription}`}
          onNext={() => setRound((prev) => prev + 1)}
        />
      )}

      <button
        type="button"
        onClick={() => handlePlaySound()}
        className="flex items-center gap-1.5 text-xs font-bold mx-auto"
        style={{ color: '#6B665E' }}
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Sesi tekrar çal</span>
      </button>
    </div>
  );
};
