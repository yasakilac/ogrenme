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
  Award
} from 'lucide-react';
import { LearningModule, LearningModuleProps } from '../types';
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
      <div className="bg-white rounded-2xl border border-stone-200/80 px-4 py-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 ${
            isLearningPhase ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
          }`}>
            {isLearningPhase ? (
              <>
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>1. Öğrenme Aşaması</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-rose-700" />
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors shrink-0"
          >
            <span>Test Bölümüne Geç</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('flashcard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 font-semibold hover:bg-stone-200 transition-colors shrink-0"
          >
            <span>Öğrenme Bölümüne Dön</span>
          </button>
        )}
      </div>

      {/* Aktif Sekme İçeriği */}
      <main className="w-full">
        {/* 1. ÖĞRENME: Kuş Türleri Kartları & Galeri */}
        {activeTab === 'flashcard' && (
          <BirdFlashcard
            learnedBirds={progressData.learnedBirds}
            onLearnToggle={handleToggleLearn}
            onOpenDetails={(b) => setActiveModalBird(b)}
          />
        )}

        {/* 2. ÖĞRENME: Türkiye Haritası & Kuş Hotspotları */}
        {activeTab === 'hotspots' && (
          <TurkeyHotspotMap
            onSelectBird={(b) => setActiveModalBird(b)}
          />
        )}

        {/* 3. ÖĞRENME: Sürükle & Bırak Eşleme Atölyesi */}
        {activeTab === 'drag-drop' && (
          <DragDropActivity />
        )}

        {/* 4. ÖĞRENME: Morfolojik Karşılaştırma */}
        {activeTab === 'compare' && (
          <CompareAndAnalogyActivity />
        )}

        {/* 5. TEST: Akustik Ses Teşhis Testi */}
        {activeTab === 'audio-match' && (
          <AudioMatchActivity onScoreUpdate={handleAudioScore} />
        )}

        {/* 6. TEST: Kavram Sınavı */}
        {activeTab === 'quiz' && (
          <QuizActivity />
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
    difficulty: 'orta',
    estimatedMinutes: 35,
    navTabs: [
      // ÖĞRENME ETKİNLİKLERİ
      { id: 'flashcard', label: 'Kuşları Tanı', shortLabel: 'Türler', icon: Layers },
      { id: 'hotspots', label: 'Kuş Haritası', shortLabel: 'Harita', icon: MapPin },
      { id: 'drag-drop', label: 'Sürükle & Bırak', shortLabel: 'Eşle', icon: Move },
      { id: 'compare', label: 'Karşılaştır', shortLabel: 'Kıyas', icon: GitCompare },
      // TEST ETKİNLİKLERİ
      { id: 'audio-match', label: 'Ses Teşhisi', shortLabel: 'Ses Testi', icon: Volume2 },
      { id: 'quiz', label: 'Kavram Testi', shortLabel: 'Test', icon: ListChecks },
      { id: 'comprehensive-exam', label: 'Büyük Sınav (Havuz)', shortLabel: 'Büyük Sınav', icon: Trophy }
    ]
  },
  component: KusTurleriModuleComponent,
  finalTest: COMPREHENSIVE_QUESTION_POOL.map((q) => ({
    id: String(q.id),
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation
  }))
};
