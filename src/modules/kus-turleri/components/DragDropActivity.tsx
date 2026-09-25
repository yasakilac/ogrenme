import React, { useState } from 'react';
import {
  Check,
  X,
  RotateCcw,
  Award,
  Layers,
  Utensils,
  GripVertical
} from 'lucide-react';
import { TURKEY_BIRDS, BirdSpecies } from '../data/birds';
import { BirdPhoto } from './BirdPhoto';
import { birdAudioSynth } from '../utils/audioSynth';
import { CORRECT, WRONG } from '../../../components/ui';

type ActivityMode = 'habitat' | 'diet';

interface MatchSlot {
  targetId: string;
  targetTitle: string;
  targetSubtitle: string;
  categoryGlyph: string;
  expectedBirdId: string;
  ecologicalFact: string;
}

const HABITAT_SLOTS: MatchSlot[] = [
  {
    targetId: 'tuzlu-lagun',
    targetTitle: 'Tuzlu Sığ Göl & Çamur Tabanı',
    targetSubtitle: 'Tuz Gölü, Gediz Deltası Lagünleri',
    categoryGlyph: '🧂',
    expectedBirdId: 'flamingo',
    ecologicalFact: 'Ters kıvrık süzgeç gagasıyla tuzlu sığ sulardaki artemia karideslerini süzer.'
  },
  {
    targetId: 'berrak-dere',
    targetTitle: 'Berrak Nehir & Sazlık Kıyısı',
    targetSubtitle: 'Temiz tatlı su dere yatakları',
    categoryGlyph: '🐟',
    expectedBirdId: 'yalicapkini',
    ecologicalFact: 'Zıpkın gagasıyla suya sürtünmesiz dalış yaparak küçük balıkları avlar.'
  },
  {
    targetId: 'tatli-su-deltasi',
    targetTitle: 'Geniş Göl & Taşkın Söğütlük',
    targetSubtitle: 'Manyas Kuşcenneti & Eber Gölü',
    categoryGlyph: '🦢',
    expectedBirdId: 'ak-pelikan',
    ecologicalFact: '13 litrelik dev deri kese gagasıyla sürü halinde balık kepçeler.'
  },
  {
    targetId: 'acik-bozkir',
    targetTitle: 'Açık Bozkır & Step Platoları',
    targetSubtitle: 'İç Anadolu geniş ovaları',
    categoryGlyph: '🌾',
    expectedBirdId: 'sah-kartal',
    ecologicalFact: 'Çengelli kanca gagasıyla gelengi ve bozkır tavşanlarını avlayıp parçalar.'
  },
  {
    targetId: 'sarp-kanyon',
    targetTitle: 'Sarp Uçurumlar & Dik Kanyonlar',
    targetSubtitle: 'Toroslar ve Aladağlar falezleri',
    categoryGlyph: '🏔️',
    expectedBirdId: 'gokdogan',
    ecologicalFact: 'Tomium dişli gagasıyla dalışta yakaladığı avın omurunu anında kırar.'
  },
  {
    targetId: 'kayalik-step',
    targetTitle: 'Kireçtaşı Kayalıkları & Kurak Step',
    targetSubtitle: 'Şanlıurfa Birecik Fırat kıyısı',
    categoryGlyph: '🪨',
    expectedBirdId: 'kelaynak',
    ecologicalFact: 'Aşağı kıvrık uzun sonda gagasıyla kaya oyuklarındaki akrep ve böcekleri çıkarır.'
  },
  {
    targetId: 'maki-fundalik',
    targetTitle: 'Maki Fundalık & Taban Çalılığı',
    targetSubtitle: 'Çukurova narenciye altı ve sazlıklar',
    categoryGlyph: '🌿',
    expectedBirdId: 'turac',
    ecologicalFact: 'Güçlü tohum kırıcı gagasıyla sert tohumları, filizleri ve taneleri eşeler.'
  },
  {
    targetId: 'sehir-gokyuzu',
    targetTitle: 'Taş Surlar, Kuleler & Açık Gökyüzü',
    targetSubtitle: 'İstanbul surları ve tarihi yapılar',
    categoryGlyph: '☁️',
    expectedBirdId: 'ebabil',
    ecologicalFact: 'Geniş kepçe ağzıyla havada uçarken böcekleri ve karıncaları süzer.'
  }
];

