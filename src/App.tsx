/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, AlphabetType, KanaCharacter, UserProgressData } from './types';
import { Header } from './components/Header';
import { HomeCurriculumTab } from './components/HomeCurriculumTab';
import { KanaTableTab } from './components/KanaTableTab';
import { PracticeHubTab, PracticeSubTab } from './components/PracticeHubTab';
import { DrawingCanvasTab } from './components/DrawingCanvasTab';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { UserRegisterModal } from './components/UserRegisterModal';
import { SettingsModal } from './components/SettingsModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { 
  loadProgress, 
  recordCharacterAnswer, 
  setDirectMastery, 
  incrementCardFlip, 
  incrementDrawingPractice, 
  completeQuizSession, 
  resetProgressData,
  saveLastStudied,
  getActiveUserId
} from './utils/storage';

export default function App() {
  // Navigation: Exactly 4 sections (home, table, practice, drawing)
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [practiceSubTab, setPracticeSubTab] = useState<PracticeSubTab>('flashcards');
  const [alphabet, setAlphabet] = useState<AlphabetType>('hiragana');
  const [progress, setProgress] = useState<UserProgressData>(() => loadProgress());
  const [selectedModalChar, setSelectedModalChar] = useState<KanaCharacter | null>(null);
  const [drawingChar, setDrawingChar] = useState<KanaCharacter | null>(null);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Sync state with storage
  const reloadUserData = useCallback(() => {
    const currentUid = getActiveUserId();
    const loaded = loadProgress(currentUid);
    setProgress(loaded);
  }, []);

  useEffect(() => {
    reloadUserData();
  }, [reloadUserData]);

  const handleRecordAnswer = (alp: AlphabetType, kanaId: string, isCorrect: boolean) => {
    setProgress((prev) => recordCharacterAnswer(prev, alp, kanaId, isCorrect));
    saveLastStudied('topic_vowels', kanaId, alp);
  };

  const handleSetMastery = (level: 0 | 1 | 2 | 3) => {
    if (!selectedModalChar) return;
    setProgress((prev) => setDirectMastery(prev, alphabet, selectedModalChar.id, level));
  };

  const handleCardFlipped = () => {
    setProgress((prev) => incrementCardFlip(prev));
  };

  const handleDrawingCompleted = () => {
    setProgress((prev) => incrementDrawingPractice(prev));
  };

  const handleQuizSessionCompleted = () => {
    setProgress((prev) => completeQuizSession(prev));
  };

  const handleResetProgress = () => {
    const fresh = resetProgressData();
    setProgress(fresh);
  };

  const handleOpenDrawing = (char: KanaCharacter) => {
    setDrawingChar(char);
    setActiveTab('drawing');
  };

  const handleStartTopicStudy = (kanaIds: string[]) => {
    if (kanaIds.length > 0) {
      saveLastStudied('topic_vowels', kanaIds[0], alphabet);
    }
    setPracticeSubTab('flashcards');
    setActiveTab('practice');
  };

  const handleSelectModalCharacter = (char: KanaCharacter) => {
    setSelectedModalChar(char);
    saveLastStudied('topic_vowels', char.id, alphabet);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1E1B] flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      
      {/* Top Navigation & App Bar (Only 4 sections: Ana Sayfa, Harf Tablosu, Alıştırmalar, Çizim + Settings Icon) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alphabet={alphabet}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-7">
        
        {/* 1. Ana Sayfa (İkili Yapı, Kaldığın Yerden Devam Et, Konular) */}
        {activeTab === 'home' && (
          <HomeCurriculumTab
            alphabet={alphabet}
            setAlphabet={setAlphabet}
            progress={progress}
            onOpenCharacter={handleSelectModalCharacter}
            onStartTopicStudy={handleStartTopicStudy}
            onNavigateTab={(tab) => {
              if (tab === 'flashcards') {
                setPracticeSubTab('flashcards');
                setActiveTab('practice');
              } else if (tab === 'visual_words') {
                setPracticeSubTab('visual_words');
                setActiveTab('practice');
              } else if (tab === 'quiz') {
                setPracticeSubTab('quiz');
                setActiveTab('practice');
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
            onNavigateToFlashcards={() => {
              setPracticeSubTab('flashcards');
              setActiveTab('practice');
            }}
          />
        )}

        {/* 3. Alıştırmalar (Ezber Kartları, Resimli Kelimeler, Alıştırma & Test) */}
        {(activeTab === 'practice' || activeTab === 'flashcards' || activeTab === 'visual_words' || activeTab === 'quiz') && (
          <PracticeHubTab
            alphabet={alphabet}
            setAlphabet={setAlphabet}
            progress={progress}
            onRecordAnswer={handleRecordAnswer}
            onCardFlipped={handleCardFlipped}
            onSessionComplete={handleQuizSessionCompleted}
            initialSubTab={
              activeTab === 'visual_words'
                ? 'visual_words'
                : activeTab === 'quiz'
                ? 'quiz'
                : practiceSubTab
            }
          />
        )}

        {/* 4. Çizim */}
        {activeTab === 'drawing' && (
          <DrawingCanvasTab
            alphabet={alphabet}
            setAlphabet={setAlphabet}
            selectedChar={drawingChar}
            onSelectCharacter={(char) => setDrawingChar(char)}
            onDrawingCompleted={handleDrawingCompleted}
          />
        )}
      </main>

      {/* Mobile-First Bottom Navigation Bar (Ana Sayfa, Tablo, Alıştırma, Çizim + Ayarlar ikonu) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Character Detail Modal */}
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

      {/* Settings Modal (Alfabe seçimi, ses testi, profil ve admin erişimi) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        alphabet={alphabet}
        setAlphabet={setAlphabet}
        progress={progress}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenAdminModal={() => setIsAdminOpen(true)}
        onUserChanged={reloadUserData}
      />

      {/* Admin Panel Modal (Kelime & Veri Yönetimi) */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChanged={reloadUserData}
      />

      {/* User Registration & Profile Switch Modal */}
      <UserRegisterModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onUserChanged={reloadUserData}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
