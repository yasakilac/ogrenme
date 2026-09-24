import React, { useState } from 'react';
import {
  Move,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  Utensils,
  HelpCircle
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

export const DragDropActivity: React.FC = () => {
  const [activeMode, setActiveMode] = useState<ActivityMode>('habitat');
  
  // Placements: { [targetId]: birdId }
  const [placements, setPlacements] = useState<Record<string, string>>({});
  
  // Mobile / Click-to-place selected bird
  const [selectedBirdId, setSelectedBirdId] = useState<string | null>(null);
  const [lastFeedback, setLastFeedback] = useState<{
    targetId: string;
    isCorrect: boolean;
    text: string;
  } | null>(null);

  const currentSlots = activeMode === 'habitat' ? HABITAT_SLOTS : DIET_SLOTS;

  // Filter birds relevant to current mode
  const relevantBirdIds = currentSlots.map((s) => s.expectedBirdId);
  const poolBirds = TURKEY_BIRDS.filter((b) => relevantBirdIds.includes(b.id));

  // Remaining birds that are not placed correctly yet
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
      // Doğru eşleşme!
      setPlacements((prev) => ({ ...prev, [targetId]: birdId }));
      setLastFeedback({
        targetId,
        isCorrect: true,
        text: `Doğru! ${slot.ecologicalFact}`
      });
      birdAudioSynth.playBirdCall(birdId);
      setSelectedBirdId(null);
    } else {
      // Yanlış eşleşme
      const wrongBird = TURKEY_BIRDS.find((b) => b.id === birdId);
      setLastFeedback({
        targetId,
        isCorrect: false,
        text: `${wrongBird?.name || 'Bu kuş'} bu alana uygun değil. İpucu: ${slot.targetSubtitle}`
      });
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
    <div className="space-y-6 animate-fade-in">
      {/* Üst Bilgi ve Mod Seçimi */}
      <div className="bg-white rounded-[24px] border border-stone-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-[16px] bg-[var(--accent)]/10 text-[var(--accent)]">
                <Move className="w-5 h-5" />
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold text-stone-900">
                Sürükle & Bırak Eşleme Atölyesi
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Kuşları sürükleyip ilgili kutuya bırakın veya kuşa tıklayıp ardından yerleştirmek istediğiniz kutuyu seçin.
            </p>
          </div>

          {/* İki Mod Arası Geçiş */}
          <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-[20px] border border-stone-200 self-start md:self-auto">
            <button
              id="btn-mode-habitat"
              onClick={() => switchMode('habitat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[16px] text-xs font-semibold transition-all ${
                activeMode === 'habitat'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Habitat Eşleme ({HABITAT_SLOTS.length})</span>
            </button>
            <button
              id="btn-mode-diet"
              onClick={() => switchMode('diet')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[16px] text-xs font-semibold transition-all ${
                activeMode === 'diet'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Gaga & Besin Eşleme ({DIET_SLOTS.length})</span>
            </button>
          </div>
        </div>

        {/* İlerleme Çubuğu */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="grow bg-stone-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[var(--accent)] h-full rounded-full transition-all duration-500"
                style={{ width: `${(correctCount / totalSlots) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-stone-700 whitespace-nowrap">
              {correctCount} / {totalSlots} Eşleşti
            </span>
          </div>

          <button
            id="btn-reset-dragdrop"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Tamamlanma Tebrik Kutusu */}
      {isCompleted && (
        <div className="bg-[var(--accent-light)] border-2 border-[var(--accent)]/30 rounded-[24px] p-5 text-center space-y-2 animate-bounce-subtle">
          <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center mx-auto shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-[var(--accent)]">
            Tebrikler! Tüm Eşleştirmeleri Başarıyla Tamamladınız!
          </h3>
          <p className="text-xs text-[var(--accent)] max-w-md mx-auto">
            Kuş türlerinin morfolojik ve ekolojik adaptasyonlarını tam olarak kavradınız. Diğer moda geçebilir veya test bölümüne ilerleyebilirsiniz.
          </p>
        </div>
      )}

      {/* Kuş Seçim Havuzu (Sürüklenebilir Kartlar) */}
      <div className="bg-white rounded-[24px] border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span>Eşleştirilecek Kuşlar ({unplacedBirds.length} Bekliyor)</span>
          </h3>
          <span className="text-[11px] text-stone-400">
            Masaüstünde sürükleyin veya tıklayıp seçin
          </span>
        </div>

        {unplacedBirds.length === 0 ? (
          <div className="py-6 text-center text-xs text-stone-400 font-medium">
            Tüm kuşlar yuvalarına veya besinlerine başarıyla yerleştirildi! ✨
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {unplacedBirds.map((bird) => {
              const isSelected = selectedBirdId === bird.id;
              return (
                <div
                  key={bird.id}
                  id={`draggable-bird-${bird.id}`}
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', bird.id);
                  }}
                  onClick={() => {
                    setSelectedBirdId(isSelected ? null : bird.id);
                  }}
                  className={`p-2.5 rounded-[20px] border cursor-grab active:cursor-grabbing transition-all select-none flex flex-col items-center text-center gap-2 ${
                    isSelected
                      ? 'bg-[var(--accent-light)] border-[var(--accent)] ring-2 ring-[var(--accent)] shadow-md scale-105'
                      : 'bg-stone-50/70 border-stone-200 hover:border-stone-300 hover:shadow-xs'
                  }`}
                >
                  <div className="w-14 h-14 rounded-[16px] overflow-hidden pointer-events-none border border-stone-200">
                    <BirdPhoto
                      src={bird.imageUrl}
                      fallbackSrc={bird.fallbackImageUrl}
                      alt={bird.name}
                      birdId={bird.id}
                      aspectRatio="square"
                    />
                  </div>
                  <div className="w-full pointer-events-none">
                    <p className="text-[11px] font-bold text-stone-900 truncate">
                      {bird.name.split(' ')[0]}
                    </p>
                    <p className="text-[9px] text-stone-500 truncate">
                      {bird.beakType}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="text-[9px] font-bold text-[var(--accent)] bg-[var(--accent-light)] px-1.5 py-0.5 rounded-md animate-pulse">
                      Hedefe Dokun
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hedef Yuva / Drop Alanları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                if (selectedBirdId && !placedBird) {
                  handlePlaceBird(slot.targetId, selectedBirdId);
                }
              }}
              className={`p-5 rounded-[24px] border transition-all relative ${
                placedBird
                  ? ''
                  : selectedBirdId
                  ? 'bg-[var(--accent-light)]/40 border-dashed border-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] cursor-pointer'
                  : 'bg-white border-dashed border-stone-300 hover:border-stone-400'
              }`}
              style={placedBird ? { background: `${CORRECT.bg}80`, borderColor: CORRECT.border } : undefined}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Sol Kategori Bilgisi */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{slot.categoryGlyph}</span>
                    <h4 className="font-display font-bold text-sm text-stone-900">
                      {slot.targetTitle}
                    </h4>
                  </div>
                  <p className="text-xs text-stone-500">
                    {slot.targetSubtitle}
                  </p>
                </div>

                {/* Sağ Durum Rozeti */}
                {placedBird ? (
                  <span
                    className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-[16px] shrink-0"
                    style={{ color: CORRECT.fg, background: CORRECT.bg }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Eşleşti</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-stone-400 px-2 py-1 rounded-lg bg-stone-100 shrink-0">
                    Kuş Bırakın
                  </span>
                )}
              </div>

              {/* Yerleştirilen Kuş Kartı */}
              {placedBird && (
                <div
                  className="mt-4 p-3 rounded-[20px] bg-white border flex items-center justify-between gap-3 shadow-xs"
                  style={{ borderColor: CORRECT.border }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-[16px] overflow-hidden shrink-0 border" style={{ borderColor: CORRECT.border }}>
                      <BirdPhoto
                        src={placedBird.imageUrl}
                        fallbackSrc={placedBird.fallbackImageUrl}
                        alt={placedBird.name}
                        birdId={placedBird.id}
                        aspectRatio="square"
                      />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-stone-900 truncate">
                        {placedBird.name}
                      </h5>
                      <p className="text-[10px] font-medium" style={{ color: CORRECT.fg }}>
                        {slot.ecologicalFact}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      birdAudioSynth.playBirdCall(placedBird.id);
                    }}
                    title="Sesini Dinle"
                    className="p-2 rounded-[16px] shrink-0 transition-colors"
                    style={{ background: CORRECT.bg, color: CORRECT.fg }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Hata Geri Bildirimi (yanlış kuş denendi) */}
              {hasFeedback && !placedBird && (
                <div
                  className="mt-3 p-2.5 rounded-[16px] border flex items-start gap-2 text-xs"
                  style={{ background: WRONG.bg, borderColor: WRONG.border, color: WRONG.fg }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: WRONG.border }} />
                  <span>{lastFeedback.text}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
