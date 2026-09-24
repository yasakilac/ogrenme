import React, { useState } from 'react';
import { Home, Grid3X3, Sparkles, PenTool, Layers, Image as ImageIcon, ListChecks } from 'lucide-react';
import { AlphabetType, KanaCharacter, UserProgressData } from '../../types';
import { LearningModule, LearningModuleProps, ModuleExerciseTile } from '../types';
import { HomeCurriculumTab } from './components/HomeCurriculumTab';
import { KanaTableTab } from './components/KanaTableTab';
import { PracticeHubTab, PracticeSubTab } from './components/PracticeHubTab';
import { DrawingCanvasTab } from './components/DrawingCanvasTab';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import {
  recordCharacterAnswer,
  setDirectMastery,
  incrementCardFlip,
  incrementDrawingPractice,
  completeQuizSession,
  saveLastStudied
} from '../../utils/storage';
import { JAPANESE_FINAL_TEST } from './data/kanaData';

/** Japonca modülünün tüm ekranları ve kendi iç navigasyon state'i. */
const JapaneseModule: React.FC<LearningModuleProps> = ({
  activeTab,
  setActiveTab,
  progress,
  setProgress,
  alphabet,
  setAlphabet,
  initialActivityId
}) => {
  const [practiceSubTab, setPracticeSubTab] = useState<PracticeSubTab>(
    (initialActivityId as PracticeSubTab) ?? 'flashcards'
  );
  const [selectedModalChar, setSelectedModalChar] = useState<KanaCharacter | null>(null);
  const [drawingChar, setDrawingChar] = useState<KanaCharacter | null>(null);

  const handleRecordAnswer = (alp: AlphabetType, kanaId: string, isCorrect: boolean) => {
    setProgress((prev) => recordCharacterAnswer(prev, alp, kanaId, isCorrect));
    saveLastStudied('topic_vowels', kanaId, alp);
  };

  const handleSetMastery = (level: 0 | 1 | 2 | 3) => {
    if (!selectedModalChar) return;
    setProgress((prev) => setDirectMastery(prev, alphabet, selectedModalChar.id, level));
  };

  const handleOpenDrawing = (char: KanaCharacter) => {
    setDrawingChar(char);
    setActiveTab('drawing');
  };

  const handleStartTopicStudy = (kanaIds: string[]) => {
    if (kanaIds.length > 0) {
      saveLastStudied('topic_vowels', kanaIds[0], alphabet);
    }
    openPractice('flashcards');
  };

  const handleSelectModalCharacter = (char: KanaCharacter) => {
    setSelectedModalChar(char);
    saveLastStudied('topic_vowels', char.id, alphabet);
  };

  const openPractice = (sub: PracticeSubTab) => {
    setPracticeSubTab(sub);
    setActiveTab('practice');
  };

  return (
    <>
      {/* 1. Japonca Ana Sayfa (İkili Yapı, Kaldığın Yerden Devam Et, Konular) */}
      {activeTab === 'home' && (
        <HomeCurriculumTab
          alphabet={alphabet}
          setAlphabet={setAlphabet}
          progress={progress}
          onOpenCharacter={handleSelectModalCharacter}
          onStartTopicStudy={handleStartTopicStudy}
          onNavigateTab={(tab) => {
            if (tab === 'flashcards' || tab === 'visual_words' || tab === 'quiz') {
              openPractice(tab);
            } else {
              setActiveTab(tab);
            }
          }}
        />
      )}

      {/* 2. Harf Tablosu */}
      {activeTab === 'table' && (
        <KanaTableTab
          alphabet={alphabet}
          setAlphabet={setAlphabet}
          progress={progress}
          onSelectCharacter={handleSelectModalCharacter}
          onOpenDrawing={handleOpenDrawing}
          onNavigateToFlashcards={() => openPractice('flashcards')}
        />
      )}

      {/* 3. Alıştırmalar (Ezber Kartları, Resimli Kelimeler, Alıştırma & Test) */}
      {activeTab === 'practice' && (
        <PracticeHubTab
          alphabet={alphabet}
          setAlphabet={setAlphabet}
          progress={progress}
          onRecordAnswer={handleRecordAnswer}
          onCardFlipped={() => setProgress((prev) => incrementCardFlip(prev))}
          onSessionComplete={() => setProgress((prev) => completeQuizSession(prev))}
          initialSubTab={practiceSubTab}
        />
      )}

      {/* 4. Çizim */}
      {activeTab === 'drawing' && (
        <DrawingCanvasTab
          alphabet={alphabet}
          setAlphabet={setAlphabet}
          selectedChar={drawingChar}
          onSelectCharacter={(char) => setDrawingChar(char)}
          onDrawingCompleted={() => setProgress((prev) => incrementDrawingPractice(prev))}
        />
      )}

      {/* Karakter Detay Modalı */}
      {selectedModalChar && (
        <CharacterDetailModal
          character={selectedModalChar}
          alphabet={alphabet}
          progress={progress.characters[`${alphabet}_${selectedModalChar.id}`]}
          onClose={() => setSelectedModalChar(null)}
          onOpenDrawing={() => {
            handleOpenDrawing(selectedModalChar);
            setSelectedModalChar(null);
          }}
          onSetMastery={handleSetMastery}
        />
      )}
    </>
  );
};

