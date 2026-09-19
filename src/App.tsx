/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, AlphabetType, KanaCharacter, UserProgressData } from './types';
import { Header } from './components/Header';
import { HomeCurriculumTab } from './components/HomeCurriculumTab';
import { VisualWordsTab } from './components/VisualWordsTab';
import { DashboardTab } from './components/DashboardTab';
import { KanaTableTab } from './components/KanaTableTab';
import { GuideTab } from './components/GuideTab';
import { FlashcardsTab } from './components/FlashcardsTab';
import { QuizTab } from './components/QuizTab';
import { DrawingCanvasTab } from './components/DrawingCanvasTab';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { UserRegisterModal } from './components/UserRegisterModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MoreDrawerModal } from './components/MoreDrawerModal';
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
  // 1st page: Home with Progress Tracking, Resume Where Left Off, and Topics Curriculum
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [alphabet, setAlphabet] = useState<AlphabetType>('hiragana');
  const [progress, setProgress] = useState<UserProgressData>(() => loadProgress());
  const [selectedModalChar, setSelectedModalChar] = useState<KanaCharacter | null>(null);
  const [drawingChar, setDrawingChar] = useState<KanaCharacter | null>(null);

  // Modals state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);

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
    setActiveTab('flashcards');
  };

  const handleSelectModalCharacter = (char: KanaCharacter) => {
    setSelectedModalChar(char);
    saveLastStudied('topic_vowels', char.id, alphabet);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1E1B] flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      
      {/* Top Navigation & App Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alphabet={alphabet}
        setAlphabet={setAlphabet}
        streakDays={progress.stats.streakDays}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenAdminModal={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-7">
        
        {/* Page 1: Home Curriculum Tab (Takip, Kaldığın Yer, Konu Başlıkları) */}
        {activeTab === 'home' && (
          <HomeCurriculumTab
            alphabet={alphabet}
            setAlphabet={setAlphabet}
            progress={progress}
            onOpenCharacter={handleSelectModalCharacter}
            onStartTopicStudy={handleStartTopicStudy}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Visual Words & Red Letter Practice (Resimli Kelime Ezberi & İlk Harf Kırmızı) */}
        {activeTab === 'visual_words' && (
          <VisualWordsTab initialAlphabet={alphabet} />
        )}

        {/* Kana Reading Table */}
        {activeTab === 'table' && (
          <KanaTableTab
            alphabet={alphabet}
            setAlphabet={setAlphabet}
            progress={progress}
            onSelectCharacter={handleSelectModalCharacter}
            onOpenDrawing={handleOpenDrawing}
            onNavigateToFlashcards={() => setActiveTab('flashcards')}
          />
        )}

        {/* Flashcards */}
        {activeTab === 'flashcards' && (
          <FlashcardsTab
            alphabet={alphabet}
            setAlphabet={setAlphabet}
            progress={progress}
            onRecordAnswer={handleRecordAnswer}
            onCardFlipped={handleCardFlipped}
          />
        )}

        {/* Quizzes & Exercises */}
        {activeTab === 'quiz' && (
          <QuizTab
            alphabet={alphabet}
            setAlphabet={setAlphabet}
            progress={progress}
            onRecordAnswer={handleRecordAnswer}
            onSessionComplete={handleQuizSessionCompleted}
          />
        )}

        {/* Stroke Drawing Canvas */}
        {activeTab === 'drawing' && (
          <DrawingCanvasTab
            alphabet={alphabet}
            setAlphabet={setAlphabet}
            selectedChar={drawingChar}
            onSelectCharacter={(char) => setDrawingChar(char)}
            onDrawingCompleted={handleDrawingCompleted}
          />
        )}

        {/* Comprehensive Guide & Rules */}
        {activeTab === 'guide' && <GuideTab />}

        {/* Detailed Stats / Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            progress={progress}
            alphabet={alphabet}
            setAlphabet={setAlphabet}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectCharacter={handleSelectModalCharacter}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Mobile-First Bottom Navigation Bar (Sticky Thumb Controls) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMoreMenu={() => setIsMoreDrawerOpen(true)}
      />

      {/* Mobile Extra Drawer Menu */}
      <MoreDrawerModal
        isOpen={isMoreDrawerOpen}
        onClose={() => setIsMoreDrawerOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenAdminModal={() => setIsAdminOpen(true)}
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

      {/* Admin Panel Modal (Kelime & Veri Yönetimi) */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChanged={reloadUserData}
      />

      {/* Simple User Registration & Profile Switch Modal */}
      <UserRegisterModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onUserChanged={reloadUserData}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
