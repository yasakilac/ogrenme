import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Volume2,
  Sparkles,
  Compass,
  ArrowRight,
  Layers,
  Globe,
  Maximize2,
  RotateCcw,
  ShieldCheck,
  Eye,
  Info
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
    name: 'Doğa & Coğrafya',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
  },
  satellite: {
    name: 'Gerçek Uydu',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  osm: {
    name: 'Standart Harita',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
};

const TURKEY_CENTER: [number, number] = [39.0, 35.3];
const TURKEY_DEFAULT_ZOOM = 6;

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

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent duplicate maps

    const map = L.map(mapContainerRef.current, {
      center: TURKEY_CENTER,
      zoom: TURKEY_DEFAULT_ZOOM,
      minZoom: 5,
      maxZoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    // Add Tile Layer
    const tile = L.tileLayer(TILE_LAYERS[activeTileLayer].url, {
      attribution: TILE_LAYERS[activeTileLayer].attribution,
      maxZoom: 18
    }).addTo(map);

    tileLayerRef.current = tile;
    mapInstanceRef.current = map;

    // Resize observer to ensure tiles render smoothly
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

  // Update Tile Layer when layer type changes
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

  // Update Markers on the map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    TURKEY_HOTSPOTS.forEach((spot) => {
      const isSelected = spot.id === selectedHotspotId;
      const primaryBird = TURKEY_BIRDS.find((b) => b.id === spot.primaryBirdId);
      
      const isMatchingFilter = activeBirdFilter
        ? spot.birdIds.includes(activeBirdFilter)
        : true;

      // Custom HTML Marker
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
              ? 'bg-stone-900 border-white text-white hover:scale-110 hover:bg-[var(--accent)]'
              : 'bg-stone-400 border-white text-white'
          }">
            <span>${primaryBird?.name.substring(0, 1) || '🪶'}</span>
          </div>
          <div class="absolute top-9 whitespace-nowrap px-1.5 py-0.5 rounded-md text-[10px] font-bold shadow-xs pointer-events-none ${
            isSelected
              ? 'bg-[var(--accent)] text-white shadow-md'
              : 'bg-white/95 text-stone-800 border border-stone-200'
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
          map.flyTo([spot.lat, spot.lng], Math.max(map.getZoom(), 8), {
            duration: 1.0
          });
        });

      markersRef.current[spot.id] = marker;
    });
  }, [selectedHotspotId, activeBirdFilter]);

  // Handle Zoom to selected hotspot
  const handleSelectHotspot = (spot: HotspotLocation) => {
    setSelectedHotspotId(spot.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([spot.lat, spot.lng], 9, {
        duration: 1.2
      });
    }
  };

  // Reset to full Turkey view
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(TURKEY_CENTER, TURKEY_DEFAULT_ZOOM, {
        duration: 1.0
      });
    }
    setActiveBirdFilter(null);
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  // Sound playback
  const handlePlaySound = (birdId: string) => {
    setPlayingBirdId(birdId);
    birdAudioSynth.playBirdCall(birdId);
    setTimeout(() => {
      setPlayingBirdId(null);
    }, 1800);
  };

  // Filter birds
  const handleFilterBird = (birdId: string | null) => {
    setActiveBirdFilter(birdId);

    if (birdId && mapInstanceRef.current) {
      const matchingSpots = TURKEY_HOTSPOTS.filter((h) => h.birdIds.includes(birdId));
      if (matchingSpots.length > 0) {
        if (matchingSpots.length === 1) {
          handleSelectHotspot(matchingSpots[0]);
        } else {
          const group = L.featureGroup(
            matchingSpots.map((s) => L.marker([s.lat, s.lng]))
          );
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.3));
          setSelectedHotspotId(matchingSpots[0].id);
        }
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık ve Harita Katmanı Seçici */}
      <div className="bg-white rounded-[24px] border border-stone-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-[16px] bg-[var(--accent)]/10 text-[var(--accent)]">
                <Globe className="w-5 h-5" />
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold text-stone-900">
                Türkiye Kuş Gözlem Hotspotları (Gerçek Harita)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Türkiye'nin tuzlu göllerinden subasar ormanlarına kadar gerçek coğrafi harita üzerinde kuşların yoğunlaştığı kritik yaşam alanlarını keşfedin.
            </p>
          </div>

          {/* Harita Katmanı Seçimi */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-[20px] border border-stone-200 self-start md:self-auto">
            {(Object.keys(TILE_LAYERS) as TileLayerType[]).map((layerKey) => (
              <button
                key={layerKey}
                id={`btn-layer-${layerKey}`}
                onClick={() => setActiveTileLayer(layerKey)}
                className={`px-3 py-1.5 rounded-[16px] text-xs font-semibold transition-all ${
                  activeTileLayer === layerKey
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {TILE_LAYERS[layerKey].name}
              </button>
            ))}
          </div>
        </div>

        {/* Kuş Filtre Çubuğu */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Türe Göre:</span>
          </span>

          <button
            id="filter-all-birds"
            onClick={() => handleFilterBird(null)}
            className={`px-3 py-1.5 rounded-[16px] text-xs font-semibold shrink-0 transition-all ${
              activeBirdFilter === null
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Tüm Hotspotlar ({TURKEY_HOTSPOTS.length})
          </button>

          {TURKEY_BIRDS.map((bird) => {
            const isSelected = activeBirdFilter === bird.id;
            return (
              <button
                key={bird.id}
                id={`filter-bird-${bird.id}`}
                onClick={() => handleFilterBird(isSelected ? null : bird.id)}
                className={`px-3 py-1.5 rounded-[16px] text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{bird.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-70">
                  ({bird.hotspotIds?.length || 1})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Harita ve Detay Paneli Düzeni */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sol Kolon: Gerçek Leaflet Haritası */}
        <div className="lg:col-span-8 bg-white rounded-[24px] border border-stone-200/80 overflow-hidden shadow-xs relative">
          {/* Leaflet Container */}
          <div
            ref={mapContainerRef}
            id="turkey-real-leaflet-map"
            className="w-full h-[460px] sm:h-[540px] z-10"
            style={{ background: '#e5e3df' }}
          />

          {/* Harita Üstü Kontroller */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <div className="bg-white/95 backdrop-blur-md rounded-[20px] shadow-md border border-stone-200/80 p-1 flex flex-col">
              <button
                id="btn-zoom-in"
                onClick={handleZoomIn}
                title="Yakınlaştır"
                className="w-8 h-8 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-100 rounded-[16px] transition-colors text-lg"
              >
                +
              </button>
              <div className="h-px bg-stone-200 mx-1"></div>
              <button
                id="btn-zoom-out"
                onClick={handleZoomOut}
                title="Uzaklaştır"
                className="w-8 h-8 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-100 rounded-[16px] transition-colors text-lg"
              >
                −
              </button>
            </div>

            <button
              id="btn-reset-map-view"
              onClick={handleResetView}
              title="Türkiye Genel Görünümüne Dön"
              className="bg-white/95 backdrop-blur-md rounded-[20px] shadow-md border border-stone-200/80 p-2 text-stone-700 hover:bg-stone-100 transition-colors flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Harita Bilgi Çubuğu */}
          <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
            <div className="bg-stone-900/80 backdrop-blur-md text-white px-3 py-2 rounded-[20px] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
                <span className="font-semibold">{selectedHotspot.name}</span>
                <span className="text-stone-300 hidden sm:inline">({selectedHotspot.city})</span>
              </div>
              <span className="text-stone-400 text-[11px]">
                İşaretçilere tıklayarak yaklaşabilirsiniz
              </span>
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Seçili Hotspot & Kuş Ekolojisi Detay Paneli */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-[24px] border border-stone-200/80 p-5 shadow-xs space-y-4">
            {/* Hotspot Başlığı & Bölge */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--accent-light)] text-[var(--accent)]">
                  {selectedHotspot.region} • {selectedHotspot.city}
                </span>
                <span className="text-[11px] font-bold text-[var(--accent)] bg-[var(--accent-light)] px-2 py-0.5 rounded-lg border border-[var(--accent)]/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{selectedHotspot.density}</span>
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-stone-900">
                {selectedHotspot.name}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {selectedHotspot.habitatType}
              </p>
            </div>

            {/* Neden Burada Yoğunlar? (Ekolojik Kavram) */}
            <div className="p-3.5 rounded-[20px] bg-[var(--accent-light)]/70 border border-[var(--accent)]/70 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)]">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Neden Burada Yoğunlar?</span>
              </div>
              <p className="text-xs text-[var(--accent)] leading-relaxed">
                {selectedHotspot.whyHotspot}
              </p>
            </div>

            {/* Alan Açıklaması & Sezon */}
            <div className="space-y-2 text-xs">
              <p className="text-stone-600 leading-relaxed">
                {selectedHotspot.description}
              </p>
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-stone-100">
                <span className="text-stone-400">En İyi Gözlem Dönemi:</span>
                <span className="font-semibold text-stone-800">{selectedHotspot.bestSeason}</span>
              </div>
            </div>

            {/* Bu Alandaki Kuşlar */}
            <div className="space-y-2.5 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center justify-between">
                <span>Alandaki Karakteristik Kuşlar</span>
                <span className="text-[11px] font-normal text-stone-400">
                  {selectedHotspot.birdIds.length} Tür
                </span>
              </h4>

              <div className="space-y-2">
                {selectedHotspot.birdIds.map((bId) => {
                  const bird = TURKEY_BIRDS.find((b) => b.id === bId);
                  if (!bird) return null;
                  const isPlaying = playingBirdId === bird.id;

                  return (
                    <div
                      key={bird.id}
                      className="p-2.5 rounded-[20px] bg-stone-50/80 border border-stone-200 flex items-center justify-between gap-2.5 hover:bg-stone-50 transition-colors"
                    >
                      <div
                        onClick={() => onSelectBird && onSelectBird(bird)}
                        className="flex items-center gap-2.5 min-w-0 cursor-pointer grow"
                      >
                        <div className="w-10 h-10 rounded-[16px] overflow-hidden shrink-0 border border-stone-200">
                          <BirdPhoto
                            src={bird.imageUrl}
                            fallbackSrc={bird.fallbackImageUrl}
                            alt={bird.name}
                            birdId={bird.id}
                            aspectRatio="square"
                          />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-stone-900 truncate hover:text-[var(--accent)] transition-colors">
                            {bird.name}
                          </h5>
                          <p className="text-[10px] text-stone-500 truncate">
                            {bird.beakType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Ses Çalma */}
                        <button
                          id={`play-map-bird-${bird.id}`}
                          onClick={() => handlePlaySound(bird.id)}
                          title="Kuş Sesini Dinle"
                          className={`p-2 rounded-[16px] transition-all ${
                            isPlaying
                              ? 'bg-[var(--accent)] text-white'
                              : 'bg-white text-stone-700 hover:bg-[var(--accent-light)] hover:text-[var(--accent)] border border-stone-200'
                          }`}
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
                        </button>

                        {/* Kart Açma */}
                        {onSelectBird && (
                          <button
                            id={`open-modal-map-${bird.id}`}
                            onClick={() => onSelectBird(bird)}
                            title="Detaylı İncele"
                            className="p-2 rounded-[16px] bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors"
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

          {/* Diğer Hotspotlara Hızlı Atlama Listesi */}
          <div className="bg-white rounded-[24px] border border-stone-200/80 p-4 shadow-xs space-y-2">
            <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Tüm Türkiye Hotspotları
            </h4>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {TURKEY_HOTSPOTS.map((h) => {
                const isCurrent = h.id === selectedHotspotId;
                return (
                  <button
                    key={h.id}
                    onClick={() => handleSelectHotspot(h)}
                    className={`p-2 rounded-[16px] text-left text-xs font-semibold truncate transition-all ${
                      isCurrent
                        ? 'bg-[var(--accent)] text-white shadow-xs'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {h.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
