import React, { useState } from 'react';
import { Target, CheckCircle2, Info, Eye, Award } from 'lucide-react';
import { DIAGRAM_HOTSPOTS, type DiagramHotspot } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';

interface DiagramLabelingActivityProps {
  onScoreUpdate?: (points: number) => void;
}

export const DiagramLabelingActivity: React.FC<DiagramLabelingActivityProps> = ({ onScoreUpdate }) => {
  const [selectedHotspot, setSelectedHotspot] = useState<DiagramHotspot>(DIAGRAM_HOTSPOTS[0]);
  const [discoveredSpots, setDiscoveredSpots] = useState<Record<string, boolean>>({});

  const handleSelectSpot = (spot: DiagramHotspot) => {
    setSelectedHotspot(spot);
    cameraAudio.playDialTick();
    if (!discoveredSpots[spot.id]) {
      setDiscoveredSpots((prev) => ({ ...prev, [spot.id]: true }));
      cameraAudio.playSuccessSound();
      if (onScoreUpdate) onScoreUpdate(10);
    }
  };

  const discoveredCount = Object.values(discoveredSpots).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#EBE7E0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
              Kamera Vizörü & Ekran Diyagramı
            </span>
            <h3 className="text-lg font-bold text-[#1F1E1B]">Kamera Vizörü & Kadran Etiketleme</h3>
            <p className="text-sm text-[#66635E] mt-0.5">
              DSLR/Aynasız kamera vizöründeki noktacıklara dokunarak hangi göstergenin ne işe yaradığını keşfedin.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
            <Award className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-stone-800">
              {discoveredCount} / {DIAGRAM_HOTSPOTS.length} Keşfedildi
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol Taraf: İnteraktif Vizör Diyagramı (7 Kolon) */}
        <div className="lg:col-span-7 bg-stone-950 p-6 rounded-3xl border-4 border-stone-800 shadow-xl flex flex-col justify-between relative aspect-16/10">
          {/* Çekim Sahnesi Arka Planı (Şematik Manzara Çizimi) */}
          <div className="absolute inset-4 rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 pointer-events-none opacity-40">
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-800/50 to-stone-900" />
          </div>

          {/* 3x3 Kılavuz Çizgileri */}
          <div className="absolute inset-4 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/10 rounded-2xl">
            <div className="border-r border-b border-white/10" />
            <div className="border-r border-b border-white/10" />
            <div className="border-b border-white/10" />
            <div className="border-r border-b border-white/10" />
            <div className="border-r border-b border-white/10" />
            <div className="border-b border-white/10" />
            <div className="border-r border-white/10" />
            <div className="border-r border-white/10" />
            <div />
          </div>

          {/* Vizör Bilgi Çubuğu Şablonu */}
          <div className="absolute bottom-6 inset-x-8 h-10 bg-black/80 rounded-xl border border-stone-700/80 flex items-center justify-around text-amber-400 font-mono text-xs pointer-events-none px-4">
            <span>1/1000</span>
            <span>f/2.8</span>
            <span>-2..0..+2</span>
            <span>ISO 400</span>
          </div>

          {/* İnteraktif Hotspot Düğmeleri */}
          {DIAGRAM_HOTSPOTS.map((spot) => {
            const isSelected = selectedHotspot.id === spot.id;
            const isDiscovered = discoveredSpots[spot.id];

            return (
              <button
                key={spot.id}
                onClick={() => handleSelectSpot(spot)}
                style={{
                  left: `${spot.xPercent}%`,
                  top: `${spot.yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-30 group flex items-center justify-center p-2 rounded-full transition-transform ${
                  isSelected ? 'scale-125' : 'hover:scale-110'
                }`}
                title={spot.label}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg transition-colors ${
                    isSelected
                      ? 'bg-rose-500 text-white ring-4 ring-rose-400/30 animate-pulse'
                      : isDiscovered
                      ? 'bg-emerald-500 text-white ring-2 ring-emerald-300/40'
                      : 'bg-amber-400 text-black ring-2 ring-white/50'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })}
        </div>

        {/* Sağ Taraf: Seçilen Hotspot Detay Kartı (5 Kolon) */}
        <div className="lg:col-span-5 bg-white border border-[#EBE7E0] rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0ECE6] pb-3">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                VİZÖR GÖSTERGE BİLGİSİ
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
                {selectedHotspot.functionKey.toUpperCase()}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1F1E1B]">{selectedHotspot.label}</h2>
              <p className="text-sm text-[#66635E] mt-2 leading-relaxed">
                {selectedHotspot.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7E0] text-xs space-y-2">
              <span className="font-bold text-[#1F1E1B] block">Fotoğrafçıya Sağladığı Kolaylık:</span>
              <p className="text-[#66635E] leading-relaxed">
                Vizörden gözünüzü ayırmadan enstantane, diyafram ve pozlama ibresini gerçek zamanlı takip etmenizi sağlayarak anı kaçırmadan çekim yapabilmenize imkan tanır.
              </p>
            </div>
          </div>

          {/* Diğer Noktalara Geçiş Listesi */}
          <div className="pt-2 border-t border-[#F0ECE6]">
            <span className="text-[11px] font-bold text-[#8A8680] uppercase tracking-wider block mb-2">
              Diğer Göstergeler:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {DIAGRAM_HOTSPOTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSpot(s)}
                  className={`px-3 py-2 rounded-xl text-left text-xs font-medium border transition-colors ${
                    selectedHotspot.id === s.id
                      ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="truncate block">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
