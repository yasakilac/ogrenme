import React, { useState, useEffect } from 'react';
import {
  Aperture,
  Timer,
  Sparkles,
  Camera,
  Layers,
  ListChecks,
  ArrowRight,
  CheckCircle2,
  Award,
  CheckCircle,
  CheckSquare,
  ArrowUpDown,
  Volume2,
  Image as ImageIcon,
  Target,
  AlertTriangle,
  Compass,
  FolderTree,
  Columns,
  PenTool,
  Network,
  Mic,
} from 'lucide-react';
import type { LearningModule, LearningModuleProps, ModuleExerciseTile } from '../types';
import { CameraSimulator } from './components/CameraSimulator';
import { ActivitiesHubTab, type ActivityTypeId } from './components/ActivitiesHubTab';
import { FinalTestTab } from './components/FinalTestTab';
import { TopicAperture } from './components/TopicAperture';
import { TopicShutter } from './components/TopicShutter';
import { TopicIso } from './components/TopicIso';
import { MasteryCertificateModal } from './components/MasteryCertificateModal';
import { PHOTOGRAPHY_FINAL_TEST } from './data/photographyData';
import { cameraAudio } from './utils/cameraAudio';
import { getStorageItem } from '../../utils/storage';

const LOCAL_STORAGE_KEY = 'ogrenme_dijital_fotograf_ayarlari_progress';

interface ModuleLocalProgress {
  totalScore: number;
  completedTopics: string[]; // 'aperture', 'shutter', 'iso', 'simulator', 'activities', 'test'
  finalTestScore?: number;
}

