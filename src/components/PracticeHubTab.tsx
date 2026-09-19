import React, { useState } from 'react';
import { Layers, Image as ImageIcon, HelpCircle } from 'lucide-react';
import { AlphabetType, UserProgressData } from '../types';
import { FlashcardsTab } from './FlashcardsTab';
import { VisualWordsTab } from './VisualWordsTab';
import { QuizTab } from './QuizTab';

export type PracticeSubTab = 'flashcards' | 'visual_words' | 'quiz';

interface PracticeHubTabProps {
  alphabet: AlphabetType;
  setAlphabet: (alp: AlphabetType) => void;
  progress: UserProgressData;
  onRecordAnswer: (alp: AlphabetType, kanaId: string, isCorrect: boolean) => void;
  onCardFlipped: () => void;
  onSessionComplete: () => void;
  initialSubTab?: PracticeSubTab;
}

export const PracticeHubTab: React.FC<PracticeHubTabProps> = ({
  alphabet,
  setAlphabet,
  progress,
  onRecordAnswer,
  onCardFlipped,
  onSessionComplete,
  initialSubTab = 'flashcards'
}) => {
  const [subTab, setSubTab] = useState<PracticeSubTab>(initialSubTab);

  const practiceModes = [
    {
      id: 'flashcards' as PracticeSubTab,
      label: 'Ezber Kartları',
      icon: Layers,
    },
    {
      id: 'visual_words' as PracticeSubTab,
      label: 'Resimli Kelimeler',
      icon: ImageIcon,
    },
    {
      id: 'quiz' as PracticeSubTab,
      label: 'Alıştırma & Test',
      icon: HelpCircle,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 sm:pb-12">
      {/* Segmented Sub-Navigation for Alıştırmalar */}
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-1.5 shadow-2xs max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-1.5">
          {practiceModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = subTab === mode.id;
            return (
              <button
                key={mode.id}
                id={`practice-subtab-${mode.id}`}
                onClick={() => setSubTab(mode.id)}
                className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 ${
                  isActive
                    ? 'bg-rose-700 text-white shadow-2xs'
                    : 'text-[#5C574F] hover:text-[#1F1E1B] hover:bg-[#FAF8F5]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#7A756D]'}`} />
                <span className="truncate">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Ezber Kartları */}
      {subTab === 'flashcards' && (
        <FlashcardsTab
          alphabet={alphabet}
          setAlphabet={setAlphabet}
          progress={progress}
          onRecordAnswer={onRecordAnswer}
          onCardFlipped={onCardFlipped}
        />
      )}

      {/* 2. Resimli Kelimeler */}
      {subTab === 'visual_words' && (
        <VisualWordsTab
          initialAlphabet={alphabet}
          alphabet={alphabet}
        />
      )}

      {/* 3. Alıştırma & Test */}
      {subTab === 'quiz' && (
        <QuizTab
          alphabet={alphabet}
          setAlphabet={setAlphabet}
          progress={progress}
          onRecordAnswer={onRecordAnswer}
          onSessionComplete={onSessionComplete}
        />
      )}
    </div>
  );
};
