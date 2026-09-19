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
}
```

**Önemli:** `progress`/`alphabet`/`setProgress`/`setAlphabet` prop'larını props listesinde
kabul et (TypeScript hata vermesin diye), ama **kullanma**. Senin modülün kendi
ilerleme durumunu kendi `useState` + (istersen) kendi `localStorage` anahtarıyla
tutar, örn. `localStorage.getItem('ogrenme_<modul-id>_progress')`. `getProgressPercent`
alanını hiç yazma / boş bırak — hub'da o modül için % çubuğu gösterilmeyecek, sorun
değil.

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
    navTabs: [
      { id: 'home', label: 'Ana Sayfa', icon: Home },
      { id: 'quiz', label: 'Test', icon: ListChecks }
    ]
  },
  component: MyModule
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

## Etkinlik tipleri (bugün desteklenenler)

Modülün içindeki ekranları/etkinlikleri şu temel tiplerden kur (React component olarak,
serbestçe): flashcard (ön/arka çevirme), çoktan seçmeli, doğru/yanlış, eşleştirme
(görsel/ses ile). Daha karmaşık tipler (cloze, sıralama, kavram haritası, senaryo,
metafor vb.) istersen dahil et — kısıtlama yok, önemli olan yukarıdaki dosya/tip
sözleşmesine uyman.

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
- [ ] `LearningModule`/`LearningModuleMeta`/`LearningModuleProps` şekillerine birebir uydum mu?
- [ ] `navTabs`'teki ikonlar gerçekten `lucide-react`'te var mı?

---

**Konu:** _(buraya konuyu yaz, örn. "10 Kuş Türü — Doğa & Bilim kategorisi")_
