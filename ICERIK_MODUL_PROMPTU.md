# Öğrenme Modülü Üretim Talimatı (Ana Prompt)

Bu dosyayı olduğu gibi bir yapay zekaya (ChatGPT, Gemini, Claude vb.) yapıştır, sonuna
"Konu: <konunun adı>" ekle. Konudan bağımsız kısımları değiştirme — bunlar uygulamanın
teknik mimarisiyle ilgili, konu değişse bile sabit kalmalı.

---

## Sen bir React modülü üretiyorsun, içerik değil

Aşağıdaki uygulamaya eklenecek, tamamen bitmiş, çalışır durumda bir "öğrenme modülü"
üreteceksin. Bu bir chatbot cevabı değil, doğrudan bir kod tabanına kopyalanacak dosya
seti. Konunun içeriğini (kuş türleri, tarih, ne olursa) sen tasarlarsın; ama teknik
yapıyı aşağıdaki kurallara **harfiyen** uyacak şekilde üretmen gerekiyor. Kurallara
uymayan çıktı, entegrasyon öncesi elle düzeltilmek zorunda kalır — bu israf, kaçın.

## Sabit teknik çerçeve (asla değişmez)

- **Stack:** React 19 (fonksiyon component + hook), TypeScript, Tailwind CSS v4
  (utility class'lar, hazır Tailwind sınıflarıyla stil — CSS-in-JS, CSS modülü, ayrı
  `.css` dosyası YOK), Vite 8 ile derleniyor.
- **Next.js DEĞİL.** `next/*` import'u, `'use client'`/`'use server'` direktifi, API
  route, server component YOK. Bu tamamen istemci-taraflı (client-only) bir SPA.
- **Backend yok.** Modülün verisi statik olarak koda gömülü (TS/JSON dosyaları).
  Çalışma zamanında bilinmeyen bir dış API'ye `fetch` atma. Ses/görsel gerekiyorsa
  ya tarayıcının yerleşik `SpeechSynthesis` API'sini kullan ya da veriyi metin/URL
  olarak bırak, gerçek dosya üretme.
- **Yeni npm bağımlılığı ekleme.** Sadece şunlar mevcut ve kullanılabilir: `react`,
  `lucide-react` (ikonlar için), `tailwindcss` utility class'ları, proje içindeki
  `../../utils/storage.ts` yardımcıları (aşağıda). Başka bir kütüphane
  (chart, drag-drop, animasyon vb.) gerekiyorsa **ekleme, bunun yerine düz
  React state + CSS ile çöz**, ya da çıktının başına "şu paket lazım" diye not düş.
- **Dosya sınırları — SADECE kendi klasörüne yaz:**
  `src/modules/<modul-id>/` altına her şeyi koy (component'ler, veri, alt klasörler
  serbest). `src/App.tsx`, `src/components/Header.tsx`, `src/modules/types.ts` gibi
  paylaşılan dosyalara **dokunma**. `src/modules/registry.ts`'ye sadece **tek satırlık**
  bir kayıt ekleneceğini varsay (onu ben ekleyeceğim, sen sadece nasıl kaydedileceğini
  göstermek için son bloğu ver).

## TypeScript sözleşmesi (birebir bu şekillere uy)

```ts
// src/modules/types.ts — MEVCUT, değiştirme, sadece import et

export interface ModuleNavTab {
  id: string;
  label: string;       // masaüstü menü etiketi
  shortLabel?: string;  // mobil alt bar etiketi (yoksa label kullanılır)
  icon: LucideIcon;     // lucide-react'ten GERÇEK VAR OLAN bir ikon, uydurma
}

export interface LearningModuleMeta {
  id: string;                    // kebab-case, benzersiz, örn. 'kus-turleri'
  title: string;
  subtitle: string;
  category: 'Dil' | 'Teknoloji' | 'Kültür & Sanat' | 'Genel';
  tag: string;                   // örn. 'Yeni • Genel Kültür'
  description: string;
  features: string[];            // hub kartında 3-4 madde
  status: 'active';               // sen her zaman 'active' üretiyorsun (component var)
  colorTheme?: string;
  shortTitle?: string;
  glyph?: string;                 // tek karakter/emoji, kart ikonu
  navTabs: ModuleNavTab[];        // modülün kendi iç sekmeleri (en az 1)
  labels?: { cta?: string; progress?: string; back?: string; enter?: string };
}

export interface LearningModuleProps {
  activeTab: string;              // navTabs'inden birinin id'si; sen yorumlarsın
  setActiveTab: (tab: string) => void;
  progress: UserProgressData;     // GÖRMEZDEN GEL — bu şu an sadece Japonca modülüne
  setProgress: (...) => void;     // ait eski bir miras alan, senin modülünle ilgisi yok
  alphabet: AlphabetType;         // GÖRMEZDEN GEL — aynı sebeple
  setAlphabet: (alp: AlphabetType) => void;
}

export interface LearningModule {
  meta: LearningModuleMeta;
  component: React.ComponentType<LearningModuleProps>;
  getProgressPercent?: (progress: UserProgressData) => number; // ATLA, kullanma
  finalTest: FinalTestQuestion[];  // ZORUNLU, aşağıya bak
}

/** Ders bitirme testi sorusu. */
export interface FinalTestQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;                 // doğru cevap sonrası kısa açıklama
  mode?: 'recognition' | 'production';   // tanıma mı üretme mi — bkz. aşağıdaki etkinlik tipleri notu
}
```

