import React, { useState } from 'react';
import {
  Timer,
  Zap,
  Volume2,
  Wind,
  ArrowRight,
  Sliders,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { cameraAudio } from '../utils/cameraAudio';
import { TopicPracticeWidget } from './TopicPracticeWidget';

interface TopicShutterProps {
  onComplete?: () => void;
  onGoToSimulator?: () => void;
  onScoreEarned?: (points: number) => void;
}

const SHUTTER_STOPS = [
  {
    s: '1/2000s',
    numSec: 0.0005,
    motion: 'Hareketi Havada Dondurur',
    photoUrl: 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=1200&q=80',
    title: '1/2000s: Uçan Kuşun Kanatları Havada Jilet Gibi Dondu',
    description: 'Saniyenin iki binde birinde perde açılıp kapanır. Su damlaları, kanat çırpan kuşlar ve hızlı mermiler havada asılı kalır.',
    shutterType: 'Ultra Hızlı Enstantane',
  },
  {
    s: '1/500s',
    numSec: 0.002,
    motion: 'Hızlı Hareket Net (Spor / Aksiyon)',
    photoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    title: '1/500s: Koşan Sporcu ve Zıplama Anı Keskin',
    description: 'Aksiyon sporları ve koşan çocuklar için ideal hızdır; el ve ayak hareketlerinde bulanıklık oluşmaz.',
    shutterType: 'Hızlı',
  },
  {
    s: '1/125s',
    numSec: 0.008,
    motion: 'Elde Çekim Güvenli Sınırı',
    photoUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80',
    title: '1/125s: Günlük Sokak ve Gezi Çekimleri',
    description: 'Elde tutulan kamerada nabız ve el titremesinin fotoğrafa yansımasını engelleyen standart altın eşik.',
    shutterType: 'Standart Günlük',
  },
  {
    s: '1/15s',
    numSec: 0.067,
    motion: 'Dinamik Hareket İzi (Hafif Bulanıklık)',
    photoUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    title: '1/15s: Yanından Geçen Bisikletlinin Hareket Akışı',
    description: 'Sabit nesneler net kalırken hareket eden öğeler bulanıklaşarak fotoğrafa hız ve hareket hissi katar.',
    shutterType: 'Yavaş (Tripod Önerilir)',
  },
  {
    s: '1s',
    numSec: 1.0,
    motion: 'Uzun Pozlama (İpeksi Şelale & Işık İzi)',
    photoUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    title: '1s: Şelale Suyu Pamuk ve İpek Gibi Akıyor',
    description: 'Perde 1 tam saniye açık kalır. Rüzgardaki yapraklar ve şelalenin suyu pürüzsüzleşir, büyüleyici bir sanat tablosuna dönüşür.',
    shutterType: 'Uzun Pozlama (Tripod Şart)',
  },
];

export const TopicShutter: React.FC<TopicShutterProps> = ({
  onComplete,
  onGoToSimulator,
  onScoreEarned,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const current = SHUTTER_STOPS[selectedIdx];

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    cameraAudio.playShutterSound(SHUTTER_STOPS[idx].numSec);
    if (onComplete) onComplete();
  };

  const handlePlaySound = () => {
    cameraAudio.playShutterSound(current.numSec);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* KART 1: ENSTANTANE KONU KARTI & GERÇEK FOTOĞRAF İNCELEMESİ */}
      <div className="bg-white border-2 border-[#EBE7E0] rounded-[24px] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Üst Konu Başlığı */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0ECE6] pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[20px] bg-[var(--accent-light)] border border-[var(--accent)]/30 text-[var(--accent)] flex items-center justify-center shrink-0">
              <Timer className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-light)]/70 px-2 py-0.5 rounded-md ">
                  2. Temel Konu
                </span>
                <span className="text-xs text-stone-500 ">Deklanşör Süresi</span>
              </div>
              <h2 className="text-2xl font-black text-[#1F1E1B] mt-0.5">Enstantane Hızı ve Hareket</h2>
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

        {/* Hız Seçici Butonlar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-stone-800">
              <Sliders className="w-4 h-4 text-[var(--accent)]" />
              Enstantane Hızı Seçin:
            </span>
            <span className="font-bold text-[var(--accent)] bg-[var(--accent-light)] px-2.5 py-1 rounded-lg border border-[var(--accent)]/30">
              Seçili: {current.s} ({current.shutterType})
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {SHUTTER_STOPS.map((stop, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <button
                  key={stop.s}
                  onClick={() => handleSelect(idx)}
                  className={`p-3 sm:p-4 rounded-[20px] border text-center transition-all flex flex-col items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-md scale-105'
                      : 'bg-[#FAF8F5] border-[#EBE7E0] text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <Timer className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[var(--accent)]'}`} />
                  <span className="font-black text-xs sm:text-sm">{stop.s}</span>
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

            {/* Gerçek Fotoğraf Üzerindeki Bilgi Şeridi */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 flex flex-col justify-between p-4 sm:p-5 pointer-events-none">
              <div className="flex items-center justify-between">
                <span className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-[16px] text-[var(--accent)] text-xs font-bold border border-[var(--accent)]/30">
                  Gerçek Çekim Hızı: {current.s}
                </span>
                <span className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-[16px] text-white text-xs border border-white/20">
                  {current.shutterType}
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
                1/2000s (Hareketi Dondur)
              </button>
              <button
                onClick={() => handleSelect(4)}
                className={`px-3 py-1.5 rounded-[16px] font-bold transition-all cursor-pointer ${
                  selectedIdx === 4
                    ? 'bg-[var(--accent)] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                1s (İpeksi Uzun Pozlama)
              </button>
            </div>
          </div>
        </div>

        {/* Ses Dinleme ve Hareket Etkisi Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handlePlaySound}
            className="p-4 rounded-[20px] bg-[#FAF8F5] border border-[#EBE7E0] hover:bg-stone-100 transition-all flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-[16px] bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Perde Mekanizması
                </span>
                <span className="text-sm sm:text-base font-extrabold text-stone-900">
                  Deklanşör Sesini Dinle ({current.s})
                </span>
              </div>
            </div>
            <Play className="w-4 h-4 text-[var(--accent)] group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="p-4 rounded-[20px] bg-[#FAF8F5] border border-[#EBE7E0] flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-[16px] bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center shrink-0">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Fiziksel Sonuç
              </span>
              <span className="text-sm sm:text-base font-extrabold text-stone-900">{current.motion}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KART 2: ENSTANTANE DENEME & EZBERLEME KARTI */}
      <TopicPracticeWidget
        topicCategory="Enstantane"
        onScoreEarned={onScoreEarned}
      />
    </div>
  );
};
