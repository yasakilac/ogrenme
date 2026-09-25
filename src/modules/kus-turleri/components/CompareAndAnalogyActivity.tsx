import React, { useState } from 'react';
import { Volume2, Utensils, Feather, MapPin, ArrowRight } from 'lucide-react';
import { TURKEY_BIRDS } from '../data/birds';
import { BirdPhoto } from './BirdPhoto';
import { birdAudioSynth } from '../utils/audioSynth';
import { CORRECT, WRONG, CheckBar } from '../../../components/ui';

type Mode = 'compare' | 'analogy';

interface AnalogyItem {
  id: string;
  knownBirdId: string;
  knownTrait: string;
  knownAnswer: string;
  promptBirdId: string;
  promptTrait: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

/** Gaga tipi → ana besin ilişkisi; birds.ts'deki gerçek beakType/diet alanlarından türetildi. */
const ANALOGY_ITEMS: AnalogyItem[] = [
  {
    id: 'an-1',
    knownBirdId: 'flamingo',
    knownTrait: 'Kıvrık Süzgeç Gaga',
    knownAnswer: 'Artemia karidesi',
    promptBirdId: 'kelaynak',
    promptTrait: 'Aşağı Kıvrık Sonda Gaga',
    correctAnswer: 'Akrep ve örümcek',
    options: ['Akrep ve örümcek', 'Güvercin ve uçan kuşlar', 'Tohum ve filiz'],
    explanation: 'Kelaynak, Flamingo gibi kıvrık ama ince bir sonda gagayla kaya oyuklarındaki akrep ve örümcekleri çıkarır.',
  },
  {
    id: 'an-2',
    knownBirdId: 'sah-kartal',
    knownTrait: 'Çengelli Parçalayıcı Gaga',
    knownAnswer: 'Kemirgen (gelengi)',
    promptBirdId: 'gokdogan',
    promptTrait: 'Çentikli Şahin Gagası',
    correctAnswer: 'Güvercin ve uçan kuşlar',
    options: ['Güvercin ve uçan kuşlar', 'Artemia karidesi', 'Tatlı su balığı'],
    explanation: 'Gökdoğanın çentikli gagası, Şah Kartal\'ın kemirgen avlaması gibi, dik dalışta yakaladığı kuşları anında etkisiz bırakır.',
  },
  {
    id: 'an-3',
    knownBirdId: 'ibibik',
    knownTrait: 'Uzun Kavisli Cımbız Gaga',
    knownAnswer: 'Toprak altı böcek',
    promptBirdId: 'yalicapkini',
    promptTrait: 'Hançer (Zıpkın) Gaga',
    correctAnswer: 'Küçük tatlı su balığı',
    options: ['Küçük tatlı su balığı', 'Kemirgenler', 'Tohum ve filiz'],
    explanation: 'Yalıçapkını, İbibik\'in toprağı eşelemesi gibi, hançer gagasını suya daldırarak küçük balıkları avlar.',
  },
  {
    id: 'an-4',
    knownBirdId: 'ak-pelikan',
    knownTrait: 'Dev Deri Kese Gaga',
    knownAnswer: 'Tatlı su balığı',
    promptBirdId: 'turac',
    promptTrait: 'Tohum Kırıcı Sağlam Gaga',
    correctAnswer: 'Tohum, filiz ve böcek',
    options: ['Tohum, filiz ve böcek', 'Akrep ve örümcek', 'Güvercin ve uçan kuşlar'],
    explanation: 'Turaç, Ak Pelikan\'ın balık kepçelemesi gibi, güçlü gagasıyla çalılık tabanındaki sert tohum ve böcekleri çıtlatır.',
  },
];

/** E12 (Karşılaştırma) + E13 (Benzetme) dili: sekmeli iki alt görünüm. */
export const CompareAndAnalogyActivity: React.FC = () => {
  const [mode, setMode] = useState<Mode>('compare');

  // --- Karşılaştır sekmesi state ---
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

  // --- Benzetme sekmesi state ---
  const [analogyIdx, setAnalogyIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const a = ANALOGY_ITEMS[analogyIdx];
  const knownBird = TURKEY_BIRDS.find((b) => b.id === a.knownBirdId);
  const promptBird = TURKEY_BIRDS.find((b) => b.id === a.promptBirdId);
  const answered = picked !== null;
  const isRight = answered && picked === a.correctAnswer;

  const handlePick = (opt: string) => {
    if (answered) return;
    setPicked(opt);
  };

  const handleNextAnalogy = () => {
    setAnalogyIdx((prev) => (prev + 1) % ANALOGY_ITEMS.length);
    setPicked(null);
  };

  return (
    <div className="space-y-4">
      {/* Sekme geçişi */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-[18px]" style={{ background: '#EDE6DB' }}>
        {(['compare', 'analogy'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            style={{ background: mode === m ? '#1C1B19' : 'transparent', color: mode === m ? '#FFFFFF' : '#1C1B19' }}
            className="h-11 rounded-[14px] font-extrabold text-sm transition-all"
          >
            {m === 'compare' ? 'Karşılaştır' : 'Benzetme'}
          </button>
        ))}
      </div>

      {mode === 'compare' ? (
        <div className="space-y-4">
          {/* Kuş Seçim Menüsü */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-[18px] space-y-1" style={{ background: '#FFFFFF', border: '1px solid #E6E0D6' }}>
              <label htmlFor="select-bird-1" className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: '#77716A' }}>
                1. Kuş
              </label>
              <select
                id="select-bird-1"
                value={bird1Id}
                onChange={(e) => setBird1Id(e.target.value)}
                className="w-full p-2 rounded-[12px] text-xs font-bold focus:outline-none"
                style={{ background: '#FAF8F5', border: '1px solid #E6E0D6', color: '#1C1B19' }}
              >
                {TURKEY_BIRDS.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-[18px] space-y-1" style={{ background: '#FFFFFF', border: '1px solid #E6E0D6' }}>
              <label htmlFor="select-bird-2" className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: '#77716A' }}>
                2. Kuş
              </label>
              <select
                id="select-bird-2"
                value={bird2Id}
                onChange={(e) => setBird2Id(e.target.value)}
                className="w-full p-2 rounded-[12px] text-xs font-bold focus:outline-none"
                style={{ background: '#FAF8F5', border: '1px solid #E6E0D6', color: '#1C1B19' }}
              >
                {TURKEY_BIRDS.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Açık (bird1) / Koyu (bird2) yan yana kartlar */}
          <div className="grid grid-cols-1 gap-3">
            {[
              { bird: bird1, dark: false },
              { bird: bird2, dark: true },
            ].map(({ bird, dark }) => (
              <div
                key={bird.id}
                className="rounded-[24px] p-4 space-y-3"
                style={{ background: dark ? '#1F2A44' : '#FFFFFF', color: dark ? '#FFFFFF' : '#1C1B19', border: dark ? 'none' : '1px solid #E6E0D6' }}
              >
                <div className="aspect-video w-full rounded-[18px] overflow-hidden relative" style={{ background: dark ? '#2E3D5F' : '#F7F4EE' }}>
                  <BirdPhoto
                    src={bird.imageUrl}
                    fallbackSrc={bird.fallbackImageUrl}
                    alt={bird.name}
                    birdId={bird.id}
                    aspectRatio="video"
                    className="w-full h-full rounded-[18px]"
                  />
                  <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold backdrop-blur-md ${bird.color.badgeBg} ${bird.color.badgeText}`}>
                    {bird.category}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg font-extrabold">{bird.name}</h3>
                    <p className="text-xs italic" style={{ color: dark ? '#C7D0E4' : '#6B665E' }}>{bird.scientificName}</p>
                  </div>
                  <button
                    onClick={() => handlePlay(bird.id)}
                    className="p-2 rounded-[14px]"
                    style={{ background: dark ? '#2E3D5F' : '#FAF8F5' }}
                    title="Sesi Dinle"
                    aria-label={`${bird.name} sesini dinle`}
                  >
                    <Volume2 className="w-4 h-4" style={{ color: playingId === bird.id ? 'var(--accent)' : dark ? '#FFFFFF' : '#1C1B19' }} />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-[14px]" style={{ background: dark ? '#2E3D5F' : '#FAF8F5' }}>
                    <Utensils className="w-3.5 h-3.5 shrink-0" style={{ color: dark ? '#C7D0E4' : '#77716A' }} />
                    <div>
                      <span className="block text-[10px] uppercase font-bold" style={{ color: dark ? '#C7D0E4' : '#77716A' }}>Gaga Tipi</span>
                      <span className="font-bold">{bird.beakType}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-[14px]" style={{ background: dark ? '#2E3D5F' : '#FAF8F5' }}>
                    <Feather className="w-3.5 h-3.5 shrink-0" style={{ color: dark ? '#C7D0E4' : '#77716A' }} />
                    <div className="flex gap-4">
                      <div>
                        <span className="block text-[10px] uppercase font-bold" style={{ color: dark ? '#C7D0E4' : '#77716A' }}>Kanat Açıklığı</span>
                        <span className="font-bold">{bird.wingspan}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold" style={{ color: dark ? '#C7D0E4' : '#77716A' }}>Ağırlık</span>
                        <span className="font-bold">{bird.weight}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-[14px]" style={{ background: dark ? '#2E3D5F' : '#FAF8F5' }}>
                    <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: dark ? '#C7D0E4' : '#77716A' }} />
                    <div>
                      <span className="block text-[10px] uppercase font-bold" style={{ color: dark ? '#C7D0E4' : '#77716A' }}>Habitat & Besin</span>
                      <span className="font-bold">{bird.habitat}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-[18px] text-xs leading-relaxed" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <strong>{bird1.name}</strong> ({bird1.beakType}) ile <strong>{bird2.name}</strong> ({bird2.beakType}) morfolojik olarak farklı avlanma biçimlerine göre özelleşmiştir.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-2.5" style={{ gridTemplateColumns: '1fr 28px 1fr' }}>
            <TraitBox label={a.knownTrait} sub={knownBird?.name} />
            <ArrowRight className="w-6 h-6 mx-auto" style={{ color: '#6B665E' }} aria-hidden="true" />
            <TraitBox label={a.knownAnswer} sub="besin" accent />

            <TraitBox label={a.promptTrait} sub={promptBird?.name} />
            <ArrowRight className="w-6 h-6 mx-auto" style={{ color: '#6B665E' }} aria-hidden="true" />
            <div
              className="h-[110px] rounded-[20px] flex flex-col items-center justify-center gap-1.5 text-center px-2"
              style={{
                background: answered ? (isRight ? CORRECT.bg : WRONG.bg) : '#F7F4EE',
                borderWidth: 2,
                borderStyle: answered ? 'solid' : 'dashed',
                borderColor: answered ? (isRight ? CORRECT.border : WRONG.border) : '#C9BFAF',
                color: answered ? (isRight ? CORRECT.fg : WRONG.fg) : '#A39C91',
              }}
            >
              {!answered ? (
                <span className="font-display text-4xl font-extrabold">?</span>
              ) : (
                <span className="font-extrabold text-sm leading-snug">{picked}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {a.options.map((opt) => {
              const isSelected = picked === opt;
              const isCorrectOpt = opt === a.correctAnswer;
              let style: { bg: string; border: string; fg: string } = { bg: '#FFFFFF', border: '#E6E0D6', fg: '#1C1B19' };
              let borderWidth = 1;
              if (answered) {
                if (isCorrectOpt) { style = CORRECT; borderWidth = 3; }
                else if (isSelected) { style = WRONG; borderWidth = 3; }
                else style = { bg: '#FFFFFF', border: '#F2EEE7', fg: '#A39C91' };
              }
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={answered}
                  onClick={() => handlePick(opt)}
                  style={{ background: style.bg, borderWidth, borderStyle: 'solid', borderColor: style.border, color: style.fg }}
                  className="h-14 rounded-[18px] px-4 font-bold text-sm text-left transition-all"
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {answered && (
            <CheckBar correct={isRight} message={a.explanation} onNext={handleNextAnalogy} />
          )}
        </div>
      )}
    </div>
  );
};

const TraitBox: React.FC<{ label: string; sub?: string; accent?: boolean }> = ({ label, sub, accent }) => (
  <div
    className="h-[110px] rounded-[20px] flex flex-col items-center justify-center gap-1 text-center px-2"
    style={{ background: accent ? 'var(--accent-light)' : '#FFFFFF', border: '1px solid #E6E0D6' }}
  >
    <span className="font-extrabold text-sm leading-snug" style={{ color: accent ? 'var(--accent)' : '#1C1B19' }}>{label}</span>
    {sub && <span className="text-[10px] font-semibold" style={{ color: '#6B665E' }}>{sub}</span>}
  </div>
);