const DIET_SLOTS: MatchSlot[] = [
  {
    targetId: 'besin-artemia',
    targetTitle: 'Artemia Karidesi & Mikro Alg',
    targetSubtitle: 'Tuzlu sudan süzecek lamelli gaga aranıyor',
    categoryGlyph: '🦐',
    expectedBirdId: 'flamingo',
    ecologicalFact: 'Büyük Flamingo, kafa aşağı pozisyonda gaga filtreleriyle beslenir.'
  },
  {
    targetId: 'besin-balik-zipkin',
    targetTitle: 'Süratli Küçük Tatlı Su Balığı',
    targetSubtitle: 'Dalışta su direncini kıran hançer gaga aranıyor',
    categoryGlyph: '🎣',
    expectedBirdId: 'yalicapkini',
    ecologicalFact: 'Yalıçapkını, mızrak gagasıyla göz açıp kapayıncaya kadar dalıp avlar.'
  },
  {
    targetId: 'besin-kemirgen',
    targetTitle: 'Gelengi (Yer Sincabı) & Tavşan',
    targetSubtitle: 'Sert kas dokusunu yırtacak çengel kanca aranıyor',
    categoryGlyph: '🐇',
    expectedBirdId: 'sah-kartal',
    ecologicalFact: 'Doğu Şah Kartalı, çelik benzeri kavisli kancasıyla avını parçalar.'
  },
  {
    targetId: 'besin-akrep',
    targetTitle: 'Kaya Yarığındaki Akrep & Örümcek',
    targetSubtitle: 'Dar çatlaklara girecek ince kavisli sonda gaga aranıyor',
    categoryGlyph: '🦂',
    expectedBirdId: 'kelaynak',
    ecologicalFact: 'Kelaynak, hassas sonda gagasıyla akrepleri iğnelerinden etkilenmeden çıkarır.'
  },
  {
    targetId: 'besin-danaburnu',
    targetTitle: 'Toprak Altındaki Tırtıl & Danaburnu',
    targetSubtitle: 'Toprağı hassas eşeleyecek kavisli cımbız aranıyor',
    categoryGlyph: '🐛',
    expectedBirdId: 'ibibik',
    ecologicalFact: 'İbibik, uzun kavisli cımbız gagasıyla bahçe toprağını yoklayarak avlanır.'
  },
  {
    targetId: 'besin-tohum',
    targetTitle: 'Sert Yabani Tohum & Çalı Kökleri',
    targetSubtitle: 'Sert tohum kabuğunu kıracak konik gaga aranıyor',
    categoryGlyph: '🌾',
    expectedBirdId: 'turac',
    ecologicalFact: 'Turaç, güçlü tohum kırıcı gagasıyla çalılık tabanında tohumları çıtlatır.'
  }
];

