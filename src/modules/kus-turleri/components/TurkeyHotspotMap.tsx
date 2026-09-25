import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Volume2,
  Sparkles,
  Compass,
  ArrowRight,
  Globe,
  RotateCcw,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { TURKEY_HOTSPOTS, TURKEY_BIRDS, HotspotLocation, BirdSpecies } from '../data/birds';
import { BirdPhoto } from './BirdPhoto';
import { birdAudioSynth } from '../utils/audioSynth';

interface TurkeyHotspotMapProps {
  onSelectBird?: (bird: BirdSpecies) => void;
}

type TileLayerType = 'voyager' | 'satellite' | 'osm';

const TILE_LAYERS: Record<TileLayerType, { name: string; url: string; attribution: string }> = {
  voyager: {
    name: 'Doğa',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
  },
  satellite: {
    name: 'Uydu',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  osm: {
    name: 'Standart',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
};

const TURKEY_CENTER: [number, number] = [39.0, 35.3];
const TURKEY_DEFAULT_ZOOM = 6;

/** E2 (Etkinlik — Hotspot) dili: üstte seçili kuş kartı, altta gerçek Leaflet haritası + detay paneli korunur. */
export const TurkeyHotspotMap: React.FC<TurkeyHotspotMapProps> = ({ onSelectBird }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [selectedHotspotId, setSelectedHotspotId] = useState<string>('tuz-golu');
  const [activeBirdFilter, setActiveBirdFilter] = useState<string | null>(null);
  const [activeTileLayer, setActiveTileLayer] = useState<TileLayerType>('voyager');
  const [playingBirdId, setPlayingBirdId] = useState<string | null>(null);

  const selectedHotspot = TURKEY_HOTSPOTS.find((h) => h.id === selectedHotspotId) || TURKEY_HOTSPOTS[0];
  const primaryBird = TURKEY_BIRDS.find((b) => b.id === selectedHotspot.primaryBirdId);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: TURKEY_CENTER,
      zoom: TURKEY_DEFAULT_ZOOM,
      minZoom: 5,
      maxZoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    const tile = L.tileLayer(TILE_LAYERS[activeTileLayer].url, {
      attribution: TILE_LAYERS[activeTileLayer].attribution,
      maxZoom: 18
    }).addTo(map);

    tileLayerRef.current = tile;
    mapInstanceRef.current = map;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const newTile = L.tileLayer(TILE_LAYERS[activeTileLayer].url, {
      attribution: TILE_LAYERS[activeTileLayer].attribution,
      maxZoom: 18
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTile;
  }, [activeTileLayer]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    TURKEY_HOTSPOTS.forEach((spot) => {
      const isSelected = spot.id === selectedHotspotId;
      const primary = TURKEY_BIRDS.find((b) => b.id === spot.primaryBirdId);

      const isMatchingFilter = activeBirdFilter ? spot.birdIds.includes(activeBirdFilter) : true;

      const customHtml = `
        <div class="relative flex items-center justify-center transition-transform ${
          isSelected ? 'scale-125 z-50' : 'scale-100'
        } ${isMatchingFilter ? 'opacity-100' : 'opacity-35'}">
          ${
            isSelected
              ? '<div class="absolute -inset-2 rounded-full bg-[var(--accent)]/30 animate-ping"></div>'
              : ''
          }
          <div class="w-8 h-8 rounded-full border-2 shadow-lg flex items-center justify-center font-bold text-xs cursor-pointer ${
            isSelected
              ? 'bg-[var(--accent)] border-white text-white ring-4 ring-[var(--accent)]'
              : isMatchingFilter
              ? 'bg-[#1C1B19] border-white text-white hover:scale-110 hover:bg-[var(--accent)]'
              : 'bg-[#A39C91] border-white text-white'
          }">
            <span>${primary?.name.substring(0, 1) || '🪶'}</span>
          </div>
          <div class="absolute top-9 whitespace-nowrap px-1.5 py-0.5 rounded-md text-[10px] font-bold shadow-xs pointer-events-none ${
            isSelected
              ? 'bg-[var(--accent)] text-white shadow-md'
              : 'bg-white/95 text-[#1C1B19] border border-[#E6E0D6]'
          }">
            ${spot.name.split(' ')[0]}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-bird-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedHotspotId(spot.id);
          map.flyTo([spot.lat, spot.lng], Math.max(map.getZoom(), 8), { duration: 1.0 });
        });

      markersRef.current[spot.id] = marker;
    });
  }, [selectedHotspotId, activeBirdFilter]);

  const handleSelectHotspot = (spot: HotspotLocation) => {
    setSelectedHotspotId(spot.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([spot.lat, spot.lng], 9, { duration: 1.2 });
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(TURKEY_CENTER, TURKEY_DEFAULT_ZOOM, { duration: 1.0 });
    }
    setActiveBirdFilter(null);
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handlePlaySound = (birdId: string) => {
    setPlayingBirdId(birdId);
    birdAudioSynth.playBirdCall(birdId);
    setTimeout(() => setPlayingBirdId(null), 1800);
  };

  const handleFilterBird = (birdId: string | null) => {
    setActiveBirdFilter(birdId);

    if (birdId && mapInstanceRef.current) {
      const matchingSpots = TURKEY_HOTSPOTS.filter((h) => h.birdIds.includes(birdId));
      if (matchingSpots.length > 0) {
        if (matchingSpots.length === 1) {
          handleSelectHotspot(matchingSpots[0]);
        } else {
          const group = L.featureGroup(matchingSpots.map((s) => L.marker([s.lat, s.lng])));
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.3));
          setSelectedHotspotId(matchingSpots[0].id);
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Seçili kuş kartı (E2 üst şerit) */}
      {primaryBird && (
        <div
          className="h-[84px] rounded-[22px] px-4 flex items-center gap-3.5"
          style={{ background: '#FFFFFF', border: '1px solid #E6E0D6' }}
        >
          <div className="w-14 h-14 rounded-[16px] overflow-hidden shrink-0" style={{ background: 'var(--accent-light)' }}>
            <BirdPhoto
              src={primaryBird.imageUrl}
              fallbackSrc={primaryBird.fallbackImageUrl}
              alt={primaryBird.name}
              birdId={primaryBird.id}
              aspectRatio="square"
            />
          </div>
          <div className="flex-grow min-w-0">
            <span className="font-display text-lg font-extrabold block truncate" style={{ color: '#1C1B19' }}>
              {primaryBird.name}
            </span>
            <span className="text-xs font-semibold truncate block" style={{ color: '#6B665E' }}>
              {selectedHotspot.name} · {selectedHotspot.city}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handlePlaySound(primaryBird.id)}
            aria-label={`${primaryBird.name} sesini dinle`}
            className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
            style={{ background: playingBirdId === primaryBird.id ? 'var(--accent)' : 'var(--accent-light)', color: playingBirdId === primaryBird.id ? '#FFFFFF' : 'var(--accent)' }}
          >
            <Volume2 className={`w-5 h-5 ${playingBirdId === primaryBird.id ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}

      {/* Harita Katmanı + Kuş Filtre Çubuğu */}
      <div className="rounded-[22px] p-3 space-y-3" style={{ background: '#FFFFFF', border: '1px solid #E6E0D6' }}>
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: '#77716A' }}>
            <Globe className="w-3.5 h-3.5" />
            Harita
          </span>
          <div className="flex items-center gap-1 p-1 rounded-[14px]" style={{ background: '#EDE6DB' }}>
            {(Object.keys(TILE_LAYERS) as TileLayerType[]).map((layerKey) => (
              <button
                key={layerKey}
                id={`btn-layer-${layerKey}`}
                onClick={() => setActiveTileLayer(layerKey)}
                style={{ background: activeTileLayer === layerKey ? '#FFFFFF' : 'transparent', color: '#1C1B19' }}
                className="px-2.5 py-1 rounded-[10px] text-[11px] font-bold transition-all"
              >
                {TILE_LAYERS[layerKey].name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider shrink-0" style={{ color: '#A39C91' }}>
            <Compass className="w-3.5 h-3.5" />
          </span>
          <button
            id="filter-all-birds"
            onClick={() => handleFilterBird(null)}
            style={{ background: activeBirdFilter === null ? 'var(--accent)' : '#F7F4EE', color: activeBirdFilter === null ? '#FFFFFF' : '#6B665E' }}
            className="px-2.5 py-1.5 rounded-[12px] text-[11px] font-bold shrink-0"
          >
            Tümü ({TURKEY_HOTSPOTS.length})
          </button>
          {TURKEY_BIRDS.map((bird) => {
            const isSelected = activeBirdFilter === bird.id;
            return (
              <button
                key={bird.id}
                id={`filter-bird-${bird.id}`}
                onClick={() => handleFilterBird(isSelected ? null : bird.id)}
                style={{ background: isSelected ? '#1C1B19' : '#F7F4EE', color: isSelected ? '#FFFFFF' : '#6B665E' }}
                className="px-2.5 py-1.5 rounded-[12px] text-[11px] font-bold shrink-0"
              >
                {bird.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gerçek Leaflet Haritası */}
      <div className="rounded-[26px] overflow-hidden relative" style={{ border: '1px solid #E6E0D6' }}>
        <div ref={mapContainerRef} id="turkey-real-leaflet-map" className="w-full h-[280px] z-10" style={{ background: '#D6E9EE' }} />

        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          <div className="rounded-[16px] shadow-md p-1 flex flex-col" style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #E6E0D6' }}>
            <button id="btn-zoom-in" onClick={handleZoomIn} title="Yakınlaştır" aria-label="Yakınlaştır" className="w-8 h-8 flex items-center justify-center font-bold text-lg rounded-[10px]" style={{ color: '#1C1B19' }}>+</button>
            <div className="h-px mx-1" style={{ background: '#E6E0D6' }}></div>
            <button id="btn-zoom-out" onClick={handleZoomOut} title="Uzaklaştır" aria-label="Uzaklaştır" className="w-8 h-8 flex items-center justify-center font-bold text-lg rounded-[10px]" style={{ color: '#1C1B19' }}>−</button>
          </div>
          <button
            id="btn-reset-map-view"
            onClick={handleResetView}
            title="Türkiye Genel Görünümüne Dön"
            aria-label="Genel görünüme dön"
            className="rounded-[16px] shadow-md p-2 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #E6E0D6', color: '#1C1B19' }}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
          <div className="px-3 py-2 rounded-[16px] flex items-center justify-between text-xs" style={{ background: 'rgba(28,27,25,0.8)', color: '#FFFFFF' }}>
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
              <span className="font-semibold truncate">{selectedHotspot.name}</span>
            </div>
            <MapPin className="w-3.5 h-3.5 shrink-0 opacity-60" />
          </div>
        </div>
      </div>

      {/* Seçili Hotspot Detay Paneli */}
      <div className="rounded-[24px] p-4 space-y-3.5" style={{ background: '#FFFFFF', border: '1px solid #E6E0D6' }}>
        <div className="flex items-center justify-between gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            {selectedHotspot.region} • {selectedHotspot.city}
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-[10px] flex items-center gap-1" style={{ color: 'var(--accent)', background: 'var(--accent-light)' }}>
            <ShieldCheck className="w-3 h-3" />
            {selectedHotspot.density}
          </span>
        </div>

        <div>
          <h3 className="font-display text-lg font-extrabold" style={{ color: '#1C1B19' }}>{selectedHotspot.name}</h3>
          <p className="text-xs font-medium" style={{ color: '#6B665E' }}>{selectedHotspot.habitatType}</p>
        </div>

        <div className="p-3 rounded-[18px] space-y-1" style={{ background: 'var(--accent-light)' }}>
          <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--accent)' }}>
            <Sparkles className="w-3.5 h-3.5" />
            Neden Burada Yoğunlar?
          </span>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--accent)' }}>{selectedHotspot.whyHotspot}</p>
        </div>

        <div className="space-y-2 text-xs">
          <p className="leading-relaxed" style={{ color: '#6B665E' }}>{selectedHotspot.description}</p>
          <div className="flex items-center justify-between text-[11px] pt-2" style={{ borderTop: '1px solid #F2EEE7' }}>
            <span style={{ color: '#A39C91' }}>En İyi Gözlem Dönemi:</span>
            <span className="font-bold" style={{ color: '#1C1B19' }}>{selectedHotspot.bestSeason}</span>
          </div>
        </div>

        <div className="space-y-2 pt-2" style={{ borderTop: '1px solid #F2EEE7' }}>
          <h4 className="text-[11px] font-bold uppercase tracking-wider flex items-center justify-between" style={{ color: '#1C1B19' }}>
            <span>Alandaki Kuşlar</span>
            <span className="font-normal" style={{ color: '#A39C91' }}>{selectedHotspot.birdIds.length} Tür</span>
          </h4>

          <div className="space-y-2">
            {selectedHotspot.birdIds.map((bId) => {
              const bird = TURKEY_BIRDS.find((b) => b.id === bId);
              if (!bird) return null;
              const isPlaying = playingBirdId === bird.id;

              return (
                <div key={bird.id} className="p-2.5 rounded-[18px] flex items-center justify-between gap-2.5" style={{ background: '#FAF8F5', border: '1px solid #F2EEE7' }}>
                  <button
                    type="button"
                    onClick={() => onSelectBird && onSelectBird(bird)}
                    className="flex items-center gap-2.5 min-w-0 grow text-left"
                  >
                    <div className="w-10 h-10 rounded-[14px] overflow-hidden shrink-0" style={{ border: '1px solid #E6E0D6' }}>
                      <BirdPhoto src={bird.imageUrl} fallbackSrc={bird.fallbackImageUrl} alt={bird.name} birdId={bird.id} aspectRatio="square" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold truncate" style={{ color: '#1C1B19' }}>{bird.name}</h5>
                      <p className="text-[10px] truncate" style={{ color: '#6B665E' }}>{bird.beakType}</p>
                    </div>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      id={`play-map-bird-${bird.id}`}
                      onClick={() => handlePlaySound(bird.id)}
                      title="Kuş Sesini Dinle"
                      aria-label={`${bird.name} sesini dinle`}
                      className="p-2 rounded-[12px] transition-all"
                      style={{ background: isPlaying ? 'var(--accent)' : '#FFFFFF', color: isPlaying ? '#FFFFFF' : '#1C1B19', border: isPlaying ? 'none' : '1px solid #E6E0D6' }}
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
                    </button>
                    {onSelectBird && (
                      <button
                        id={`open-modal-map-${bird.id}`}
                        onClick={() => onSelectBird(bird)}
                        title="Detaylı İncele"
                        aria-label={`${bird.name} detayını aç`}
                        className="p-2 rounded-[12px]"
                        style={{ background: '#FFFFFF', border: '1px solid #E6E0D6', color: '#1C1B19' }}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tüm Hotspotlar Hızlı Liste */}
      <div className="rounded-[22px] p-3.5 space-y-2" style={{ background: '#FFFFFF', border: '1px solid #E6E0D6' }}>
        <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#A39C91' }}>Tüm Türkiye Hotspotları</h4>
        <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
          {TURKEY_HOTSPOTS.map((h) => {
            const isCurrent = h.id === selectedHotspotId;
            return (
              <button
                key={h.id}
                onClick={() => handleSelectHotspot(h)}
                style={{ background: isCurrent ? 'var(--accent)' : '#F7F4EE', color: isCurrent ? '#FFFFFF' : '#1C1B19' }}
                className="p-2 rounded-[14px] text-left text-xs font-bold truncate transition-all"
              >
                {h.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
