import React from 'react';
import { UserProgressData, AlphabetType, KanaCharacter } from '../types';
import { KANA_DATA } from '../modules/japanese/data/kanaData';
import { 
  Trophy, 
  Target, 
  Flame, 
  CheckCircle, 
  RotateCcw, 
  PenTool, 
  Layers, 
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Volume2
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface DashboardTabProps {
  progress: UserProgressData;
  alphabet: AlphabetType;
  setAlphabet: (alp: AlphabetType) => void;
  onNavigateTab: (tab: 'table' | 'flashcards' | 'quiz' | 'drawing') => void;
  onSelectCharacter: (char: KanaCharacter) => void;
  onResetProgress: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  progress,
  alphabet,
  setAlphabet,
  onNavigateTab,
  onSelectCharacter,
  onResetProgress
}) => {
  // Compute progress for Hiragana
  const totalCharacters = KANA_DATA.length;
  
  let hiraganaMastered = 0;
  let hiraganaLearning = 0;
  let katakanaMastered = 0;
  let katakanaLearning = 0;

  KANA_DATA.forEach((item) => {
    const hProg = progress.characters[`hiragana_${item.id}`];
    if (hProg) {
      if (hProg.masteryLevel >= 3) hiraganaMastered++;
      else if (hProg.masteryLevel >= 1) hiraganaLearning++;
    }

    const kProg = progress.characters[`katakana_${item.id}`];
    if (kProg) {
      if (kProg.masteryLevel >= 3) katakanaMastered++;
      else if (kProg.masteryLevel >= 1) katakanaLearning++;
    }
  });

  const hiraganaPercent = Math.round(((hiraganaMastered + hiraganaLearning * 0.5) / totalCharacters) * 100);
  const katakanaPercent = Math.round(((katakanaMastered + katakanaLearning * 0.5) / totalCharacters) * 100);

  // Overall accuracy
  const totalAnswers = progress.stats.totalQuizQuestions;
  const correctAnswers = progress.stats.correctQuizQuestions;
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  // Find weak characters (most incorrect answers)
  const weakList: { char: KanaCharacter; incorrect: number; alphabet: AlphabetType }[] = [];
  KANA_DATA.forEach((char) => {
    const hProg = progress.characters[`hiragana_${char.id}`];
    if (hProg && hProg.incorrectAnswers > 0) {
      weakList.push({ char, incorrect: hProg.incorrectAnswers, alphabet: 'hiragana' });
    }
    const kProg = progress.characters[`katakana_${char.id}`];
    if (kProg && kProg.incorrectAnswers > 0) {
      weakList.push({ char, incorrect: kProg.incorrectAnswers, alphabet: 'katakana' });
    }
  });
  weakList.sort((a, b) => b.incorrect - a.incorrect);
  const topWeak = weakList.slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#2D2A26] to-[#1A1918] text-white p-6 sm:p-8 relative overflow-hidden shadow-xl border border-neutral-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-4 border border-rose-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Japonca Alfabe Yolculuğun</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Konnichiwa! Bugün ne öğrenmek istersin?
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6">
            Hiragana ve Katakana karakterlerini adım adım ezberle, sesli telaffuzlarla kulağını alıştır ve çizim tuvaliyle kas hafızası oluştur.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button
              id="btn-quick-flashcards"
              onClick={() => onNavigateTab('flashcards')}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Layers className="w-4 h-4" />
              <span>Kartlarla Çalış</span>
            </button>
            <button
              id="btn-quick-quiz"
              onClick={() => onNavigateTab('quiz')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all border border-white/20 active:scale-95"
            >
              <Target className="w-4 h-4 text-rose-300" />
              <span>Test Çöz</span>
            </button>
            <button
              id="btn-quick-drawing"
              onClick={() => onNavigateTab('drawing')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all border border-white/20 active:scale-95"
            >
              <PenTool className="w-4 h-4 text-amber-300" />
              <span>Çizim Pratiği</span>
            </button>
          </div>
        </div>

        {/* Decorative Japanese Kana Background Pattern */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 select-none text-9xl font-black font-serif text-white pointer-events-none hidden md:block">
          あア
        </div>
      </div>

      {/* Progress Cards: Hiragana vs Katakana */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Hiragana Progress Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E3D8] shadow-xs hover:border-rose-300 transition-colors space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 font-bold text-2xl flex items-center justify-center border border-rose-200">
                あ
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F1E1D]">Hiragana İlerlemesi</h3>
                <p className="text-xs text-[#7A756D]">Temel Japonca kelimeler ve ekler</p>
              </div>
            </div>
            <span className="text-2xl font-black text-rose-600">
              %{hiraganaPercent}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-[#EFECE6] rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500" 
              style={{ width: `${(hiraganaMastered / totalCharacters) * 100}%` }}
              title={`Ustalaşılan: ${hiraganaMastered}`}
            />
            <div 
              className="h-full bg-amber-400 transition-all duration-500" 
              style={{ width: `${(hiraganaLearning / totalCharacters) * 100}%` }}
              title={`Öğreniliyor: ${hiraganaLearning}`}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#615C53] pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Ustalaşıldı: <strong>{hiraganaMastered}</strong> / {totalCharacters}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              Öğreniliyor: <strong>{hiraganaLearning}</strong>
            </span>
          </div>

          <button
            id="btn-study-hiragana-now"
            onClick={() => {
              setAlphabet('hiragana');
              onNavigateTab('table');
            }}
            className="w-full py-2.5 rounded-xl bg-[#F8F6F0] hover:bg-rose-50 text-rose-900 text-xs font-semibold flex items-center justify-center gap-2 border border-[#E2DDD3] hover:border-rose-200 transition-all"
          >
            <span>Hiragana Tablosuna Git</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Katakana Progress Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E3D8] shadow-xs hover:border-indigo-300 transition-colors space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 font-bold text-2xl flex items-center justify-center border border-indigo-200">
                ア
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F1E1D]">Katakana İlerlemesi</h3>
                <p className="text-xs text-[#7A756D]">Yabancı kökenli kelimeler ve isimler</p>
              </div>
            </div>
            <span className="text-2xl font-black text-indigo-600">
              %{katakanaPercent}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-[#EFECE6] rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500" 
              style={{ width: `${(katakanaMastered / totalCharacters) * 100}%` }}
              title={`Ustalaşılan: ${katakanaMastered}`}
            />
            <div 
              className="h-full bg-amber-400 transition-all duration-500" 
              style={{ width: `${(katakanaLearning / totalCharacters) * 100}%` }}
              title={`Öğreniliyor: ${katakanaLearning}`}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#615C53] pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Ustalaşıldı: <strong>{katakanaMastered}</strong> / {totalCharacters}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              Öğreniliyor: <strong>{katakanaLearning}</strong>
            </span>
          </div>

          <button
            id="btn-study-katakana-now"
            onClick={() => {
              setAlphabet('katakana');
              onNavigateTab('table');
            }}
            className="w-full py-2.5 rounded-xl bg-[#F8F6F0] hover:bg-indigo-50 text-indigo-900 text-xs font-semibold flex items-center justify-center gap-2 border border-[#E2DDD3] hover:border-indigo-200 transition-all"
          >
            <span>Katakana Tablosuna Git</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Metrics Row: 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-[#E8E3D8] shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">Seri</span>
          </div>
          <div className="text-2xl font-bold text-[#1F1E1D]">
            {progress.stats.streakDays} Gün
          </div>
          <p className="text-[11px] text-[#7A756D] mt-1">Düzenli çalışma alışkanlığı</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E3D8] shadow-xs">
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">Doğruluk</span>
          </div>
          <div className="text-2xl font-bold text-[#1F1E1D]">
            %{accuracy}
          </div>
          <p className="text-[11px] text-[#7A756D] mt-1">{totalAnswers} toplam soru</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E3D8] shadow-xs">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">Kartlar</span>
          </div>
          <div className="text-2xl font-bold text-[#1F1E1D]">
            {progress.stats.cardsFlipped}
          </div>
          <p className="text-[11px] text-[#7A756D] mt-1">Çevrilen hafıza kartı</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E3D8] shadow-xs">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <PenTool className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A756D]">Çizimler</span>
          </div>
          <div className="text-2xl font-bold text-[#1F1E1D]">
            {progress.stats.strokeDrawingsCompleted}
          </div>
          <p className="text-[11px] text-[#7A756D] mt-1">Tamamlanan çizim</p>
        </div>

      </div>

      {/* Weakest Characters Section (En çok hata yapılanlar) */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8E3D8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F1E1D]">
                Zorlandığın Karakterler (Gelişim Fırsatları)
              </h3>
              <p className="text-xs text-[#7A756D]">
                Testlerde en çok yanlış işaretlenen harfler burada listelenir.
              </p>
            </div>
          </div>

          {topWeak.length > 0 && (
            <button
              id="btn-practice-weak-quiz"
              onClick={() => onNavigateTab('quiz')}
              className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold border border-rose-200 transition-colors"
            >
              Testle Tekrar Et
            </button>
          )}
        </div>

        {topWeak.length === 0 ? (
          <div className="py-8 text-center bg-[#FAF8F5] rounded-2xl border border-dashed border-[#DDD6CA]">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#1F1E1D]">
              Henüz hata kaydı yok!
            </p>
            <p className="text-xs text-[#7A756D] max-w-sm mx-auto mt-1">
              Alıştırmalar veya kartlar çözdükçe zorlandığın harfler burada otomatik olarak toplanacak.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {topWeak.map((item, idx) => {
              const charDisplay = item.alphabet === 'hiragana' ? item.char.hiragana : item.char.katakana;
              return (
                <div
                  key={idx}
                  onClick={() => onSelectCharacter(item.char)}
                  className="p-3 rounded-2xl bg-[#FBF9F5] hover:bg-white border border-[#E8E3D8] hover:border-rose-300 transition-all cursor-pointer text-center group"
                >
                  <div className="text-3xl font-bold text-[#1F1E1D] group-hover:text-rose-600 transition-colors mb-1">
                    {charDisplay}
                  </div>
                  <div className="text-xs font-mono font-bold text-[#555047]">
                    {item.char.romaji}
                  </div>
                  <div className="text-[10px] text-rose-600 font-semibold mt-1">
                    {item.incorrect} Hata
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.speak(charDisplay);
                    }}
                    className="mt-2 p-1 text-[#8A847A] hover:text-rose-600 rounded-md transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 mx-auto" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reset Data Footer */}
      <div className="pt-4 flex items-center justify-between text-xs text-[#7A756D] border-t border-[#EAE5DA]">
        <span>Veriler tarayıcınızın yerel hafızasında (localStorage) güvenle saklanır.</span>
        <button
          id="btn-reset-progress"
          onClick={() => {
            if (window.confirm('Tüm öğrenme ilerlemenizi sıfırlamak istediğinize emin misiniz?')) {
              onResetProgress();
            }
          }}
          className="flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:underline font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>İlerlemeyi Sıfırla</span>
        </button>
      </div>

    </div>
  );
};
