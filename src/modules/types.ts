import type React from 'react';
import type { LucideIcon } from 'lucide-react';
import type { AlphabetType, UserProgressData } from '../types';

/** Bir modülün üst navigasyonda (Header + MobileBottomNav) gösterdiği sekme. */
export interface ModuleNavTab {
  id: string;
  label: string;       // masaüstü menü etiketi ("Harf Tablosu")
  shortLabel?: string; // mobil alt bar etiketi ("Tablo"); yoksa label kullanılır
  icon: LucideIcon;
}

export interface LearningModuleMeta {
  id: string;                    // 'japanese', 'korean', 'kanji', ...
  title: string;
  subtitle: string;
  category: 'Dil' | 'Teknoloji' | 'Kültür & Sanat' | 'Genel';
  tag: string;
  description: string;
  features: string[];
  status: 'active' | 'planned';
  colorTheme?: string;           // opsiyonel, ileride tema özelleştirmesi için
  shortTitle?: string;           // 'Japonca' — dar alanlar için
  glyph?: string;                // '日' — kart/menü ikonu
  navTabs?: ModuleNavTab[];      // sadece status='active' modüllerde
  /** Modüle özel buton/etiket metinleri (Türkçe ek grameri modüle ait). */
  labels?: {
    cta?: string;      // Hub kartındaki giriş butonu
    progress?: string; // Hub kartındaki ilerleme çubuğu başlığı
    back?: string;     // Header: modüle geri dön
    enter?: string;    // Header: modüle geç
  };
}

/**
 * Modül ekranlarına App.tsx'in geçtiği prop seti.
 * activeTab App'te tutulur çünkü üst navigasyon (Header/MobileBottomNav) uygulama
 * kabuğudur; App değeri yorumlamaz, modülün navTabs'inden gelen opak bir string'tir.
 */
export interface LearningModuleProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  progress: UserProgressData;
  setProgress: React.Dispatch<React.SetStateAction<UserProgressData>>;
  // ponytail: alphabet tek aktif modüle ait ama App'teki SettingsModal ve Header
  // markası da kullanıyor. İkinci aktif modül gelince modül state'ine indirilir.
  alphabet: AlphabetType;
  setAlphabet: (alp: AlphabetType) => void;
}

export interface LearningModule {
  meta: LearningModuleMeta;
  /** Sadece status='active' modüllerde dolu; App bunu render eder. */
  component?: React.ComponentType<LearningModuleProps>;
  /** Hub kartındaki % ilerleme çubuğu için. */
  getProgressPercent?: (progress: UserProgressData) => number;
}
