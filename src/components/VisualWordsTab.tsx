import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  RotateCw, 
  CheckCircle, 
  XCircle, 
  Layers, 
  Filter, 
  Search,
  Eye,
  EyeOff,
  HelpCircle,
  Play
} from 'lucide-react';
import { PracticeWord, AlphabetType } from '../types';
import { PRACTICE_WORDS } from '../data/wordsData';
import { loadCustomWords } from '../utils/storage';
import { soundManager } from '../utils/sound';

interface VisualWordsTabProps {
  initialAlphabet?: AlphabetType;
}

export const VisualWordsTab: React.FC<VisualWordsTabProps> = ({ initialAlphabet = 'hiragana' }) => {
  // Combine built-in visual words with any user-created words from admin panel
  const customWords = loadCustomWords();
  const allWords: PracticeWord[] = useMemo(() => {
    return [...PRACTICE_WORDS, ...customWords];
  }, [customWords]);

  // Tab sub-mode: 'cards' (Resimli Kartlar) | 'quiz' (Kırmızı Harfi Bul) | 'gallery' (Görsel Sözlük)
  const [subMode, setSubMode] = useState<'cards' | 'quiz' | 'gallery'>('cards');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAlphabet, setSelectedAlphabet] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered words
  const filteredWords = useMemo(() => {
    return allWords.filter((w) => {
      const matchCat = selectedCategory === 'all' || w.category === selectedCategory;
      const matchAlp = selectedAlphabet === 'all' || w.alphabet === selectedAlphabet;
      const matchSearch = 
        !searchQuery ||
        w.kana.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.romaji.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.meaningTr.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchAlp && matchSearch;
    });
  }, [allWords, selectedCategory, selectedAlphabet, searchQuery]);

  // Card view state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(true);

  // Quiz view state
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  // Available categories
  const categories = useMemo(() => {
    const set = new Set(allWords.map((w) => w.category));
    return ['all', ...Array.from(set)];
  }, [allWords]);

  const activeCardWord = filteredWords[currentIndex] || filteredWords[0] || allWords[0];

  // Helper to split and colorize the target letter in red
  const renderHighlightedKana = (kana: string, targetKana: string) => {
    if (!targetKana) {
      // Highlight first character by default
      const first = kana.slice(0, 1);
      const rest = kana.slice(1);
      return (
        <span>
          <span className="text-rose-600 font-extrabold text-3xl sm:text-5xl drop-shadow-sm">{first}</span>
          <span className="text-[#1F1E1B] font-bold text-3xl sm:text-5xl">{rest}</span>
        </span>
      );
    }

    const idx = kana.indexOf(targetKana);
    if (idx === -1) {
      return <span className="text-[#1F1E1B] font-bold text-3xl sm:text-5xl">{kana}</span>;
    }

    const before = kana.slice(0, idx);
    const target = kana.slice(idx, idx + targetKana.length);
    const after = kana.slice(idx + targetKana.length);

    return (
      <span>
        {before && <span className="text-[#1F1E1B] font-bold text-3xl sm:text-5xl">{before}</span>}
        <span className="text-rose-600 font-black text-3xl sm:text-5xl underline decoration-rose-400 decoration-wavy decoration-2 drop-shadow-sm">
          {target}
        </span>
        {after && <span className="text-[#1F1E1B] font-bold text-3xl sm:text-5xl">{after}</span>}
      </span>
    );
  };

  // Helper to highlight Romaji
  const renderHighlightedRomaji = (romaji: string, targetRomaji: string) => {
    if (!targetRomaji) return romaji;
    const idx = romaji.toLowerCase().indexOf(targetRomaji.toLowerCase());
    if (idx === -1) return romaji;

    const before = romaji.slice(0, idx);
    const target = romaji.slice(idx, idx + targetRomaji.length);
    const after = romaji.slice(idx + targetRomaji.length);

    return (
      <span className="font-mono">
        {before}
        <strong className="text-rose-600 font-black px-0.5 underline">{target}</strong>
        {after}
      </span>
    );
  };

  // Play audio for letter and word
  const handlePlayLetter = (letter: string) => {
    soundManager.speak(letter);
  };

  const handlePlayWord = (word: string) => {
    soundManager.speak(word);
  };

  // Card navigation
  const handleNextCard = () => {
    if (filteredWords.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevCard = () => {
    if (filteredWords.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const handleShuffleCards = () => {
    if (filteredWords.length <= 1) return;
    const next = Math.floor(Math.random() * filteredWords.length);
    setCurrentIndex(next);
  };

  // Quiz logic
  const currentQuizWord = filteredWords[quizIndex % Math.max(1, filteredWords.length)] || allWords[0];
  
  // Generate 4 choices for the quiz
  const quizChoices = useMemo(() => {
    if (!currentQuizWord) return [];
    const correctLetter = currentQuizWord.targetKana || currentQuizWord.kana.slice(0, 1);
    
    // Pick other random letters
    const otherLetters = allWords
      .map((w) => w.targetKana || w.kana.slice(0, 1))
      .filter((l) => l !== correctLetter);
    
    const uniqueOthers = Array.from(new Set(otherLetters)).sort(() => 0.5 - Math.random());
    const distractors = uniqueOthers.slice(0, 3);
    
    return [correctLetter, ...distractors].sort(() => 0.5 - Math.random());
  }, [currentQuizWord, allWords]);

  const handleQuizAnswer = (choice: string) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(choice);
    setIsAnswerChecked(true);

    const correctLetter = currentQuizWord.targetKana || currentQuizWord.kana.slice(0, 1);
    const isCorrect = choice === correctLetter;

    if (isCorrect) {
      soundManager.playSuccessTone();
      setQuizScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      soundManager.playErrorTone();
      setQuizScore((prev) => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setQuizIndex((prev) => (prev + 1) % Math.max(1, filteredWords.length));
  };

  return (
    <div className="space-y-6 pb-24 sm:pb-12 max-w-4xl mx-auto">
      {/* --- HEADER BANNER --- */}
      <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 border border-rose-200/80 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-600 text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Resimli Kelime & Harf Ezberi
              </span>
              <span className="text-xs text-[#7A756D] font-medium hidden sm:inline">
                İlk Harfi Kırmızı Vurgulu Alıştırmalar
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F1E1B] tracking-tight">
              Görsel Hafıza ile Harf Öğrenimi
            </h1>
            <p className="text-sm text-[#5C574F] mt-1 max-w-xl">
              Görseli incele, kırmızı renkli başlangıç harfine odaklan ve gerçek telaffuzu dinleyerek Japonca kelime dağarcığını hızla büyüt.
            </p>
          </div>

          {/* Sub-Mode Selector */}
          <div className="flex bg-[#EBE7DF] p-1 rounded-xl w-full sm:w-auto shadow-inner">
            <button
              id="mode-cards"
              onClick={() => setSubMode('cards')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                subMode === 'cards'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-[#5C574F] hover:text-[#1F1E1B]'
              }`}
            >
              📸 Kartlar
            </button>
            <button
              id="mode-quiz"
              onClick={() => setSubMode('quiz')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                subMode === 'quiz'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-[#5C574F] hover:text-[#1F1E1B]'
              }`}
            >
              🎯 Harf Testi
            </button>
            <button
              id="mode-gallery"
              onClick={() => setSubMode('gallery')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                subMode === 'gallery'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-[#5C574F] hover:text-[#1F1E1B]'
              }`}
            >
              📖 Galeri ({filteredWords.length})
            </button>
          </div>
        </div>

        {/* --- FILTERS ROW --- */}
        <div className="mt-4 pt-4 border-t border-[#E6E1D8]/80 flex flex-wrap items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <span className="text-xs font-bold text-[#7A756D] mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-rose-700 text-white'
                    : 'bg-white text-[#5C574F] border border-[#E6E1D8] hover:bg-[#F9F7F2]'
                }`}
              >
                {cat === 'all' ? 'Tümü' : cat}
              </button>
            ))}
          </div>

          {/* Alphabet toggle */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => { setSelectedAlphabet('all'); setCurrentIndex(0); }}
              className={`px-2.5 py-1 rounded-lg font-bold ${selectedAlphabet === 'all' ? 'bg-white border border-[#D1CABE] text-[#1F1E1B]' : 'text-[#7A756D]'}`}
            >
              Tümü
            </button>
            <button
              onClick={() => { setSelectedAlphabet('hiragana'); setCurrentIndex(0); }}
              className={`px-2.5 py-1 rounded-lg font-bold ${selectedAlphabet === 'hiragana' ? 'bg-white border border-rose-300 text-rose-700' : 'text-[#7A756D]'}`}
            >
              Hiragana
            </button>
            <button
              onClick={() => { setSelectedAlphabet('katakana'); setCurrentIndex(0); }}
              className={`px-2.5 py-1 rounded-lg font-bold ${selectedAlphabet === 'katakana' ? 'bg-white border border-amber-300 text-amber-700' : 'text-[#7A756D]'}`}
            >
              Katakana
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-MODE 1: RESİMLİ KELİME KARTLARI                       */}
      {/* ========================================================= */}
      {subMode === 'cards' && (
        <div className="space-y-4">
          {activeCardWord ? (
            <motion.div
              key={activeCardWord.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-[#E6E1D8] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              {/* Card Image Container */}
              <div className="relative w-full h-64 sm:h-80 bg-[#F2EFE9] overflow-hidden group">
                <img
                  src={activeCardWord.imageUrl}
                  alt={activeCardWord.meaningTr}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />

                {/* Top overlay pills */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/65 backdrop-blur-md text-white">
                    {activeCardWord.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/90 backdrop-blur-md text-[#1F1E1B] border border-white/40 shadow-xs">
                    {currentIndex + 1} / {filteredWords.length}
                  </span>
                </div>

                {/* Target Letter Floating Badge on the image */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md border border-white/60 rounded-2xl p-2.5 shadow-lg flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                    <span className="text-2xl font-black text-rose-600">
                      {activeCardWord.targetKana || activeCardWord.kana.slice(0, 1)}
                    </span>
                  </div>
                  <div className="text-left pr-1">
                    <span className="text-[10px] uppercase font-bold text-[#7A756D] block">Hedef Harf</span>
                    <span className="text-xs font-bold text-[#1F1E1B]">
                      {activeCardWord.targetRomaji || 'hedef'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlayLetter(activeCardWord.targetKana || activeCardWord.kana.slice(0, 1))}
                    className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all active:scale-95"
                    title="Hedef harfin sesini dinle"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Content & Japanese Word with Red Initial Letter */}
              <div className="p-5 sm:p-8 text-center space-y-4">
                {/* Highlighted Japanese Word */}
                <div className="flex items-center justify-center gap-3">
                  {renderHighlightedKana(
                    activeCardWord.kana,
                    activeCardWord.targetKana || activeCardWord.kana.slice(0, 1)
                  )}

                  {/* Play Word Sound Button */}
                  <button
                    type="button"
                    id="play-word-audio"
                    onClick={() => handlePlayWord(activeCardWord.kana)}
                    className="w-11 h-11 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center transition-all shadow-xs active:scale-95 ml-2"
                    title="Tüm kelimenin telaffuzunu dinle"
                  >
                    <Volume2 className="w-5 h-5 text-amber-800" />
                  </button>
                </div>

                {/* Romaji with red highlighted target sound */}
                <div className="text-lg text-[#5C574F]">
                  {renderHighlightedRomaji(
                    activeCardWord.romaji,
                    activeCardWord.targetRomaji || ''
                  )}
                </div>

                {/* Meaning section with toggle */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMeaning(!showMeaning)}
                    className="text-xs font-semibold text-[#7A756D] hover:text-[#1F1E1B] inline-flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-[#F2EFE9] transition-colors"
                  >
                    {showMeaning ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showMeaning ? 'Türkçe Anlamı Gizle' : 'Türkçe Anlamı Göster'}</span>
                  </button>

                  <AnimatePresence>
                    {showMeaning && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2"
                      >
                        <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 block">
                          {activeCardWord.meaningTr}
                        </span>
                        {activeCardWord.hint && (
                          <span className="text-xs text-[#7A756D] mt-1 block">
                            💡 {activeCardWord.hint}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dual Audio Actions Bar */}
                <div className="pt-4 border-t border-[#E6E1D8]/80 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handlePlayLetter(activeCardWord.targetKana || activeCardWord.kana.slice(0, 1))}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Volume2 className="w-4 h-4 text-rose-600" />
                    <span>Kırmızı Harfin Sesi ({activeCardWord.targetKana || activeCardWord.kana.slice(0, 1)})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlayWord(activeCardWord.kana)}
                    className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Volume2 className="w-4 h-4 text-amber-700" />
                    <span>Kelime Okunuşu ({activeCardWord.kana})</span>
                  </button>
                </div>
              </div>

              {/* Card Footer Navigation Buttons */}
              <div className="bg-[#FAF8F5] border-t border-[#E6E1D8] p-3 sm:p-4 flex items-center justify-between">
                <button
                  type="button"
                  id="prev-word-card"
                  onClick={handlePrevCard}
                  className="px-4 py-2 rounded-xl bg-white border border-[#E6E1D8] text-xs sm:text-sm font-bold text-[#1F1E1B] hover:bg-[#F2EFE9] flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Önceki</span>
                </button>

                <button
                  type="button"
                  onClick={handleShuffleCards}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[#5C574F] hover:text-[#1F1E1B] hover:bg-white transition-all flex items-center gap-1"
                  title="Rastgele Karıştır"
                >
                  <Shuffle className="w-4 h-4" />
                  <span className="hidden sm:inline">Rastgele</span>
                </button>

                <button
                  type="button"
                  id="next-word-card"
                  onClick={handleNextCard}
                  className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                >
                  <span>Sonraki</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="p-12 text-center bg-white border border-[#E6E1D8] rounded-2xl">
              <p className="text-[#5C574F] text-sm">Seçilen filtrelere uygun kelime bulunamadı.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-MODE 2: KIRMIZI HARFİ SEÇME TESTİ                     */}
      {/* ========================================================= */}
      {subMode === 'quiz' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E6E1D8] rounded-3xl overflow-hidden shadow-sm p-4 sm:p-6">
            {/* Quiz Top Score Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E6E1D8]">
              <div>
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">
                  Kırmızı Harfi Tamamlama
                </span>
                <h3 className="text-lg font-black text-[#1F1E1B]">
                  Görseldeki kelimenin ilk harfi hangisidir?
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#7A756D] block">Doğru / Toplam</span>
                <span className="text-base font-black text-emerald-700">
                  {quizScore.correct} / {quizScore.total}
                </span>
              </div>
            </div>

            {/* Quiz Image & Clue */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-60 h-48 sm:h-52 rounded-2xl overflow-hidden border border-[#E6E1D8] relative shrink-0 shadow-inner">
                <img
                  src={currentQuizWord.imageUrl}
                  alt={currentQuizWord.meaningTr}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-sm">
                  {currentQuizWord.category}
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                  <span>Türkçe Anlamı:</span>
                  <strong className="text-sm text-amber-950">{currentQuizWord.meaningTr}</strong>
                </div>

                {/* Display Japanese word with missing red blank box */}
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                  <div className="w-12 h-12 rounded-xl border-2 border-dashed border-rose-500 bg-rose-50 flex items-center justify-center">
                    {isAnswerChecked ? (
                      <span className="text-3xl font-black text-rose-600">
                        {currentQuizWord.targetKana || currentQuizWord.kana.slice(0, 1)}
                      </span>
                    ) : (
                      <span className="text-xl font-bold text-rose-400">?</span>
                    )}
                  </div>
                  <span className="text-3xl font-bold text-[#1F1E1B]">
                    {currentQuizWord.kana.slice((currentQuizWord.targetKana || currentQuizWord.kana.slice(0, 1)).length)}
                  </span>
                </div>

                <p className="text-xs text-[#7A756D]">
                  Romaji İpucu: <strong className="font-mono text-sm text-[#1F1E1B]">{currentQuizWord.romaji}</strong>
                </p>
              </div>
            </div>

            {/* 4 Interactive Red Choice Buttons */}
            <div className="mt-6 pt-5 border-t border-[#E6E1D8] grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quizChoices.map((choice) => {
                const correctLetter = currentQuizWord.targetKana || currentQuizWord.kana.slice(0, 1);
                const isSelected = selectedAnswer === choice;
                const isCorrect = choice === correctLetter;

                let btnStyle = 'bg-white border-[#E6E1D8] hover:border-rose-300 text-[#1F1E1B]';
                if (isAnswerChecked) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-300';
                  } else {
                    btnStyle = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={choice}
                    onClick={() => handleQuizAnswer(choice)}
                    disabled={isAnswerChecked}
                    className={`p-4 rounded-2xl border-2 text-center transition-all shadow-xs active:scale-95 ${btnStyle}`}
                  >
                    <span className="text-3xl sm:text-4xl font-black block mb-1 text-rose-600">
                      {choice}
                    </span>
                    <span className="text-xs text-[#7A756D] font-mono block">
                      (Tıkla & Dinle)
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quiz Result Banner & Next Button */}
            {isAnswerChecked && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D8] flex flex-col sm:flex-row items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  {selectedAnswer === (currentQuizWord.targetKana || currentQuizWord.kana.slice(0, 1)) ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-sm font-bold text-emerald-800">
                        Harika! Doğru harfi buldun: "{currentQuizWord.targetKana || currentQuizWord.kana.slice(0, 1)}"
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span className="text-sm font-bold text-rose-800">
                        Doğru cevap: "{currentQuizWord.targetKana || currentQuizWord.kana.slice(0, 1)}" harfi olmalıydı.
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handlePlayWord(currentQuizWord.kana)}
                    className="px-3 py-2 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-200 transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Kelimeyi Dinle</span>
                  </button>

                  <button
                    type="button"
                    id="quiz-next-question"
                    onClick={handleNextQuizQuestion}
                    className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
                  >
                    <span>Sıradaki Soru</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-MODE 3: GÖRSEL SÖZLÜK GALERİSİ (GRID)                  */}
      {/* ========================================================= */}
      {subMode === 'gallery' && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7A756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Türkçe anlam veya Japonca kelime ara (örn: kedi, inu, neko)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E6E1D8] text-sm text-[#1F1E1B] placeholder-[#A09A8F] focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {filteredWords.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E6E1D8] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col"
              >
                {/* Thumbnail Image */}
                <div className="relative h-32 w-full bg-[#F2EFE9] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.meaningTr}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                    {item.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-3 text-center flex-1 flex flex-col justify-between space-y-1.5">
                  <div>
                    <div className="text-lg font-bold">
                      {renderHighlightedKana(
                        item.kana,
                        item.targetKana || item.kana.slice(0, 1)
                      )}
                    </div>
                    <div className="text-xs text-[#7A756D] font-mono">
                      {item.romaji}
                    </div>
                    <div className="text-xs font-bold text-emerald-800 mt-1">
                      {item.meaningTr}
                    </div>
                  </div>

                  {/* Audio Buttons */}
                  <div className="pt-2 border-t border-[#E6E1D8]/60 flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePlayLetter(item.targetKana || item.kana.slice(0, 1))}
                      className="px-2 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      title="Kırmızı harfin sesini dinle"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{item.targetKana || item.kana.slice(0, 1)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePlayWord(item.kana)}
                      className="px-2 py-1 rounded-md bg-[#F2EFE9] hover:bg-[#E6E1D8] text-[#1F1E1B] text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      title="Tüm kelimeyi dinle"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Kelime</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
