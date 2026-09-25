import React, { useState } from 'react';
import { Aperture, Timer, Gauge, Sparkles, Crosshair, BarChart3 } from 'lucide-react';
import { DIAGRAM_HOTSPOTS, type DiagramHotspot } from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { Card } from '../../../components/ui';

interface DiagramLabelingActivityProps {
  onScoreUpdate?: (points: number) => void;
}

const FUNCTION_ICON: Record<DiagramHotspot['functionKey'], React.ElementType> = {
  diyafram: Aperture,
  enstantane: Timer,
  pozometre: Gauge,
  iso: Sparkles,
  odak: Crosshair,
  histogram: BarChart3,
};

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
  const SelectedIcon = FUNCTION_ICON[selectedHotspot.functionKey];

  return (
    <div className="space-y-4">
      <div
        className="h-[76px] rounded-[22px] bg-white px-4 flex items-center gap-3.5"
        style={{ border: '1px solid #E6E0D6' }}
      >
        <span
          className="w-12 h-12 rounded-[15px] flex items-center justify-center shrink-0"
          style={{ background: 'var(--accent-light)' }}
        >
          <SelectedIcon className="w-[26px] h-[26px]" style={{ color: 'var(--accent)' }} />
        </span>
        <span className="flex-grow font-display font-extrabold text-lg truncate" style={{ color: '#1C1B19' }}>
          {selectedHotspot.label}
        </span>
        <span className="text-sm font-bold shrink-0" style={{ color: '#6B665E' }}>
          {discoveredCount} / {DIAGRAM_HOTSPOTS.length}
        </span>
      </div>

      <div className="rounded-[26px] p-3.5 flex flex-col gap-2.5" style={{ background: '#0F1422' }}>
        <div className="relative h-[200px] rounded-xl" style={{ background: '#2A3858' }}>
          <svg viewBox="0 0 322 200" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            <path
              d="M16 40V16h24M282 16h24v24M306 160v24h-24M40 184H16v-24"
              fill="none"
              stroke="#C7D0E4"
              strokeWidth="2"
            />
          </svg>

          {DIAGRAM_HOTSPOTS.map((spot) => {
            const isSelected = selectedHotspot.id === spot.id;
            const isDiscovered = discoveredSpots[spot.id];
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => handleSelectSpot(spot)}
                aria-label={spot.label}
                aria-pressed={isSelected}
                style={{
                  left: `${spot.xPercent}%`,
                  top: `${spot.yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-10 w-11 h-11 -m-[2px] flex items-center justify-center transition-transform ${
                  isSelected ? 'scale-110' : ''
                }`}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background: isSelected || isDiscovered ? 'var(--accent)' : 'rgba(255,255,255,0.85)',
                    boxShadow: isSelected ? '0 0 0 4px rgba(255,255,255,0.25)' : undefined,
                  }}
                >
                  <Crosshair className="w-3.5 h-3.5" style={{ color: isSelected || isDiscovered ? '#FFFFFF' : '#1C1B19' }} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Card>
        <p className="text-sm leading-relaxed" style={{ color: '#1C1B19' }}>
          {selectedHotspot.description}
        </p>
      </Card>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: '#6B665E' }}>
          Diğer göstergeler
        </span>
        <div className="grid grid-cols-2 gap-2">
          {DIAGRAM_HOTSPOTS.map((spot) => {
            const isSelected = selectedHotspot.id === spot.id;
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => handleSelectSpot(spot)}
                className="min-h-[44px] px-3 py-2 rounded-[16px] text-left text-xs font-bold transition-colors"
                style={{
                  background: isSelected ? 'var(--accent-light)' : '#FFFFFF',
                  border: `1px solid ${isSelected ? 'var(--accent)' : '#E6E0D6'}`,
                  color: isSelected ? 'var(--accent)' : '#1C1B19',
                }}
              >
                <span className="truncate block">{spot.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
