import React, { useState } from 'react';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  LayoutGrid,
  CreditCard,
  MapPin,
  Utensils,
  Check,
  RotateCcw,
} from 'lucide-react';
import { TURKEY_BIRDS, BirdSpecies } from '../data/birds';
import { birdAudioSynth } from '../utils/audioSynth';
import { BirdPhoto } from './BirdPhoto';
import { CORRECT, WRONG } from '../../../components/ui';

interface BirdFlashcardProps {
  onLearnToggle?: (id: string) => void;
  learnedBirds?: string[];
  onOpenDetails?: (bird: BirdSpecies) => void;
}

/** E5 (Etkinlik — Kartlar) dili: büyük odak kart + alt "Tekrar / Biliyorum" ikilisi. */
export const BirdFlashcard: React.FC<BirdFlashcardProps> = ({
  onOpenDetails,
  onLearnToggle,
  learnedBirds = [],
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Hepsi');
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories = ['Hepsi', 'Sulak Alan', 'Yırtıcı', 'Ötücü & Orman', 'Bozkır & Yer'];

  const filteredBirds = TURKEY_BIRDS.filter((b) => {
    if (selectedCategory === 'Hepsi') return true;
    if (selectedCategory === 'Ötücü & Orman') return b.category === 'Ötücü & Orman';
    if (selectedCategory === 'Bozkır & Yer') return b.category === 'Bozkır & Yer' || b.category === 'Gökyüzü Avcısı';
    return b.category === selectedCategory;
  });

  const currentBird = filteredBirds[currentIndex] || filteredBirds[0];
  const isLearned = currentBird && learnedBirds.includes(currentBird.id);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredBirds.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredBirds.length) % filteredBirds.length);
  };

  const handlePlayAudio = (birdId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPlayingId(birdId);
    birdAudioSynth.playBirdCall(birdId);
    setTimeout(() => setPlayingId(null), 2000);
  };

  const handleKnowIt = () => {
    if (currentBird && !isLearned && onLearnToggle) onLearnToggle(currentBird.id);
    handleNext();
  };

  return (
    <div className="space-y-4">
      {/* Üst Kontrol Çubuğu: Kategori Filtresi + Görünüm Değiştirici */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 p-1 rounded-[16px] overflow-x-auto max-w-full" style={{ background: '#EDE6DB' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat}`}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
              }}
              style={{ background: selectedCategory === cat ? '#FFFFFF' : 'transparent', color: selectedCategory === cat ? '#1C1B19' : '#6B665E' }}
              className="px-3 py-1.5 rounded-[12px] text-xs font-bold whitespace-nowrap transition-all"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 p-1 rounded-[16px]" style={{ background: '#EDE6DB' }}>
          <button
            id="view-mode-card-btn"
            onClick={() => setViewMode('card')}
            title="Kart Görünümü"
            style={{ background: viewMode === 'card' ? '#FFFFFF' : 'transparent', color: '#1C1B19' }}
            className="p-1.5 rounded-[12px] transition-all"
          >
            <CreditCard className="w-4 h-4" />
          </button>
          <button
            id="view-mode-grid-btn"
            onClick={() => setViewMode('grid')}
            title="Galeri Izgarası"
            style={{ background: viewMode === 'grid' ? '#FFFFFF' : 'transparent', color: '#1C1B19' }}
            className="p-1.5 rounded-[12px] transition-all"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= GÖRÜNÜM 1: ODAK KARTI ================= */}
      {viewMode === 'card' && currentBird && (
        <div className="space-y-3">
          <span className="text-sm font-bold block" style={{ color: '#6B665E' }}>
            Kart {currentIndex + 1} / {filteredBirds.length}
          </span>

          <div className="rounded-[28px] bg-white overflow-hidden" style={{ border: '1px solid #E6E0D6' }}>
            <div className="relative aspect-[4/3] w-full" style={{ background: '#F7F4EE' }}>
              <BirdPhoto
                src={currentBird.imageUrl}
                fallbackSrc={currentBird.fallbackImageUrl}
                alt={currentBird.name}
                birdId={currentBird.id}
                aspectRatio="auto"
                className="w-full h-full"
              />

              <div className="absolute top-4 left-4 flex items-center gap-1.5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-xs ${currentBird.color.badgeBg} ${currentBird.color.badgeText}`}>
                  {currentBird.category}
                </span>
                {isLearned && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: CORRECT.bg, color: CORRECT.fg }}>
                    <Check className="w-3 h-3" strokeWidth={3} />
                    Öğrenildi
                  </span>
                )}
              </div>

              <button
                id="open-modal-from-card-btn"
                onClick={() => onOpenDetails && onOpenDetails(currentBird)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors"
                style={{ background: 'rgba(28,27,25,0.5)' }}
                title="Tam Ekran İncele"
                aria-label="Detayları aç"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <h3 className="font-display text-2xl font-extrabold" style={{ color: '#1C1B19' }}>
                  {currentBird.name}
                </h3>
                <p className="text-xs italic mt-0.5" style={{ color: '#6B665E' }}>
                  {currentBird.scientificName} • {currentBird.family}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 p-2.5 rounded-[16px]" style={{ background: '#FAF8F5', border: '1px solid #E6E0D6' }}>
                  <Utensils className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider" style={{ color: '#77716A' }}>Gaga & Beslenme</span>
                    <span className="font-bold" style={{ color: '#1C1B19' }}>{currentBird.beakType}</span>
                    <span className="block text-[11px]" style={{ color: '#6B665E' }}>{currentBird.diet}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-[16px]" style={{ background: '#FAF8F5', border: '1px solid #E6E0D6' }}>
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider" style={{ color: '#77716A' }}>Yaşam Alanı</span>
                    <span className="font-bold" style={{ color: '#1C1B19' }}>{currentBird.habitat}</span>
                  </div>
                </div>

                <p className="p-2.5 rounded-[16px] leading-relaxed" style={{ background: '#FAF8F5', border: '1px solid #E6E0D6', color: '#6B665E' }}>
                  <strong style={{ color: '#1C1B19' }}>Öne Çıkan:</strong> {currentBird.features[0]}
                </p>
              </div>

              <button
                id={`play-sound-${currentBird.id}`}
                onClick={(e) => handlePlayAudio(currentBird.id, e)}
                style={{
                  background: playingId === currentBird.id ? 'var(--accent)' : 'var(--accent-light)',
                  color: playingId === currentBird.id ? '#FFFFFF' : 'var(--accent)',
                }}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-[16px] text-xs font-bold transition-all"
              >
                <Volume2 className={`w-4 h-4 ${playingId === currentBird.id ? 'animate-spin' : ''}`} />
                <span>{playingId === currentBird.id ? 'Ses Çalıyor...' : 'Kuş Sesini Dinle'}</span>
              </button>
            </div>
          </div>

          {/* Navigasyon Okları & Mini Küçük Resimler */}
          <div className="flex items-center justify-between gap-2">
            <button
              id="prev-bird-btn"
              onClick={handlePrev}
              aria-label="Önceki kuş"
              className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0"
              style={{ background: '#FFFFFF', border: '1px solid #E6E0D6' }}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: '#1C1B19' }} />
            </button>

            <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 max-w-[65%]">
              {filteredBirds.map((b, idx) => (
                <button
                  key={b.id}
                  id={`thumbnail-${b.id}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={b.name}
                  className="w-10 h-10 rounded-[14px] overflow-hidden shrink-0 transition-all relative"
                  style={{
                    borderWidth: 2,
                    borderStyle: 'solid',
                    borderColor: idx === currentIndex ? 'var(--accent)' : 'transparent',
                    opacity: idx === currentIndex ? 1 : 0.6,
                  }}
                >
                  <img
                    src={b.imageUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (b.fallbackImageUrl && e.currentTarget.src !== b.fallbackImageUrl) {
                        e.currentTarget.src = b.fallbackImageUrl;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  {learnedBirds.includes(b.id) && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: CORRECT.border }}>
                      <Check className="w-2 h-2" strokeWidth={4} style={{ color: '#FFFFFF' }} />
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button
              id="next-bird-btn"
              onClick={handleNext}
              aria-label="Sonraki kuş"
              className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0"
              style={{ background: '#FFFFFF', border: '1px solid #E6E0D6' }}
            >
              <ChevronRight className="w-4 h-4" style={{ color: '#1C1B19' }} />
            </button>
          </div>

          {/* Tekrar / Biliyorum */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleNext}
              style={{ background: WRONG.bg, border: `2px solid ${WRONG.border}`, color: WRONG.fg }}
              className="h-[60px] rounded-[18px] flex items-center justify-center gap-2 font-extrabold text-sm"
            >
              <RotateCcw className="w-5 h-5" strokeWidth={2.4} />
              <span>Tekrar</span>
            </button>
            <button
              type="button"
              onClick={handleKnowIt}
              style={{ background: CORRECT.bg, border: `2px solid ${CORRECT.border}`, color: CORRECT.fg }}
              className="h-[60px] rounded-[18px] flex items-center justify-center gap-2 font-extrabold text-sm"
            >
              <Check className="w-5 h-5" strokeWidth={3} />
              <span>Biliyorum</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= GÖRÜNÜM 2: GALERİ IZGARASI ================= */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredBirds.map((b) => {
            const isPlaying = playingId === b.id;
            const learned = learnedBirds.includes(b.id);
            return (
              <div
                key={b.id}
                id={`grid-bird-${b.id}`}
                onClick={() => onOpenDetails && onOpenDetails(b)}
                className="cursor-pointer rounded-[20px] overflow-hidden flex flex-col"
                style={{ background: '#FFFFFF', border: '1px solid #E6E0D6' }}
              >
                <div className="relative aspect-square w-full" style={{ background: '#F7F4EE' }}>
                  <BirdPhoto
                    src={b.imageUrl}
                    fallbackSrc={b.fallbackImageUrl}
                    alt={b.name}
                    birdId={b.id}
                    aspectRatio="square"
                  />
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md ${b.color.badgeBg} ${b.color.badgeText}`}>
                    {b.category}
                  </span>
                  {learned && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: CORRECT.border }}>
                      <Check className="w-3 h-3" strokeWidth={3} style={{ color: '#FFFFFF' }} />
                    </span>
                  )}
                </div>

                <div className="p-3 flex flex-col justify-between grow gap-2">
                  <div>
                    <h4 className="font-bold text-sm truncate" style={{ color: '#1C1B19' }}>{b.name}</h4>
                    <p className="text-[11px] truncate" style={{ color: '#6B665E' }}>{b.beakType}</p>
                  </div>

                  <button
                    id={`grid-play-${b.id}`}
                    onClick={(e) => handlePlayAudio(b.id, e)}
                    style={{ background: isPlaying ? 'var(--accent)' : '#FAF8F5', color: isPlaying ? '#FFFFFF' : '#1C1B19', border: isPlaying ? 'none' : '1px solid #E6E0D6' }}
                    className="w-full py-1.5 px-2 rounded-[14px] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
                    <span>{isPlaying ? 'Çalıyor' : 'Sesi Dinle'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