export const DigitalPhotographyModule: React.FC<LearningModuleProps> = ({
  activeTab: externalTab,
  setActiveTab: setExternalTab,
  initialActivityId,
}) => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);
  const hasCelebratedRef = React.useRef<boolean>(false);

  useEffect(() => {
    const handleOpenCert = () => setIsCertificateModalOpen(true);
    window.addEventListener('open-certificate-modal', handleOpenCert);
    return () => window.removeEventListener('open-certificate-modal', handleOpenCert);
  }, []);

  useEffect(() => {
    if (externalTab && externalTab !== currentView) {
      setCurrentView(externalTab);
    }
  }, [externalTab, currentView]);

  useEffect(() => {
    const handleGoHome = () => {
      setCurrentView('home');
      if (setExternalTab) setExternalTab('home');
      cameraAudio.playDialTick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('navigate-to-home', handleGoHome);
    return () => {
      window.removeEventListener('navigate-to-home', handleGoHome);
    };
  }, [setExternalTab]);

  const [progressData, setProgressData] = useState<ModuleLocalProgress>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            totalScore: typeof parsed?.totalScore === 'number' ? parsed.totalScore : 0,
            completedTopics: Array.isArray(parsed?.completedTopics) ? parsed.completedTopics : [],
            finalTestScore: typeof parsed?.finalTestScore === 'number' ? parsed.finalTestScore : undefined,
          };
        }
      } catch {
        // yoksay
      }
    }
    return {
      totalScore: 0,
      completedTopics: [],
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progressData));
        window.dispatchEvent(
          new CustomEvent('module-progress-updated', { detail: progressData })
        );
      } catch {
        // yoksay
      }
    }
  }, [progressData]);

  const markTopicComplete = (topicId: string, bonusPoints = 20) => {
    setProgressData((prev) => {
      const currentList = Array.isArray(prev?.completedTopics) ? prev.completedTopics : [];
      if (currentList.includes(topicId)) return prev;
      cameraAudio.playSuccessSound();
      return {
        ...prev,
        completedTopics: [...currentList, topicId],
        totalScore: (prev?.totalScore || 0) + bonusPoints,
      };
    });
  };

  const handleScoreEarned = (points: number) => {
    setProgressData((prev) => ({
      ...prev,
      totalScore: (prev?.totalScore || 0) + points,
    }));
  };

  const handleFinalTestFinish = (percentage: number) => {
    setProgressData((prev) => {
      const currentList = Array.isArray(prev?.completedTopics) ? prev.completedTopics : [];
      const alreadyHas = currentList.includes('test');
      return {
        ...prev,
        finalTestScore: percentage,
        completedTopics: alreadyHas ? currentList : [...currentList, 'test'],
        totalScore: (prev?.totalScore || 0) + Math.round(percentage * 0.5),
      };
    });
  };

  const resetAllProgress = () => {
    if (window.confirm('Tüm ilerlemeyi sıfırlamak istediğinize emin misiniz?')) {
      const initial: ModuleLocalProgress = { totalScore: 0, completedTopics: [] };
      setProgressData(initial);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      cameraAudio.playDialTick();
    }
  };

  // Konu Başlıkları Listesi (Sadece ikon ve ad)
  const TOPICS = [
    {
      id: 'aperture',
      title: 'Diyafram',
      icon: Aperture,
      color: 'amber',
    },
    {
      id: 'shutter',
      title: 'Enstantane',
      icon: Timer,
      color: 'blue',
    },
    {
      id: 'iso',
      title: 'ISO',
      icon: Sparkles,
      color: 'purple',
    },
    {
      id: 'simulator',
      title: 'Pozlama Simülatörü',
      icon: Camera,
      color: 'rose',
    },
    {
      id: 'activities',
      title: 'Kavram Etkinlikleri',
      icon: Layers,
      color: 'emerald',
    },
    {
      id: 'final-test',
      title: 'Ders Bitirme Sınavı',
      icon: ListChecks,
      color: 'stone',
    },
  ];

  const totalTopicsCount = TOPICS.length;
  const completedTopicsList = Array.isArray(progressData?.completedTopics)
    ? progressData.completedTopics
    : [];
  const completedCount = completedTopicsList.length;
  const progressPercent = Math.round((completedCount / totalTopicsCount) * 100);
  const isMasteryAchieved = completedCount >= 5 || progressPercent === 100;

  useEffect(() => {
    if (isMasteryAchieved && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      cameraAudio.playFanfareSound();
    }
  }, [isMasteryAchieved]);

  const navigateTo = (viewId: string) => {
    setCurrentView(viewId);
    if (setExternalTab) setExternalTab(viewId);
    cameraAudio.playDialTick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // RENDER: İlerleme artık ModuleTopBar'da (App kabuğu) gösteriliyor, burada tekrar edilmiyor.
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 2. ANA SAYFA: KONU KARTLARI VE DENEME KARTLARI */}
      {currentView === 'home' && (
        <div className="space-y-8">
          {/* FOTOĞRAFÇILIK USTALIK SERTİFİKASI KAZANILDI KARTI (5 modül veya %100) */}
          {isMasteryAchieved && (
            <section className="animate-fadeIn">
              <div
                onClick={() => setIsCertificateModalOpen(true)}
                className="bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-[var(--accent)] rounded-[24px] p-1 shadow-md cursor-pointer group hover:scale-[1.005] transition-all"
              >
                <div className="bg-[#FFFDF9] rounded-[22px] p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5 border border-[var(--accent)]/30">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-gradient-to-tr from-[var(--accent)] via-[var(--accent)] to-[var(--accent)] text-stone-950 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <Award className="w-8 h-8 sm:w-9 sm:h-9 text-stone-950" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-light)] px-2.5 py-0.5 rounded-md border border-[var(--accent)]/30">
                          🏆 Ustalık Başarısı Açıldı
                        </span>
                        <span className="text-xs text-stone-500 ">
                          {completedCount >= 5 ? '5/5+ Modül Tamamlandı' : '%100 İlerleme'}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-stone-950 mt-1">
                        Fotoğrafçılık Ustalık Sertifikası Kazandınız!
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-600 mt-0.5 max-w-xl">
                        Tebrikler! Pozlama üçgenini ve DSLR ayarlarını üstün başarıyla tamamladınız. Adınıza özel resmi ustalık sertifikanızı görüntülemek, PDF olarak kaydetmek veya yazdırmak için tıklayın.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCertificateModalOpen(true);
                      }}
                      className="px-5 py-3 rounded-[20px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:from-[var(--accent)] hover:to-[var(--accent)] transition-all group-hover:translate-x-1 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>Sertifikamı Görüntüle</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
          {/* KONU KARTLARI BÖLÜMÜ */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 ">
                1. Bölüm: Öğrenme Konuları
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {[
                { id: 'aperture', title: 'Diyafram', subtitle: 'f/stop & Alan Derinliği', icon: Aperture, color: 'amber' },
                { id: 'shutter', title: 'Enstantane', subtitle: 'Perde Hızı & Hareket', icon: Timer, color: 'blue' },
                { id: 'iso', title: 'ISO', subtitle: 'Sensör & Gren Kontrolü', icon: Sparkles, color: 'purple' },
                { id: 'simulator', title: 'Simülatör', subtitle: 'İnteraktif DSLR Çekim', icon: Camera, color: 'rose' },
              ].map((topic) => {
                const Icon = topic.icon;
                const isCompleted = completedTopicsList.includes(topic.id);

                return (
                  <button
                    key={topic.id}
                    onClick={() => navigateTo(topic.id)}
                    className="group bg-white border-2 border-[#EBE7E0] hover:border-stone-400 hover:shadow-md rounded-[20px] p-4 text-left transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer min-h-[110px]"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-10 h-10 rounded-[16px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                          topic.color === 'amber'
                            ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30'
                            : topic.color === 'blue'
                            ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30'
                            : topic.color === 'purple'
                            ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30'
                            : 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {isCompleted ? (
                        <span className="text-[11px] font-bold text-[var(--accent)] bg-[var(--accent-light)] px-2 py-0.5 rounded-md border border-[var(--accent)]/30">
                          Tamamlandı
                        </span>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#1F1E1B] group-hover:text-[var(--accent)] transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">
                        {topic.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* DENEME & ETKİNLİK KARTLARI BÖLÜMÜ */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 ">
                2. Bölüm: Deneme & Etkinlik Kartları
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kavram Deneme Kartı */}
              <div
                onClick={() => navigateTo('activities')}
                className="group bg-white border-2 border-[#EBE7E0] hover:border-[var(--accent)] hover:shadow-md rounded-[24px] p-5 sm:p-6 transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-[20px] bg-[var(--accent-light)] border border-[var(--accent)]/30 text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-light)]/60 px-2 py-0.5 rounded-md ">
                      Deneme & Pratik
                    </span>
                    <h3 className="text-lg font-black text-stone-900 group-hover:text-[var(--accent)] transition-colors mt-0.5">
                      Kavram Ezberleme & Denemeleri
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      14 farklı etkileşimli kavram kartı ve pratik testler.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all shrink-0" />
              </div>

              {/* Bitirme Sınavı Link Kartı (Tıklayınca Başlar) */}
              <div
                onClick={() => navigateTo('final-test')}
                className="group bg-gradient-to-br from-white to-[var(--accent-light)]/40 border-2 border-[#EBE7E0] hover:border-[var(--accent)] hover:shadow-md rounded-[24px] p-5 sm:p-6 transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-[20px] bg-[var(--accent-light)] border border-[var(--accent)]/30 text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ListChecks className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-light)]/70 px-2 py-0.5 rounded-md ">
                        Resmi Sınav
                      </span>
                      {progressData.finalTestScore !== undefined && (
                        <span className="text-[11px] font-bold text-[var(--accent)] bg-[var(--accent-light)] px-2 py-0.5 rounded-md border border-[var(--accent)]/30 ">
                          %{progressData.finalTestScore}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-stone-900 group-hover:text-[var(--accent)] transition-colors mt-0.5">
                      Ünite Sonu Bitirme Sınavı
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      10 kapsamlı soru ile tüm konuları değerlendirin.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[16px] bg-stone-900 group-hover:bg-[var(--accent)] text-white text-xs font-bold transition-colors shrink-0">
                  <span>Başla</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 3. SEÇİLİ KONU GÖRÜNÜMLERİ */}
      {currentView === 'aperture' && (
        <TopicAperture
          onComplete={() => markTopicComplete('aperture')}
          onGoToSimulator={() => navigateTo('simulator')}
          onScoreEarned={handleScoreEarned}
        />
      )}

      {currentView === 'shutter' && (
        <TopicShutter
          onComplete={() => markTopicComplete('shutter')}
          onGoToSimulator={() => navigateTo('simulator')}
          onScoreEarned={handleScoreEarned}
        />
      )}

      {currentView === 'iso' && (
        <TopicIso
          onComplete={() => markTopicComplete('iso')}
          onGoToSimulator={() => navigateTo('simulator')}
          onScoreEarned={handleScoreEarned}
        />
      )}

      {currentView === 'simulator' && (
        <div className="space-y-4">
          <CameraSimulator />
        </div>
      )}

      {currentView === 'activities' && (
        <div className="space-y-4">
          <ActivitiesHubTab
            initialActivityId={initialActivityId as ActivityTypeId | undefined}
            onScoreEarned={(pts) => {
              handleScoreEarned(pts);
              markTopicComplete('activities', pts);
            }}
            onGoToHome={() => navigateTo('home')}
            onGoToTopic={(topicId) => navigateTo(topicId)}
          />
        </div>
      )}

      {currentView === 'final-test' && (
        <div className="space-y-4">
          <FinalTestTab
            questions={PHOTOGRAPHY_FINAL_TEST}
            onFinish={handleFinalTestFinish}
          />
        </div>
      )}

      {/* 4. FOTOĞRAFÇILIK USTALIK SERTİFİKASI MODALI */}
      <MasteryCertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        completedCount={completedCount}
        totalScore={progressData?.totalScore || 0}
        finalTestScore={progressData?.finalTestScore}
      />
    </div>
  );
};

export const myModule: LearningModule = {
  meta: {
    id: 'dijital-fotograf-ayarlari',
    title: 'Dijital Fotoğrafçılık & Pozlama Simülatörü',
    subtitle: 'Diyafram, Enstantane Hızı ve ISO Dengesi',
    category: 'Teknoloji',
    tag: 'Fotoğrafçılık',
    description: 'Pozlama üçgeni konu başlıkları, interaktif simülatör ve 14 kavram etkinliği.',
    features: [
      'İnteraktif DSLR vizör ve pozometre simülatörü',
      'Gerçek zamanlı alan derinliği ve hareket bulanıklığı motoru',
      'Web Audio API mekanik deklanşör sesleri (Ücretsiz / Yerel)',
      '14 farklı kavram öğrenme etkinliği ve bitirme sınavı',
    ],
    status: 'active',
    colorTheme: 'violet',
    shortTitle: 'Fotoğrafçılık',
    glyph: '📷',
    accent: { color: '#B45309', light: '#FBEFE2' },
    icon: Camera,
    difficulty: 'başlangıç',
    estimatedMinutes: 25,
    navTabs: [
      { id: 'home', label: 'Ana Sayfa', icon: Layers },
      { id: 'aperture', label: 'Diyafram', icon: Aperture, kind: 'topic' },
      { id: 'shutter', label: 'Enstantane', icon: Timer, kind: 'topic' },
      { id: 'iso', label: 'ISO', icon: Sparkles, kind: 'topic' },
      { id: 'simulator', label: 'Simülatör', icon: Camera, kind: 'topic' },
      { id: 'final-test', label: 'Sınav', icon: ListChecks, kind: 'topic' },
      { id: 'activities', label: 'Etkinlikler', icon: Layers, kind: 'exercise' },
    ],
    // 14 kavram etkinliğinin her biri Öğrenme Alanı giriş ekranında kendi karosunda açılır
    // (tabId her zaman 'activities', activityId ActivitiesHubTab'in ActivityTypeId'sine denk gelir).
    exerciseTiles: [
      { id: 'flashcard', label: 'Kartlar', icon: Layers, tabId: 'activities', activityId: 'flashcard' },
      { id: 'true-false', label: 'Doğru/Yanlış', icon: CheckCircle, tabId: 'activities', activityId: 'true-false' },
      { id: 'cloze', label: 'Boşluk Doldur', icon: CheckSquare, tabId: 'activities', activityId: 'cloze' },
      { id: 'sequencing', label: 'Sırala', icon: ArrowUpDown, tabId: 'activities', activityId: 'sequencing' },
      { id: 'sound-matching', label: 'Ses Eşle', icon: Volume2, tabId: 'activities', activityId: 'sound-matching' },
      { id: 'visual-matching', label: 'Görsel Bul', icon: ImageIcon, tabId: 'activities', activityId: 'visual-matching' },
      { id: 'diagram-labeling', label: 'Vizör Etiketle', icon: Target, tabId: 'activities', activityId: 'diagram-labeling' },
      { id: 'error-finding', label: 'Hata Bul', icon: AlertTriangle, tabId: 'activities', activityId: 'error-finding' },
      { id: 'scenario', label: 'Senaryo', icon: Compass, tabId: 'activities', activityId: 'scenario' },
      { id: 'categorize', label: 'Grupla', icon: FolderTree, tabId: 'activities', activityId: 'categorize' },
      { id: 'comparison', label: 'Kıyasla', icon: Columns, tabId: 'activities', activityId: 'comparison' },
      { id: 'written', label: 'Yazılı Cevap', icon: PenTool, tabId: 'activities', activityId: 'written' },
      { id: 'analogy-metaphor', label: 'Benzetme', icon: Network, tabId: 'activities', activityId: 'analogy-metaphor' },
      { id: 'feynman-voice', label: 'Anlat', icon: Mic, tabId: 'activities', activityId: 'feynman-voice' },
    ] satisfies ModuleExerciseTile[],
  },
  component: DigitalPhotographyModule,
  getProgressPercent: () => {
    const saved = getStorageItem<ModuleLocalProgress>(LOCAL_STORAGE_KEY, { totalScore: 0, completedTopics: [] });
    return Math.min(100, Math.round((saved.completedTopics.length / 6) * 100));
  },
  finalTest: PHOTOGRAPHY_FINAL_TEST,
};

export default myModule;
