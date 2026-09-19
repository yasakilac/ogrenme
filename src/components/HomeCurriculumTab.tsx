import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Volume2, 
  BookOpen, 
  ArrowRight,
  Flame,
  Layers,
  Image as ImageIcon,
  Grid3X3,
  HelpCircle,
  PenTool,
  Compass,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { KanaCharacter, UserProgressData, AlphabetType, ActiveTab } from '../types';
import { TOPIC_LESSONS } from '../data/wordsData';
import { KANA_DATA } from '../data/kanaData';
import { soundManager } from '../utils/sound';
import { loadLastStudied } from '../utils/storage';

interface HomeCurriculumTabProps {
  alphabet: AlphabetType;
  setAlphabet: (alp: AlphabetType) => void;
  progress: UserProgressData;
  onOpenCharacter: (char: KanaCharacter) => void;
  onStartTopicStudy: (kanaIds: string[]) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const HomeCurriculumTab: React.FC<HomeCurriculumTabProps> = ({
  alphabet,
  setAlphabet,
  progress,
  onOpenCharacter,
  onStartTopicStudy,
  onNavigateTab
}) => {
  const lastStudied = loadLastStudied();

  // Selected topic for focused view (defaults to last studied topic or 1st topic)
  const [activeTopicId, setActiveTopicId] = useState<string>(lastStudied.topicId || TOPIC_LESSONS[0].id);
  const [showAllTopics, setShowAllTopics] = useState(false);

  // Calculate statistics
  const currentAlphabetChars = KANA_DATA.filter((k) => k.category === 'seion');
  const totalBasic = currentAlphabetChars.length;
  
  let masteredCount = 0;
  let learningCount = 0;
  
  currentAlphabetChars.forEach((k) => {
    const key = `${alphabet}_${k.id}`;
    const p = progress.characters[key];
    if (p && p.masteryLevel >= 2) {
      masteredCount++;
    } else if (p && p.masteryLevel >= 1) {
      learningCount++;
    }
  });

  const progressPercent = totalBasic > 0 ? Math.round((masteredCount / totalBasic) * 100) : 0;

  // Resolve last studied character and topic
  const lastKana = KANA_DATA.find((k) => k.id === lastStudied.kanaId) || KANA_DATA[0];
  const lastTopic = TOPIC_LESSONS.find((t) => t.id === lastStudied.topicId) || TOPIC_LESSONS[0];

  // Active focused topic
  const currentFocusedTopic = TOPIC_LESSONS.find((t) => t.id === activeTopicId) || lastTopic;
  const currentTopicKanas = currentFocusedTopic.kanaIds
    .map((id) => KANA_DATA.find((k) => k.id === id))
    .filter((k): k is KanaCharacter => Boolean(k));

  const handlePlaySound = (e: React.MouseEvent, char: KanaCharacter) => {
    e.stopPropagation();
    const symbol = alphabet === 'hiragana' ? char.hiragana : char.katakana;
    soundManager.speak(symbol);
  };

  // Activity Quick Nav Cards (Icon-driven modular hub)
  const activityModules = [
    {
      id: 'visual_words' as ActiveTab,
      title: 'Resimli Kelimeler',
      desc: 'Görsel hafıza kartları ve ilk harfi kırmızı kelime ezberi',
      icon: ImageIcon,
      tag: 'Yeni & Popüler',
      accentBg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      iconColor: 'text-rose-600',
      hoverBorder: 'hover:border-rose-300'
    },
    {
      id: 'table' as ActiveTab,
      title: 'Harf Tablosu',
      desc: 'Tüm heceler, dakuon ve bileşik sesler stüdyo kayıtlarıyla',
      icon: Grid3X3,
      tag: '50+ Ses',
      accentBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      iconColor: 'text-indigo-600',
      hoverBorder: 'hover:border-indigo-300'
    },
    {
      id: 'flashcards' as ActiveTab,
      title: 'Ezber Kartları',
      desc: 'Çevirmeli kartlar ile hızlı harf ve telaffuz antrenmanı',
      icon: Layers,
      tag: 'Hızlı Pratik',
      accentBg: 'bg-amber-50 text-amber-800 border-amber-200/80',
      iconColor: 'text-amber-600',
      hoverBorder: 'hover:border-amber-300'
    },
    {
      id: 'quiz' as ActiveTab,
      title: 'Alıştırma & Test',
      desc: 'Çoktan seçmeli, ses tanıma ve harf eşleştirme sınavı',
      icon: HelpCircle,
      tag: 'Puanlı Test',
      accentBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      iconColor: 'text-emerald-600',
      hoverBorder: 'hover:border-emerald-300'
    },
    {
      id: 'drawing' as ActiveTab,
      title: 'Fırça & Çizim',
      desc: 'Doğru vuruş sırası ve yönleriyle Japonca yazı tuvali',
      icon: PenTool,
      tag: 'El Yazısı',
      accentBg: 'bg-teal-50 text-teal-800 border-teal-200/80',
      iconColor: 'text-teal-600',
      hoverBorder: 'hover:border-teal-300'
    },
    {
      id: 'guide' as ActiveTab,
      title: 'Rehber & Kurallar',
      desc: 'Tenten, maru, yoon ve Türkçe-Japonca fonetik mantığı',
      icon: BookOpen,
      tag: 'Ders Notu',
      accentBg: 'bg-stone-100 text-stone-800 border-stone-200',
      iconColor: 'text-stone-700',
      hoverBorder: 'hover:border-stone-300'
    }
  ];

  return (
    <div className="space-y-6 pb-24 sm:pb-12 max-w-4xl mx-auto">
      
      {/* --- 1. GÖZ YORMAYAN SAKİN ÜST BANNER & DÜZEN --- */}
      <div className="bg-white border border-[#E8E4DC] rounded-3xl p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-[#7A756D]">
                Öğrenme Portalı • Gerçek İnsan Sesleri
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1F1E1B] tracking-tight mt-1">
              Japonca Öğrenme Merkezi
            </h1>
            <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5 max-w-lg">
              İhtiyacın olan çalışma modunu seç veya kaldığın konudan devam et.
            </p>
          </div>

          {/* Minimalist Alphabet Switcher */}
          <div className="flex items-center bg-[#F2EFEA] p-1 rounded-2xl border border-[#E2DDD4] shrink-0 self-start sm:self-auto">
            <button
              id="switch-to-hiragana"
              onClick={() => setAlphabet('hiragana')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                alphabet === 'hiragana'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-[#6C675E] hover:text-[#1F1E1D]'
              }`}
            >
              <span className="w-4 h-4 rounded-md bg-rose-100 text-rose-800 flex items-center justify-center text-[11px] font-black">あ</span>
              <span>Hiragana</span>
            </button>
            <button
              id="switch-to-katakana"
              onClick={() => setAlphabet('katakana')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                alphabet === 'katakana'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-[#6C675E] hover:text-[#1F1E1D]'
              }`}
            >
              <span className="w-4 h-4 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center text-[11px] font-black">ア</span>
              <span>Katakana</span>
            </button>
          </div>
        </div>

        {/* Calm Compact Stats Strip (Eye-friendly, not loud) */}
        <div className="mt-4 pt-3.5 border-t border-[#F0ECE4] grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
            </div>
            <div>
              <span className="text-[11px] text-[#7A756D] block font-medium">Seri</span>
              <span className="text-sm sm:text-base font-bold text-[#1F1E1B]">{progress.stats.streakDays} Gün</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="text-[11px] text-[#7A756D] block font-medium">Usta Harf</span>
              <span className="text-sm sm:text-base font-bold text-[#1F1E1B]">{masteredCount} / {totalBasic}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/70 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <span className="text-[11px] text-[#7A756D] block font-medium">İlerleme</span>
              <span className="text-sm sm:text-base font-bold text-[#1F1E1B]">%{progressPercent}</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/70 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <span className="text-[11px] text-[#7A756D] block font-medium">Soru Sayısı</span>
              <span className="text-sm sm:text-base font-bold text-[#1F1E1B]">{progress.stats.totalQuizQuestions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. KULLANIM İKONLARINA DAYALI ANA ÇALIŞMA MERKEZİ (ICON ACTION HUB) --- */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-[#5C574F] uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-rose-600" />
            Çalışma Modları
          </h2>
          <span className="text-xs text-[#7A756D]">Modu seç ve başla</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {activityModules.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`hub-action-${item.id}`}
                onClick={() => onNavigateTab(item.id)}
                className={`p-4 rounded-2xl bg-white border border-[#E8E4DC] ${item.hoverBorder} hover:shadow-xs transition-all text-left group flex flex-col justify-between active:scale-[0.99]`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-11 h-11 rounded-2xl ${item.accentBg} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] text-[#6C675E]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#1F1E1B] group-hover:text-rose-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6A655C] mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#F2EFEA] flex items-center justify-between text-xs font-semibold text-rose-700 group-hover:translate-x-0.5 transition-transform">
                  <span>Aç</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- 3. SAKİN & ZARİF "KALDIĞIN YER" BÖLÜMÜ (COMPACT RESUME) --- */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white to-[#FAF7F2] border border-[#E8E4DC] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-rose-50 border border-rose-200/80 flex flex-col items-center justify-center text-center shrink-0 shadow-2xs">
            <span className="text-2xl font-black text-rose-700 font-japanese leading-none">
              {alphabet === 'hiragana' ? lastKana.hiragana : lastKana.katakana}
            </span>
            <span className="text-[10px] font-mono font-bold text-rose-600 mt-0.5">
              {lastKana.romaji}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-rose-100/70 text-rose-800">
                Kaldığın Yer
              </span>
              <span className="text-xs font-semibold text-[#7A756D]">
                {lastTopic.title}
              </span>
            </div>
            <p className="text-sm font-bold text-[#1F1E1B] mt-0.5">
              Son çalışılan: "{alphabet === 'hiragana' ? lastKana.hiragana : lastKana.katakana}" ({lastKana.romaji}) • {lastKana.trPronunciation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            id="resume-listen-button"
            onClick={(e) => handlePlaySound(e, lastKana)}
            className="p-2.5 rounded-xl bg-white border border-[#E8E4DC] hover:bg-[#F5F2EC] text-[#1F1E1B] transition-all shadow-2xs active:scale-95"
            title="Sesi dinle"
          >
            <Volume2 className="w-4 h-4 text-rose-600" />
          </button>

          <button
            type="button"
            id="resume-study-button"
            onClick={() => onStartTopicStudy(lastTopic.kanaIds)}
            className="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-2xs active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Devam Et</span>
          </button>
        </div>
      </div>

      {/* --- 4. ODAK KONU & MÜFREDAT GEZGİNİ (SAYFAYI BOĞMADAN DÜZENLİ GÖSTERİM) --- */}
      <div className="bg-white border border-[#E8E4DC] rounded-3xl p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-rose-600" />
              <h2 className="text-base sm:text-lg font-black text-[#1F1E1B]">
                Müfredat Odağı: {currentFocusedTopic.title}
              </h2>
            </div>
            <p className="text-xs text-[#6A655C] mt-0.5">
              {currentFocusedTopic.descriptionTr}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAllTopics(!showAllTopics)}
            className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1 py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors shrink-0"
          >
            <span>{showAllTopics ? 'Konuları Daralt' : 'Tüm Konular (10)'}</span>
            {showAllTopics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Focused Active Topic Kana Letters (Sadece seçili konunun 5 harfi, ekranı boğmaz) */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#7A756D] mr-1">Konudaki Harfler:</span>
            {currentTopicKanas.map((k) => {
              const charProgress = progress.characters[`${alphabet}_${k.id}`];
              const level = charProgress ? charProgress.masteryLevel : 0;
              const charSymbol = alphabet === 'hiragana' ? k.hiragana : k.katakana;

              return (
                <div
                  key={k.id}
                  onClick={() => onOpenCharacter(k)}
                  className={`group flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-2xs ${
                    level === 3
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : level >= 1
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-white text-[#1F1E1B] border-[#E8E4DC] hover:border-rose-300'
                  }`}
                  title={`${k.romaji} - ${k.trPronunciation}. Detay için tıkla`}
                >
                  <span className="text-base font-black font-japanese">{charSymbol}</span>
                  <span className="text-[11px] text-[#7A756D] font-mono">({k.romaji})</span>
                  <button
                    type="button"
                    onClick={(e) => handlePlaySound(e, k)}
                    className="w-5 h-5 rounded-md hover:bg-black/5 flex items-center justify-center transition-colors ml-0.5"
                    title="Doğal ses dinle"
                  >
                    <Volume2 className="w-3 h-3 text-[#7A756D] group-hover:text-rose-600" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onStartTopicStudy(currentFocusedTopic.kanaIds)}
            className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Bu Konuyu Çalış</span>
          </button>
        </div>

        {/* Collapsible Topics Selector (Kullanıcı dilediğinde diğer konulara tıklar, ekran kalabalığı önlenir) */}
        <AnimatePresence>
          {showAllTopics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-2 border-t border-[#F0ECE4] overflow-hidden"
            >
              <span className="text-xs font-bold text-[#7A756D] block">
                Tüm Konu Başlıkları:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TOPIC_LESSONS.map((topic) => {
                  const isSelected = topic.id === activeTopicId;
                  const topicKanas = topic.kanaIds
                    .map((id) => KANA_DATA.find((k) => k.id === id))
                    .filter((k): k is KanaCharacter => Boolean(k));

                  let topicMastered = 0;
                  topicKanas.forEach((k) => {
                    const p = progress.characters[`${alphabet}_${k.id}`];
                    if (p && p.masteryLevel >= 2) topicMastered++;
                  });

                  return (
                    <button
                      key={topic.id}
                      onClick={() => setActiveTopicId(topic.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-200'
                          : 'bg-white border-[#E8E4DC] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="pr-2">
                        <span className="text-xs font-bold text-[#1F1E1B] block">
                          {topic.title}
                        </span>
                        <span className="text-[11px] text-[#7A756D]">
                          {topicMastered}/{topicKanas.length} Usta Harf
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        topicMastered === topicKanas.length && topicKanas.length > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : isSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-[#F2EFEA] text-[#6C675E]'
                      }`}>
                        {isSelected ? 'Seçili' : 'Seç'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
