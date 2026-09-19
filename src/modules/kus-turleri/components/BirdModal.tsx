import React, { useState } from 'react';
import { X, Volume2, MapPin, Feather, Utensils } from 'lucide-react';
import { BirdSpecies } from '../data/birds';
import { BirdPhoto } from './BirdPhoto';
import { birdAudioSynth } from '../utils/audioSynth';

interface BirdModalProps {
  bird: BirdSpecies | null;
  onClose: () => void;
}

export const BirdModal: React.FC<BirdModalProps> = ({ bird, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!bird) return null;

  const handlePlayAudio = () => {
    setIsPlaying(true);
    birdAudioSynth.playBirdCall(bird.id);
    setTimeout(() => setIsPlaying(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Görsel Başlık */}
        <div className="relative h-64 sm:h-72 w-full bg-stone-100">
          <BirdPhoto
            src={bird.imageUrl}
            fallbackSrc={bird.fallbackImageUrl}
            alt={bird.name}
            birdId={bird.id}
            aspectRatio="auto"
            className="w-full h-full rounded-none"
          />

          {/* Kapat Butonu */}
          <button
            id="close-bird-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Kategori Etiketi */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-xs ${bird.color.badgeBg} ${bird.color.badgeText}`}>
              {bird.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-md">
              {bird.conservationStatus}
            </span>
          </div>
        </div>

        {/* Gövde - Sadeleştirilmiş Bilgiler */}
        <div className="p-6 overflow-y-auto space-y-5 text-stone-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold font-serif text-stone-900 tracking-tight">{bird.name}</h3>
              <p className="text-xs text-stone-500 italic mt-0.5">{bird.scientificName} • {bird.family}</p>
            </div>

            <button
              id="modal-play-sound-btn"
              onClick={handlePlayAudio}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                isPlaying
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
              <span>{isPlaying ? 'Çalıyor' : 'Sesi Dinle'}</span>
            </button>
          </div>

          {/* Temel Özellik Rozetleri */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-0.5">
              <span className="text-stone-400 font-medium flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-stone-600" />
                <span>Gaga Yapısı</span>
              </span>
              <p className="font-semibold text-stone-900">{bird.beakType}</p>
              <p className="text-stone-600 text-[11px] leading-tight">{bird.beakAdaptation}</p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-0.5">
              <span className="text-stone-400 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-600" />
                <span>Yaşam Alanı</span>
              </span>
              <p className="font-semibold text-stone-900">{bird.habitat}</p>
              <p className="text-stone-600 text-[11px] leading-tight">Besin: {bird.diet}</p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-0.5">
              <span className="text-stone-400 font-medium flex items-center gap-1">
                <Feather className="w-3.5 h-3.5 text-stone-600" />
                <span>Boyut & Kanat</span>
              </span>
              <p className="font-semibold text-stone-900 font-mono text-[13px]">{bird.wingspan}</p>
              <p className="text-stone-500 text-[11px]">Ağırlık: {bird.weight}</p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-0.5">
              <span className="text-stone-400 font-medium flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-stone-600" />
                <span>Ses Özelliği</span>
              </span>
              <p className="text-stone-800 text-[11px] italic leading-tight pt-1">{bird.voiceDescription}</p>
            </div>
          </div>

          {/* Ayırt Edici Noktalar */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Öne Çıkan Özellikler</span>
            {bird.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
