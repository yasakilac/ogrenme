import React, { useState } from 'react';
import {
  Sparkles,
  Sun,
  AlertTriangle,
  ArrowRight,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { cameraAudio } from '../utils/cameraAudio';
import { TopicPracticeWidget } from './TopicPracticeWidget';

interface TopicIsoProps {
  onComplete?: () => void;
  onGoToSimulator?: () => void;
  onScoreEarned?: (points: number) => void;
}

const ISO_STOPS = [
  {
    iso: 'ISO 100',
    gain: '1x (Taban Hassasiyet)',
    noise: 'Sıfır Gren / Kristal Netlik',
    photoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    title: 'ISO 100: Kristal Netlikte Gece Şehri (Sıfır Gren)',
    description: 'Sensörün doğal taban hassasiyeti. Gökyüzü pürüzsüz simsiyahtır, bina kenarları jilet gibi keskindir ve sıfır dijital parazit vardır.',
    isoType: 'Doğal Taban Değer (Maksimum Kalite)',
    grainOverlayOpacity: 0,
  },
  {
    iso: 'ISO 400',
    gain: '4x Kazanç',
    noise: 'Temiz / Çok İnce Doku',
    photoUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    title: 'ISO 400: Akşamüstü ve Gölgeli Mekanlar',
    description: 'Işığın azaldığı durumlarda sensör sinyali 4 kat artırılır. Görüntü hala son derece temiz ve kalitelidir.',
    isoType: 'Hafif Kazanç',
    grainOverlayOpacity: 0.05,
  },
  {
    iso: 'ISO 800',
    gain: '8x Kazanç',
    noise: 'Hafif Kumlanma',
    photoUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    title: 'ISO 800: İç Mekan ve Loş Işık',
    description: 'Sensör 8 kat sinyal üretir. Yakınlaştırıldığında gölgelerde hafif bir doku hissedilmeye başlar.',
    isoType: 'Orta Kazanç',
    grainOverlayOpacity: 0.15,
  },
  {
    iso: 'ISO 1600',
    gain: '16x Kazanç',
    noise: 'Belirgin Dijital Gren',
    photoUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    title: 'ISO 1600: Konser ve Sahne Işıkları',
    description: 'Karanlıkta hızlı enstantane kullanabilmek için tercih edilir. Karanlık bölgelerde gren noktaları seçilir.',
    isoType: 'Yüksek Kazanç',
    grainOverlayOpacity: 0.35,
  },
  {
    iso: 'ISO 6400',
    gain: '64x Kazanç',
    noise: 'Yoğun Dijital Parazit (Gren)',
    photoUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    title: 'ISO 6400: Gece Gökyüzü ve Zifiri Karanlık',
    description: 'Sinyal 64 kat yükseltilmiştir. Zayıf fotonlarla birlikte elektriksel gürültü de yükseldiği için pikseller kum gibi grenli çıkar.',
    isoType: 'Aşırı Yüksek (Son Çare)',
    grainOverlayOpacity: 0.65,
  },
];

export const TopicIso: React.FC<TopicIsoProps> = ({
  onComplete,
  onGoToSimulator,
  onScoreEarned,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const current = ISO_STOPS[selectedIdx];

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    cameraAudio.playDialTick();
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* KART 1: ISO KONU KARTI & GERÇEK FOTOĞRAF İNCELEMESİ */}
      <div className="bg-white border-2 border-[#EBE7E0] rounded-[24px] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Üst Konu Başlığı */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0ECE6] pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[20px] bg-[var(--accent-light)] border border-[var(--accent)]/30 text-[var(--accent)] flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-light)]/70 px-2 py-0.5 rounded-md ">
                  3. Temel Konu
                </span>
                <span className="text-xs text-stone-500 ">Sensör Duyarlılığı</span>
              </div>
              <h2 className="text-2xl font-black text-[#1F1E1B] mt-0.5">ISO ve Sensör Hassasiyeti</h2>
            </div>
          </div>

          {onGoToSimulator && (
            <button
              onClick={onGoToSimulator}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[16px] text-xs font-bold bg-stone-900 hover:bg-black text-white transition-colors cursor-pointer self-start sm:self-center"
            >
              <span>Simülatörde Dene</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ISO Butonları */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-stone-800">
              <Sliders className="w-4 h-4 text-[var(--accent)]" />
              ISO Hassasiyetini Seçin:
            </span>
            <span className="font-bold text-[var(--accent)] bg-[var(--accent-light)] px-2.5 py-1 rounded-lg border border-[var(--accent)]/30">
              Seçili: {current.iso} ({current.isoType})
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {ISO_STOPS.map((stop, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <button
                  key={stop.iso}
                  onClick={() => handleSelect(idx)}
                  className={`p-3 sm:p-4 rounded-[20px] border text-center transition-all flex flex-col items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-md scale-105'
                      : 'bg-[#FAF8F5] border-[#EBE7E0] text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <Sparkles className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[var(--accent)]'}`} />
                  <span className="font-black text-xs sm:text-sm">{stop.iso}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* GERÇEK FOTOĞRAF GÖRSELİ (CANLI ÖNİZLEME) */}
        <div className="space-y-3">
          <div className="relative rounded-[20px] overflow-hidden border-2 border-stone-300 bg-stone-900 shadow-md">
            <img
              src={current.photoUrl}
              alt={current.title}
              referrerPolicy="no-referrer"
              className="w-full h-64 sm:h-80 object-cover transition-opacity duration-300"
            />

            {/* Dijital Gren / Kumlanma Katmanı (Yüksek ISO'da gerçekçi parazit simülasyonu) */}
            {current.grainOverlayOpacity > 0 && (
              <div
                className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-300"
                style={{
                  opacity: current.grainOverlayOpacity,
                  backgroundImage:
                    'radial-gradient(#fff 1px, transparent 1px), radial-gradient(#ef4444 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)',
                  backgroundSize: '3px 3px, 4px 4px, 5px 5px',
                  backgroundPosition: '0 0, 1px 1px, 2px 2px',
                }}
              />
            )}

            {/* Gerçek Fotoğraf Üzerindeki Bilgi Şeridi */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 flex flex-col justify-between p-4 sm:p-5 pointer-events-none">
              <div className="flex items-center justify-between">
                <span className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-[16px] text-[var(--accent)] text-xs font-bold border border-[var(--accent)]/30">
                  Gerçek Çekim Değeri: {current.iso}
                </span>
                <span className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-[16px] text-white text-xs border border-white/20">
                  {current.noise}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-white font-black text-base sm:text-lg leading-snug drop-shadow-md">
                  {current.title}
                </h3>
                <p className="text-stone-200 text-xs sm:text-sm leading-relaxed max-w-2xl drop-shadow-xs">
                  {current.description}
                </p>
              </div>
            </div>
          </div>

          {/* Hızlı Karşılaştırma İki Fotoğraf Butonu */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#FAF8F5] border border-[#EBE7E0] rounded-[20px] text-xs">
            <span className="font-bold text-stone-700">Hızlı Karşılaştırma Yap:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelect(0)}
                className={`px-3 py-1.5 rounded-[16px] font-bold transition-all cursor-pointer ${
                  selectedIdx === 0
                    ? 'bg-[var(--accent)] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                ISO 100 (Kristal Temiz)
              </button>
              <button
                onClick={() => handleSelect(4)}
                className={`px-3 py-1.5 rounded-[16px] font-bold transition-all cursor-pointer ${
                  selectedIdx === 4
                    ? 'bg-[var(--accent)] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                ISO 6400 (Grenli Gece)
              </button>
            </div>
          </div>
        </div>

        {/* Sinyal Kazancı & Gren Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-[20px] bg-[#FAF8F5] border border-[#EBE7E0] flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-[16px] bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Sensör Sinyal Kazancı
              </span>
              <span className="text-sm sm:text-base font-extrabold text-stone-900">{current.gain}</span>
            </div>
          </div>

          <div className="p-4 rounded-[20px] bg-[#FAF8F5] border border-[#EBE7E0] flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-[16px] bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Kumlanma (Gren / Gürültü)
              </span>
              <span className="text-sm sm:text-base font-extrabold text-stone-900">{current.noise}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KART 2: ISO DENEME & EZBERLEME KARTI */}
      <TopicPracticeWidget
        topicCategory="ISO"
        onScoreEarned={onScoreEarned}
      />
    </div>
  );
};
