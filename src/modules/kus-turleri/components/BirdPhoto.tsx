import React, { useState, useEffect } from 'react';
import { BirdIllustration } from './BirdIllustration';

interface BirdPhotoProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  birdId: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  objectFit?: 'cover' | 'contain';
}

export const BirdPhoto: React.FC<BirdPhotoProps> = ({
  src,
  fallbackSrc,
  alt,
  birdId,
  className = '',
  aspectRatio = 'square',
  objectFit = 'cover'
}) => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
    setIsLoading(false);
  };

  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-3/4',
    auto: ''
  }[aspectRatio];

  if (hasError) {
    return (
      <div className={`relative overflow-hidden flex items-center justify-center bg-stone-100 rounded-2xl ${aspectClass} ${className}`}>
        <BirdIllustration birdId={birdId} size="md" />
        <div className="absolute bottom-2 inset-x-2 text-center">
          <span className="px-2 py-0.5 rounded-md bg-black/40 text-white text-[10px] backdrop-blur-xs font-medium">
            İllüstrasyon Görünümü
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-stone-100 rounded-2xl ${aspectClass} ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-stone-200/80 animate-pulse flex items-center justify-center z-10">
          <span className="text-stone-400 text-xs font-medium">Fotoğraf yükleniyor...</span>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        className={`w-full h-full transition-transform duration-500 ease-out hover:scale-105 ${
          objectFit === 'cover' ? 'object-cover' : 'object-contain'
        } ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};
