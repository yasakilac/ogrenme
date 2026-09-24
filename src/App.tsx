/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AlphabetType, UserProgressData } from './types';
import { MODULE_REGISTRY, getModule } from './modules/registry';
import { LearningHubView } from './components/LearningHubView';
import { ModuleIntroScreen } from './components/ModuleIntroScreen';
import { ModuleTopBar } from './components/ModuleTopBar';
import { AdminPanelModal } from './components/AdminPanelModal';
import { UserRegisterModal } from './components/UserRegisterModal';
import { SettingsModal } from './components/SettingsModal';
import { loadProgress, saveProgress, getActiveUserId } from './utils/storage';
import { useFirebaseSync } from './hooks/useFirebaseSync';

const firstActiveModule = MODULE_REGISTRY.find((m) => m.component) ?? MODULE_REGISTRY[0];

export default function App() {
  // Navigation: hangi modüldeyiz + modülün hangi sekmesi (App sekme değerini yorumlamaz)
  const [currentModuleId, setCurrentModuleId] = useState<string>(firstActiveModule.meta.id);
  const [isHub, setIsHub] = useState(true);
  // Modüle girince önce ortak "Öğrenme Alanı" giriş ekranı (design/ref: 02) gösterilir;
  // bir konu/egzersiz seçilince false olur ve modülün kendi ekranı (ModuleView) render edilir.
  const [isModuleIntro, setIsModuleIntro] = useState(true);
  const [activeTab, setActiveTab] = useState<string>(firstActiveModule.meta.navTabs?.[0]?.id ?? '');
  // ModuleIntroScreen'in egzersiz karosundan gelen alt-etkinlik id'si (bkz. ModuleExerciseTile.activityId).
  const [initialActivityId, setInitialActivityId] = useState<string | undefined>(undefined);

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
    setIsModuleIntro(true);
  };

  const openTab = (tab: string, activityId?: string) => {
    setActiveTab(tab);
    setInitialActivityId(activityId);
    setIsHub(false);
    setIsModuleIntro(false);
  };

  const accentColor = currentModule.meta.accent?.color ?? '#1C1B19';
  const accentLight = currentModule.meta.accent?.light ?? '#EFEBE4';

  return (
    <div className="min-h-screen max-w-[480px] mx-auto font-sans selection:bg-rose-100 selection:text-rose-900" style={{ background: '#F7F4EE', color: '#1C1B19' }}>

      {isHub || !ModuleView ? (
        <main className="px-4 pt-1 pb-8">
          <LearningHubView
            progress={progress}
            onSelectModule={openModule}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </main>
      ) : isModuleIntro ? (
        <ModuleIntroScreen
          module={currentModule}
          progress={progress}
          onOpenTab={openTab}
          onExitToHub={() => setIsHub(true)}
        />
      ) : (
        // --accent/--accent-light: modül içi tüm etkinlik component'leri bu CSS değişkenlerini
        // (bg-[var(--accent)] gibi arbitrary Tailwind class'larla) kullanarak tek bir modül rengine bağlanır.
        <div style={{ ['--accent' as string]: accentColor, ['--accent-light' as string]: accentLight }}>
          <ModuleTopBar
            onBack={() => setIsModuleIntro(true)}
            onHome={() => setIsHub(true)}
            accentColor={accentColor}
            accentLight={accentLight}
            progressPercent={currentModule.getProgressPercent?.(progress)}
            showModuleBadge
            ModuleIcon={currentModule.meta.icon}
            moduleGlyph={currentModule.meta.glyph}
          />
          <main className="px-4 pb-16">
            <ModuleView
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              progress={progress}
              setProgress={setProgress}
              alphabet={alphabet}
              setAlphabet={setAlphabet}
              initialActivityId={initialActivityId}
            />
          </main>
        </div>
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
