import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Bookmark,
  Check
} from 'lucide-react';
import { KanaCharacter, UserProgressData, AlphabetType, ActiveTab } from '../types';
import { TOPIC_LESSONS } from '../data/wordsData';
import { KANA_DATA } from '../data/kanaData';
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
  onStartTopicStudy
}) => {
  const lastStudied = loadLastStudied();
  const [showAllTopics, setShowAllTopics] = useState(true);

  // Resolve last studied topic & character
  const lastTopic = TOPIC_LESSONS.find((t) => t.id === lastStudied.topicId) || TOPIC_LESSONS[0];
  const lastKana = KANA_DATA.find((k) => k.id === lastStudied.kanaId) || KANA_DATA[0];
  const displayLastChar = alphabet === 'hiragana' ? lastKana.hiragana : lastKana.katakana;

  return (
    <div className="space-y-4 sm:space-y-5 pb-24 sm:pb-12 max-w-3xl mx-auto">
      
      {/* 1. EN ÜSTTE İKİLİ YAPI: HIRAGANA / KATAKANA SEÇİMİ */}
      <div className="bg-white border border-[#E8E4DC] rounded-3xl p-3 sm:p-4 shadow-2xs">
        <div className="flex items-center justify-between px-1 mb-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-[#7A756D]">
            Çalışma Alfabesi
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
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
                  Temel Japonca
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
                  Yabancı Kelimeler
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

      {/* 2. KALDIĞIN YERDEN DEVAM ET */}
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
                Kaldığın Yer
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

      {/* 3. KONULAR */}
      <div className="bg-white border border-[#E8E4DC] rounded-3xl p-4 sm:p-5 shadow-2xs">
        <button
          type="button"
          id="toggle-topics-list"
          onClick={() => setShowAllTopics(!showAllTopics)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-stone-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#1F1E1B] group-hover:text-rose-700 transition-colors">
                Konular
              </h2>
              <span className="text-xs text-[#7A756D]">
                {TOPIC_LESSONS.length} Ders Ünitesi • {alphabet === 'hiragana' ? 'Hiragana Harfleri' : 'Katakana Harfleri'}
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#F4F1EA] group-hover:bg-rose-50 text-[#5C574F] group-hover:text-rose-700 transition-colors">
            {showAllTopics ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        <AnimatePresence>
          {showAllTopics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2.5 pt-4 mt-3 border-t border-[#F0ECE4] overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TOPIC_LESSONS.map((topic) => {
                  const topicKanas = topic.kanaIds
                    .map((id) => KANA_DATA.find((k) => k.id === id))
                    .filter((k): k is KanaCharacter => Boolean(k));

                  let topicMastered = 0;
                  topicKanas.forEach((k) => {
                    const p = progress.characters[`${alphabet}_${k.id}`];
                    if (p && p.masteryLevel >= 2) topicMastered++;
                  });

                  return (
                    <div
                      key={topic.id}
                      className="p-3.5 rounded-2xl border border-[#E8E4DC] bg-[#FAF8F5] hover:bg-white hover:border-rose-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="min-w-0 pr-1">
                        <span className="text-xs sm:text-sm font-bold text-[#1F1E1B] block truncate">
                          {topic.title}
                        </span>
                        
                        {/* Kana Badges in current Alphabet */}
                        <div className="flex items-center gap-1 mt-1 mb-1">
                          {topicKanas.map((k) => (
                            <span 
                              key={k.id}
                              className="w-6 h-6 rounded-md bg-white border border-[#E8E4DC] flex items-center justify-center font-japanese font-bold text-xs text-rose-700 shadow-2xs"
                            >
                              {alphabet === 'hiragana' ? k.hiragana : k.katakana}
                            </span>
                          ))}
                        </div>

                        <span className="text-[11px] text-[#7A756D] block">
                          {topicMastered}/{topicKanas.length} Usta Harf ({alphabet === 'hiragana' ? 'Hiragana' : 'Katakana'})
                        </span>
                      </div>

                      <button
                        type="button"
                        id={`topic-start-${topic.id}`}
                        onClick={() => onStartTopicStudy(topic.kanaIds)}
                        className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shrink-0 transition-all active:scale-95 shadow-2xs flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Başla</span>
                      </button>
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