**Önemli:** `progress`/`alphabet`/`setProgress`/`setAlphabet` prop'larını props listesinde
kabul et (TypeScript hata vermesin diye), ama **kullanma**. Senin modülün kendi
ilerleme durumunu kendi `useState` + (istersen) kendi `localStorage` anahtarıyla
tutar, örn. `localStorage.getItem('ogrenme_<modul-id>_progress')`. `getProgressPercent`
alanını hiç yazma / boş bırak — hub'da o modül için % çubuğu gösterilmeyecek, sorun
değil.

## Zorunlu standartlar (her modülde olmalı — pazarlık konusu değil)

- **Skor/puan.** Her etkinlik bir sonuç üretmeli (`{ correct: boolean }` ya da kısmi
  puanlı etkinliklerde `{ scoreOutOf100: number }`). Modül bunları kendi state/
  localStorage'ında biriktirip kullanıcıya kendi ilerlemesini (doğru/yanlış sayısı,
  genel % başarı gibi) modülün kendi ana ekranında göstermeli — bu olmadan kişi
  kendini göremiyor, kabul edilmez.
- **Ders bitirme testi (`finalTest`) — ZORUNLU.** `LearningModule.finalTest` alanı
  BOŞ OLAMAZ: en az 8-10 çoktan seçmeli soru, tüm modül konusunu kapsayacak şekilde.
  Bu, modülün "bitirme testi" sekmesinde (`navTabs`'e bir `{ id: 'final-test', ... }`
  ekle) kullanıcının çözebileceği bir test olarak render edilmeli. Bu sorular aynı
  zamanda ileride tüm modüllerden toplanan genel "Bilgi Yarışması" havuzunu
  besleyecek — o yüzden şekle (`FinalTestQuestion`) birebir uy, atlanmaz.
- **Gerçek görsel/ses, placeholder değil.** Emoji veya renkli kutucuk "görsel" yerine
  kullanılmaz (ciddi bir konuda amatör durur) — serbest lisanslı gerçek görsel URL'leri
  kullan (örn. Wikimedia Commons). Ses için yeni bir dosya pipeline'ı KURMA — tarayıcının
  `SpeechSynthesis` API'siyle veya mevcut `soundManager` yardımcısıyla gerçekçi telaffuz/
  seslendirme sağla.
- **Tasarım bütünlüğü.** Modül, uygulamanın geri kalanından "farklı bir app gibi"
  hissettirmemeli — aşağıdaki Stil bölümündeki palete ve mobil-öncelikli düzene uy.
- **Pedagojik çoklu-duyu yapı.** Tek bir etkinlik türüne (sadece flashcard, sadece
  çoktan seçmeli) sıkışma — konuya uygun en az 3-4 FARKLI etkinlik türü seç, hem
  "tanıma" (flashcard, çoktan seçmeli) hem "üretme/hatırlama" (yazılı cevap, sesli
  anlatım, senaryo) tarafından örnekler olsun. Etkinlikleri "Etkinlik tipleri"
  bölümündeki kataloğa göre konuya özel seç — hepsini kullanmak zorunda değilsin,
  konuya en uygun olanları seç.
- **Meta bilgisi.** `LearningModuleMeta.difficulty` (`'başlangıç'|'orta'|'ileri'`) ve
  `estimatedMinutes` alanlarını doldur — kullanıcı hub'da paketin ne kadar süreceğini
  görsün.
- **(opsiyonel ama tercih edilir) Kaynak.** Bilgi içerikli konularda (tarih, bilim vb.)
  yanlış bilgi riskine karşı, paket verisine opsiyonel bir `sources?: string[]` alanı
  (kaynak URL/referans) eklemen iyi olur — zorunlu değil.

## Component yapısı — referans (Japonca modülünden, birebir bu deseni izle)

```tsx
// src/modules/<modul-id>/index.tsx
import React, { useState } from 'react';
import { Home, ListChecks } from 'lucide-react'; // gerçek lucide-react ikonları
import { LearningModule, LearningModuleProps } from '../types';
import { SomeTabComponent } from './components/SomeTabComponent'; // kendi component'in

const MyModule: React.FC<LearningModuleProps> = ({ activeTab, setActiveTab }) => {
  // kendi iç state'in burada (activeTab dışındaki her şey)

  return (
    <>
      {activeTab === 'home' && <SomeTabComponent onNavigate={() => setActiveTab('quiz')} />}
      {activeTab === 'quiz' && <div>...</div>}
    </>
  );
};

export const myModule: LearningModule = {
  meta: {
    id: 'kus-turleri',
    title: '...',
    subtitle: '...',
    category: 'Genel',
    tag: 'Yeni',
    description: '...',
    features: ['...', '...', '...'],
    status: 'active',
    shortTitle: '...',
    glyph: '🐦',
    difficulty: 'başlangıç',
    estimatedMinutes: 20,
    navTabs: [
      { id: 'home', label: 'Ana Sayfa', icon: Home },
      { id: 'quiz', label: 'Test', icon: ListChecks },
      { id: 'final-test', label: 'Bitirme Testi', icon: ListChecks }
    ]
  },
  component: MyModule,
  finalTest: [
    {
      id: 'ft1',
      question: '...',
      options: ['...', '...', '...', '...'],
      correctIndex: 0,
      explanation: '...',
      mode: 'recognition'
    }
    // ... en az 8-10 soru
  ]
};
```

