import React from 'react';
import { KanaCharacter, AlphabetType, CharacterProgress } from '../../../types';
import { Volume2, X, PenTool, CheckCircle2, Bookmark } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

interface CharacterDetailModalProps {
  character: KanaCharacter | null;
  alphabet: AlphabetType;
  progress?: CharacterProgress;
  onClose: () => void;
  onOpenDrawing: (char: KanaCharacter) => void;
  onSetMastery: (level: 0 | 1 | 2 | 3) => void;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  alphabet,
  progress,
  onClose,
  onOpenDrawing,
  onSetMastery
}) => {
  if (!character) return null;

  const currentKana = alphabet === 'hiragana' ? character.hiragana : character.katakana;
  const alternateKana = alphabet === 'hiragana' ? character.katakana : character.hiragana;
  const alternateLabel = alphabet === 'hiragana' ? 'Katakana karşılığı' : 'Hiragana karşılığı';

  const masteryLevel = progress?.masteryLevel ?? 0;

  const handleSpeak = () => {
    soundManager.speak(currentKana);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="character-modal-card"
        className="bg-[#FBF9F5] border border-[#E2DDD3] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#EAE5DA] flex items-center justify-between bg-white/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 uppercase tracking-wider">
              {character.category}
            </span>
            <span className="text-xs font-medium text-[#7A756D]">
              {character.strokeCount} Vuruş (Çizgi)
            </span>
          </div>
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7A756D] hover:text-[#1F1E1D] hover:bg-[#EFECE6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Main Character Hero Display */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-white border border-[#EAE5DA]">
            <div className="flex items-center gap-6">
              {/* Massive Kana with audio click */}
              <button
                id="btn-speak-main-kana"
                onClick={handleSpeak}
                title="Dinlemek için tıkla"
                className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#FAF7F2] border-2 border-rose-200 hover:border-rose-400 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xs"
              >
                <span className="text-6xl sm:text-7xl font-bold text-[#1F1E1D] select-none">
                  {currentKana}
                </span>
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-rose-600 text-white shadow-md group-hover:scale-110 transition-transform">
                  <Volume2 className="w-4 h-4" />
                </div>
              </button>

              {/* Romaji & Alternative */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-[#1F1E1D] font-mono">
                    {character.romaji}
                  </span>
                  <span className="text-xs text-[#827D74] font-medium">/ romaji</span>
                </div>
                <p className="text-sm text-[#615C53] mt-1">
                  {alternateLabel}: <strong className="text-base text-[#1F1E1D] font-bold ml-1">{alternateKana}</strong>
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
                  <span>Sesletim:</span>
                  <span className="italic font-normal text-[#47433B]">[{character.romaji.toUpperCase()}]</span>
                </div>
              </div>
            </div>

            {/* Quick Action: Drawing Canvas */}
            <button
              id="btn-modal-draw-practice"
              onClick={() => {
                onOpenDrawing(character);
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1F1E1D] hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <PenTool className="w-4 h-4 text-rose-300" />
              <span>Çizerek Dene</span>
            </button>
          </div>

          {/* Pronunciation Explanation Box */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              Türkçe Okunuş & Telaffuz Rehberi
            </h4>
            <p className="text-sm text-[#47433B] leading-relaxed">
              {character.trPronunciation}
            </p>
          </div>

          {/* Visual Mnemonic (Ezber İpucu) */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80">
            <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-rose-600" />
              Görsel Hafıza İpucu (Mnemonik)
            </h4>
            <p className="text-sm text-[#47433B] leading-relaxed">
              {character.mnemonic}
            </p>
          </div>

          {/* Sample Words */}
          {character.sampleWords && character.sampleWords.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#7A756D] uppercase tracking-wider">
                Örnek Kelimeler
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {character.sampleWords.map((sample, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-[#EAE5DA] flex items-center justify-between hover:border-rose-200 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#1F1E1D]">
                          {sample.word}
                        </span>
                        <span className="text-xs font-mono text-rose-600 font-semibold">
                          ({sample.romaji})
                        </span>
                      </div>
                      <p className="text-xs text-[#7A756D] mt-0.5">
                        {sample.meaningTr}
                      </p>
                    </div>
                    <button
                      id={`btn-sample-word-${idx}`}
                      onClick={() => soundManager.speak(sample.word)}
                      title="Kelimeyi dinle"
                      className="p-2 rounded-lg text-[#7A756D] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manual Mastery Control */}
          <div className="pt-2 border-t border-[#EAE5DA]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#7A756D] uppercase tracking-wider">
                Öğrenme Durumun:
              </span>
              {progress && (
                <span className="text-xs text-[#827D74]">
                  Doğru: {progress.correctAnswers} / Yanlış: {progress.incorrectAnswers}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { level: 0 as const, label: 'Başlanmadı', color: 'border-gray-200 hover:bg-gray-100 text-gray-700' },
                { level: 1 as const, label: 'Öğreniliyor', color: 'border-amber-200 hover:bg-amber-100 text-amber-800' },
                { level: 2 as const, label: 'İyi Durumda', color: 'border-blue-200 hover:bg-blue-100 text-blue-800' },
                { level: 3 as const, label: 'Ustalaşıldı', color: 'border-emerald-200 hover:bg-emerald-100 text-emerald-800' },
              ].map((item) => (
                <button
                  key={item.level}
                  id={`btn-mastery-level-${item.level}`}
                  onClick={() => onSetMastery(item.level)}
                  className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                    masteryLevel === item.level
                      ? 'bg-[#1F1E1D] text-white border-[#1F1E1D] shadow-xs'
                      : `bg-white ${item.color}`
                  }`}
                >
                  {masteryLevel === item.level && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