/** E1 (Etkinlik — Sürükle Bırak) dili: kesikli kenarlı hedefler + havuz + koyu footer butonları. */
export const DragDropActivity: React.FC = () => {
  const [activeMode, setActiveMode] = useState<ActivityMode>('habitat');
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedBirdId, setSelectedBirdId] = useState<string | null>(null);
  const [lastFeedback, setLastFeedback] = useState<{ targetId: string; isCorrect: boolean; text: string } | null>(null);

  const currentSlots = activeMode === 'habitat' ? HABITAT_SLOTS : DIET_SLOTS;
  const relevantBirdIds = currentSlots.map((s) => s.expectedBirdId);
  const poolBirds = TURKEY_BIRDS.filter((b) => relevantBirdIds.includes(b.id));
  const placedBirdIds = Object.values(placements);
  const unplacedBirds = poolBirds.filter((b) => !placedBirdIds.includes(b.id));

  const totalSlots = currentSlots.length;
  const correctCount = Object.entries(placements).filter(
    ([slotId, birdId]) => currentSlots.find((s) => s.targetId === slotId)?.expectedBirdId === birdId
  ).length;
  const isCompleted = correctCount === totalSlots;

  const handlePlaceBird = (targetId: string, birdId: string) => {
    const slot = currentSlots.find((s) => s.targetId === targetId);
    if (!slot) return;

    if (slot.expectedBirdId === birdId) {
      setPlacements((prev) => ({ ...prev, [targetId]: birdId }));
      setLastFeedback({ targetId, isCorrect: true, text: `Doğru! ${slot.ecologicalFact}` });
      birdAudioSynth.playBirdCall(birdId);
      setSelectedBirdId(null);
    } else {
      const wrongBird = TURKEY_BIRDS.find((b) => b.id === birdId);
      setLastFeedback({ targetId, isCorrect: false, text: `${wrongBird?.name || 'Bu kuş'} bu alana uygun değil. İpucu: ${slot.targetSubtitle}` });
    }
  };

  const handleReset = () => {
    setPlacements({});
    setSelectedBirdId(null);
    setLastFeedback(null);
  };

  const switchMode = (mode: ActivityMode) => {
    setActiveMode(mode);
    setPlacements({});
    setSelectedBirdId(null);
    setLastFeedback(null);
  };

  return (
    <div className="space-y-4">
      {/* Mod Seçimi + İlerleme */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-1 rounded-[16px]" style={{ background: '#EDE6DB' }}>
          <button
            id="btn-mode-habitat"
            onClick={() => switchMode('habitat')}
            style={{ background: activeMode === 'habitat' ? '#FFFFFF' : 'transparent', color: '#1C1B19' }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all"
          >
            <Layers className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span>Habitat</span>
          </button>
          <button
            id="btn-mode-diet"
            onClick={() => switchMode('diet')}
            style={{ background: activeMode === 'diet' ? '#FFFFFF' : 'transparent', color: '#1C1B19' }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all"
          >
            <Utensils className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span>Besin</span>
          </button>
        </div>
        <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{correctCount} / {totalSlots}</span>
      </div>

      {isCompleted && (
        <div className="rounded-[22px] p-4 text-center space-y-1.5" style={{ background: 'var(--accent-light)', border: '2px solid var(--accent)' }}>
          <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Award className="w-5 h-5" style={{ color: '#FFFFFF' }} />
          </div>
          <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>Tüm eşleştirmeler doğru! Diğer moda geçebilirsiniz.</p>
        </div>
      )}

      {/* Kuş Havuzu */}
      <div className="rounded-[22px] p-3 flex flex-wrap gap-2 min-h-[76px] content-start" style={{ background: '#EDE6DB' }}>
        {unplacedBirds.length === 0 ? (
          <span className="text-xs font-semibold m-auto" style={{ color: '#A39C91' }}>Tüm kuşlar yerleştirildi</span>
        ) : (
          unplacedBirds.map((bird) => {
            const isSelected = selectedBirdId === bird.id;
            return (
              <button
                key={bird.id}
                id={`draggable-bird-${bird.id}`}
                type="button"
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', bird.id)}
                onClick={() => setSelectedBirdId(isSelected ? null : bird.id)}
                aria-pressed={isSelected}
                style={{
                  background: isSelected ? '#1C1B19' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#1C1B19',
                  border: isSelected ? '2px solid #1C1B19' : '1px solid #E6E0D6',
                  transform: isSelected ? 'translateY(-3px)' : 'none',
                }}
                className="h-12 pl-2 pr-3.5 rounded-[16px] flex items-center gap-2 font-bold text-sm transition-all"
              >
                <div className="w-8 h-8 rounded-[10px] overflow-hidden shrink-0">
                  <BirdPhoto src={bird.imageUrl} fallbackSrc={bird.fallbackImageUrl} alt="" birdId={bird.id} aspectRatio="square" />
                </div>
                <span>{bird.name.split(' ')[0]}</span>
                <GripVertical className="w-3.5 h-3.5 shrink-0" style={{ color: isSelected ? '#FFFFFF' : '#A39C91' }} aria-hidden="true" />
              </button>
            );
          })
        )}
      </div>

      {/* Hedef Kutular */}
      <div className="space-y-2.5">
        {currentSlots.map((slot) => {
          const placedBirdId = placements[slot.targetId];
          const placedBird = placedBirdId ? TURKEY_BIRDS.find((b) => b.id === placedBirdId) : null;
          const hasFeedback = lastFeedback?.targetId === slot.targetId;

          return (
            <div
              key={slot.targetId}
              id={`drop-zone-${slot.targetId}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const birdId = e.dataTransfer.getData('text/plain');
                if (birdId) handlePlaceBird(slot.targetId, birdId);
              }}
              onClick={() => {
                if (selectedBirdId && !placedBird) handlePlaceBird(slot.targetId, selectedBirdId);
              }}
              style={{
                background: placedBird ? CORRECT.bg : '#FFFFFF',
                borderWidth: 2,
                borderStyle: placedBird ? 'solid' : 'dashed',
                borderColor: placedBird ? CORRECT.border : selectedBirdId ? 'var(--accent)' : '#E6E0D6',
              }}
              className="rounded-[20px] p-3.5 transition-all"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg shrink-0" aria-hidden="true">{slot.categoryGlyph}</span>
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-sm truncate" style={{ color: placedBird ? CORRECT.fg : '#1C1B19' }}>{slot.targetTitle}</h4>
                    <p className="text-[11px] truncate" style={{ color: placedBird ? CORRECT.fg : '#6B665E' }}>{slot.targetSubtitle}</p>
                  </div>
                </div>
                {placedBird ? (
                  <Check className="w-5 h-5 shrink-0" strokeWidth={3} style={{ color: CORRECT.border }} />
                ) : (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-[10px] shrink-0" style={{ background: '#F7F4EE', color: '#A39C91' }}>Boş</span>
                )}
              </div>

              {placedBird && (
                <div className="mt-2.5 p-2 rounded-[16px] bg-white flex items-center justify-between gap-2" style={{ border: `1px solid ${CORRECT.border}` }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-[12px] overflow-hidden shrink-0">
                      <BirdPhoto src={placedBird.imageUrl} fallbackSrc={placedBird.fallbackImageUrl} alt={placedBird.name} birdId={placedBird.id} aspectRatio="square" />
                    </div>
                    <span className="text-xs font-bold truncate" style={{ color: '#1C1B19' }}>{placedBird.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); birdAudioSynth.playBirdCall(placedBird.id); }}
                    aria-label={`${placedBird.name} sesini dinle`}
                    className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                  >
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </button>
                </div>
              )}

              {hasFeedback && !placedBird && (
                <div className="mt-2.5 p-2.5 rounded-[14px] flex items-start gap-2 text-xs" style={{ background: WRONG.bg, color: WRONG.fg }}>
                  <X className="w-4 h-4 shrink-0 mt-0.5" style={{ color: WRONG.border }} />
                  <span>{lastFeedback.text}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="w-full h-12 rounded-[16px] flex items-center justify-center gap-2 font-bold text-sm"
        style={{ background: '#FFFFFF', border: '1px solid #E6E0D6', color: '#1C1B19' }}
      >
        <RotateCcw className="w-4 h-4" />
        <span>Baştan Başla</span>
      </button>
    </div>
  );
};
