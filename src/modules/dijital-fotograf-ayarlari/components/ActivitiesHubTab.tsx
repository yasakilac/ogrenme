import React, { useState } from 'react';
import {
  Layers,
  Volume2,
  Image as ImageIcon,
  PenTool,
  CheckSquare,
  ArrowUpDown,
  FolderTree,
  CheckCircle,
  AlertTriangle,
  Target,
  Columns,
  Mic,
  Compass,
  Network,
  ArrowLeft,
  Home,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { FlashcardActivity } from './FlashcardActivity';
import { SoundMatchingActivity } from './SoundMatchingActivity';
import { VisualMatchingActivity } from './VisualMatchingActivity';
import { WrittenResponseActivity } from './WrittenResponseActivity';
import { ClozeActivity } from './ClozeActivity';
import { SequencingActivity } from './SequencingActivity';
import { CategorizeActivity } from './CategorizeActivity';
import { TrueFalseActivity } from './TrueFalseActivity';
import { ErrorFindingActivity } from './ErrorFindingActivity';
import { DiagramLabelingActivity } from './DiagramLabelingActivity';
import { ComparisonActivity } from './ComparisonActivity';
import { FeynmanVoiceActivity } from './FeynmanVoiceActivity';
import { ScenarioActivity } from './ScenarioActivity';
import { AnalogyMetaphorActivity } from './AnalogyMetaphorActivity';
import { cameraAudio } from '../utils/cameraAudio';

export type ActivityTypeId =
  | 'flashcard'
  | 'sound-matching'
  | 'visual-matching'
  | 'written'
  | 'cloze'
  | 'sequencing'
  | 'categorize'
  | 'true-false'
  | 'error-finding'
  | 'diagram-labeling'
  | 'comparison'
  | 'feynman-voice'
  | 'scenario'
  | 'analogy-metaphor';

interface ActivitiesHubTabProps {
  onScoreEarned: (points: number) => void;
  onGoToHome?: () => void;
  onGoToTopic?: (topicId: string) => void;
  /** ModuleIntroScreen'in egzersiz karosundan direkt açılacak etkinlik (bkz. exerciseTiles). */
  initialActivityId?: ActivityTypeId;
}

export const ActivitiesHubTab: React.FC<ActivitiesHubTabProps> = ({
  onScoreEarned,
  onGoToHome,
  onGoToTopic,
  initialActivityId,
}) => {
  // Karo'dan gelindiyse doğrudan o etkinlikle açılır; yoksa katalog ekranı gösterilir.
  const [selectedActivityId, setSelectedActivityId] = useState<ActivityTypeId | null>(initialActivityId ?? null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'cards' | 'media' | 'logic'>('all');

  const activityCatalog = [
    {
      id: 'flashcard' as ActivityTypeId,
      title: 'Kavram Flashcardları',
      categoryType: 'cards' as const,
      badgeText: 'Ezber Kartları',
      icon: Layers,
      color: 'rose',
      countText: '14 Kart',
      description: 'Diyafram, enstantane, ISO ve pozometre terimlerini çevrilebilir kartlarla pekiştirin.',
    },
    {
      id: 'true-false' as ActivityTypeId,
      title: 'Doğru / Yanlış Karar Testi',
      categoryType: 'cards' as const,
      badgeText: 'Hızlı Pratik',
      icon: CheckCircle,
      color: 'emerald',
      countText: '10 Önerme',
      description: 'Optik kurallarla ilgili önermeleri anında analiz edip doğru veya yanlış olarak işaretleyin.',
    },
    {
      id: 'cloze' as ActivityTypeId,
      title: 'Cümle Boşluk Doldurma',
      categoryType: 'cards' as const,
      badgeText: 'Kavram Testi',
      icon: CheckSquare,
      color: 'amber',
      countText: '8 Cümle',
      description: 'Fotoğrafçılık kuralları cümlelerindeki kritik optik boşlukları uygun terimlerle tamamlayın.',
    },
    {
      id: 'sequencing' as ActivityTypeId,
      title: 'Değer ve Basamak Sıralama',
      categoryType: 'cards' as const,
      badgeText: 'Basamak Düzeni',
      icon: ArrowUpDown,
      color: 'blue',
      countText: 'Işık Sıralaması',
      description: 'Diyafram f/stop ve enstantane sürelerini en aydınlıktan en karanlığa doğru mantıksal sıraya dizin.',
    },
    {
      id: 'sound-matching' as ActivityTypeId,
      title: 'Deklanşör Ses Hızı Eşleme',
      categoryType: 'media' as const,
      badgeText: 'İşitsel Deneyim',
      icon: Volume2,
      color: 'purple',
      countText: '5 Ses Testi',
      description: 'Kamera perdesinin mekanik açılıp kapanma sesini dinleyerek enstantane süresini tahmin edin.',
    },
    {
      id: 'visual-matching' as ActivityTypeId,
      title: 'Görsel Optik Etki Bulma',
      categoryType: 'media' as const,
      badgeText: 'Görsel Analiz',
      icon: ImageIcon,
      color: 'amber',
      countText: 'Fotoğraf Analizi',
      description: 'Bokeh, hareket dondurma veya gren dokulu fotoğraflara bakarak buna sebep olan temel ayarı belirleyin.',
    },
    {
      id: 'diagram-labeling' as ActivityTypeId,
      title: 'Kamera Vizörü Etiketleme',
      categoryType: 'media' as const,
      badgeText: 'Vizör Arayüzü',
      icon: Target,
      color: 'rose',
      countText: 'Vizör Kadranı',
      description: 'DSLR vizöründeki noktacıklara dokunarak diyafram, enstantane ve pozometre skalasını tanıyın.',
    },
    {
      id: 'error-finding' as ActivityTypeId,
      title: 'Kamera Dedektifi (Hata Bulma)',
      categoryType: 'media' as const,
      badgeText: 'EXIF İncelemesi',
      icon: AlertTriangle,
      color: 'amber',
      countText: 'Kusur Teşhisi',
      description: 'Bulanık veya aşırı grenli çekilmiş fotoğrafların EXIF verilerini inceleyerek teknik kusuru teşhis edin.',
    },
    {
      id: 'scenario' as ActivityTypeId,
      title: 'Saha Çekim Senaryoları',
      categoryType: 'logic' as const,
      badgeText: 'Gerçek Saha',
      icon: Compass,
      color: 'emerald',
      countText: 'Çekim İkilemleri',
      description: 'Kumsalda parlak güneş, loş konser veya şelale çekiminde en ideal üçlü kombinasyonu belirleyin.',
    },
    {
      id: 'categorize' as ActivityTypeId,
      title: 'Kavramları Gruplama',
      categoryType: 'logic' as const,
      badgeText: 'Sınıflandırma',
      icon: FolderTree,
      color: 'blue',
      countText: '3 Ana Grup',
      description: 'Verilen optik sonuçları ve birimleri Diyafram, Enstantane veya ISO kutucuklarına yerleştirin.',
    },
    {
      id: 'comparison' as ActivityTypeId,
      title: 'Karşılaştırma Matrisi',
      categoryType: 'logic' as const,
      badgeText: 'Zıtlık Analizi',
      icon: Columns,
      color: 'stone',
      countText: 'Kıyas Tablosu',
      description: 'Açık vs kısık diyafram, hızlı vs yavaş perde hızı etkilerini yan yana zıtlık tablosunda inceleyin.',
    },
    {
      id: 'written' as ActivityTypeId,
      title: 'Açık Uçlu Akıl Yürütme',
      categoryType: 'logic' as const,
      badgeText: 'Serbest Yazı',
      icon: PenTool,
      color: 'rose',
      countText: 'Analiz & Cevap',
      description: 'Kendi cümlelerinizle f-stop veya ISO mantığını yazın; sistem anahtar kavramlarınızı analiz etsin.',
    },
    {
      id: 'analogy-metaphor' as ActivityTypeId,
      title: 'Su Kovası & Kavram Ağı',
      categoryType: 'logic' as const,
      badgeText: 'Görsel Metafor',
      icon: Network,
      color: 'purple',
      countText: 'Metafor Modeli',
      description: 'Pozlamanın musluk genişliği, akış süresi ve kova hassasiyeti metaforuyla zihinde somutlaştırılması.',
    },
    {
      id: 'feynman-voice' as ActivityTypeId,
      title: 'Sesli Anlatım (Feynman)',
      categoryType: 'logic' as const,
      badgeText: 'Sözlü Anlatım',
      icon: Mic,
      color: 'amber',
      countText: 'Mikrofon Kaydı',
      description: 'Pozlama üçgenini bir çocuğa anlatır gibi sesli olarak mikrofonunuza konuşarak açıklayın.',
    },
  ];

  const filteredCatalog = activityCatalog.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.categoryType === filterCategory;
  });

  const handleOpenActivity = (id: ActivityTypeId) => {
    setSelectedActivityId(id);
    cameraAudio.playDialTick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setSelectedActivityId(null);
    cameraAudio.playDialTick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentActivityMeta = activityCatalog.find((a) => a.id === selectedActivityId);

  // 1. GÖRÜNÜM: ETKİNLİK SEÇİLMİŞSE ETKİNLİĞİ VE ÜSTTE 3 YÖNLÜ NAVİGASYON ÇUBUĞUNU GÖSTER
  if (selectedActivityId !== null) {
    const ActiveIcon = currentActivityMeta?.icon || BookOpen;

    return (
      <div className="space-y-4">
        {/* Üst bar zaten App kabuğunda (ModuleTopBar: geri = modül girişi, ev = hub); burada sadece
            aktif etkinliğin rozeti ve (kataloktan gelindiyse) kataloğa dön linki kalır. */}
        <div className="flex items-center justify-between gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'var(--accent-light)' }}
          >
            <ActiveIcon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
              {currentActivityMeta?.title}
            </span>
          </div>
          {initialActivityId === undefined && (
            <button
              onClick={handleBackToCatalog}
              className="flex items-center gap-1.5 text-xs font-bold"
              style={{ color: '#6B665E' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kataloğa dön</span>
            </button>
          )}
        </div>

        {/* Seçilen Etkinliğin Tek Başına İlerlemeli Olarak Render Edilmesi */}
        <div className="transition-all duration-200">
          {selectedActivityId === 'flashcard' && <FlashcardActivity onScoreUpdate={onScoreEarned} />}
          {selectedActivityId === 'sound-matching' && <SoundMatchingActivity onScoreUpdate={onScoreEarned} />}
          {selectedActivityId === 'visual-matching' && <VisualMatchingActivity onScoreUpdate={onScoreEarned} />}
          {selectedActivityId === 'written' && <WrittenResponseActivity onScoreUpdate={onScoreEarned} />}
          {selectedActivityId === 'cloze' && <ClozeActivity onScoreUpdate={onScoreEarned} />}
          {selectedActivityId === 'sequencing' && <SequencingActivity onScoreUpdate={onScoreEarned} />}
          {selectedActivityId === 'categorize' && <CategorizeActivity onScoreUpdate={onScoreEarned} />}
          {selectedActivityId === 'true-false' && <TrueFalseActivity onScoreUpdate={onScoreEarned} />}
          {selectedActivityId === 'error-finding' && <ErrorFindingActivity onScoreUpdate={onScoreEarned} />}
          {selectedActivityId === 'diagram-labeling' && <DiagramLabelingActivity onScoreUpdate={onScoreEarned} />}
          {selectedActivityId === 'comparison' && <ComparisonActivity onScoreUpdate={onScoreEarned} />}
          {selectedActivityId === 'feynman-voice' && <FeynmanVoiceActivity onScoreUpdate={onScoreEarned} />}
          {selectedActivityId === 'scenario' && <ScenarioActivity onScoreUpdate={onScoreEarned} />}
          {selectedActivityId === 'analogy-metaphor' && <AnalogyMetaphorActivity onScoreUpdate={onScoreEarned} />}
        </div>
      </div>
    );
  }

  // 2. GÖRÜNÜM: ETKİNLİK KATALOĞU (Tüm bilgiler tek sayfada yığılmaz, temiz kart kataloğu)
  return (
    <div className="space-y-6">
      {/* Katalog Başlık Kartı & Sade Filtreler (Pedagojik jargonlar kaldırıldı) */}
      <div className="bg-white border-2 border-[#EBE7E0] rounded-[24px] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0ECE6] pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[20px] bg-[var(--accent-light)] border border-[var(--accent)]/30 text-[var(--accent)] flex items-center justify-center shrink-0">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-light)]/70 px-2 py-0.5 rounded-md ">
                  Etkinlik Kataloğu
                </span>
                <span className="text-xs text-stone-500 ">14 İnteraktif Pratik</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
                Kavram Ezberleme & Pratik Kataloğu
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
                Pozlama üçgeni kavramlarını pekiştirmek için aşağıdaki etkinliklerden birini seçin. Etkinlikler adım adım, ilerlemeli olarak açılır.
              </p>
            </div>
          </div>

          {/* Ana Sayfaya Dön Butonu */}
          {onGoToHome && (
            <button
              onClick={onGoToHome}
              className="self-start md:self-center flex items-center gap-1.5 px-3.5 py-2 rounded-[16px] bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer border border-stone-200"
              title="Ana Sayfaya Dön"
            >
              <Home className="w-4 h-4 text-stone-700" />
              <span>Ana Sayfa</span>
            </button>
          )}
        </div>

        {/* Sade & Anlaşılır Kategori Sekmeleri (Tanıma/Üretme jargonları yok) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-[16px] text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            Tüm Etkinlikler ({activityCatalog.length})
          </button>
          <button
            onClick={() => setFilterCategory('cards')}
            className={`px-3.5 py-1.5 rounded-[16px] text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'cards'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            Kartlar & Hızlı Ezber (4)
          </button>
          <button
            onClick={() => setFilterCategory('media')}
            className={`px-3.5 py-1.5 rounded-[16px] text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'media'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            Görsel & Ses Pratikleri (4)
          </button>
          <button
            onClick={() => setFilterCategory('logic')}
            className={`px-3.5 py-1.5 rounded-[16px] text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'logic'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            Saha & Akıl Yürütme (6)
          </button>
        </div>
      </div>

      {/* KATALOG KARTLARI IZGARASI: Tıklayınca Etkinlik Başlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCatalog.map((act) => {
          const Icon = act.icon;

          return (
            <div
              key={act.id}
              onClick={() => handleOpenActivity(act.id)}
              className="group bg-white border-2 border-[#EBE7E0] hover:border-[var(--accent)] hover:shadow-md rounded-[24px] p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer"
            >
              <div className="space-y-3">
                {/* Üst: İkon + Rozet */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      act.color === 'rose'
                        ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30'
                        : act.color === 'emerald'
                        ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30'
                        : act.color === 'blue'
                        ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30'
                        : act.color === 'purple'
                        ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30'
                        : act.color === 'amber'
                        ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30'
                        : 'bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md ">
                      {act.countText}
                    </span>
                  </div>
                </div>

                {/* Başlık ve Açıklama */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] ">
                    {act.badgeText}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-stone-900 group-hover:text-[var(--accent)] transition-colors mt-0.5">
                    {act.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>

              {/* Alt Eylem: Başlat Butonu */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold">
                <span className="text-stone-400 group-hover:text-[var(--accent)] transition-colors">
                  İlerlemeli Pratik
                </span>
                <div className="flex items-center gap-1.5 text-stone-800 group-hover:text-[var(--accent)] transition-colors">
                  <span>Etkinliği Başlat</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
