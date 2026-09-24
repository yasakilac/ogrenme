import React, { useState } from 'react';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  LayoutGrid,
  CreditCard,
  MapPin,
  Utensils
} from 'lucide-react';
import { TURKEY_BIRDS, BirdSpecies } from '../data/birds';
import { birdAudioSynth } from '../utils/audioSynth';
import { BirdPhoto } from './BirdPhoto';

interface BirdFlashcardProps {
  onLearnToggle?: (id: string) => void;
  learnedBirds?: string[];
  onOpenDetails?: (bird: BirdSpecies) => void;
}

export const BirdFlashcard: React.FC<BirdFlashcardProps> = ({
  onOpenDetails
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Üst Kontrol Çubuğu (Kategori Filtresi + Görünüm Değiştirici) */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Kategori Hapları */}
        <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-[16px] overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat}`}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Görünüm Geçişi: Tek Kart vs Galeri Izgarası */}
        <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-[16px]">
          <button
            id="view-mode-card-btn"
            onClick={() => setViewMode('card')}
            title="Kart Görünümü"
            className={`p-1.5 rounded-lg text-xs transition-all ${
              viewMode === 'card' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
          </button>
          <button
            id="view-mode-grid-btn"
            onClick={() => setViewMode('grid')}
            title="Galeri Izgarası"
            className={`p-1.5 rounded-lg text-xs transition-all ${
              viewMode === 'grid' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= GÖRÜNÜM 1: BÜYÜK FOTOĞRAFLI ODAK KARTI ================= */}
      {viewMode === 'card' && currentBird && (
        <div className="space-y-4">
          <div className="bg-white rounded-[24px] border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Gerçek Fotoğraf Alanı */}
              <div className="relative aspect-4/3 md:aspect-auto md:h-full bg-stone-100 group overflow-hidden">
                <BirdPhoto
                  src={currentBird.imageUrl}
                  fallbackSrc={currentBird.fallbackImageUrl}
                  alt={currentBird.name}
                  birdId={currentBird.id}
                  aspectRatio="auto"
                  className="w-full h-full"
                />

                {/* Kategori Rozeti */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-xs ${currentBird.color.badgeBg} ${currentBird.color.badgeText}`}>
                    {currentBird.category}
                  </span>
                </div>

                {/* Detay Büyüteç Butonu */}
                <button
                  id="open-modal-from-card-btn"
                  onClick={() => onOpenDetails && onOpenDetails(currentBird)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors"
                  title="Tam Ekran İncele"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bilgi ve Eylem Alanı (Sade & Kısa Metinler) */}
              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 tracking-tight">
                      {currentBird.name}
                    </h3>
                    <p className="text-xs text-stone-500 italic mt-0.5">
                      {currentBird.scientificName} • {currentBird.family}
                    </p>
                  </div>

                  {/* 2 Temel Özet Kartı */}
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-[16px] border border-stone-100">
                      <Utensils className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Gaga & Beslenme</span>
                        <span className="font-semibold text-stone-800">{currentBird.beakType}</span>
                        <span className="text-stone-500 block text-[11px]">{currentBird.diet}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-[16px] border border-stone-100">
                      <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Yaşam Alanı</span>
                        <span className="font-semibold text-stone-800">{currentBird.habitat}</span>
                      </div>
                    </div>
                  </div>

                  {/* Önemli Tek Özellik */}
                  <p className="text-xs text-stone-600 bg-stone-50/50 p-2.5 rounded-[16px] border border-stone-100">
                    💡 <strong className="text-stone-800">Öne Çıkan:</strong> {currentBird.features[0]}
                  </p>
                </div>

                {/* Ses Çalma & Detay Butonu */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    id={`play-sound-${currentBird.id}`}
                    onClick={(e) => handlePlayAudio(currentBird.id, e)}
                    className={`grow flex items-center justify-center gap-2 py-2.5 px-4 rounded-[16px] text-xs font-semibold transition-all ${
                      playingId === currentBird.id
                        ? 'bg-[var(--accent)] text-white shadow-xs'
                        : 'bg-[var(--accent-light)] text-[var(--accent)] hover:bg-[var(--accent-light)] border border-[var(--accent)]/30'
                    }`}
                  >
                    <Volume2 className={`w-4 h-4 ${playingId === currentBird.id ? 'animate-spin' : ''}`} />
                    <span>{playingId === currentBird.id ? 'Ses Çalıyor...' : 'Kuş Sesini Dinle'}</span>
                  </button>

                  <button
                    id="card-details-btn"
                    onClick={() => onOpenDetails && onOpenDetails(currentBird)}
                    className="px-4 py-2.5 rounded-[16px] text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors"
                  >
                    Detay
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigasyon Okları & Mini Küçük Resimler */}
          <div className="flex items-center justify-between gap-2">
            <button
              id="prev-bird-btn"
              onClick={handlePrev}
              className="flex items-center gap-1 px-3 py-2 rounded-[16px] text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Önceki</span>
            </button>

            {/* Yatay Küçük Resim Listesi */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 max-w-[65%] scrollbar-none">
              {filteredBirds.map((b, idx) => (
                <button
                  key={b.id}
                  id={`thumbnail-${b.id}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-10 h-10 rounded-[16px] overflow-hidden shrink-0 border-2 transition-all ${
                    idx === currentIndex
                      ? 'border-[var(--accent)] scale-105 shadow-xs'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={b.imageUrl}
                    alt={b.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (b.fallbackImageUrl && e.currentTarget.src !== b.fallbackImageUrl) {
                        e.currentTarget.src = b.fallbackImageUrl;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <button
              id="next-bird-btn"
              onClick={handleNext}
              className="flex items-center gap-1 px-3 py-2 rounded-[16px] text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              <span>Sonraki</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= GÖRÜNÜM 2: TÜM TÜRLER GALERİ IZGARASI ================= */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {filteredBirds.map((b) => {
            const isPlaying = playingId === b.id;
            return (
              <div
                key={b.id}
                id={`grid-bird-${b.id}`}
                onClick={() => onOpenDetails && onOpenDetails(b)}
                className="group cursor-pointer bg-white rounded-[20px] border border-stone-200/80 overflow-hidden shadow-2xs hover:shadow-sm hover:border-stone-300 transition-all flex flex-col"
              >
                {/* Gerçek Fotoğraf */}
                <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                  <BirdPhoto
                    src={b.imageUrl}
                    fallbackSrc={b.fallbackImageUrl}
                    alt={b.name}
                    birdId={b.id}
                    aspectRatio="square"
                  />
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md ${b.color.badgeBg} ${b.color.badgeText}`}>
                    {b.category}
                  </span>
                </div>

                {/* Kart Özeti */}
                <div className="p-3 flex flex-col justify-between grow space-y-2">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-[var(--accent)] transition-colors truncate">
                      {b.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">{b.beakType}</p>
                  </div>

                  {/* Ses Çalma Butonu */}
                  <button
                    id={`grid-play-${b.id}`}
                    onClick={(e) => handlePlayAudio(b.id, e)}
                    className={`w-full py-1.5 px-2 rounded-[16px] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isPlaying
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-stone-50 hover:bg-[var(--accent-light)] text-stone-700 hover:text-[var(--accent)] border border-stone-200'
                    }`}
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
