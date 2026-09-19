import React, { useState, useEffect } from 'react';
import { KanaCharacter, AlphabetType, KanaCategory, UserProgressData } from '../types';
import { KANA_DATA, GOJUON_ROW_LABELS } from '../data/kanaData';
import { 
  Volume2, 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  PenTool, 
  Layers, 
  Flame,
  Info,
  Compass,
  Eye
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface KanaTableTabProps {
  alphabet: AlphabetType;
  setAlphabet: (alp: AlphabetType) => void;
  progress: UserProgressData;
  onSelectCharacter: (char: KanaCharacter) => void;
  onOpenDrawing?: (char: KanaCharacter) => void;
  onNavigateToFlashcards?: () => void;
}

export const KanaTableTab: React.FC<KanaTableTabProps> = ({
  alphabet,
  setAlphabet,
  progress,
  onSelectCharacter,
  onOpenDrawing,
  onNavigateToFlashcards
}) => {
  const [category, setCategory] = useState<KanaCategory | 'all'>('seion');
  const [viewMode, setViewMode] = useState<'by_row' | 'compact_grid'>('by_row');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentlyPlayingChar, setCurrentlyPlayingChar] = useState<string | null>(null);

  // Sound event listener to show visual feedback when sound is actively playing
  useEffect(() => {
    const unsub = soundManager.addListener((speaking, text) => {
      if (!speaking) {
        setCurrentlyPlayingChar(null);
      } else {
        setCurrentlyPlayingChar(text);
      }
    });
    return unsub;
  }, []);

  // Filter characters
  const filteredKana = KANA_DATA.filter((char) => {
    if (category !== 'all' && char.category !== category) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchRomaji = char.romaji.toLowerCase().includes(q);
      const matchKana = char.hiragana.includes(q) || char.katakana.includes(q);
      const matchPronunciation = char.trPronunciation.toLowerCase().includes(q);
      const matchWord = char.sampleWords.some((w) => 
        w.word.includes(q) || w.romaji.toLowerCase().includes(q) || w.meaningTr.toLowerCase().includes(q)
      );
      return matchRomaji || matchKana || matchPronunciation || matchWord;
    }
    return true;
  });

  // Calculate Next Recommended Letter in Japanese Order
  // Scan KANA_DATA seion characters first, then dakuon, etc.
  const allSeion = KANA_DATA.filter((c) => c.category === 'seion');
  const nextChar = 
    allSeion.find((char) => {
      const prog = progress.characters[`${alphabet}_${char.id}`];
      return !prog || prog.masteryLevel < 2;
    }) || allSeion[0];

  const nextCharKana = alphabet === 'hiragana' ? nextChar.hiragana : nextChar.katakana;

  // Mastered counts
  const seionMasteredCount = allSeion.filter((c) => {
    const p = progress.characters[`${alphabet}_${c.id}`];
    return p && p.masteryLevel >= 2;
  }).length;

  const progressPercent = Math.round((seionMasteredCount / allSeion.length) * 100);

  const handleAudioPlay = (e: React.MouseEvent, char: KanaCharacter) => {
    e.stopPropagation();
    const textToSpeak = alphabet === 'hiragana' ? char.hiragana : char.katakana;
    setCurrentlyPlayingChar(textToSpeak);
    soundManager.speak(textToSpeak);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 🎯 SPOTLIGHT BANNER: "SIRADAKİ ÇALIŞMAN GEREKEN HARF" */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        <div className="flex items-center gap-4">
          {/* Big Interactive Next Kana Tile */}
          <button
            id="spotlight-next-char"
            onClick={() => onSelectCharacter(nextChar)}
            className="group relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#FAF8F5] border border-[#E2DDD4] hover:border-rose-400 flex flex-col items-center justify-center shadow-2xs hover:scale-102 active:scale-95 transition-all"
            title="Detaylar ve telaffuz için tıkla"
          >
            <span className="text-3xl sm:text-4xl font-black text-[#1F1E1D] group-hover:text-rose-600 font-japanese leading-none">
              {nextCharKana}
            </span>
            <span className="text-xs font-mono font-bold text-rose-700 mt-1">
              {nextChar.romaji}
            </span>
            <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold shadow-2xs">
              Sıradaki
            </div>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold uppercase tracking-wider">
                Yolculuğundaki Sıradaki Harf
              </span>
              <span className="text-xs text-[#7A756D] font-medium hidden sm:inline">
                {nextChar.strokeCount} çizgi
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-[#1F1E1D] mt-1">
              {nextChar.romaji.toUpperCase()} ({nextCharKana}) Harfini Öğren
            </h2>

            <p className="text-xs sm:text-sm text-[#5C564D] mt-0.5 max-w-lg">
              <strong>Türkçe Okunuşu:</strong> {nextChar.trPronunciation}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <button
                id="btn-spotlight-audio"
                onClick={(e) => handleAudioPlay(e, nextChar)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 border border-rose-200 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Sesini Dinle</span>
              </button>

              {onOpenDrawing && (
                <button
                  id="btn-spotlight-draw"
                  onClick={() => onOpenDrawing(nextChar)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F5F2EC] text-[#47433B] text-xs font-semibold flex items-center gap-1.5 border border-[#DDD6CB] transition-colors"
                >
                  <PenTool className="w-3.5 h-3.5 text-rose-600" />
                  <span>Çizerek Pratik Yap</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Learning Journey Overview Pill */}
        <div className="md:border-l md:border-[#E8E2D6] md:pl-6 space-y-2 min-w-[200px]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#7A756D] font-medium">Temel Harf Başarısı</span>
            <span className="font-bold text-[#1F1E1D]">{seionMasteredCount} / {allSeion.length}</span>
          </div>

          <div className="w-full h-2.5 bg-[#EDE8DF] rounded-full overflow-hidden">
            <div 
              className="h-full bg-rose-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-[#8C867B]">
            {progressPercent === 100 
              ? 'Tüm temel seslerde ustalaştın! Tebrikler!'
              : `${allSeion.length - seionMasteredCount} temel harf sırada bekliyor.`}
          </p>
        </div>

      </div>

      {/* FILTER & VIEW SWITCHER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-[#E8E3D8] shadow-2xs">
        
        {/* Category Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'seion' as const, label: '1. Temel Sesler (46)' },
            { id: 'dakuon' as const, label: '2. Tenten (\") Ga/Za/Da/Ba' },
            { id: 'handakuon' as const, label: '3. Maru (°) Pa' },
            { id: 'yoon' as const, label: '4. Bileşik (Kya/Sha)' },
            { id: 'all' as const, label: 'Tüm Tablo' }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`filter-table-${tab.id}`}
              onClick={() => {
                setCategory(tab.id);
                soundManager.playFlipSound();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                category === tab.id
                  ? 'bg-[#1F1E1D] text-white shadow-xs'
                  : 'bg-[#F5F2EC] text-[#555047] hover:bg-[#EBE6DC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Layout View Toggle */}
        <div className="flex items-center gap-2">
          
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-44">
            <Search className="w-3.5 h-3.5 text-[#8A847A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-search-kana"
              placeholder="Harf veya okunuş ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F5F2EC] border border-transparent focus:border-rose-400 focus:bg-white text-xs text-[#1F1E1D] outline-hidden transition-all"
            />
          </div>

          {/* View Mode Toggle: Row-by-Row vs Grid */}
          <button
            id="btn-toggle-view-mode"
            onClick={() => setViewMode(viewMode === 'by_row' ? 'compact_grid' : 'by_row')}
            className="px-2.5 py-1.5 rounded-xl bg-[#F5F2EC] hover:bg-[#EBE6DC] text-[#555047] text-xs font-semibold transition-colors whitespace-nowrap"
            title="Görünümü Değiştir"
          >
            {viewMode === 'by_row' ? 'Izgara Görünümü' : 'Satır Satır Düzen'}
          </button>
        </div>

      </div>

      {/* QUICK INSTRUCTION HINT */}
      <div className="flex items-center justify-between px-3 py-2 text-xs text-[#7A756D]">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span>Her harfin altında <strong>Romaji</strong> ve <strong>Türkçe okunuşu</strong> yazılıdır. Harfe tıklayarak detay ve yazım pratiğini açabilirsin.</span>
        </span>
        <span className="hidden sm:inline text-[#8C867B]">
          🎯 = Sıradaki önerilen harf
        </span>
      </div>

      {/* MAIN TABLE CONTENT */}
      {filteredKana.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E3D8] shadow-xs">
          <p className="text-sm font-semibold text-[#1F1E1D]">Aramanıza uygun karakter bulunamadı.</p>
          <p className="text-xs text-[#7A756D] mt-1">Lütfen farklı bir arama terimi deneyin.</p>
        </div>
      ) : viewMode === 'by_row' && category === 'seion' && !searchQuery.trim() ? (
        
        /* 1. ORDERED JAPANESE GOJUON ROWS (A-KA-SA-TA-NA-HA-MA-YA-RA-WA-N) */
        <div className="space-y-4">
          {GOJUON_ROW_LABELS.map((rowInfo) => {
            const rowChars = KANA_DATA.filter((c) => c.category === 'seion' && c.row === rowInfo.row);
            if (rowChars.length === 0) return null;

            // Row mastery stats
            const rowMasteredCount = rowChars.filter((c) => {
              const p = progress.characters[`${alphabet}_${c.id}`];
              return p && p.masteryLevel >= 2;
            }).length;

            const isRowCompleted = rowMasteredCount === rowChars.length;

            return (
              <div 
                key={rowInfo.row}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E3D8] shadow-2xs space-y-3"
              >
                {/* Row Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE4]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-[#1F1E1D]">
                      {rowInfo.label}
                    </span>
                    <span className="text-xs text-[#7A756D]">
                      ({rowInfo.desc})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isRowCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Tamamlandı
                      </span>
                    ) : (
                      <span className="text-xs text-[#8A847A] font-medium">
                        {rowMasteredCount} / {rowChars.length} Öğrenildi
                      </span>
                    )}
                  </div>
                </div>

                {/* Row Kana Cards (5 Columns standard) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {rowChars.map((char) => {
                    const currentKana = alphabet === 'hiragana' ? char.hiragana : char.katakana;
                    const isNext = char.id === nextChar.id;
                    const prog = progress.characters[`${alphabet}_${char.id}`];
                    const mastery = prog?.masteryLevel ?? 0;
                    const isPlaying = currentlyPlayingChar === currentKana;

                    return (
                      <div
                        key={char.id}
                        id={`kana-card-${char.id}`}
                        onClick={() => onSelectCharacter(char)}
                        className={`group relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isNext 
                            ? 'bg-rose-50/50 border-rose-400 shadow-sm ring-2 ring-rose-200' 
                            : 'bg-white hover:bg-[#FAF8F5] border-[#E8E3D8] hover:border-rose-300 shadow-2xs hover:shadow-xs'
                        }`}
                      >
                        {/* Status Badges */}
                        <div className="flex items-center justify-between mb-1">
                          {isNext ? (
                            <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-bold">
                              🎯 Sıradaki
                            </span>
                          ) : mastery >= 2 ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Öğrenildi" />
                          ) : mastery === 1 ? (
                            <span className="w-2 h-2 rounded-full bg-amber-400" title="Çalışılıyor" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-neutral-200" title="Yeni" />
                          )}

                          <button
                            id={`btn-listen-${char.id}`}
                            onClick={(e) => handleAudioPlay(e, char)}
                            title="Telaffuzu Dinle"
                            className={`p-1 rounded-lg transition-colors ${
                              isPlaying 
                                ? 'bg-rose-600 text-white animate-pulse' 
                                : 'text-[#8C867B] hover:text-rose-600 hover:bg-rose-50'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Large Character */}
                        <div className="text-center py-1">
                          <div className="text-4xl sm:text-5xl font-bold text-[#1F1E1D] group-hover:text-rose-600 font-japanese transition-colors">
                            {currentKana}
                          </div>
                          <div className="text-sm font-bold font-mono text-rose-700 mt-1">
                            {char.romaji}
                          </div>
                        </div>

                        {/* Direct Turkish Pronunciation Tag */}
                        <div className="mt-2 pt-2 border-t border-[#F0ECE4] text-center">
                          <span className="text-[11px] font-medium text-[#5E5950] line-clamp-1 block" title={char.trPronunciation}>
                            {char.trPronunciation.replace("Türkçe ", "").replace("gibidir.", "").replace("gibi", "")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

      ) : (

        /* 2. COMPACT GRID VIEW (For all categories or quick overview) */
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {filteredKana.map((char) => {
            const currentKana = alphabet === 'hiragana' ? char.hiragana : char.katakana;
            const isNext = char.id === nextChar.id;
            const prog = progress.characters[`${alphabet}_${char.id}`];
            const mastery = prog?.masteryLevel ?? 0;
            const isPlaying = currentlyPlayingChar === currentKana;

            return (
              <div
                key={char.id}
                id={`grid-kana-${char.id}`}
                onClick={() => onSelectCharacter(char)}
                className={`group relative p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isNext 
                    ? 'bg-rose-50/60 border-rose-400 shadow-sm ring-2 ring-rose-200' 
                    : 'bg-white hover:bg-[#FAF8F5] border-[#E8E3D8] hover:border-rose-300 shadow-2xs hover:shadow-xs'
                }`}
              >
                {/* Header inside card */}
                <div className="flex items-center justify-between mb-1">
                  {isNext ? (
                    <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-bold">
                      🎯 Sıradaki
                    </span>
                  ) : mastery >= 2 ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Ustalaşıldı" />
                  ) : mastery === 1 ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400" title="Öğreniliyor" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-neutral-200" title="Yeni" />
                  )}

                  <button
                    onClick={(e) => handleAudioPlay(e, char)}
                    title="Telaffuzu Dinle"
                    className={`p-1 rounded-lg transition-colors ${
                      isPlaying 
                        ? 'bg-rose-600 text-white animate-pulse' 
                        : 'text-[#8C867B] hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Kana and Romaji */}
                <div className="text-center py-2">
                  <div className="text-4xl sm:text-5xl font-bold text-[#1F1E1D] group-hover:text-rose-600 font-japanese transition-colors">
                    {currentKana}
                  </div>
                  <div className="text-sm font-bold font-mono text-rose-700 mt-1">
                    {char.romaji}
                  </div>
                </div>

                {/* Turkish reading snippet */}
                <div className="mt-1 pt-1.5 border-t border-[#F0ECE4] text-center">
                  <span className="text-[10px] font-medium text-[#6B655B] line-clamp-1">
                    {char.trPronunciation.slice(0, 24)}...
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