`registry.ts`'ye eklenecek satır (sen yazma, ben ekleyeceğim, sadece bil):
```ts
import { myModule } from './kus-turleri';
// MODULE_REGISTRY dizisine: myModule,
```

## Stil

Uygulamanın ana paleti sıcak/editoryal: arka plan `#FAF8F5`, metin `#1F1E1B`, vurgu
`rose-*` tonları. Tailwind utility class'larıyla bu ruha uy (bire bir kopyalamak
zorunda değilsin, ama parlak/soğuk bir tema açma). Mobil-öncelikli tasarla (dar ekran
önce), `max-w-*` + responsive class'lar kullan.

## Etkinlik tipleri (konuya özel seç, kataloğa göre)

Aşağıdaki katalogdan konuya en uygun 3-4+ türü seç (hepsi zorunlu değil, çeşitlilik
zorunlu — bkz. yukarıdaki "Pedagojik çoklu-duyu yapı" maddesi). Her biri serbest bir
React component olarak uygulanır, tek bir sabit format yok.

**Temel / Klasik (tanıma ağırlıklı):** flashcard, sesle eşleştirme, kısa çoktan
seçmeli, yazılı (açık uçlu) cevap, video/görsel eşleştirme.

**Tanıma & üretme ekseninde ek türler:** boşluk doldurma (cloze), sıralama (adım/
kronoloji), kategorize etme (drag-drop gruplama), doğru/yanlış, hata bulma,
etiketleme (görsel/diyagram üzerinde işaretleme), karşılaştırma (fark/benzerlik
doldurma), sesli anlatım (Feynman tekniği — kendi cümleleriyle anlatma/kayıt),
senaryo/uygulama (kavramı hangi durumda kullanacağını seçme).

**Disiplinlerarası / derin anlam (üretme ağırlıklı):** analoji tamamlama, semantik
harita/ağ kurma, sınıflandırma + savunma (nedenini açıklama), kolokasyon/birliktelik
eşleştirme, hikaye tamamlama, çizerek anlatma, metafor/benzetme kurma, atasözü/
deyimle ilişkilendirme.

Flashcard ve çoktan seçmeli "tanıma" tarafında; yazılı, sesli anlatım, senaryo ve
metafor kurma "üretme/hatırlama" tarafında — her etkinliğe (ve `finalTest`
sorularına) uygun olduğunda `mode: 'recognition' | 'production'` etiketini ekle,
ileride tekrar algoritması bu ayrıma göre kurulacak.

## Çıktı formatı

Her dosyayı ayrı bir kod bloğu olarak, başında tam yol yorumuyla ver:

```
// src/modules/kus-turleri/index.tsx
...
// src/modules/kus-turleri/data/birds.ts
...
// src/modules/kus-turleri/components/BirdFlashcard.tsx
...
```

Sonunda kısa bir özet: kaç dosya, hangi etkinlik tipleri var, eklemen gereken bir
npm paketi olup olmadığı.

## Kontrol listesi (teslim etmeden önce kendine sor)

- [ ] `src/modules/<id>/` dışında hiçbir dosyaya dokunmadım mı?
- [ ] Next.js'e özgü hiçbir şey yok mu?
- [ ] Yeni npm paketi eklemedim mi (eklediysem açıkça belirttim mi)?
- [ ] `progress`/`alphabet` prop'larını kullanmadım mı?
- [ ] `LearningModule`/`LearningModuleMeta`/`LearningModuleProps`/`FinalTestQuestion` şekillerine birebir uydum mu?
- [ ] `navTabs`'teki ikonlar gerçekten `lucide-react`'te var mı?
- [ ] `finalTest` en az 8-10 soru içeriyor mu, boş/eksik değil mi?
- [ ] Her etkinlik bir skor/sonuç üretiyor mu, kullanıcı kendi ilerlemesini görebiliyor mu?
- [ ] Görsel/ses placeholder değil, gerçek/gerçekçi mi?
- [ ] En az 3-4 farklı etkinlik türü var mı (tek tip tekrar değil)?
- [ ] `difficulty` ve `estimatedMinutes` dolduruldu mu?

---

**Konu:** _(buraya konuyu yaz, örn. "10 Kuş Türü — Doğa & Bilim kategorisi")_