/** Hiragana + Katakana toplam benzersiz kayıt sayısına göre kabaca ilerleme. */
const TOTAL_KANA = 214;

export const japaneseModule: LearningModule = {
  meta: {
    id: 'japanese',
    title: 'Japonca Öğren',
    subtitle: 'Hiragana & Katakana Temelleri',
    category: 'Dil',
    tag: 'İlk Proje • Aktif',
    description:
      'Sesli telaffuzlar, 13 ders ünitesi, interaktif çizim tuvali, kelime kartları ve testlerle Japonca alfabe ustalığı.',
    features: ['Hiragana & Katakana', 'Sesli Telaffuzlar', 'İnteraktif Çizim', 'Kelime & Test Modülü'],
    status: 'active',
    colorTheme: 'rose',
    shortTitle: 'Japonca',
    glyph: '日',
    accent: { color: '#B4233C', light: '#FBE9EC' },
    // Japonca'nın ikonu her zaman '日' glifi (bkz. glyph) — çizgi ikon tanımlı değil.
    navTabs: [
      { id: 'home', label: 'Ana Sayfa', shortLabel: 'Japonca', icon: Home },
      { id: 'table', label: 'Harf Tablosu', shortLabel: 'Tablo', icon: Grid3X3, kind: 'topic' },
      { id: 'practice', label: 'Alıştırmalar', shortLabel: 'Alıştırma', icon: Sparkles, kind: 'exercise' },
      { id: 'drawing', label: 'Çizim', shortLabel: 'Çizim', icon: PenTool, kind: 'exercise' }
    ],
    // Alıştırmalar sekmesinin 3 alt-etkinliği + Çizim, tek tek karo olarak açılır.
    exerciseTiles: [
      { id: 'flashcards', label: 'Kartlar', icon: Layers, tabId: 'practice', activityId: 'flashcards' },
      { id: 'visual_words', label: 'Görsel Kelimeler', icon: ImageIcon, tabId: 'practice', activityId: 'visual_words' },
      { id: 'quiz', label: 'Test', icon: ListChecks, tabId: 'practice', activityId: 'quiz' },
      { id: 'drawing', label: 'Çizim', icon: PenTool, tabId: 'drawing' }
    ] satisfies ModuleExerciseTile[],
    labels: {
      cta: 'Japonca Öğrenmeye Başla / Devam Et',
      progress: 'Japonca Öğrenme İlerlemeniz',
      back: "Japonca'ya Dön",
      enter: 'Japonca Bölümüne Geç'
    }
  },
  component: JapaneseModule,
  getProgressPercent: (progress: UserProgressData) => {
    const studied = Object.values(progress.characters).filter((c) => c.masteryLevel > 0).length;
    return Math.min(100, Math.round((studied / TOTAL_KANA) * 100));
  },
  finalTest: JAPANESE_FINAL_TEST
};
