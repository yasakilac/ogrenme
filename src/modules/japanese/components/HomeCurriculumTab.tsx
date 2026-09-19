import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Check,
  Volume2
} from 'lucide-react';
import { KanaCharacter, UserProgressData, AlphabetType, ActiveTab } from '../../../types';
import { TOPIC_LESSONS } from '../data/wordsData';
import { KANA_DATA } from '../data/kanaData';
import { loadLastStudied } from '../../../utils/storage';
import { soundManager } from '../../../utils/sound';

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
  const [showAllTopics, setShowAllTopics] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'seion' | 'dakuon' | 'yoon'>('all');
  const [playingKanaRomaji, setPlayingKanaRomaji] = useState<string | null>(null);

  // Resolve last studied topic & character
  const lastTopic = TOPIC_LESSONS.find((t) => t.id === lastStudied.topicId) || TOPIC_LESSONS[0];
  const lastKana = KANA_DATA.find((k) => k.id === lastStudied.kanaId) || KANA_DATA[0];
  const displayLastChar = alphabet === 'hiragana' ? lastKana.hiragana : lastKana.katakana;

  const handlePlayAudio = (e: React.MouseEvent, romaji: string) => {
    e.stopPropagation();
    setPlayingKanaRomaji(romaji);
    soundManager.playSingleMoraAudio(romaji).finally(() => {
      setPlayingKanaRomaji(null);
    });
  };

  // Filter lessons according to category
  const filteredTopics = TOPIC_LESSONS.filter((topic) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'seion') return topic.order <= 10;
    if (selectedCategory === 'dakuon') return topic.order === 11 || topic.order === 12;
    if (selectedCategory === 'yoon') return topic.order === 13;
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-5 pb-24 sm:pb-12 max-w-3xl mx-auto">
      
      {/* 1. GİRİŞ VE KARŞILAMA KARTI */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#FAF8F5] to-rose-50/40 border border-[#E8E4DC] rounded-3xl p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200/70 text-rose-800 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
              <span>Japonca</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1F1E1B] tracking-tight">
              Japonca Öğrenme Ünitesi
            </h1>
            <p className="text-xs sm:text-sm text-[#5C574F] max-w-md">
              Temel alfabeler, sesli telaffuzlar ve adım adım ders konularıyla Japonca öğrenin.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-xs p-2.5 rounded-2xl border border-[#E8E4DC] shadow-2xs shrink-0">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-japanese font-black text-xl flex items-center justify-center shadow-2xs">
              {alphabet === 'hiragana' ? 'あ' : 'ア'}
            </div>
            <div className="pr-2">
              <span className="text-[11px] font-bold text-[#7A756D] uppercase block">
                Etkin Alfabe
              </span>
              <span className="text-xs font-black text-[#1F1E1B] block">
                {alphabet === 'hiragana' ? 'Hiragana (平仮名)' : 'Katakana (片仮名)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. EN ÜSTTE İKİLİ ALFABE SEÇİMİ: HIRAGANA / KATAKANA */}
      <div className="bg-white border border-[#E8E4DC] rounded-3xl p-3 sm:p-4 shadow-2xs">
        <div className="flex items-center justify-between px-1 mb-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-[#7A756D]">
            Çalışma Alfabesi
          </span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
            {alphabet === 'hiragana' ? 'Hiragana Aktif' : 'Katakana Aktif'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {/* Hiragana Button */}
          <button
            type="button"
            id="home-select-hiragana"
            onClick={() => setAlphabet('hiragana')}
            className={`p-3 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between group active:scale-[0.99] ${
              alphabet === 'hiragana'
                ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-300/70 shadow-xs'
                : 'bg-[#FAF8F5] border-[#E8E4DC] hover:bg-white hover:border-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-japanese font-black text-2xl sm:text-3xl shadow-2xs transition-transform group-hover:scale-105 ${
                alphabet === 'hiragana'
                  ? 'bg-rose-600 text-white shadow-rose-200'
                  : 'bg-white border border-[#E8E4DC] text-rose-700'
              }`}>
                あ
              </div>
              <div>
                <span className={`font-black text-sm sm:text-base block ${
                  alphabet === 'hiragana' ? 'text-rose-950' : 'text-[#1F1E1B]'
                }`}>
                  Hiragana
                </span>
                <span className="text-[11px] text-[#7A756D]">
                  Temel Japonca (平仮名)
                </span>
              </div>
            </div>
            {alphabet === 'hiragana' && (
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Katakana Button */}
          <button
            type="button"
            id="home-select-katakana"
            onClick={() => setAlphabet('katakana')}
            className={`p-3 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between group active:scale-[0.99] ${
              alphabet === 'katakana'
                ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-300/70 shadow-xs'
                : 'bg-[#FAF8F5] border-[#E8E4DC] hover:bg-white hover:border-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-japanese font-black text-2xl sm:text-3xl shadow-2xs transition-transform group-hover:scale-105 ${
                alphabet === 'katakana'
                  ? 'bg-amber-600 text-white shadow-amber-200'
                  : 'bg-white border border-[#E8E4DC] text-amber-700'
              }`}>
                ア
              </div>
              <div>
                <span className={`font-black text-sm sm:text-base block ${
                  alphabet === 'katakana' ? 'text-amber-950' : 'text-[#1F1E1B]'
                }`}>
                  Katakana
                </span>
                <span className="text-[11px] text-[#7A756D]">
                  Yabancı Kelimeler (片仮名)
                </span>
              </div>
            </div>
            {alphabet === 'katakana' && (
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 3. KALDIĞIN YERDEN DEVAM ET */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E8E4DC] shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-center shrink-0 shadow-2xs">
            <span className="font-japanese font-black text-2xl text-rose-700">
              {displayLastChar}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">
                Kaldığın Yerden Devam Et
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-rose-50 text-rose-800 border border-rose-200/60">
                {alphabet === 'hiragana' ? 'Hiragana' : 'Katakana'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#1F1E1B] mt-0.5 truncate">
              {lastTopic.title}
            </h3>
            <span className="text-xs text-[#7A756D] block truncate">
              Son çalışılan: {lastKana.romaji} ({displayLastChar})
            </span>
          </div>
        </div>

        <button
          type="button"
          id="resume-study-button"
          onClick={() => onStartTopicStudy(lastTopic.kanaIds)}
          className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-2xs active:scale-95 shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Devam Et</span>
        </button>
      </div>

      {/* 4. ÖĞRENME KONULARI (DERSLER TÜRKÇE) */}
      <div className="bg-white border border-[#E8E4DC] rounded-3xl p-4 sm:p-5 shadow-2xs">
        
        {/* Unit Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center shrink-0 shadow-2xs">
              <BookOpen className="w-5 h-5 text-rose-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#1F1E1B] tracking-tight">
                  Öğrenme Konuları
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                  13 Ünite
                </span>
              </div>
              <span className="text-xs text-[#7A756D] block mt-0.5">
                {alphabet === 'hiragana' ? 'Hiragana Müfredatı' : 'Katakana Müfredatı'}
              </span>
            </div>
          </div>

          <button
            type="button"
            id="toggle-topics"
            onClick={() => setShowAllTopics(!showAllTopics)}
            className="p-2 rounded-xl bg-[#F4F1EA] hover:bg-rose-50 text-[#5C574F] hover:text-rose-700 transition-colors"
            title="Konuları Göster/Gizle"
          >
            {showAllTopics ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Category Filter Tabs */}
        {showAllTopics && (
          <div className="pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all' as const, label: 'Tümü (13)' },
              { id: 'seion' as const, label: 'Temel Sesler (10)' },
              { id: 'dakuon' as const, label: 'Tenten & Maru (2)' },
              { id: 'yoon' as const, label: 'Bileşik Sesler (1)' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                id={`filter-cat-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-rose-700 text-white shadow-2xs'
                    : 'bg-[#FAF8F5] border border-[#E8E4DC] text-[#5C574F] hover:text-[#1F1E1B] hover:bg-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Topics List */}
        <AnimatePresence>
          {showAllTopics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-2 overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-3">
                {filteredTopics.map((topic) => {
                  const topicKanas = topic.kanaIds
                    .map((id) => KANA_DATA.find((k) => k.id === id))
                    .filter((k): k is KanaCharacter => Boolean(k));

                  let topicMastered = 0;
                  topicKanas.forEach((k) => {
                    const p = progress.characters[`${alphabet}_${k.id}`];
                    if (p && p.masteryLevel >= 2) topicMastered++;
                  });

                  const isComplete = topicMastered === topicKanas.length && topicKanas.length > 0;

                  return (
                    <div
                      key={topic.id}
                      id={`unit-${topic.id}`}
                      className="p-3.5 sm:p-4 rounded-2xl border border-[#E8E4DC] bg-[#FAF8F5] hover:bg-white hover:border-rose-300 transition-all shadow-2xs group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        
                        {/* Topic Information in Turkish */}
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm sm:text-base font-black text-[#1F1E1B]">
                              {topic.title}
                            </span>

                            {isComplete ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                                Tamamlandı ({topicMastered}/{topicKanas.length})
                              </span>
                            ) : topicMastered > 0 ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                                Çalışılıyor ({topicMastered}/{topicKanas.length})
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-[#7A756D]">
                                Başlanmadı (0/{topicKanas.length})
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-[#7A756D]">
                            <span className="font-semibold text-stone-600">{topic.subtitle}</span>
                            {topic.descriptionTr && (
                              <>
                                <span>•</span>
                                <span className="line-clamp-1">{topic.descriptionTr}</span>
                              </>
                            )}
                          </div>

                          {/* Kana Badges with direct Audio Playback */}
                          <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                            {topicKanas.map((k) => {
                              const charDisplay = alphabet === 'hiragana' ? k.hiragana : k.katakana;
                              const isPlaying = playingKanaRomaji === k.romaji;
                              const charProg = progress.characters[`${alphabet}_${k.id}`];
                              const isCharMastered = charProg && charProg.masteryLevel >= 2;

                              return (
                                <button
                                  key={k.id}
                                  type="button"
                                  onClick={(e) => handlePlayAudio(e, k.romaji)}
                                  className={`h-8 px-2.5 rounded-lg border flex items-center gap-1 font-japanese font-bold text-sm transition-all shadow-2xs active:scale-95 ${
                                    isPlaying
                                      ? 'bg-rose-600 text-white border-rose-600 scale-105'
                                      : isCharMastered
                                      ? 'bg-white border-rose-300 text-rose-700 hover:bg-rose-50'
                                      : 'bg-white border-[#E8E4DC] text-[#1F1E1B] hover:border-rose-200'
                                  }`}
                                  title={`${charDisplay} (${k.romaji}) - Telaffuz Dinle`}
                                >
                                  <span>{charDisplay}</span>
                                  <Volume2 className={`w-3 h-3 ${isPlaying ? 'text-white' : 'text-[#A09A8F]'}`} />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Action Button: Ders Çalış */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0ECE4] w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            id={`start-unit-${topic.id}`}
                            onClick={() => onStartTopicStudy(topic.kanaIds)}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xs"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Ders Çalış</span>
                          </button>
                        </div>

                      </div>
                    </div>
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
