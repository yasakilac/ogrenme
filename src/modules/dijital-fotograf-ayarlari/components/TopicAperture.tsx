import React, { useState } from 'react';
import {
  Aperture,
  Sun,
  Eye,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { cameraAudio } from '../utils/cameraAudio';
import { TopicPracticeWidget } from './TopicPracticeWidget';

interface TopicApertureProps {
  onComplete?: () => void;
  onGoToSimulator?: () => void;
  onScoreEarned?: (points: number) => void;
}

const APERTURE_STOPS = [
  {
    f: 'f/1.4',
    light: 'Maksimum Işık (%100)',
    dof: 'Çok Sığ (Yoğun Bokeh)',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    title: 'f/1.4: Model Kristal Net, Arka Plan Kremsi Bulanık (Bokeh)',
    description: 'Diyafram sonuna kadar açık. Işık deliği çok geniştir; sensöre bol ışık girer ve model dışındaki tüm arka plan rüya gibi bulanıklaşır.',
    apertureMm: 'Geniş Açıklık',
  },
  {
    f: 'f/2.8',
    light: 'Yüksek Işık (%50)',
    dof: 'Sığ Alan Derinliği',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    title: 'f/2.8: Belirgin Bokeh, Yüz ve Saçlar Net',
    description: 'Portreler için ideal alan derinliği; model öne çıkar, arka plan yumuşaktır.',
    apertureMm: 'Geniş',
  },
  {
    f: 'f/5.6',
    light: 'Dengeli Işık (%25)',
    dof: 'Orta Alan Derinliği',
    photoUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    title: 'f/5.6: Sokak ve Günlük Çekimler',
    description: 'Özne net, çevre ortam ve mekan detayları da anlaşılır biçimde görünür.',
    apertureMm: 'Orta',
  },
  {
    f: 'f/11',
    light: 'Az Işık (%6)',
    dof: 'Geniş Alan Derinliği',
    photoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    title: 'f/11: Manzara Netliği (Önden Arkaya Her Yer Net)',
    description: 'Diyafram deliği kısılmıştır. Ön plandaki nehir taşlarından en uzaktaki karlı dağlara kadar her piksel keskindir.',
    apertureMm: 'Kısık',
  },
  {
    f: 'f/16',
    light: 'Minimum Işık (%3)',
    dof: 'Maksimum Derinlik (Tüm Sahne Net)',
    photoUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    title: 'f/16: Panoramik Doğa ve Güneş Yıldızı',
    description: 'Diyafram deliği iğne ucu kadar küçülmüştür. Işık çok azalır fakat kadrajın tamamı sıfır bulanıklıkla net çıkar.',
    apertureMm: 'Çok Kısık',
  },
];

export const TopicAperture: React.FC<TopicApertureProps> = ({
  onComplete,
  onGoToSimulator,
  onScoreEarned,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const current = APERTURE_STOPS[selectedIdx];

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    cameraAudio.playDialTick();
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* KART 1: DİYAFRAM KONU KARTI & GERÇEK FOTOĞRAF İNCELEMESİ */}
      <div className="bg-white border-2 border-[#EBE7E0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Üst Konu Başlığı */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0ECE6] pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <Aperture className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md font-mono">
                  1. Temel Konu
                </span>
                <span className="text-xs text-stone-500 font-mono">f/stop Değeri</span>
              </div>
              <h2 className="text-2xl font-black text-[#1F1E1B] mt-0.5">Diyafram ve Alan Derinliği</h2>
            </div>
          </div>

          {onGoToSimulator && (
            <button
              onClick={onGoToSimulator}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-stone-900 hover:bg-black text-white transition-colors cursor-pointer self-start sm:self-center"
            >
              <span>Simülatörde Dene</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Diyafram Basamak Butonları */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-stone-800">
              <Sliders className="w-4 h-4 text-amber-600" />
              Diyafram Basamağı Seçin:
            </span>
            <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              Seçili: {current.f} ({current.apertureMm})
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {APERTURE_STOPS.map((stop, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <button
                  key={stop.f}
                  onClick={() => handleSelect(idx)}
                  className={`p-3 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                      : 'bg-[#FAF8F5] border-[#EBE7E0] text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full border-2 border-current flex items-center justify-center font-mono text-[10px] font-bold ${
                      isSelected ? 'bg-white/20' : 'bg-stone-200/50'
                    }`}
                  >
                    f
                  </div>
                  <span className="font-mono font-black text-xs sm:text-sm">{stop.f}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* GERÇEK FOTOĞRAF GÖRSELİ (CANLI ÖNİZLEME) */}
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border-2 border-stone-300 bg-stone-900 shadow-md">
            <img
              src={current.photoUrl}
              alt={current.title}
              referrerPolicy="no-referrer"
              className="w-full h-64 sm:h-80 object-cover transition-opacity duration-300"
            />

            {/* Gerçek Fotoğraf Üzerindeki Bilgi Şeridi */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 flex flex-col justify-between p-4 sm:p-5 pointer-events-none">
              <div className="flex items-center justify-between">
                <span className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-xl text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                  Gerçek Çekim Değeri: {current.f}
                </span>
                <span className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-xl text-white font-mono text-xs border border-white/20">
                  {current.apertureMm}
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
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#FAF8F5] border border-[#EBE7E0] rounded-2xl text-xs">
            <span className="font-bold text-stone-700">Hızlı Karşılaştırma Yap:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelect(0)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedIdx === 0
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                f/1.4 (Sığ Bokeh)
              </button>
              <button
                onClick={() => handleSelect(3)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedIdx === 3
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                f/11 (Her Yer Net)
              </button>
            </div>
          </div>
        </div>

        {/* Işık ve Alan Derinliği Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7E0] flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Sensöre Giren Işık
              </span>
              <span className="text-sm sm:text-base font-extrabold text-stone-900">{current.light}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7E0] flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Arka Plan (Alan Derinliği)
              </span>
              <span className="text-sm sm:text-base font-extrabold text-stone-900">{current.dof}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KART 2: DİYAFRAM DENEME & EZBERLEME KARTI */}
      <TopicPracticeWidget
        topicCategory="Diyafram"
        onScoreEarned={onScoreEarned}
      />
    </div>
  );
};
