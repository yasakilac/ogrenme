import React, { useState, useEffect } from 'react';
import {
  Layers,
  MapPin,
  Move,
  GitCompare,
  Volume2,
  ListChecks,
  Compass,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Trophy,
  Award,
  Bird
} from 'lucide-react';
import { LearningModule, LearningModuleProps } from '../types';
import { TopicHeader } from '../../components/ui';
import { TURKEY_BIRDS, BirdSpecies } from './data/birds';
import { BirdFlashcard } from './components/BirdFlashcard';
import { TurkeyHotspotMap } from './components/TurkeyHotspotMap';
import { DragDropActivity } from './components/DragDropActivity';
import { CompareAndAnalogyActivity } from './components/CompareAndAnalogyActivity';
import { AudioMatchActivity } from './components/AudioMatchActivity';
import { QuizActivity } from './components/QuizActivity';
import { ComprehensiveExamActivity, COMPREHENSIVE_QUESTION_POOL } from './components/ComprehensiveExamActivity';
import { BirdModal } from './components/BirdModal';
import { getStorageItem, setStorageItem } from '../../utils/storage';

const STORAGE_KEY = 'ogrenme_kus-turleri_progress';

interface SavedModuleProgress {
  learnedBirds: string[];
  audioScore: number;
}

const KusTurleriModuleComponent: React.FC<LearningModuleProps> = ({
  activeTab,
  setActiveTab
}) => {
  const [progressData, setProgressData] = useState<SavedModuleProgress>(() => {
    return getStorageItem<SavedModuleProgress>(STORAGE_KEY, {
      learnedBirds: ['flamingo', 'sah-kartal'],
      audioScore: 0
    });
  });

  const [activeModalBird, setActiveModalBird] = useState<BirdSpecies | null>(null);

  useEffect(() => {
    setStorageItem(STORAGE_KEY, progressData);
  }, [progressData]);

  const handleToggleLearn = (birdId: string) => {
    setProgressData((prev) => {
      const isAlready = prev.learnedBirds.includes(birdId);
      const updated = isAlready
        ? prev.learnedBirds.filter((id) => id !== birdId)
        : [...prev.learnedBirds, birdId];
      return { ...prev, learnedBirds: updated };
    });
  };

  const handleAudioScore = (newScore: number) => {
    setProgressData((prev) => ({
      ...prev,
      audioScore: Math.max(prev.audioScore, newScore)
    }));
  };

  // Determine whether current tab is in the Learning or Testing phase
  const isLearningPhase = ['flashcard', 'hotspots', 'drag-drop', 'compare'].includes(activeTab);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-5 sm:py-6 space-y-6">
      {/* Pedagojik Akış Bilgi Çubuğu: Önce Öğrenme, Sonra Test */}
      <div className="bg-white rounded-[20px] border border-stone-200/80 px-4 py-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-[16px] font-bold flex items-center gap-1.5 ${
            isLearningPhase ? 'bg-[var(--accent-light)] text-[var(--accent)]' : 'bg-[var(--accent-light)] text-[var(--accent)]'
          }`}>
            {isLearningPhase ? (
              <>
                <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>1. Öğrenme Aşaması</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>2. Test & Değerlendirme</span>
              </>
            )}
          </span>
          <span className="text-stone-500 hidden md:inline">
            {isLearningPhase
              ? 'Türleri inceleyin, Türkiye haritasında yaşam alanlarını ve gaga adaptasyonlarını pekiştirin.'
              : 'Öğrendiklerinizi ses teşhisi, kavram soruları ve 30 soruluk havuzdan rastgele gelen Büyük Sınav ile değerlendirin.'}
          </span>
        </div>

        {/* Hızlı Adım Geçiş Butonu */}
        {isLearningPhase ? (
          <button
            onClick={() => setActiveTab('audio-match')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[16px] bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors shrink-0"
          >
            <span>Test Bölümüne Geç</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('flashcard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[16px] bg-stone-100 text-stone-700 font-semibold hover:bg-stone-200 transition-colors shrink-0"
          >
            <span>Öğrenme Bölümüne Dön</span>
          </button>
        )}
      </div>

      {/* Aktif Sekme İçeriği */}
      <main className="w-full">
        {/* 1. ÖĞRENME: Kuş Türleri Kartları & Galeri */}
        {activeTab === 'flashcard' && (
          <div className="space-y-4">
            <TopicHeader icon={Layers} title="Kartlar" />
            <BirdFlashcard
              learnedBirds={progressData.learnedBirds}
              onLearnToggle={handleToggleLearn}
              onOpenDetails={(b) => setActiveModalBird(b)}
            />
          </div>
        )}

        {/* 2. ÖĞRENME: Türkiye Haritası & Kuş Hotspotları */}
        {activeTab === 'hotspots' && (
          <div className="space-y-4">
            <TopicHeader icon={MapPin} title="Haritada Bul" />
            <TurkeyHotspotMap
              onSelectBird={(b) => setActiveModalBird(b)}
            />
          </div>
        )}

        {/* 3. ÖĞRENME: Sürükle & Bırak Eşleme Atölyesi */}
        {activeTab === 'drag-drop' && (
          <div className="space-y-4">
            <TopicHeader icon={Move} title="Eşleştir" />
            <DragDropActivity />
          </div>
        )}

        {/* 4. ÖĞRENME: Morfolojik Karşılaştırma */}
        {activeTab === 'compare' && (
          <div className="space-y-4">
            <TopicHeader icon={GitCompare} title="Karşılaştır & Benzet" />
            <CompareAndAnalogyActivity />
          </div>
        )}

        {/* 5. TEST: Akustik Ses Teşhis Testi */}
        {activeTab === 'audio-match' && (
          <div className="space-y-4">
            <TopicHeader icon={Volume2} title="Sesi Dinle" />
            <AudioMatchActivity onScoreUpdate={handleAudioScore} />
          </div>
        )}

        {/* 6. TEST: Kavram Sınavı */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <TopicHeader icon={ListChecks} title="Kavram Testi" />
            <QuizActivity />
          </div>
        )}

        {/* 7. FİNAL TEST: Görsel + Ses + Bilgi Soru Havuzlu Büyük Sınav */}
        {activeTab === 'comprehensive-exam' && (
          <ComprehensiveExamActivity />
        )}
      </main>

      {/* Detay Modal */}
      <BirdModal
        bird={activeModalBird}
        onClose={() => setActiveModalBird(null)}
      />
    </div>
  );
};

export const kusTurleriModule: LearningModule = {
  meta: {
    id: 'kus-turleri',
    title: "Türkiye'nin Kuşları",
    subtitle: 'Görsel & İşitsel Kavram Öğrenimi',
    category: 'Doğa & Bilim',
    tag: '10 Tür',
    description: "Türkiye'de yaşayan 10 kuş türünün gaga morfolojisi, sesleri, harita hotspotları ve ekolojik rolleri.",
    features: [
      'Gerçek doğa fotoğrafları & Web Audio ses sentezi',
      'Türkiye gerçek harita üzerinde kuş gözlem hotspotları',
      'Sürükle-bırak habitat ve besin eşleme atölyesi',
      'Soru havuzlu, görsel ve ses destekli Büyük Kuş Uzmanlığı Sınavı'
    ],
    status: 'active',
    colorTheme: 'emerald',
    shortTitle: 'Kuşlar',
    glyph: '🐦',
    accent: { color: '#0F766E', light: '#E3F2EF' },
    icon: Bird,
    difficulty: 'orta',
    estimatedMinutes: 35,
    navTabs: [
      // Stepper'daki tek "konu": tür tanıma galerisi. Geri kalanı egzersiz ızgarasında.
      { id: 'flashcard', label: 'Kuşları Tanı', shortLabel: 'Türler', icon: Layers, kind: 'topic' },
      { id: 'hotspots', label: 'Kuş Haritası', shortLabel: 'Harita', icon: MapPin, kind: 'exercise' },
      { id: 'compare', label: 'Karşılaştır', shortLabel: 'Kıyas', icon: GitCompare, kind: 'exercise' },
      { id: 'drag-drop', label: 'Sürükle & Bırak', shortLabel: 'Eşle', icon: Move, kind: 'exercise' },
      { id: 'audio-match', label: 'Ses Teşhisi', shortLabel: 'Ses Testi', icon: Volume2, kind: 'exercise' },
      { id: 'quiz', label: 'Kavram Testi', shortLabel: 'Test', icon: ListChecks, kind: 'exercise' },
      { id: 'comprehensive-exam', label: 'Büyük Sınav (Havuz)', shortLabel: 'Büyük Sınav', icon: Trophy, kind: 'exercise' }
    ]
  },
  component: KusTurleriModuleComponent,
  getProgressPercent: () => {
    const saved = getStorageItem<SavedModuleProgress>(STORAGE_KEY, { learnedBirds: [], audioScore: 0 });
    return Math.min(100, Math.round((saved.learnedBirds.length / TURKEY_BIRDS.length) * 100));
  },
  finalTest: COMPREHENSIVE_QUESTION_POOL.map((q) => ({
    id: String(q.id),
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation
  }))
};
