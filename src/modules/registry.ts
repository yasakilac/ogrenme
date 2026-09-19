import { LearningModule } from './types';
import { japaneseModule } from './japanese';
import { kusTurleriModule } from './kus-turleri';

/**
 * Yeni öğrenme modülü eklemek için:
 *  1. src/modules/<id>/ altına veri + (aktifse) component yaz,
 *  2. buraya tek bir kayıt ekle.
 * App.tsx ve LearningHubView.tsx'e dokunmak gerekmez.
 */
export const MODULE_REGISTRY: LearningModule[] = [
  japaneseModule,
  kusTurleriModule,

  // Planlanan modüller: henüz component yok, sadece Hub kartı için meta.
  {
    meta: {
      id: 'kanji',
      title: 'Japonca Kanji & N5 Kelimeleri',
      subtitle: 'Görsel Hatırlatıcılar & Radikaller',
      category: 'Dil',
      tag: 'Planlanan • Çok Yakında',
      description:
        'En çok kullanılan temel 100 Kanji, birleşme mantığı ve JLPT N5 sınavına hazırlık kelime dağarcığı.',
      features: ['100 Temel Kanji', 'On-yomi & Kun-yomi', 'Örnek Cümleler', 'Yazım Sırası Animasyonları'],
      status: 'planned'
    }
  },
  {
    meta: {
      id: 'korean',
      title: 'Korece Hangul Alfabesi',
      subtitle: 'Bilimsel Alfabe Mimarisi',
      category: 'Dil',
      tag: 'Planlanan • Dil Modülü',
      description:
        'Kral Sejong tarafından tasarlanan Hangul harf blokları, ünlü ve ünsüz seslerin telaffuzu ve basit cümleler.',
      features: ['Hangul Blokları', 'Sesli Karşılaştırma', 'Yazım Kuralları', 'Hızlı Ezber Kartları'],
      status: 'planned'
    }
  },
  {
    meta: {
      id: 'python',
      title: 'Yapay Zeka & Python Temelleri',
      subtitle: 'Programlama Mantığı ve Algoritma',
      category: 'Teknoloji',
      tag: 'Planlanan • Kodlama',
      description:
        'Temel veri yapıları, fonksiyonlar, algoritmik düşünme ve modern yapay zeka araçları için Python öğrenimi.',
      features: ['İnteraktif Kod Alanı', 'Algoritmalar', 'Proje Tabanlı Görevler', 'Mini Quizler'],
      status: 'planned'
    }
  },
  {
    meta: {
      id: 'history_culture',
      title: 'Dünya Kültürleri & Tarih Notları',
      subtitle: 'Görsel & Sesli Hikayeler',
      category: 'Kültür & Sanat',
      tag: 'Planlanan • Genel Kültür',
      description:
        'Farklı coğrafyaların mimarisi, tarihi olaylar ve kültürel geleneklerin derlendiği kısa öğrenme hapları.',
      features: ['Görsel Atlas', 'Tarih Zaman Çizelgesi', 'Hap Bilgiler', 'Özet Seslendirmeler'],
      status: 'planned'
    }
  }
];

export const getModule = (id: string) => MODULE_REGISTRY.find((m) => m.meta.id === id);
