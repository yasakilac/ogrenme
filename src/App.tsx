/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AlphabetType, UserProgressData } from './types';
import { MODULE_REGISTRY, getModule } from './modules/registry';
import { Header } from './components/Header';
import { LearningHubView } from './components/LearningHubView';
import { AdminPanelModal } from './components/AdminPanelModal';
import { UserRegisterModal } from './components/UserRegisterModal';
import { SettingsModal } from './components/SettingsModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { loadProgress, saveProgress, getActiveUserId } from './utils/storage';
import { useFirebaseSync } from './hooks/useFirebaseSync';

const firstActiveModule = MODULE_REGISTRY.find((m) => m.component) ?? MODULE_REGISTRY[0];

export default function App() {
  // Navigation: hangi modüldeyiz + modülün hangi sekmesi (App sekme değerini yorumlamaz)
  const [currentModuleId, setCurrentModuleId] = useState<string>(firstActiveModule.meta.id);
  const [isHub, setIsHub] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(firstActiveModule.meta.navTabs?.[0]?.id ?? '');

  // ponytail: alphabet + progress tek aktif modülün şeması; ikinci modül kendi
  // şemasını getirdiğinde modül state'ine indirilir (şimdi değil).
  const [alphabet, setAlphabet] = useState<AlphabetType>('hiragana');
  const [progress, setProgress] = useState<UserProgressData>(() => loadProgress());

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Sync state with storage
  const reloadUserData = useCallback(() => {
    setProgress(loadProgress(getActiveUserId()));
  }, []);

  useEffect(() => {
    reloadUserData();
  }, [reloadUserData]);

  // Bulut senkronu: opsiyonel katman, giriş yapılmadan yerel-mod olduğu gibi çalışır.
  const cloudSync = useFirebaseSync({
    onCloudProgress: (cloudProgress) => {
      // Bulutta veri varsa aktif profilin üzerine yaz (basit kural: bulut kazanır).
      saveProgress(cloudProgress, getActiveUserId());
      setProgress(cloudProgress);
    },
    getLocalProgress: () => progress
  });

  // Write-through: ilerleme değiştikçe (hangi mutasyon olursa olsun) giriş yapılmışsa
  // debounce ile buluta yaz. Tüm setProgress çağrıları buradan tek noktadan geçer.
  useEffect(() => {
    cloudSync.pushProgress(progress);
  }, [progress, cloudSync.pushProgress]);

  const currentModule = getModule(currentModuleId) ?? firstActiveModule;
  const ModuleView = currentModule.component;

  const openModule = (moduleId: string) => {
    const target = getModule(moduleId);
    if (!target?.component) return; // planlanan modüller henüz açılamaz
    setCurrentModuleId(moduleId);
    setActiveTab(target.meta.navTabs?.[0]?.id ?? '');
    setIsHub(false);
  };

  const openTab = (tab: string) => {
    setActiveTab(tab);
    setIsHub(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1E1B] flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">

      {/* Top Navigation & App Bar with Top-Level Learning Module Switcher */}
      <Header
        tabs={currentModule.meta.navTabs ?? []}
        activeTab={activeTab}
        setActiveTab={openTab}
        isHub={isHub}
        currentModuleId={currentModuleId}
        alphabet={alphabet}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSelectModule={(id) => (id === 'hub' ? setIsHub(true) : openModule(id))}
      />

      {/* Main Content Area: Öğrenme Merkezi veya aktif modülün ekranları */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-7">
        {isHub || !ModuleView ? (
          <LearningHubView progress={progress} onSelectModule={openModule} />
        ) : (
          <ModuleView
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            progress={progress}
            setProgress={setProgress}
            alphabet={alphabet}
            setAlphabet={setAlphabet}
          />
        )}
      </main>

      {/* Mobile-First Bottom Navigation Bar (Alanlar + aktif modülün sekmeleri) */}
      <MobileBottomNav
        tabs={currentModule.meta.navTabs ?? []}
        activeTab={activeTab}
        setActiveTab={openTab}
        isHub={isHub}
        onSelectHub={() => setIsHub(true)}
      />

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
        authUser={cloudSync.user}
        authLoading={cloudSync.authLoading}
        authError={cloudSync.error}
        onClearAuthError={() => cloudSync.setError('')}
        onSignUp={cloudSync.signUp}
        onSignIn={cloudSync.signIn}
        onSignOut={cloudSync.signOutUser}
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
