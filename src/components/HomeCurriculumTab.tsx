import React from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  BookOpen, 
  ArrowRight,
  Flame,
  Award,
  Layers,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { KanaCharacter, UserProgressData, AlphabetType } from '../types';
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
  onNavigateTab: (tab: 'home' | 'table' | 'visual_words' | 'flashcards' | 'quiz' | 'drawing' | 'admin') => void;
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

  const handlePlaySound = (e: React.MouseEvent, char: KanaCharacter) => {
    e.stopPropagation();
    const symbol = alphabet === 'hiragana' ? char.hiragana : char.katakana;
    soundManager.speak(symbol);
  };

  return (
    <div className="space-y-6 pb-24 sm:pb-12 max-w-4xl mx-auto">
      {/* --- TOP BANNER & ALPHABET SWITCHER --- */}
      <div className="bg-gradient-to-br from-[#FAF8F5] via-white to-[#F2EFE9] border border-[#E6E1D8] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                Japonca Temel Yolculuğu
              </span>
              <span className="text-xs text-[#7A756D] font-medium hidden sm:inline">
                Gerçek Tokyo İnsan Sesleri ile
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1E1B] tracking-tight">
              {alphabet === 'hiragana' ? 'Hiragana Müfredatı' : 'Katakana Müfredatı'}
            </h1>
            <p className="text-sm text-[#7A756D] mt-1 max-w-xl">
              Konu başlıklarını sırasıyla takip et, gerçek insan telaffuzlarını dinle ve resimli kelime alıştırmalarıyla ezberini pekiştir.
            </p>
          </div>

          {/* Alphabet Toggle Buttons */}
          <div className="flex bg-[#EBE7DF] p-1 rounded-xl w-full sm:w-auto shadow-inner">
            <button
              id="switch-to-hiragana"
              onClick={() => setAlphabet('hiragana')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                alphabet === 'hiragana'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-[#5C574F] hover:text-[#1F1E1B]'
              }`}
            >
              あ Hiragana
            </button>
            <button
              id="switch-to-katakana"
              onClick={() => setAlphabet('katakana')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                alphabet === 'katakana'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-[#5C574F] hover:text-[#1F1E1B]'
              }`}
            >
              ア Katakana
            </button>
          </div>
        </div>

        {/* --- PROGRESS BAR & STREAK BAR --- */}
        <div className="mt-5 pt-5 border-t border-[#E6E1D8]/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/80 p-3 rounded-xl border border-[#E6E1D8]">
            <span className="text-xs text-[#7A756D] font-medium block">İlerleme Oranı</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-[#1F1E1B]">%{progressPercent}</span>
              <span className="text-xs text-[#7A756D]">({masteredCount}/{totalBasic})</span>
            </div>
            <div className="w-full bg-[#EBE7DF] h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-[#E6E1D8]">
            <span className="text-xs text-[#7A756D] font-medium block">Günlük Seri</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-xl font-black text-[#1F1E1B]">{progress.stats.streakDays}</span>
              <span className="text-xs text-[#7A756D]">Gün</span>
            </div>
            <span className="text-[11px] text-amber-700 font-medium block mt-1">Harika gidiyorsun!</span>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-[#E6E1D8]">
            <span className="text-xs text-[#7A756D] font-medium block">Öğrenilen / Usta</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-rose-600">{learningCount}</span>
              <span className="text-xs text-[#7A756D]">/</span>
              <span className="text-xl font-black text-emerald-600">{masteredCount}</span>
            </div>
            <span className="text-[11px] text-[#7A756D] block mt-1">Harf Seviyesi</span>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-[#E6E1D8]">
            <span className="text-xs text-[#7A756D] font-medium block">Çözülen Soru</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-[#1F1E1B]">{progress.stats.totalQuizQuestions}</span>
              <span className="text-xs text-emerald-600 font-semibold">
                ({progress.stats.totalQuizQuestions > 0 ? Math.round((progress.stats.correctQuizQuestions / progress.stats.totalQuizQuestions) * 100) : 0}% Başarı)
              </span>
            </div>
            <span className="text-[11px] text-[#7A756D] block mt-1">{progress.stats.totalQuizzesCompleted} Test Bitti</span>
          </div>
        </div>
      </div>

      {/* --- "KALDIĞIN YERİ GÖSTERME" (RESUME WHERE YOU LEFT OFF) HERO CARD --- */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute right-4 -bottom-6 text-9xl font-black text-white/10 select-none pointer-events-none">
          {alphabet === 'hiragana' ? lastKana.hiragana : lastKana.katakana}
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-rose-100">
              <BookOpen className="w-3.5 h-3.5" />
              Kaldığın Yer
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-3">
              <span>{lastTopic.title}</span>
              <span className="text-xs px-2.5 py-1 bg-amber-400 text-amber-950 font-bold rounded-lg uppercase tracking-wide">
                {lastTopic.subtitle}
              </span>
            </h2>
            <p className="text-rose-100 text-sm max-w-lg">
              Son çalıştığın harf: <strong className="text-white text-base">"{alphabet === 'hiragana' ? lastKana.hiragana : lastKana.katakana}" ({lastKana.romaji})</strong> - {lastKana.trPronunciation}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              id="resume-listen-button"
              onClick={(e) => handlePlaySound(e, lastKana)}
              className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold flex items-center gap-2 transition-all border border-white/20 active:scale-95"
              title="Gerçek insan sesini dinle"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span>Sesi Dinle</span>
            </button>

            <button
              id="resume-study-button"
              onClick={() => onStartTopicStudy(lastTopic.kanaIds)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-sm font-black flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-amber-950" />
              <span>Kaldığın Yerden Devam Et</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- QUICK SHORTCUT BANNER FOR VISUAL WORDS --- */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-300 flex items-center justify-center shrink-0">
            <ImageIcon className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h3 className="font-bold text-base text-amber-950 flex items-center gap-2">
              <span>Resimli Kelime Ezberi & Kırmızı Harf Alıştırması</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-rose-600 text-white rounded-full">Yeni</span>
            </h3>
            <p className="text-xs text-amber-900 mt-0.5">
              Görsel altında Japonca kelime ve ilk harfi kırmızı renkte vurgulu pratik modu.
            </p>
          </div>
        </div>
        <button
          id="open-visual-words-shortcut"
          onClick={() => onNavigateTab('visual_words')}
          className="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm shrink-0 active:scale-95"
        >
          <span>Resimli Çalışmaya Geç</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* --- YAPILANDIRILMIŞ KONU BAŞLIKLARI (TOPICS CURRICULUM) --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#1F1E1B]">
              Müfredat ve Konu Başlıkları
            </h2>
            <p className="text-xs text-[#7A756D]">
              Her konunun içindeki harfleri dinleyebilir, üzerine tıklayarak detayını inceleyebilir veya direkt konuyu çalışabilirsin.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#EBE7DF] text-[#5C574F] rounded-lg">
            {TOPIC_LESSONS.length} Konu
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {TOPIC_LESSONS.map((topic, index) => {
            // Find kana objects for this topic
            const topicKanas = topic.kanaIds
              .map((id) => KANA_DATA.find((k) => k.id === id))
              .filter((k): k is KanaCharacter => Boolean(k));

            // Topic progress calculation
            let topicMastered = 0;
            topicKanas.forEach((k) => {
              const p = progress.characters[`${alphabet}_${k.id}`];
              if (p && p.masteryLevel >= 2) topicMastered++;
            });
            const isCompleted = topicKanas.length > 0 && topicMastered === topicKanas.length;
            const isStarted = topicMastered > 0;

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`border rounded-2xl p-4 sm:p-5 transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : isStarted
                    ? 'bg-white border-amber-200 shadow-sm ring-1 ring-amber-100'
                    : 'bg-white border-[#E6E1D8] hover:border-[#D1CABE]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isStarted
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#EBE7DF] text-[#5C574F]'
                      }`}>
                        {isCompleted ? '✓ Tamamlandı' : isStarted ? 'Devam Ediyor' : 'Başlanmadı'}
                      </span>
                      <span className="text-xs text-[#7A756D] font-medium">
                        {topicMastered} / {topicKanas.length} Harf
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-[#1F1E1B]">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-[#5C574F] max-w-xl">
                      {topic.descriptionTr}
                    </p>
                  </div>

                  {/* Right Action: Start topic study button */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    <button
                      id={`study-topic-${topic.id}`}
                      onClick={() => onStartTopicStudy(topic.kanaIds)}
                      className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                        isCompleted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-rose-700 hover:bg-rose-800 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCompleted ? 'Tekrar Et' : isStarted ? 'Çalışmaya Devam Et' : 'Bu Konuyu Çalış'}</span>
                    </button>
                  </div>
                </div>

                {/* Kana Chips within topic */}
                <div className="mt-3.5 pt-3 border-t border-[#E6E1D8]/60 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-[#7A756D] mr-1">Harfler:</span>
                  {topicKanas.map((k) => {
                    const charProgress = progress.characters[`${alphabet}_${k.id}`];
                    const level = charProgress ? charProgress.masteryLevel : 0;
                    const charSymbol = alphabet === 'hiragana' ? k.hiragana : k.katakana;

                    return (
                      <div
                        key={k.id}
                        onClick={() => onOpenCharacter(k)}
                        className={`group relative flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-xl border text-xs font-semibold cursor-pointer transition-all active:scale-95 ${
                          level === 3
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : level >= 1
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-[#F9F7F2] text-[#1F1E1B] border-[#E6E1D8] hover:bg-white'
                        }`}
                        title={`${k.romaji} - ${k.trPronunciation}. Detay için tıkla`}
                      >
                        <span className="text-base font-bold">{charSymbol}</span>
                        <span className="text-[11px] text-[#7A756D] font-mono">({k.romaji})</span>

                        {/* Direct human audio play icon */}
                        <button
                          type="button"
                          onClick={(e) => handlePlaySound(e, k)}
                          className="w-5 h-5 rounded-md hover:bg-black/10 flex items-center justify-center transition-colors"
                          title="Gerçek insan sesini dinle"
                        >
                          <Volume2 className="w-3 h-3 text-[#5C574F] group-hover:text-rose-700" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
