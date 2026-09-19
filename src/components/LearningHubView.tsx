import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Code, 
  Globe, 
  Brain, 
  ArrowRight, 
  Search,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  GraduationCap
} from 'lucide-react';
import { UserProgressData } from '../types';

interface LearningHubViewProps {
  progress: UserProgressData;
  onSelectJapanese: () => void;
}

interface AreaItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Dil' | 'Teknoloji' | 'Kültür & Sanat' | 'Genel';
  tag: string;
  description: string;
  features: string[];
  status: 'active' | 'planned';
  progressPercent?: number;
  highlight?: boolean;
}

export const LearningHubView: React.FC<LearningHubViewProps> = ({
  progress,
  onSelectJapanese
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'languages' | 'tech' | 'culture'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats for Japanese
  const studiedCount = Object.values(progress.characters).filter(
    (c) => c.masteryLevel > 0
  ).length;
  const totalKana = 214; // roughly total unique hiragana + katakana entries
  const jaProgress = Math.min(100, Math.round((studiedCount / totalKana) * 100));

  const learningAreas: AreaItem[] = [
    {
      id: 'japanese',
      title: 'Japonca Öğren',
      subtitle: 'Hiragana & Katakana Temelleri',
      category: 'Dil',
      tag: 'İlk Proje • Aktif',
      description: 'Sesli telaffuzlar, 13 ders ünitesi, interaktif çizim tuvali, kelime kartları ve testlerle Japonca alfabe ustalığı.',
      features: ['Hiragana & Katakana', 'Sesli Telaffuzlar', 'İnteraktif Çizim', 'Kelime & Test Modülü'],
      status: 'active',
      progressPercent: jaProgress,
      highlight: true
    },
    {
      id: 'kanji',
      title: 'Japonca Kanji & N5 Kelimeleri',
      subtitle: 'Görsel Hatırlatıcılar & Radikaller',
      category: 'Dil',
      tag: 'Planlanan • Çok Yakında',
      description: 'En çok kullanılan temel 100 Kanji, birleşme mantığı ve JLPT N5 sınavına hazırlık kelime dağarcığı.',
      features: ['100 Temel Kanji', 'On-yomi & Kun-yomi', 'Örnek Cümleler', 'Yazım Sırası Animasyonları'],
      status: 'planned'
    },
    {
      id: 'korean',
      title: 'Korece Hangul Alfabesi',
      subtitle: 'Bilimsel Alfabe Mimarisi',
      category: 'Dil',
      tag: 'Planlanan • Dil Modülü',
      description: 'Kral Sejong tarafından tasarlanan Hangul harf blokları, ünlü ve ünsüz seslerin telaffuzu ve basit cümleler.',
      features: ['Hangul Blokları', 'Sesli Karşılaştırma', 'Yazım Kuralları', 'Hızlı Ezber Kartları'],
      status: 'planned'
    },
    {
      id: 'python',
      title: 'Yapay Zeka & Python Temelleri',
      subtitle: 'Programlama Mantığı ve Algoritma',
      category: 'Teknoloji',
      tag: 'Planlanan • Kodlama',
      description: 'Temel veri yapıları, fonksiyonlar, algoritmik düşünme ve modern yapay zeka araçları için Python öğrenimi.',
      features: ['İnteraktif Kod Alanı', 'Algoritmalar', 'Proje Tabanlı Görevler', 'Mini Quizler'],
      status: 'planned'
    },
    {
      id: 'history_culture',
      title: 'Dünya Kültürleri & Tarih Notları',
      subtitle: 'Görsel & Sesli Hikayeler',
      category: 'Kültür & Sanat',
      tag: 'Planlanan • Genel Kültür',
      description: 'Farklı coğrafyaların mimarisi, tarihi olaylar ve kültürel geleneklerin derlendiği kısa öğrenme hapları.',
      features: ['Görsel Atlas', 'Tarih Zaman Çizelgesi', 'Hap Bilgiler', 'Özet Seslendirmeler'],
      status: 'planned'
    }
  ];

  const filteredAreas = learningAreas.filter((item) => {
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'languages' && item.category === 'Dil') ||
      (selectedFilter === 'tech' && item.category === 'Teknoloji') ||
      (selectedFilter === 'culture' && item.category === 'Kültür & Sanat');

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 sm:pb-12 max-w-5xl mx-auto">
      
      {/* 1. ÖĞRENME PLATFORMU ÜST BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#FAF8F5] to-rose-50/50 border border-[#E8E4DC] rounded-3xl p-5 sm:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-white text-xs font-bold shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5 text-rose-400" />
              <span>Öğrenme Platformu & Keşif Alanı</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1F1E1B] tracking-tight">
              Ne Öğrenmek İstiyorsunuz?
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-[#5C574F] leading-relaxed">
              Öğrenmek istediğiniz konuların yer aldığı merkezi öğrenme alanındasınız. 
              İlk projemiz olan <span className="font-bold text-rose-700">Japonca Öğren</span> bölümü tam donanımlı olarak hazır. Zamanla yeni diller ve farklı öğrenme alanları bu merkeze dahil olacaktır.
            </p>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 pt-2 flex-wrap text-xs font-semibold text-[#5C574F]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E4DC]">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Aktif Çalışılan: <strong className="text-[#1F1E1B]">Japonca</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E4DC]">
                <Layers className="w-4 h-4 text-rose-600" />
                <span>Harf İlerlemesi: <strong className="text-rose-700">%{jaProgress}</strong></span>
              </div>
            </div>
          </div>

          {/* Featured First Project Direct Card */}
          <div className="w-full md:w-80 bg-white border-2 border-rose-200 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110 pointer-events-none opacity-60" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/80">
                1. Proje • Aktif
              </span>
              <span className="text-2xl font-japanese font-black text-rose-700">
                日本語
              </span>
            </div>
            <h2 className="text-base font-black text-[#1F1E1B] mt-1">
              Japonca Öğren
            </h2>
            <p className="text-xs text-[#7A756D] mt-1 line-clamp-2">
              Hiragana ve Katakana alfabeleri, dersler, sesli telaffuzlar ve testler.
            </p>
            <button
              type="button"
              id="hub-hero-open-japanese"
              onClick={onSelectJapanese}
              className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-98"
            >
              <span>Japonca Bölümüne Git</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. ARAMA VE KATEGORİ FİLTRELERİ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A09A8F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            id="hub-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Öğrenme alanı ara (örn: Japonca, Kodlama, Korece)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E4DC] text-xs sm:text-sm text-[#1F1E1B] placeholder:text-[#A09A8F] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {[
            { id: 'all' as const, label: 'Tüm Alanlar' },
            { id: 'languages' as const, label: 'Diller' },
            { id: 'tech' as const, label: 'Teknoloji & Kod' },
            { id: 'culture' as const, label: 'Kültür & Sanat' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              id={`hub-filter-${tab.id}`}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedFilter === tab.id
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white border border-[#E8E4DC] text-[#5C574F] hover:text-[#1F1E1B] hover:border-stone-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. ÖĞRENME ALANLARI LİSTESİ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAreas.map((item) => {
          const isActive = item.status === 'active';

          return (
            <div
              key={item.id}
              id={`hub-card-${item.id}`}
              className={`rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between relative ${
                isActive
                  ? 'bg-white border-rose-300 ring-2 ring-rose-100/80 shadow-xs hover:border-rose-400'
                  : 'bg-[#FAF8F5] border-[#E8E4DC] opacity-90 hover:opacity-100 hover:border-stone-300 hover:bg-white'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        {item.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                      }`}>
                        {item.tag}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-[#1F1E1B] mt-2 tracking-tight">
                      {item.title}
                    </h2>
                    <span className="text-xs font-semibold text-[#7A756D] block mt-0.5">
                      {item.subtitle}
                    </span>
                  </div>

                  {isActive ? (
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center font-japanese font-black text-2xl text-rose-700 shrink-0 shadow-2xs">
                      日
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 shrink-0">
                      <Clock className="w-5 h-5 text-stone-400" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#5C574F] leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Key Features Chips */}
                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                  {item.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium px-2 py-0.8 rounded-lg bg-stone-100/80 text-stone-700"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>

                {/* Progress bar if active */}
                {isActive && (
                  <div className="bg-rose-50/70 border border-rose-200/60 rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-950 mb-1.5">
                      <span>Japonca Öğrenme İlerlemeniz</span>
                      <span>%{item.progressPercent}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-rose-200/80 overflow-hidden">
                      <div
                        className="h-full bg-rose-600 rounded-full transition-all duration-500"
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-[#F0ECE4]">
                {isActive ? (
                  <button
                    type="button"
                    id="btn-open-japanese-module"
                    onClick={onSelectJapanese}
                    className="w-full py-3 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-98"
                  >
                    <span>Japonca Öğrenmeye Başla / Devam Et</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-full py-2.5 px-4 rounded-xl bg-stone-100 text-stone-500 font-bold text-xs flex items-center justify-center gap-2 select-none">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Geliştirme Aşamasında • Yakında Eklenecek</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. ALT BİLGİ VE YOL HARİTASI NOTU */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#7A756D]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Yeni öğrenme alanları ve ders modülleri bu ana merkeze eklenecektir. İstediğiniz an üst menüden Japonca ve diğer alanlar arasında geçiş yapabilirsiniz.
          </span>
        </div>
      </div>

    </div>
  );
};
