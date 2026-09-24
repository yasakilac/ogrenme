import type { FinalTestQuestion } from '../../types';

export interface PhotoPreset {
  id: string;
  name: string;
  description: string;
  recommendedAperture: number;
  recommendedShutter: number; // in seconds
  recommendedIso: number;
  ambientLightEv: number; // EV level of the scene (e.g. 14 for bright daylight, 3 for night)
  category: string;
  subjectType: 'portrait' | 'action' | 'waterfall' | 'night_city' | 'concert';
  imageUrl: string;
  fallbackColor: string;
}

export interface FlashcardItem {
  id: string;
  title: string;
  category: 'Diyafram' | 'Enstantane' | 'ISO' | 'Pozlama';
  summary: string;
  details: string;
  formulaOrRule: string;
  visualEffect: string;
  mode: 'recognition';
}

export interface SoundMatchItem {
  id: string;
  shutterSpeed: number; // seconds
  label: string;
  situation: string;
  options: string[];
  correctOption: string;
  explanation: string;
}

export interface WrittenPromptItem {
  id: string;
  question: string;
  context: string;
  requiredKeywords: string[];
  sampleModelAnswer: string;
  mode: 'production';
}

export interface VisualMatchItem {
  id: string;
  title: string;
  photoUrl: string;
  effectDescription: string;
  primarySetting: 'Diyafram' | 'Enstantane' | 'ISO';
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ClozeItem {
  id: string;
  title: string;
  textBefore: string;
  blankAnswer: string;
  textBetween: string;
  secondBlankAnswer?: string;
  textAfter: string;
  options: string[];
  explanation: string;
}

export interface SequenceItem {
  id: string;
  title: string;
  instruction: string;
  items: { id: string; label: string; correctOrder: number; hint: string }[];
  explanation: string;
}

export interface CategorizeItem {
  id: string;
  text: string;
  correctCategory: 'Diyafram (f/stop)' | 'Enstantane (Süre)' | 'ISO (Hassasiyet)';
  explanation: string;
}

export interface TrueFalseItem {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface ErrorFindingItem {
  id: string;
  scenario: string;
  photoExif: { aperture: string; shutter: string; iso: string; lens: string; condition: string };
  symptom: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  recommendedFix: string;
}

export interface DiagramHotspot {
  id: string;
  label: string;
  description: string;
  xPercent: number;
  yPercent: number;
  functionKey: 'diyafram' | 'enstantane' | 'iso' | 'pozometre' | 'odak' | 'histogram';
}

export interface ComparisonMatrixItem {
  parameter: string;
  lowValue: { label: string; lightIntake: string; visualEffect: string; idealScenario: string };
  highValue: { label: string; lightIntake: string; visualEffect: string; idealScenario: string };
}

export interface ScenarioItem {
  id: string;
  title: string;
  story: string;
  goal: string;
  options: {
    id: string;
    label: string;
    settings: { f: string; s: string; iso: string };
    isCorrect: boolean;
    feedback: string;
  }[];
}

export interface AnalogyItem {
  id: string;
  premiseA: string;
  premiseB: string;
  targetC: string;
  options: string[];
  correctOption: string;
  explanation: string;
}

export interface SemanticNode {
  id: string;
  label: string;
  group: 'core' | 'setting' | 'effect' | 'tool';
  description: string;
}

export interface SemanticLink {
  source: string;
  target: string;
  relationship: string;
}

// ---------------- VERİ SETİ ---------------- //

export const APERTURE_STOPS = [1.4, 2.0, 2.8, 4.0, 5.6, 8.0, 11.0, 16.0, 22.0];

export const SHUTTER_STOPS = [
  { value: 0.00025, label: '1/4000s' },
  { value: 0.0005, label: '1/2000s' },
  { value: 0.001, label: '1/1000s' },
  { value: 0.002, label: '1/500s' },
  { value: 0.004, label: '1/250s' },
  { value: 0.008, label: '1/125s' },
  { value: 0.0166, label: '1/60s' },
  { value: 0.0333, label: '1/30s' },
  { value: 0.0666, label: '1/15s' },
  { value: 0.125, label: '1/8s' },
  { value: 0.25, label: '1/4s' },
  { value: 0.5, label: '1/2s' },
  { value: 1.0, label: '1s' },
  { value: 2.0, label: '2s' },
  { value: 4.0, label: '4s' },
];

export const ISO_STOPS = [100, 200, 400, 800, 1600, 3200, 6400, 12800];

export const CAMERA_PRESETS: PhotoPreset[] = [
  {
    id: 'portrait',
    name: 'Portre & Kremamsı Bokeh',
    description: 'Modeli arka plandan tamamen yalıtarak göz alıcı bir bulanıklık (bokeh) elde et.',
    recommendedAperture: 1.8,
    recommendedShutter: 0.004, // 1/250s
    recommendedIso: 100,
    ambientLightEv: 10.0,
    category: 'Portre',
    subjectType: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    fallbackColor: '#8E5B4C',
  },
  {
    id: 'action',
    name: 'Hızlı Kuş / Spor Hareketi Dondurma',
    description: 'Havada kanat çırpan kuşu veya koşan atleti sıfır hareket bulanıklığı ile havada asılı bırak.',
    recommendedAperture: 2.8,
    recommendedShutter: 0.0005, // 1/2000s
    recommendedIso: 800,
    ambientLightEv: 12.0,
    category: 'Aksiyon & Yaban Hayatı',
    subjectType: 'action',
    imageUrl: 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=900&q=80',
    fallbackColor: '#2D4E3A',
  },
  {
    id: 'waterfall',
    name: 'İpeksi Şelale / Akarsu',
    description: 'Akan suyu pamuk ve tül gibi pürüzsüzleştiren uzun pozlama tekniği.',
    recommendedAperture: 16.0,
    recommendedShutter: 0.5, // 1/2s
    recommendedIso: 100,
    ambientLightEv: 11.0,
    category: 'Doğa & Manzara',
    subjectType: 'waterfall',
    imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=900&q=80',
    fallbackColor: '#3B6B7C',
  },
  {
    id: 'night_city',
    name: 'Gece Şehir Işıkları & Araç İzleri',
    description: 'Trafik ışıklarının cadde boyunca ışık nehirlerine dönüştüğü tripod çekimi.',
    recommendedAperture: 11.0,
    recommendedShutter: 4.0, // 4s
    recommendedIso: 100,
    ambientLightEv: 3.0,
    category: 'Gece Fotoğrafçılığı',
    subjectType: 'night_city',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80',
    fallbackColor: '#17223B',
  },
  {
    id: 'concert',
    name: 'Loş Işıkta Sahne & Konser',
    description: 'Sürekli hareket eden müzisyeni yetersiz ışıkta gren dengesini koruyarak yakala.',
    recommendedAperture: 2.0,
    recommendedShutter: 0.008, // 1/125s
    recommendedIso: 3200,
    ambientLightEv: 6.0,
    category: 'Sahne & Etkinlik',
    subjectType: 'concert',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80',
    fallbackColor: '#4A1C3E',
  },
];

export const FLASHCARDS_DATA: FlashcardItem[] = [
  {
    id: 'fc-1',
    title: 'Diyafram (Aperture / f-stop)',
    category: 'Diyafram',
    summary: 'Objektif içerisindeki bıçakların açılarak sensöre giren ışık miktarını ve alan derinliğini kontrol etmesi.',
    details: 'f/ sayısı bir kesirdir (Odak uzaklığı / Diyafram çapı). Bu yüzden sayı küçüldükçe (örn. f/1.4) delik genişler, sensöre bol ışık girer ve arka plan bulanıklaşır (sığ alan derinliği). Sayı büyüdükçe (f/16) delik daralır ve her yer netleşir.',
    formulaOrRule: 'Küçük f-sayısı (f/1.8) = Çok Işık + Bulanık Arka Plan. Büyük f-sayısı (f/16) = Az Işık + Her Yer Net.',
    visualEffect: 'Arka plan bokeh bulanıklığı vs. Manzarada baştan sona jilet gibi keskinlik.',
    mode: 'recognition',
  },
  {
    id: 'fc-2',
    title: 'Enstantane Hızı (Shutter Speed)',
    category: 'Enstantane',
    summary: 'Kamera perdesinin ne kadar süre açık kalarak sensörü ışığa maruz bıraktığını belirleyen süredir.',
    details: 'Saniye cinsinden veya saniyenin kesirleri olarak ölçülür (1/1000s, 1/60s, 2s). Hızlı enstantane zamanı dondurur; yavaş enstantane ise akan su, ışık izi veya sporcu hareketini bulanıklaştırarak hareketi hissettirir.',
    formulaOrRule: 'Ters Odak Kuralı: Elde çekimde titremeyi önlemek için enstantane hızı lens odak uzaklığından yavaş olmamalıdır (örn. 50mm lens -> min 1/50s).',
    visualEffect: 'Hareketi havada asılı dondurma vs. İpeksi hareket izleri / el titremesi bulanıklığı.',
    mode: 'recognition',
  },
  {
    id: 'fc-3',
    title: 'ISO (Sensör Duyarlılığı)',
    category: 'ISO',
    summary: 'Sensörün gelen ışığa karşı elektriksel sinyal kazancını (amplification) ayarlama derecesi.',
    details: 'ISO 100 taban değerdir (en temiz, gren siz görüntü). Işık azaldığında ISO 1600, 3200 veya 6400 değerlerine çıkılarak görüntü aydınlatılır; ancak sensördeki elektriksel gürültü yükselir ve piksellerde gren (kumlanma) oluşur.',
    formulaOrRule: 'Mümkün olan en düşük ISO (tercihen 100-200) ile çekim yapın. Yalnızca diyafram ve enstantane sınırına ulaştığınızda ISO artırın.',
    visualEffect: 'Pürüzsüz saf doku vs. Kumlu, grenli, renk sapmalı (chroma noise) dijital doku.',
    mode: 'recognition',
  },
  {
    id: 'fc-4',
    title: 'Pozlama Üçgeni (Exposure Triangle)',
    category: 'Pozlama',
    summary: 'Fotoğrafın doğru parlaklığa (0 EV) ulaşması için Diyafram, Enstantane ve ISO’nun birbiriyle dengelenmesi kuralı.',
    details: 'Bir ayardan 1 stop kıstığınızda (örneğin diyaframı f/2.8\'den f/4\'e çektiğinizde ışık yarıya düşer), görüntünün kararmaması için enstantaneyi 1 stop uzatmalı (1/250s yerine 1/125s) veya ISO\'yu 1 stop artırmalısınız (ISO 200 yerine 400).',
    formulaOrRule: 'Pozlama (EV) = Diyafram x Enstantane x ISO dengesi. Işık miktarı terazinin bir kefesindeyse, ayarlar diğer kefesindedir.',
    visualEffect: 'Doğru pozlama (doğal renk ve kontrast), az pozlama (kapkara) veya aşırı pozlama (patlamış beyazlar).',
    mode: 'recognition',
  },
  {
    id: 'fc-5',
    title: 'Alan Derinliği (Depth of Field - DoF)',
    category: 'Diyafram',
    summary: 'Netlenen noktanın önünde ve arkasında kabul edilebilir derecede keskin görünen bölgenin derinliği.',
    details: 'Alan derinliğini 3 faktör belirler: 1) Diyafram açıklığı (açık diyafram = sığ alan derinliği), 2) Odak uzaklığı (telefoto lens = daha sığ derinlik), 3) Konuya olan fiziksel mesafe (yaklaştıkça derinlik sığlaşır).',
    formulaOrRule: 'Sığ Alan Derinliği: f/1.4 - f/2.8 (Portreler için). Geniş Alan Derinliği: f/8 - f/16 (Manzara ve mimari için).',
    visualEffect: 'Gözün doğrudan ana özneye kilitlenmesini sağlayan sinematik optik ayrım.',
    mode: 'recognition',
  },
  {
    id: 'fc-6',
    title: 'Pozometre ve EV (Exposure Value)',
    category: 'Pozlama',
    summary: 'Kamera vizöründe sahneden yansıyan ışığı ölçüp kullanıcının ayarlarının durumunu gösteren göstergedir.',
    details: 'Merkezdeki "0" noktası, sahnenin %18 griye göre dengeli pozlandığını gösterir. İbre sola doğru -1, -2, -3 yönüne giderse fotoğraf az pozlanmış (karanlık), sağa +1, +2, +3 yönüne giderse aşırı pozlanmış (yanmış) olur.',
    formulaOrRule: 'Vizörde ibreyi 0\'da tutmak standart pozlamadır. Kar manzarasında +1 EV pozlama telafisi, gece siluetinde -1 EV telafisi önerilir.',
    visualEffect: 'Vizör altındaki -3..-2..-1..0..+1..+2..+3 çubuğu.',
    mode: 'recognition',
  },
  {
    id: 'fc-7',
    title: 'Histogram Okuma',
    category: 'Pozlama',
    summary: 'Fotoğraftaki piksellerin siyahtan beyaza doğru ton dağılımını gösteren grafiksel harita.',
    details: 'Histogramın sol ucu saf siyahları (gölgeler), sağ ucu saf beyazları (parlak alanlar), ortası ise orta tonları temsil eder. Grafiğin sağ duvara çarpıp tırmanması detay kaybı (patlama / clipping), sol duvara yaslanması ise gölgelerin çökmesi demektir.',
    formulaOrRule: 'Kamera ekranındaki yanıltıcı parlaklığa değil, her zaman histogramın grafiğine güvenin!',
    visualEffect: 'Çan eğrisine benzeyen dengeli bir tonal dağılım ideal kabul edilir.',
    mode: 'recognition',
  },
  {
    id: 'fc-8',
    title: '1 Stop Kuralı (Stop Değişimi)',
    category: 'Pozlama',
    summary: 'Fotoğrafçılıkta sensöre ulaşan ışık miktarının 2 katına çıkması (+1 stop) veya yarıya inmesi (-1 stop) adımı.',
    details: 'Tam stop serisi: Diyaframda: f/1.4 -> 2 -> 2.8 -> 4 -> 5.6 -> 8 -> 11 -> 16 -> 22. Enstantanede: 1/1000s -> 1/500s -> 1/250s -> 1/125s -> 1/60s. ISO\'da: 100 -> 200 -> 400 -> 800 -> 1600 -> 3200.',
    formulaOrRule: 'Bir ayarda +1 stop (ışığı iki kat artırma) yaptıysanız, diğer bir ayarda -1 stop (ışığı yarıya düşürme) yaparak dengeyi korursunuz.',
    visualEffect: 'Pozlama düzeyini tam olarak aynı tutarken optik karakteri (bokeh, hareket, gren) değiştirme sanatı.',
    mode: 'recognition',
  },
];

export const SOUND_MATCH_ITEMS: SoundMatchItem[] = [
  {
    id: 'sm-1',
    shutterSpeed: 0.001, // 1/1000s
    label: 'Çok Hızlı Deklanşör Sesi',
    situation: 'Güneşli günde uçan şahini havada jilet gibi dondururken çıkan ses.',
    options: ['1/1000 saniye (Hızlı)', '1/15 saniye (Yavaş)', '2 saniye (Uzun Pozlama)'],
    correctOption: '1/1000 saniye (Hızlı)',
    explanation: 'Perde o kadar hızlı açılıp kapanır ki iki tık neredeyse tek bir keskin metalik vuruş gibi birleşir.',
  },
  {
    id: 'sm-2',
    shutterSpeed: 0.125, // 1/8s
    label: 'Orta-Yavaş Deklanşör Sesi',
    situation: 'Akşam üzeri elde tutulursa el titremesi riski taşıyan, perdenin esnediği an.',
    options: ['1/4000 saniye', '1/8 saniye (Orta-Yavaş)', '1/500 saniye'],
    correctOption: '1/8 saniye (Orta-Yavaş)',
    explanation: 'Ayna kalktıktan sonra belirgin bir duraklama olur ve perde kapanışı kulakla netçe ayırt edilir.',
  },
  {
    id: 'sm-3',
    shutterSpeed: 2.0, // 2s
    label: 'Uzun Pozlama Deklanşör Sesi',
    situation: 'Gece deniz kıyısında dalgaları sisleştirmek için tripod üzerinde çekim yapılırken.',
    options: ['1/250 saniye', '1/60 saniye', '2 tam saniye (Uzun Pozlama)'],
    correctOption: '2 tam saniye (Uzun Pozlama)',
    explanation: 'İlk tıkta ayna ve perde kalkar, 2 koca saniye süren derin bir sessizlikten sonra ikinci tokat gibi kapanış sesi gelir.',
  },
];

export const WRITTEN_PROMPTS: WrittenPromptItem[] = [
  {
    id: 'wp-1',
    question: 'f/1.8 gibi açık bir diyafram ile f/16 gibi kısık bir diyaframın fotoğrafa optik ve ışık etkisini kendi cümlelerinizle karşılaştırınız.',
    context: 'Portre veya manzara çeken bir fotoğrafçının neden f/1.8 veya f/16 tercih ettiğini açıklayın.',
    requiredKeywords: ['ışık', 'alan derinliği', 'bulanık', 'net', 'keskin'],
    sampleModelAnswer: 'f/1.8 çok geniştir; sensöre bol ışık alır ve sığ alan derinliği oluşturarak arka planı krema gibi bulanıklaştırır (portre için idealdir). f/16 ise çok dardır; az ışık geçirir ancak geniş alan derinliği sağlayarak hem ön planı hem arka plandaki dağları baştan sona net ve keskin yapar.',
    mode: 'production',
  },
  {
    id: 'wp-2',
    question: 'Karanlık bir ortamda flaşsız çekim yaparken ISO değerini 100’den 6400’e çıkarmanın avantajı ve beraberinde getirdiği bedel (dezavantaj) nedir?',
    context: 'Düşük ışık fotoğrafçılığında sensör kazancı prensibini düşünün.',
    requiredKeywords: ['parlak', 'gren', 'gürültü', 'aydınlık', 'kalite'],
    sampleModelAnswer: 'Avantajı: Sensör sinyalini yükselterek karanlıkta daha hızlı enstantane kullanabilmeyi ve fotoğrafın aydınlık çıkmasını sağlar. Dezavantajı: Sinyalle birlikte elektriksel gürültü de yükselir; fotoğrafta gren (kumlanma), detay kaybı ve dinamik aralıkta daralma meydana gelir.',
    mode: 'production',
  },
];

export const VISUAL_MATCH_ITEMS: VisualMatchItem[] = [
  {
    id: 'vm-1',
    title: 'Modelin Gözleri Keskin, Arka Plandaki Şehir Işıkları Daireler Şeklinde Bulanık',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    effectDescription: 'Bu fotoğrafta model odakta parıldarken arka plan yumuşak bir ışık lekesi havuzuna dönüşmüştür.',
    primarySetting: 'Diyafram',
    options: ['Geniş Diyafram (f/1.4 - f/2.0)', 'Çok Hızlı Enstantane (1/4000s)', 'Yüksek ISO (12800)'],
    correctAnswer: 'Geniş Diyafram (f/1.4 - f/2.0)',
    explanation: 'Arka plandaki dairesel bokeh efekti ve son derece sığ alan derinliği, f/1.4 - f/2.0 gibi geniş diyafram açıklıklarının ayırt edici optik imzasıdır.',
  },
  {
    id: 'vm-2',
    title: 'Şelalenin Suyu Köpük Köpük Pütürlü Değil, Tül ve İpek Gibi Pürüzsüz',
    photoUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
    effectDescription: 'Akan suyun tüm hareket çizgileri birleşmiş, kayalar sabit ve keskin kalırken su süt beyaz bir tül halini almıştır.',
    primarySetting: 'Enstantane',
    options: ['Yavaş Enstantane / Uzun Pozlama (1s - 4s)', 'Düşük Diyafram (f/1.8)', 'Otomatik Netleme Noktası'],
    correctAnswer: 'Yavaş Enstantane / Uzun Pozlama (1s - 4s)',
    explanation: 'Su gibi hareketli sıvıların pürüzsüzleştirilip hareket hissinin zamana yayılması, perdenin 1-4 saniye gibi uzun süre açık bırakılmasıyla sağlanır.',
  },
  {
    id: 'vm-3',
    title: 'Gece Gökyüzü ve Samanyolu Fotoğrafında Kumlanma, Nokta Nokta Renk Pürüzleri',
    photoUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    effectDescription: 'Karanlık alanlarda renk sapmaları ve piksellerde kum gibi parazitler (noise/gren) mevcuttur.',
    primarySetting: 'ISO',
    options: ['Çok Yüksek ISO Değeri (ISO 6400 - 12800)', 'Kısık Diyafram (f/22)', 'Hızlı Enstantane (1/2000s)'],
    correctAnswer: 'Çok Yüksek ISO Değeri (ISO 6400 - 12800)',
    explanation: 'Yüksek ISO, sensörün zayıf ışık sinyalini aşırı yükseltirken kaçınılmaz olarak dijital gürültüyü (gren) fotoğrafa ekler.',
  },
];

export const CLOZE_ITEMS: ClozeItem[] = [
  {
    id: 'cl-1',
    title: 'Pozlama Üçgeninde Işık Telafisi',
    textBefore: 'Diyaframı f/2.8\'den f/5.6\'ya kısarak ışığı 2 stop azalttığımızda, fotoğrafın kararmaması için enstantane süresini 1/500s\'den',
    blankAnswer: '1/125s',
    textBetween: 'değerine uzatmalı veya ISO değerini',
    secondBlankAnswer: 'artırmalıyız',
    textAfter: '.',
    options: ['1/125s', '1/2000s', '1/4000s', 'artırmalıyız', 'azaltmalıyız'],
    explanation: '2 stop ışık kaybını telafi etmek için süreyi 4 kat uzatmak (1/500 -> 1/250 -> 1/125) veya ISO hassasiyetini artırmak gerekir.',
  },
  {
    id: 'cl-2',
    title: 'Ters Odak Enstantane Kuralı',
    textBefore: 'Elde 200mm telefoto lensle tripodsuz çekim yaparken, el titremesinden kaynaklanan bulanıklığı engellemek için minimum güvenli enstantane hızı yaklaşık',
    blankAnswer: '1/250s',
    textBetween: 'veya daha hızlı olmalıdır; çünkü odak uzaklığı uzadıkça elin en ufak sarsıntısı karede',
    secondBlankAnswer: 'büyür',
    textAfter: '.',
    options: ['1/250s', '1/15s', '1/2s', 'büyür', 'küçülür'],
    explanation: '1/Odak uzaklığı kuralına göre 200mm lens için güvenli alt sınır yaklaşık 1/200s (makinelerde 1/250s) dir.',
  },
];

export const SEQUENCE_ITEMS: SequenceItem[] = [
  {
    id: 'seq-1',
    title: 'Diyafram Açıklıkları: En Çok Işık Geçirenden En Az Işık Geçirene',
    instruction: 'Aşağıdaki diyafram değerlerini sensöre en çok ışık alandan (en açık) en az ışık alana (en kısık) doğru sıralayınız.',
    items: [
      { id: 'f14', label: 'f/1.4', correctOrder: 1, hint: 'En geniş delik, devasa ışık, en sığ alan derinliği' },
      { id: 'f28', label: 'f/2.8', correctOrder: 2, hint: 'Profesyonel zoom lenslerin geniş diyaframı' },
      { id: 'f56', label: 'f/5.6', correctOrder: 3, hint: 'Orta seviye açıklık, portre ve sokak için dengeli' },
      { id: 'f11', label: 'f/11', correctOrder: 4, hint: 'Kısık diyafram, manzara için geniş netlik' },
      { id: 'f22', label: 'f/22', correctOrder: 5, hint: 'İğne deliği kadar dar, en az ışık, difraksiyon riski' },
    ],
    explanation: 'f/ sayısı kesir olduğu için payda küçüldükçe delik büyür: f/1.4 > f/2.8 > f/5.6 > f/11 > f/22.',
  },
  {
    id: 'seq-2',
    title: 'Enstantane Hızları: Hareketi En İyi Dondurandan En Çok Bulanıklaştırana',
    instruction: 'Aşağıdaki süreleri perdenin en hızlı kapandığı andan en uzun süre açık kaldığı ana doğru sıralayınız.',
    items: [
      { id: 's4000', label: '1/4000 saniye', correctOrder: 1, hint: 'Göz açıp kapayıncaya kadar, mermiyi bile dondurur' },
      { id: 's500', label: '1/500 saniye', correctOrder: 2, hint: 'Koşan insan ve bisikletliyi dondurur' },
      { id: 's60', label: '1/60 saniye', correctOrder: 3, hint: 'Standart sokak ve portre eşiği' },
      { id: 's4', label: '1/4 saniye', correctOrder: 4, hint: 'Elde tutulamaz, hareketli insanlar hayalete döner' },
      { id: 's30', label: '30 saniye', correctOrder: 5, hint: 'Tripod şart, yıldız pozlama ve deniz sisi' },
    ],
    explanation: '1/4000s saniyenin dört binde biridir, 30s ise yarım dakikadır. Hızlıdan yavaşa: 1/4000s > 1/500s > 1/60s > 1/4s > 30s.',
  },
];

export const CATEGORIZE_ITEMS: CategorizeItem[] = [
  {
    id: 'cat-1',
    text: 'Arka plandaki objelerin kremamsı şekilde eriyip dairesel bokeh oluşturması',
    correctCategory: 'Diyafram (f/stop)',
    explanation: 'Alan derinliği ve bokeh tamamen diyafram açıklığının optik geometrisiyle kontrol edilir.',
  },
  {
    id: 'cat-2',
    text: 'Helikopter pervanesinin havada donup net çizgiler olarak kalması',
    correctCategory: 'Enstantane (Süre)',
    explanation: 'Hareket dondurma veya hareket izi oluşturma perdenin açık kalma süresiyle yönetilir.',
  },
  {
    id: 'cat-3',
    text: 'Karanlık fotoğrafta büyütüldüğünde görülen renkli kumlanma ve piksellenme (noise)',
    correctCategory: 'ISO (Hassasiyet)',
    explanation: 'Sensör kazancının yükselmesi elektriksel gürültüyü (gren) ortaya çıkarır.',
  },
  {
    id: 'cat-4',
    text: 'Sokak lambalarının etrafında yıldız şeklinde ışık huzmeleri (Star-burst efekti)',
    correctCategory: 'Diyafram (f/stop)',
    explanation: 'Kısık diyaframlarda (f/16, f/22) diyafram bıçaklarının köşelerinden ışık kırınımı (difraksiyon) yıldız efekti üretir.',
  },
  {
    id: 'cat-5',
    text: 'Panning tekniği ile araba keskin kalırken arka planın yatay çizgilerle akması',
    correctCategory: 'Enstantane (Süre)',
    explanation: 'Kamerayı hareketli araçla birlikte çevirirken 1/30s gibi enstantaneyle çekim yapma tekniğidir.',
  },
  {
    id: 'cat-6',
    text: 'Fotoğrafın en yüksek dinamik aralığa ve en saf renk doğruluğuna sahip olması',
    correctCategory: 'ISO (Hassasiyet)',
    explanation: 'Kameranın taban ISO değerinde (genellikle ISO 100) sensör maksimum dinamik aralık ve temizlik sunar.',
  },
];

export const TRUE_FALSE_ITEMS: TrueFalseItem[] = [
  {
    id: 'tf-1',
    statement: 'Diyafram değeri f/2.8\'den f/8\'e getirildiğinde, sensöre giren ışık miktarı artar.',
    isTrue: false,
    explanation: 'Yanlış! Sayı büyüdükçe (f/8) diyafram deliği daralır ve sensöre giren ışık miktarı ciddi oranda azalır.',
  },
  {
    id: 'tf-2',
    statement: '1/2000s enstantane hızı, 1/60s enstantane hızına göre hareketi çok daha keskin dondurur.',
    isTrue: true,
    explanation: 'Doğru! 1/2000s saniyenin iki binde biridir ve hızlı sporcuları veya kanat çırpan kuşları dondurur.',
  },
  {
    id: 'tf-3',
    statement: 'Yüksek ISO (örn. 12800) kullanmak lensin içine fiziksel olarak daha fazla foton girmesini sağlar.',
    isTrue: false,
    explanation: 'Yanlış! ISO lense gelen ışığı artırmaz; sensörün mevcut zayıf ışık sinyalini dijital ve elektriksel olarak yükseltir (amplifikasyon).',
  },
  {
    id: 'tf-4',
    statement: 'Manzara fotoğrafında ön plandaki çiçeğin de arkadaki dağların da net çıkması için açık diyafram (f/1.4) seçilmelidir.',
    isTrue: false,
    explanation: 'Yanlış! Her yerin net olması geniş alan derinliği gerektirir, bunun için kısık diyafram (f/8 veya f/11) kullanılmalıdır.',
  },
];

export const ERROR_FINDING_ITEMS: ErrorFindingItem[] = [
  {
    id: 'ef-1',
    scenario: 'Basketbol maçında smaç basan oyuncuyu kapalı salonda çektiniz ancak fotoğrafı büyütünce oyuncunun eli ve top hayalet gibi bulanık çıktı.',
    photoExif: {
      aperture: 'f/2.8',
      shutter: '1/60 saniye',
      iso: 'ISO 400',
      lens: '70-200mm f/2.8',
      condition: 'Kapalı spor salonu aydınlatması',
    },
    symptom: 'Top ve kollar net değil, hareket bulanıklığı (motion blur) var.',
    options: [
      'Enstantane 1/60s seçildiği için hızlı smaç hareketini dondurmaya yetmemiştir.',
      'f/2.8 diyafram seçildiği için alan derinliği çok dardır.',
      'ISO 400 çok yüksek olduğu için fotoğrafta gren oluşmuştur.',
      'Odaklama modu manuelde unutulmuştur.',
    ],
    correctOptionIndex: 0,
    explanation: 'Kapalı salon sporlarında sporcuların el ve top hareketini dondurmak için en az 1/1000s enstantane gerekir. 1/60s süresince sporcu hareket ettiği için kare bulanıklaşmıştır.',
    recommendedFix: 'Enstantaneyi 1/1000s\'ye yükseltin; karanlığı telafi etmek için ISO\'yu 3200 veya 6400\'e çıkarın.',
  },
  {
    id: 'ef-2',
    scenario: 'Güneşli öğle vakti açık havada modelin arkasını bulanıklaştırmak için f/1.4 diyafram ayarladınız fakat deklanşöre basınca fotoğraf bembeyaz bir patlama olarak çıktı.',
    photoExif: {
      aperture: 'f/1.4',
      shutter: '1/125 saniye',
      iso: 'ISO 800',
      lens: '85mm f/1.4',
      condition: 'Kavurucu öğle güneşi',
    },
    symptom: 'Aşırı pozlama (blown-out highlights / clipping), yüz ve gökyüzü tamamen bembeyaz.',
    options: [
      'f/1.4 gibi devasa bir diyaframa ve kavurucu güneşe rağmen enstantane çok yavaş (1/125s) ve ISO gereksiz yere yüksek (800) tutulmuştur.',
      'Lens parasolü takılmadığı için parlama olmuştur.',
      'Beyaz ayarı (White Balance) yanlış seçilmiştir.',
      'Sensör temizlenmediği için toz parlamıştır.',
    ],
    correctOptionIndex: 0,
    explanation: 'Güneş altında f/1.4 kullanırken ışık sel gibi akar. ISO\'yu taban 100\'e çekmeli ve enstantaneyi 1/4000s veya 1/8000s gibi en yüksek hıza getirmelisiniz (gerekirse ND filtre takılır).',
    recommendedFix: 'ISO 100 yapın ve enstantaneyi 1/4000s\'ye veya daha hızlısına getirin.',
  },
];

export const DIAGRAM_HOTSPOTS: DiagramHotspot[] = [
  {
    id: 'spot-aperture',
    label: 'Diyafram Göstergesi (F-stop)',
    description: 'Vizörde veya üst ekranda f/2.8, f/4 gibi gösterilir; lens açıklığı ve alan derinliğini bildirir.',
    xPercent: 24,
    yPercent: 88,
    functionKey: 'diyafram',
  },
  {
    id: 'spot-shutter',
    label: 'Enstantane Kadranı / Hızı (S)',
    description: 'Vizörün sol altında "1/1000" veya "250" şeklinde görünür; perdenin ışık alma süresidir.',
    xPercent: 12,
    yPercent: 88,
    functionKey: 'enstantane',
  },
  {
    id: 'spot-meter',
    label: 'Pozometre Skalası (-3..0..+3)',
    description: 'Kameranın dahili ışık ölçeridir; ibre tam ortada (0) olduğunda sahne dengeli pozlanmış kabul edilir.',
    xPercent: 48,
    yPercent: 88,
    functionKey: 'pozometre',
  },
  {
    id: 'spot-iso',
    label: 'ISO Hassasiyet Göstergesi',
    description: 'Sensör kazancını belirtir; ISO 100, 800, 3200 gibi değerlerle ışık ihtiyacını karşılar.',
    xPercent: 78,
    yPercent: 88,
    functionKey: 'iso',
  },
  {
    id: 'spot-focus',
    label: 'Merkezi Odak Noktası (AF Reticle)',
    description: 'Netliği kilitlemek istediğiniz nesnenin (örneğin portrede modelin gözü) üzerine getirdiğiniz vizör ızgarası.',
    xPercent: 50,
    yPercent: 46,
    functionKey: 'odak',
  },
  {
    id: 'spot-hist',
    label: 'Canlı Histogram Ekranı',
    description: 'Kameranın sağ üst veya alt köşesinde piksellerin karanlık ve aydınlık dağılımını gösteren grafik.',
    xPercent: 84,
    yPercent: 18,
    functionKey: 'histogram',
  },
];

export const COMPARISON_MATRIX: ComparisonMatrixItem[] = [
  {
    parameter: 'Diyafram Açıklığı (f-sayısı)',
    lowValue: {
      label: 'Açık Diyafram (f/1.4 - f/2.8)',
      lightIntake: 'Maksimum Işık Girişi',
      visualEffect: 'Sığ alan derinliği, arka plan kremamsı bulanık (bokeh), gözü özneye odaklar.',
      idealScenario: 'Portreler, makro çekimler, loş ışıkta gece sokak çekimleri.',
    },
    highValue: {
      label: 'Kısık Diyafram (f/8 - f/16)',
      lightIntake: 'Minimum Işık Girişi',
      visualEffect: 'Geniş alan derinliği, önden arkaya tüm kare jilet gibi net ve keskin.',
      idealScenario: 'Geniş manzara, mimari çekimler, grup fotoğrafları.',
    },
  },
  {
    parameter: 'Enstantane Hızı (Perde Süresi)',
    lowValue: {
      label: 'Hızlı Enstantane (1/1000s - 1/4000s)',
      lightIntake: 'Işığa Maruz Kalma Çok Kısa',
      visualEffect: 'Zamanı milisaniyelik dondurur, su damlaları havada kristalleşir.',
      idealScenario: 'Vahşi yaşam, motor sporları, koşan çocuklar ve evcil hayvanlar.',
    },
    highValue: {
      label: 'Yavaş Enstantane (1/2s - 30s)',
      lightIntake: 'Işığa Maruz Kalma Çok Uzun',
      visualEffect: 'Hareketi çizgilere ve sis bulutlarına dönüştürür (tripod gerekir).',
      idealScenario: 'İpeksi şelaleler, gece araba far izleri, Samanyolu ve yıldız pozlama.',
    },
  },
  {
    parameter: 'Sensör Kazancı (ISO)',
    lowValue: {
      label: 'Düşük ISO (100 - 200)',
      lightIntake: 'Saf Sinyal Kazancı (Baz Değer)',
      visualEffect: 'Kristal berraklığında temiz dokular, sıfır gren, en yüksek renk dinamizmi.',
      idealScenario: 'Stüdyo ışıkları altında, güneşli dış mekanda, tripodlu manzara çekiminde.',
    },
    highValue: {
      label: 'Yüksek ISO (3200 - 12800)',
      lightIntake: 'Elektriksel Olarak Güçlendirilmiş Sinyal',
      visualEffect: 'Görüntüde kumlanma (gren), kontrastta ve dinamik aralıkta hafif düşüş.',
      idealScenario: 'Flaşın yasak olduğu konserler, kapalı spor salonları, karanlık doğum günü partisi.',
    },
  },
];

export const SCENARIO_ITEMS: ScenarioItem[] = [
  {
    id: 'sc-1',
    title: 'Güneşli Kumsalda Koşan Sevimli Köpek',
    story: 'Kumsal parlak öğle güneşiyle aydınlanıyor. Köpek çılgınca sağa sola koşup dalgaların üzerinden atlıyor. Amacınız köpeğin yüz ifadesini ve havaya sıçrayan su damlacıklarını havada kristal gibi asılı yakalamak.',
    goal: 'Hareketi dondurmak ve parlak güneş altında aşırı pozlamayı önlemek.',
    options: [
      {
        id: 'opt-a',
        label: 'f/4 • 1/2000s • ISO 100',
        settings: { f: 'f/4', s: '1/2000s', iso: '100' },
        isCorrect: true,
        feedback: 'Mükemmel seçim! 1/2000s su damlacıklarını ve köpeği havada dondurur. ISO 100 ve f/4 kumsalın parlak ışığında tam 0 EV dengesi sağlar.',
      },
      {
        id: 'opt-b',
        label: 'f/16 • 1/30s • ISO 800',
        settings: { f: 'f/16', s: '1/30s', iso: '800' },
        isCorrect: false,
        feedback: '1/30s koşan bir köpek için çok yavaştır; köpek tamamen bulanık bir leke olarak çıkacaktır.',
      },
      {
        id: 'opt-c',
        label: 'f/1.4 • 1/250s • ISO 3200',
        settings: { f: 'f/1.4', s: '1/250s', iso: '3200' },
        isCorrect: false,
        feedback: 'Güneşli kumsalda ISO 3200 ve f/1.4 fotoğrafı bembeyaz bir ışık patlamasına dönüştürür (aşırı pozlama).',
      },
    ],
  },
  {
    id: 'sc-2',
    title: 'Loş Işıklı Caz Kulübünde Saksafon Sanatçısı',
    story: 'Mekanda yalnızca sahneye vuran loş sarı bir spot ışık var. Flaş patlatmak ambiyansı bozacağı için kesinlikle yasak. Elde çekim yapıyorsunuz.',
    goal: 'Elde titremeden, bulanıklaşmadan ve karanlık kalmadan canlı bir an yakalamak.',
    options: [
      {
        id: 'opt-a',
        label: 'f/1.8 • 1/160s • ISO 3200',
        settings: { f: 'f/1.8', s: '1/160s', iso: '3200' },
        isCorrect: true,
        feedback: 'Kusursuz profesyonel ayar! f/1.8 maksimum ışık çeker, 1/160s el titremesini engeller, ISO 3200 loş ışığı dengeler.',
      },
      {
        id: 'opt-b',
        label: 'f/11 • 1/500s • ISO 100',
        settings: { f: 'f/11', s: '1/500s', iso: '100' },
        isCorrect: false,
        feedback: 'Fotoğraf zifiri karanlık çıkar! f/11 ve 1/500s loş mekanda sensöre neredeyse hiç foton ulaştırmaz.',
      },
      {
        id: 'opt-c',
        label: 'f/2.8 • 1/2s • ISO 100',
        settings: { f: 'f/2.8', s: '1/2s', iso: '100' },
        isCorrect: false,
        feedback: '1/2 saniye elde çekildiğinde elinizin en ufak nabız atışı bile tüm kareyi çamur gibi bulanıklaştırır.',
      },
    ],
  },
];

export const ANALOGY_ITEMS: AnalogyItem[] = [
  {
    id: 'an-1',
    premiseA: 'Diyafram',
    premiseB: 'İnsan gözünün göz bebeği (ortama göre büyüyüp küçülen iris)',
    targetC: 'Enstantane',
    options: ['Göz kırpma hızı ve göz kapağının açık kalma süresi', 'Gözlük camının rengi', 'Gözdeki retina tabakası'],
    correctOption: 'Göz kırpma hızı ve göz kapağının açık kalma süresi',
    explanation: 'Diyafram ışığın girdiği deliğin çapını ayarlarken (göz bebeği gibi), Enstantane ışığın ne kadar süre içeri süzüleceğini kontrol eder (göz kapağı gibi).',
  },
  {
    id: 'an-2',
    premiseA: 'ISO Hassasiyeti',
    premiseB: 'Bir mikrofonun veya amfinin ses volüm/gain düğmesi',
    targetC: 'Aşırı Yüksek ISO',
    options: [
      'Amfinin sesini sonuna kadar açınca hoparlörden gelen cızırtı/hışırtı (gürültü)',
      'Hoparlörün kablosunun kopması',
      'Müziğin daha yavaş çalması',
    ],
    correctOption: 'Amfinin sesini sonuna kadar açınca hoparlörden gelen cızırtı/hışırtı (gürültü)',
    explanation: 'Tıpkı amfi sesini sonuna kadar köklediğinizde sinyalle birlikte arka plan tıslaması (hiss) artması gibi, ISO arttığında da fotoğrafta gren/kumlanma artar.',
  },
];

export const METAPHOR_DATA = {
  title: 'Su Kovası ve Musluk Metaforu',
  description: 'Pozlama üçgenini anlamanın dünyadaki en ünlü ve sezgisel benzetmesi: Bir kovayı tam ağzına kadar suyla doldurmak (Doğru Pozlama).',
  elements: [
    {
      concept: 'Diyafram (Musluğun Vanası)',
      metaphor: 'Musluğun boru genişliği veya vananın ne kadar açıldığı.',
      effect: 'Musluğu sonuna kadar açarsanız (f/1.4) kova saniyeler içinde suyla dolar. Musluğu kısarsanız (f/16) su ip gibi incecik akar.',
    },
    {
      concept: 'Enstantane (Musluğun Açık Kalma Süresi)',
      metaphor: 'Musluğun kaç saniye açık bırakıldığı.',
      effect: 'Vana kısıksa (f/16) kovanın dolması için musluğu dakikalarca açık tutmanız gerekir (uzun pozlama). Vana çok açıksa (f/1.4) 1 saniye bile yettiğinden hemen kapatırsınız (hızlı enstantane).',
    },
    {
      concept: 'ISO (Kovanın Büyüklüğü / Sünger Hassasiyeti)',
      metaphor: 'Kovanın yerine suyu anında çeken özel bir sünger koymak veya kovanın hacmini küçültmek.',
      effect: 'Yüksek ISO, küçük bir kova gibidir; çok az suyla bile hemen dolar. Ancak kova çok küçük olduğunda su taşabilir ve sıçrayan damlalar (gren) etrafa yayılır.',
    },
    {
      concept: 'Pozlama Sonucu (Kovadaki Su Seviyesi)',
      metaphor: 'Kovanın doluluk oranı.',
      effect: 'Kova tam dolduysa = Kusursuz Pozlama (0 EV). Kova yarıda kaldıysa = Az Pozlama / Karanlık (-2 EV). Su taştı ve yerlere saçıldıysa = Aşırı Pozlama / Patlamış Beyazlar (+2 EV).',
    },
  ],
};

export const SEMANTIC_MAP_DATA: { nodes: SemanticNode[]; links: SemanticLink[] } = {
  nodes: [
    { id: 'pozlama', label: 'Pozlama (Exposure)', group: 'core', description: 'Sensöre düşen toplam ışık miktarı ve görüntünün parlaklığı' },
    { id: 'diyafram', label: 'Diyafram (Aperture)', group: 'setting', description: 'Lens içindeki bıçakların açıklığı (f/stop)' },
    { id: 'enstantane', label: 'Enstantane (Shutter)', group: 'setting', description: 'Perdenin açık kalma süresi' },
    { id: 'iso', label: 'ISO', group: 'setting', description: 'Sensör sinyal amplifikasyonu' },
    { id: 'bokeh', label: 'Bokeh & Alan Derinliği', group: 'effect', description: 'Arka plan bulanıklığı ve netlik derinliği' },
    { id: 'hareket', label: 'Hareket Dondurma / Bulanıklığı', group: 'effect', description: 'Zamanın dondurulması veya hareket izleri' },
    { id: 'gren', label: 'Dijital Gren / Kumlanma', group: 'effect', description: 'Elektriksel sinyal gürültüsü' },
    { id: 'pozometre', label: 'Pozometre (-3..0..+3)', group: 'tool', description: 'Vizördeki canlı ışık denge ibresi' },
    { id: 'histogram', label: 'Histogram Haritası', group: 'tool', description: 'Tonal dağılım grafiği' },
  ],
  links: [
    { source: 'diyafram', target: 'pozlama', relationship: 'Işık miktarını belirler' },
    { source: 'enstantane', target: 'pozlama', relationship: 'Işık süresini belirler' },
    { source: 'iso', target: 'pozlama', relationship: 'Işık hassasiyetini belirler' },
    { source: 'diyafram', target: 'bokeh', relationship: 'Açık diyafram bokeh üretir' },
    { source: 'enstantane', target: 'hareket', relationship: 'Hızlı süre hareketi dondurur' },
    { source: 'iso', target: 'gren', relationship: 'Yüksek ISO gren yaratır' },
    { source: 'pozlama', target: 'pozometre', relationship: 'Pozometre ile ölçülür' },
    { source: 'pozlama', target: 'histogram', relationship: 'Histogramda okunur' },
  ],
};

// ---------------- ZORUNLU BİTİRME TESTİ (FINAL TEST) ---------------- //

export const PHOTOGRAPHY_FINAL_TEST: FinalTestQuestion[] = [
  {
    id: 'ft-1',
    question: 'f/1.8 diyafram değeri ile f/11 diyafram değeri arasındaki en temel optik fark nedir?',
    options: [
      'f/1.8 daha geniş bir açıklıktır, daha çok ışık alır ve arka planı bulanıklaştırır; f/11 ise daha kısıktır ve her yeri netleştirir.',
      'f/11 sensöre f/1.8\'den daha fazla ışık gönderir.',
      'f/1.8 sadece gece çekimlerinde kullanılır, gündüz kullanılamaz.',
      'f/11 enstantane hızını otomatik olarak iki katına çıkarır.',
    ],
    correctIndex: 0,
    explanation: 'Küçük f-sayısı daha geniş fiziksel delik demektir. Bu da bol ışık ve sığ alan derinliği (bokeh) sağlar. Büyük f-sayısı ise geniş alan derinliği sağlar.',
    mode: 'recognition',
  },
  {
    id: 'ft-2',
    question: 'Hızlı koşan bir futbolcuyu veya uçan kuşu havada "donmuş" gibi net çekmek için hangi enstantane hızı en uygundur?',
    options: [
      '1/1000 saniye veya daha hızlısı',
      '1/30 saniye',
      '1 saniye',
      'Bulb (sürekli açık)',
    ],
    correctIndex: 0,
    explanation: 'Hızlı spor ve yaban hayatı hareketlerini sıfır hareket bulanıklığıyla havada asılı yakalamak için 1/1000s veya 1/2000s gibi yüksek enstantane hızları gereklidir.',
    mode: 'recognition',
  },
  {
    id: 'ft-3',
    question: 'ISO değerini 100’den 6400’e çıkardığınızda fotoğrafta meydana gelen kaçınılmaz yan etki hangisidir?',
    options: [
      'Görüntüde dijital kumlanma (gren/noise) artar ve detay keskinliği zayıflar.',
      'Fotoğrafın odak noktası kendiliğinden kayar.',
      'Arka plan bulanıklığı (bokeh) iki katına çıkar.',
      'Deklanşör mekanik olarak daha yavaş çalışır.',
    ],
    correctIndex: 0,
    explanation: 'ISO artışı sensör sinyalini yükseltirken elektriksel gürültüyü de büyütür; bu da fotoğrafta gren ve kumlanmaya yol açar.',
    mode: 'recognition',
  },
  {
    id: 'ft-4',
    question: 'Diyaframı 1 stop kıstığınızda (örneğin f/2.8\'den f/4\'e getirdiğinizde), fotoğrafın parlaklığını aynı tutmak için enstantane süresinde ne yapmalısınız?',
    options: [
      'Enstantane süresini 1 stop uzatmalısınız (örneğin 1/500s yerine 1/250s yapmalısınız).',
      'Enstantane süresini yarıya indirmelisiniz (örneğin 1/500s yerine 1/1000s yapmalısınız).',
      'Enstantaneye dokunmadan vizörden bakmayı bırakmalısınız.',
      'Lensi değiştirmelisiniz.',
    ],
    correctIndex: 0,
    explanation: 'Diyafram 1 stop kısıldığında içeri giren ışık yarıya düşer. Dengeyi korumak için süreyi iki katına çıkarmak (1/500s -> 1/250s) gerekir.',
    mode: 'production',
  },
  {
    id: 'ft-5',
    question: 'Fotoğraf makinesinin vizöründeki dahili pozometre göstergesi ibreyi "+2" üzerinde gösteriyorsa bu durum ne anlama gelir?',
    options: [
      'Fotoğraf aşırı pozlanmaktadır (overexposed); gereğinden fazla aydınlık ve parlak alanlarda patlama riski vardır.',
      'Fotoğraf çok karanlıktır ve kapkara çıkacaktır.',
      'Makinenin pili bitmek üzeredir.',
      'Netleme (otofokus) başarıyla kilitlenmiştir.',
    ],
    correctIndex: 0,
    explanation: '+2 EV, standart orta gri pozlama düzeyine göre 2 stop fazla ışık alındığını, yani görüntünün aşırı parlak olacağını belirtir.',
    mode: 'recognition',
  },
  {
    id: 'ft-6',
    question: 'Bir şelale veya akarsu fotoğrafında suyun süt gibi pürüzsüz ve tül gibi akıcı görünmesini sağlamak için hangi teknik kullanılır?',
    options: [
      'Tripod üzerine yerleştirip 1-4 saniye gibi yavaş bir enstantane (uzun pozlama) kullanmak.',
      '1/4000s enstantane ve ISO 12800 kullanmak.',
      'f/1.4 diyafram ile elde çekim yapmak.',
      'Kamerayı sürekli sallayarak çekim yapmak.',
    ],
    correctIndex: 0,
    explanation: 'Akan suyun hareket izlerini birbirine kaynaştırıp ipeksi bir doku oluşturmak için perdenin uzun süre (1-4s) açık kalması gerekir.',
    mode: 'production',
  },
  {
    id: 'ft-7',
    question: '"Ters Odak Enstantane Kuralı" (1/Odak Uzaklığı) neyi amaçlar?',
    options: [
      'Elde yapılan çekimlerde el titremesinden kaynaklanan bulanıklığı önlemek için asgari enstantane sınırını belirler.',
      'Lensin netleyebileceği en yakın mesafeyi hesaplar.',
      'ISO değerini otomatik olarak 100\'e kilitler.',
      'Kameranın pil tüketimini yarıya indirir.',
    ],
    correctIndex: 0,
    explanation: 'Örneğin 100mm lens kullanırken elde çekimde el titremesini önlemek için güvenli minimum hız 1/100s (makinelerde 1/125s) olmalıdır.',
    mode: 'recognition',
  },
  {
    id: 'ft-8',
    question: 'Histogram grafiğinde tüm piksellerin en sağ duvara çarpıp dikey bir duvar oluşturması (clipping) neye işaret eder?',
    options: [
      'Saf beyaz patlaması olmuştur, parlak gökyüzü veya açık tonlardaki doku detayları tamamen yok olmuştur.',
      'Fotoğraf tamamen kapkaranlıktır ve gölgeler çökmüştür.',
      'Fotoğraf mükemmel dengededir.',
      'Makine siyah-beyaz moduna geçmiştir.',
    ],
    correctIndex: 0,
    explanation: 'Histogramın sağ tarafı saf beyazları temsil eder; piksel tepesinin sağ duvara yaslanması bilgi kaybı (patlamış pikseller) anlamına gelir.',
    mode: 'recognition',
  },
  {
    id: 'ft-9',
    question: 'Aşağıdaki diyafram değerlerinden hangisi en "sığ" (en dar) alan derinliğini oluşturarak portre arkasını en çok bulanıklaştırır?',
    options: ['f/1.4', 'f/5.6', 'f/11', 'f/22'],
    correctIndex: 0,
    explanation: 'f/1.4 en geniş açıklık olup en sığ alan derinliğini ve en güçlü arka plan izolasyonunu üretir.',
    mode: 'recognition',
  },
  {
    id: 'ft-10',
    question: 'Su kovası benzetmesinde, musluğun boru genişliği (vananın açıklığı) hangi kamera ayarını temsil eder?',
    options: [
      'Diyafram (f/stop)',
      'Enstantane Hızı',
      'ISO Hassasiyeti',
      'Beyaz Dengesi (White Balance)',
    ],
    correctIndex: 0,
    explanation: 'Borunun genişliği birim zamanda içeri akan su debisini belirler; tıpkı lens diyaframının sensöre giren ışık miktarını belirlemesi gibi.',
    mode: 'production',
  },
];
