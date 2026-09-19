import React, { useState } from 'react';
import { Volume2, Utensils, Feather, MapPin } from 'lucide-react';
import { TURKEY_BIRDS, BirdSpecies } from '../data/birds';
import { BirdPhoto } from './BirdPhoto';
import { birdAudioSynth } from '../utils/audioSynth';

export const CompareAndAnalogyActivity: React.FC = () => {
  const [bird1Id, setBird1Id] = useState<string>('flamingo');
  const [bird2Id, setBird2Id] = useState<string>('ak-pelikan');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const bird1 = TURKEY_BIRDS.find((b) => b.id === bird1Id) || TURKEY_BIRDS[0];
  const bird2 = TURKEY_BIRDS.find((b) => b.id === bird2Id) || TURKEY_BIRDS[1];

  const handlePlay = (id: string) => {
    setPlayingId(id);
    birdAudioSynth.playBirdCall(id);
    setTimeout(() => setPlayingId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Kuş Seçim Menüsü */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-1">
          <label htmlFor="select-bird-1" className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            1. Kuş
          </label>
          <select
            id="select-bird-1"
            value={bird1Id}
            onChange={(e) => setBird1Id(e.target.value)}
            className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none"
          >
            {TURKEY_BIRDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.category})
              </option>
            ))}
          </select>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-1">
          <label htmlFor="select-bird-2" className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            2. Kuş
          </label>
          <select
            id="select-bird-2"
            value={bird2Id}
            onChange={(e) => setBird2Id(e.target.value)}
            className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none"
          >
            {TURKEY_BIRDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Yan Yana İki Kuşun Gerçek Fotoğrafları & Karşılaştırma Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kuş 1 */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-stone-100 relative">
            <BirdPhoto
              src={bird1.imageUrl}
              fallbackSrc={bird1.fallbackImageUrl}
              alt={bird1.name}
              birdId={bird1.id}
              aspectRatio="video"
              className="w-full h-full rounded-2xl"
            />
            <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md ${bird1.color.badgeBg} ${bird1.color.badgeText}`}>
              {bird1.category}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold font-serif text-stone-900">{bird1.name}</h3>
              <p className="text-xs text-stone-500 italic">{bird1.scientificName}</p>
            </div>
            <button
              onClick={() => handlePlay(bird1.id)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
              title="Sesi Dinle"
            >
              <Volume2 className={`w-4 h-4 ${playingId === bird1.id ? 'text-rose-600 animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-2 text-xs pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl">
              <Utensils className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Gaga Tipi</span>
                <span className="font-semibold text-stone-800">{bird1.beakType}</span>
                <p className="text-stone-500 text-[11px]">{bird1.beakAdaptation}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl">
              <Feather className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <div className="flex gap-4">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Kanat Açıklığı</span>
                  <span className="font-semibold font-mono text-stone-800">{bird1.wingspan}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Ağırlık</span>
                  <span className="font-semibold font-mono text-stone-800">{bird1.weight}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Habitat & Besin</span>
                <span className="font-semibold text-stone-800">{bird1.habitat}</span>
                <p className="text-stone-500 text-[11px]">Besin: {bird1.diet}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kuş 2 */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-stone-100 relative">
            <BirdPhoto
              src={bird2.imageUrl}
              fallbackSrc={bird2.fallbackImageUrl}
              alt={bird2.name}
              birdId={bird2.id}
              aspectRatio="video"
              className="w-full h-full rounded-2xl"
            />
            <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md ${bird2.color.badgeBg} ${bird2.color.badgeText}`}>
              {bird2.category}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold font-serif text-stone-900">{bird2.name}</h3>
              <p className="text-xs text-stone-500 italic">{bird2.scientificName}</p>
            </div>
            <button
              onClick={() => handlePlay(bird2.id)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
              title="Sesi Dinle"
            >
              <Volume2 className={`w-4 h-4 ${playingId === bird2.id ? 'text-rose-600 animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-2 text-xs pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl">
              <Utensils className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Gaga Tipi</span>
                <span className="font-semibold text-stone-800">{bird2.beakType}</span>
                <p className="text-stone-500 text-[11px]">{bird2.beakAdaptation}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl">
              <Feather className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <div className="flex gap-4">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Kanat Açıklığı</span>
                  <span className="font-semibold font-mono text-stone-800">{bird2.wingspan}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Ağırlık</span>
                  <span className="font-semibold font-mono text-stone-800">{bird2.weight}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Habitat & Besin</span>
                <span className="font-semibold text-stone-800">{bird2.habitat}</span>
                <p className="text-stone-500 text-[11px]">Besin: {bird2.diet}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kısa Karşılaştırma Özeti */}
      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between gap-3">
        <span>
          💡 <strong>{bird1.name}</strong> ({bird1.beakType}) ile <strong>{bird2.name}</strong> ({bird2.beakType}) morfolojik olarak avlanma biçimlerine göre özelleşmiştir.
        </span>
      </div>
    </div>
  );
};
