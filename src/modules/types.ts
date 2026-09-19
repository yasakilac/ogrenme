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
  category: 'Dil' | 'Teknoloji' | 'Kültür & Sanat' | 'Doğa & Bilim' | 'Genel';
  tag: string;
  description: string;
  features: string[];
  status: 'active' | 'planned';
  colorTheme?: string;           // opsiyonel, ileride tema özelleştirmesi için
  shortTitle?: string;           // 'Japonca' — dar alanlar için
  glyph?: string;                // '日' — kart/menü ikonu
  navTabs?: ModuleNavTab[];      // sadece status='active' modüllerde
  difficulty?: 'başlangıç' | 'orta' | 'ileri';
  estimatedMinutes?: number;     // hub kartında "~X dk" göstermek için
  /** Modüle özel buton/etiket metinleri (Türkçe ek grameri modüle ait). */
  labels?: {
    cta?: string;      // Hub kartındaki giriş butonu
    progress?: string; // Hub kartındaki ilerleme çubuğu başlığı
    back?: string;     // Header: modüle geri dön
    enter?: string;    // Header: modüle geç
  };
}

/** Bir modülün "ders bitirme testi" sorusu. Bilgi Yarışması havuzu buradan besleniyor. */
export interface FinalTestQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;          // doğru cevap sonrası kısa açıklama
  mode?: 'recognition' | 'production'; // ileride tekrar algoritması için
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
  /** Modülün ders bitirme testi. Yeni modüllerde ZORUNLU (bkz. ICERIK_MODUL_PROMPTU.md). */
  finalTest?: FinalTestQuestion[];
}
