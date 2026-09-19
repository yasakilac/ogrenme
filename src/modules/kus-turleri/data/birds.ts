export type BirdHabitatCategory = 'Sulak Alan' | 'Yırtıcı' | 'Ötücü & Orman' | 'Gökyüzü Avcısı' | 'Bozkır & Yer';

export interface BirdSpecies {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  category: BirdHabitatCategory;
  imageUrl: string;
  fallbackImageUrl: string;
  habitat: string;
  habitatKey: 'sulak-alan' | 'bozkir' | 'orman' | 'kanyon' | 'gokyuzu';
  diet: string;
  dietKey: 'karides-alg' | 'kucuk-balik' | 'buyuk-balik' | 'kemirgen' | 'kus-avci' | 'akrep-bocek' | 'tohum-filiz' | 'ucan-bocek' | 'kurtcuk-bocek';
  migration: string;
  conservationStatus: string;
  wingspan: string;
  weight: string;
  beakType: string;
  beakAdaptation: string;
  voiceDescription: string;
  hotspotsSummary: string;
  hotspotIds: string[];
  features: string[];
  color: {
    badgeBg: string;
    badgeText: string;
    accent: string;
  };
}

export interface HotspotLocation {
  id: string;
  name: string;
  region: string;
  city: string;
  habitatType: string;
  // Real GPS coordinates (WGS84)
  lat: number;
  lng: number;
  // Position as percentage on Turkey map (0-100) fallback
  mapX: number; // 0 (west) to 100 (east)
  mapY: number; // 0 (north) to 100 (south)
  birdIds: string[];
  primaryBirdId: string;
  density: 'Çok Yüksek' | 'Yüksek' | 'Mevsimsel Koloni';
  description: string;
  whyHotspot: string;
  bestSeason: string;
}

export const TURKEY_HOTSPOTS: HotspotLocation[] = [
  {
    id: 'tuz-golu',
    name: 'Tuz Gölü & Kulu Gölü',
    region: 'İç Anadolu',
    city: 'Aksaray / Konya',
    habitatType: 'Tuzlu Sığ Göl & Step',
    lat: 38.7500,
    lng: 33.3500,
    mapX: 47,
    mapY: 52,
    birdIds: ['flamingo', 'sah-kartal'],
    primaryBirdId: 'flamingo',
    density: 'Çok Yüksek',
    description: "Akdeniz havzasının en büyük flamingo kuluçka kolonisi burada yer alır.",
    whyHotspot: 'Sığ tuzlu sularda milyarlarca Artemia salina (tuz karidesi) bulunur ve adacıklar yırtıcılardan yalıtılmıştır.',
    bestSeason: 'Nisan - Ekim'
  },
  {
    id: 'manyas',
    name: 'Manyas Kuşcenneti & Ulubat',
    region: 'Marmara',
    city: 'Balıkesir / Bursa',
    habitatType: 'Tatlı Su Deltası & Taşkın Söğütlük',
    lat: 40.1833,
    lng: 27.9667,
    mapX: 20,
    mapY: 34,
    birdIds: ['ak-pelikan', 'yalicapkini'],
    primaryBirdId: 'ak-pelikan',
    density: 'Çok Yüksek',
    description: "Türkiye'nin ilk tescilli milli parklarından olup pelikanların tarihsel üreme merkezidir.",
    whyHotspot: 'Gölün sığ söğütlükleri pelikanlar için doğal kuluçka platformları ve zengin tatlı su balığı sunar.',
    bestSeason: 'Mart - Temmuz'
  },
  {
    id: 'gediz-deltasi',
    name: 'Gediz Deltası (İzmir Kuşcenneti)',
    region: 'Ege',
    city: 'İzmir',
    habitatType: 'Tuz Tavaları, Lagün & Kıyı Sazlığı',
    lat: 38.5333,
    lng: 26.9167,
    mapX: 13,
    mapY: 54,
    birdIds: ['flamingo', 'ak-pelikan', 'yalicapkini'],
    primaryBirdId: 'flamingo',
    density: 'Çok Yüksek',
    description: "Dünyanın en büyük yapay flamingo kuluçka adasına sahip Ramsar sulak alanıdır.",
    whyHotspot: 'Çamaltı Tuzlası lagünlerinde tuz oranı dengelenerek flamingolar için ideal besin ortamı üretilir.',
    bestSeason: 'Tüm Yıl'
  },
  {
    id: 'birecik',
    name: 'Birecik Fırat Vadisi',
    region: 'Güneydoğu Anadolu',
    city: 'Şanlıurfa',
    habitatType: 'Fırat Kireçtaşı Kayalıkları & Step',
    lat: 37.0250,
    lng: 37.9780,
    mapX: 74,
    mapY: 74,
    birdIds: ['kelaynak', 'ibibik'],
    primaryBirdId: 'kelaynak',
    density: 'Yüksek',
    description: "Kelaynakların (Geronticus eremita) dünyadaki en önemli koruma ve üreme istasyonudur.",
    whyHotspot: 'Kireçtaşı dik falezler güvenli yuva oyukları sağlarken çevredeki bozkır zengin akrep ve böcek besini sunar.',
    bestSeason: 'Şubat - Temmuz'
  },
  {
    id: 'cukurova',
    name: 'Çukurova & Akyatan Lagünü',
    region: 'Akdeniz',
    city: 'Adana',
    habitatType: 'Kıyı Lagünü, Kumul & Maki Fundalık',
    lat: 36.6333,
    lng: 35.2500,
    mapX: 58,
    mapY: 78,
    birdIds: ['turac', 'flamingo', 'yalicapkini'],
    primaryBirdId: 'turac',
    density: 'Yüksek',
    description: "Turaç kuşunun Türkiye'deki en yoğun popülasyonuna ev sahipliği yapan bereketli delta.",
    whyHotspot: 'Geniş narenciye altı bitki örtüsü, böğürtlen çalılıkları ve zengin tohum faunası turaç için kusursuzdur.',
    bestSeason: 'İlkbahar - Yaz'
  },
  {
    id: 'kizilirmak',
    name: 'Kızılırmak Deltası',
    region: 'Karadeniz',
    city: 'Samsun',
    habitatType: 'Subasar Orman (Galeriç) & Kıyı Gölleri',
    lat: 41.6000,
    lng: 36.0333,
    mapX: 62,
    mapY: 22,
    birdIds: ['yalicapkini', 'ak-pelikan', 'kizilgerdan'],
    primaryBirdId: 'yalicapkini',
    density: 'Çok Yüksek',
    description: "Karadeniz kıyısındaki en büyük ve biyolojik çeşitliliği en yüksek sulak alan sistemidir.",
    whyHotspot: 'Kızılırmak nehrinin denize döküldüğü temiz kollar zengin küçük balık av sahaları oluşturur.',
    bestSeason: 'Nisan - Mayıs & Eylül - Kasım'
  },
  {
    id: 'ic-anadolu-stepleri',
    name: 'İç Anadolu Bozkırları (Konya-Eskişehir Platoları)',
    region: 'İç Anadolu',
    city: 'Konya / Eskişehir / Ankara',
    habitatType: 'Açık Kurak Step & Tahıl Tarlaları',
    lat: 38.6500,
    lng: 32.9200,
    mapX: 43,
    mapY: 42,
    birdIds: ['sah-kartal', 'ibibik'],
    primaryBirdId: 'sah-kartal',
    density: 'Yüksek',
    description: "Doğu Şah Kartalı'nın (Aquila heliaca) ana avlanma ve üreme platolarıdır.",
    whyHotspot: 'Geniş bozkırlarda yaşayan gelengi (Anadolu yer sincabı) popülasyonu kartalın temel besin kaynağıdır.',
    bestSeason: 'Mayıs - Eylül'
  },
  {
    id: 'toroslar',
    name: 'Toros Dağları & Aladağlar Kanyonları',
    region: 'Akdeniz / İç Toros',
    city: 'Niğde / Adana / Antalya',
    habitatType: 'Sarp Uçurumlar & Derin Kanyonlar',
    lat: 37.8500,
    lng: 35.1500,
    mapX: 52,
    mapY: 69,
    birdIds: ['gokdogan'],
    primaryBirdId: 'gokdogan',
    density: 'Mevsimsel Koloni',
    description: "Dünyanın en hızlı yırtıcısı gökdoğanın sarp kaya duvarlarında yuvalandığı dağ silsilesi.",
    whyHotspot: 'Yüksek sarp falezler dalış hızını artıran aerodinamik hava koridorları ve güvenli yuvalıklar sağlar.',
    bestSeason: 'İlkbahar - Yaz'
  },
  {
    id: 'bogazici',
    name: 'İstanbul Boğazı & Tarihi Yarımada',
    region: 'Marmara',
    city: 'İstanbul',
    habitatType: 'Tarihi Surlar, Kuleler & Hava Koridoru',
    lat: 41.0400,
    lng: 29.0200,
    mapX: 28,
    mapY: 26,
    birdIds: ['ebabil', 'kizilgerdan'],
    primaryBirdId: 'ebabil',
    density: 'Çok Yüksek',
    description: "Ebabil sürülerinin gökyüzünde serbestçe süzüldüğü ve antik taş oyuklarında tünediği mega koridor.",
    whyHotspot: 'Tarihi binaların taş delikleri yuvalama alanı, Boğaz üzerinden geçen hava akımları zengin böcek taşır.',
    bestSeason: 'Mayıs - Ağustos'
  },
  {
    id: 'karadeniz-ormanlari',
    name: 'Karadeniz Kıyı & Doğu Ormanları',
    region: 'Karadeniz',
    city: 'Rize / Trabzon / Bolu',
    habitatType: 'Nemli Kayın-Ladin Ormanı & Vadi Tabanları',
    lat: 40.9500,
    lng: 41.0200,
    mapX: 78,
    mapY: 24,
    birdIds: ['kizilgerdan', 'ibibik'],
    primaryBirdId: 'kizilgerdan',
    density: 'Çok Yüksek',
    description: "Kızılgerdanın kışın bile şakıdığı, nemli ve humuslu zengin orman kuşağı.",
    whyHotspot: 'Nemli orman tabanındaki zengin solucan ve omurgasız çeşitliliği yıl boyu taze besin temin eder.',
    bestSeason: 'Tüm Yıl'
  }
];

export const TURKEY_BIRDS: BirdSpecies[] = [
  {
    id: 'flamingo',
    name: 'Büyük Flamingo',
    scientificName: 'Phoenicopterus roseus',
    family: 'Phoenicopteridae',
    category: 'Sulak Alan',
    imageUrl: 'https://images.unsplash.com/photo-1497206365907-f5e630693df0?auto=format&fit=crop&w=1200&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1519066629447-267fffa62d4b?auto=format&fit=crop&w=1200&q=80',
    habitat: 'Tuz Gölü, Gediz Deltası (Sığ tuzlu sular)',
    habitatKey: 'sulak-alan',
    diet: 'Artemia salina (tuz karidesi) ve mikro algler',
    dietKey: 'karides-alg',
    migration: 'Yerli & Kısmi Göçmen',
    conservationStatus: 'LC (Düşük Risk)',
    wingspan: '140 - 170 cm',
    weight: '2.5 - 4.0 kg',
    beakType: 'Kıvrık Süzgeç Gaga',
    beakAdaptation: 'Gaga lamelleri sığ sudaki tuz karideslerini filtreler.',
    voiceDescription: 'Ritmik, kaz benzeri "Ka-hank!" çağrısı',
    hotspotsSummary: 'Tuz Gölü ve Gediz Deltası lagünlerinde on binlerce birey',
    hotspotIds: ['tuz-golu', 'gediz-deltasi', 'cukurova'],
    features: [
      'Karotenoid içeren besinlerle tüyleri pembeleşir',
      'Ters duran gaga yapısıyla çamurlu tabanı süzer'
    ],
    color: {
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      accent: '#F43F5E'
    }
  },
  {
    id: 'yalicapkini',
    name: 'Gökçe Yalıçapkını',
    scientificName: 'Alcedo atthis',
    family: 'Alcedinidae',
    category: 'Sulak Alan',
    imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1200&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=1200&q=80',
    habitat: 'Temiz nehirler, göl ve sazlık kıyıları',
    habitatKey: 'sulak-alan',
    diet: 'Küçük tatlı su balıkları ve su böcekleri',
    dietKey: 'kucuk-balik',
    migration: 'Yerli & Kısmi Göçmen',
    conservationStatus: 'LC (Düşük Risk)',
    wingspan: '24 - 26 cm',
    weight: '30 - 45 g',
    beakType: 'Hançer (Zıpkın) Gaga',
    beakAdaptation: 'Suya sürtünmesiz dalış yapan sivri mızrak gaga.',
    voiceDescription: 'Ok gibi uçarken tiz "Tsiii-tsik!" sesi',
    hotspotsSummary: 'Kızılırmak Deltası, Manyas Kuşcenneti ve temiz dere kenarları',
    hotspotIds: ['kizilirmak', 'manyas', 'gediz-deltasi'],
    features: [
      'Metalik turkuaz sırt ve turuncu göğüs zıtlığı',
      'Hızlı tren burun tasarımına (biyomimikri) ilham vermiştir'
    ],
    color: {
      badgeBg: 'bg-cyan-100',
      badgeText: 'text-cyan-800',
      accent: '#0891B2'
    }
  },
  {
    id: 'ak-pelikan',
    name: 'Ak Pelikan',
    scientificName: 'Pelecanus onocrotalus',
    family: 'Pelecanidae',
    category: 'Sulak Alan',
    imageUrl: 'https://images.unsplash.com/photo-1520808663317-647b476a81b9?auto=format&fit=crop&w=1200&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1574870111867-089730e5a72b?auto=format&fit=crop&w=1200&q=80',
    habitat: 'Manyas Kuşcenneti, Eber Gölü, Gediz Deltası',
    habitatKey: 'sulak-alan',
    diet: 'Sazan, turna ve tatlı su balıkları',
    dietKey: 'buyuk-balik',
    migration: 'Yaz Göçmeni & Yerli Koloniler',
    conservationStatus: 'LC (Düşük Risk)',
    wingspan: '270 - 320 cm',
    weight: '9.0 - 15.0 kg',
    beakType: 'Dev Deri Kese Gaga',
    beakAdaptation: '13 litreye kadar su ve balık alabilen esnek kepçe torba.',
    voiceDescription: 'Boğuk gırtlak sesi ve gaga takırtısı',
    hotspotsSummary: 'Manyas (Kuşcenneti) ve Gediz Deltası üreme kolonileri',
    hotspotIds: ['manyas', 'gediz-deltasi', 'kizilirmak'],
    features: [
      '3 metreyi aşan kanat açıklığı ile en büyük kuşlardandır',
      'Sürü halinde balıkları sığ sulara sürerek avlar'
    ],
    color: {
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-900',
      accent: '#2563EB'
    }
  },
  {
    id: 'ibibik',
    name: 'İbibik (Çavuşkuşu)',
    scientificName: 'Upupa epops',
    family: 'Upupidae',
    category: 'Ötücü & Orman',
    imageUrl: 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?auto=format&fit=crop&w=1200&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=1200&q=80',
    habitat: 'Bağ-bahçeler, açık orman kenarları ve tarlalar',
    habitatKey: 'orman',
    diet: 'Danaburnu, tırtıl ve toprak altı böcekleri',
    dietKey: 'kurtcuk-bocek',
    migration: 'Yaz Göçmeni',
    conservationStatus: 'LC (Düşük Risk)',
    wingspan: '42 - 46 cm',
    weight: '50 - 75 g',
    beakType: 'Uzun Kavisli Cımbız Gaga',
    beakAdaptation: 'Topraktaki böcekleri aramak için kavisli ince uç.',
    voiceDescription: 'Üçlü flüt tınısında "Hup-hup-hup" ötüşü',
    hotspotsSummary: 'Anadolu bağ-bahçeleri, Birecik Fırat kıyısı, Ege vadileri',
    hotspotIds: ['birecik', 'ic-anadolu-stepleri', 'karadeniz-ormanlari'],
    features: [
      'Heyecanlandığında yelpaze gibi açılan görkemli taç tüyleri',
      'Kelebek gibi dalgalı ve zarif uçuş paterni'
    ],
    color: {
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      accent: '#D97706'
    }
  },
  {
    id: 'kizilgerdan',
    name: 'Kızıl Gerdan (Nar Bülbülü)',
    scientificName: 'Erithacus rubecula',
    family: 'Muscicapidae',
    category: 'Ötücü & Orman',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1200&q=80',
    habitat: 'Ormanlar, nemli vadiler, kışın şehir parkları',
    habitatKey: 'orman',
    diet: 'Böcek, solucan ve orman tohumları',
    dietKey: 'kurtcuk-bocek',
    migration: 'Yerli & Kısmi Göçmen',
    conservationStatus: 'LC (Düşük Risk)',
    wingspan: '20 - 22 cm',
    weight: '16 - 22 g',
    beakType: 'İnce Düz Cımbız Gaga',
    beakAdaptation: 'Topraktan solucan ve tohum toplamak için hassas gaga.',
    voiceDescription: 'Melankolik, gümüş çıngırak gibi kristal ötüş',
    hotspotsSummary: 'Karadeniz dağ ormanları, Belgrad Ormanı, kışın tüm parklar',
    hotspotIds: ['karadeniz-ormanlari', 'bogazici', 'kizilirmak'],
    features: [
      'Göz alıcı pas turuncusu / nar kırmızısı gerdan lekesi',
      'Kışın karda bile şakıyan cesur ve meraklı tavır'
    ],
    color: {
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-900',
      accent: '#EA580C'
    }
  },
  {
    id: 'sah-kartal',
    name: 'Doğu Şah Kartalı',
    scientificName: 'Aquila heliaca',
    family: 'Accipitridae',
    category: 'Yırtıcı',
    imageUrl: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=1200&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    habitat: 'İç Anadolu bozkırları, açık platolar',
    habitatKey: 'bozkir',
    diet: 'Gelengi (yer sincabı), tavşan, kemirgenler',
    dietKey: 'kemirgen',
    migration: 'Yerli & Kısmi Göçmen',
    conservationStatus: 'VU (Duyarlı)',
    wingspan: '180 - 215 cm',
    weight: '2.8 - 4.5 kg',
    beakType: 'Çengelli Parçalayıcı Gaga',
    beakAdaptation: 'Sert kas dokusunu koparmak için kıvrık çelik kanca.',
    voiceDescription: 'Otoriter ve yırtıcı çığlık: "Kiyeeer-kyok!"',
    hotspotsSummary: 'Konya Kapalı Havzası, Eskişehir-Ankara bozkır platoları',
    hotspotIds: ['ic-anadolu-stepleri', 'tuz-golu'],
    features: [
      '2 metreyi aşan heybetli kanat açıklığı ve beyaz omuz lekeleri',
      'Bozkırın kemirgen kontrolörü (tepe yırtıcı)'
    ],
    color: {
      badgeBg: 'bg-amber-900/10',
      badgeText: 'text-amber-950',
      accent: '#78350F'
    }
  },
  {
    id: 'gokdogan',
    name: 'Gökdoğan (Bayağı Doğan)',
    scientificName: 'Falco peregrinus',
    family: 'Falconidae',
    category: 'Yırtıcı',
    imageUrl: 'https://images.unsplash.com/photo-1606567595334-d39972c85dbe?auto=format&fit=crop&w=1200&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1516233758813-a38d024919c5?auto=format&fit=crop&w=1200&q=80',
    habitat: 'Sarp kanyonlar, yüksek kayalıklar, kuleler',
    habitatKey: 'kanyon',
    diet: 'Güvercin, sığırcık ve uçan kuşlar',
    dietKey: 'kus-avci',
    migration: 'Yerli & Kısmi Göçmen',
    conservationStatus: 'LC (Düşük Risk)',
    wingspan: '95 - 115 cm',
    weight: '0.7 - 1.3 kg',
    beakType: 'Çentikli Şahin Gagası',
    beakAdaptation: 'Avın omurunu anında kıran kemiksi tomium dişi.',
    voiceDescription: 'Seri ve keskin alarm kahkahası: "Kek-kek-kek!"',
    hotspotsSummary: 'Toros Dağları kanyonları, Kaçkarlar, sarp vadi uçurumları',
    hotspotIds: ['toroslar'],
    features: [
      'Gezegenin en hızlı hayvanı; dalışta 390 km/s hıza ulaşır',
      'Göz altındaki siyah bıyık çizgileri güneş parlamasını keser'
    ],
    color: {
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-950',
      accent: '#4F46E5'
    }
  },
  {
    id: 'ebabil',
    name: 'Ebabil (Karakuş)',
    scientificName: 'Apus apus',
    family: 'Apodidae',
    category: 'Gökyüzü Avcısı',
    imageUrl: 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=1200&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1539664030485-a936c7d29c6e?auto=format&fit=crop&w=1200&q=80',
    habitat: 'Şehir surları, yüksek yapılar ve sürekli gökyüzü',
    habitatKey: 'gokyuzu',
    diet: 'Havada uçan böcekler ve karıncalar',
    dietKey: 'ucan-bocek',
    migration: 'Yaz Göçmeni',
    conservationStatus: 'LC (Düşük Risk)',
    wingspan: '40 - 44 cm',
    weight: '35 - 50 g',
    beakType: 'Geniş Kepçe Ağız',
    beakAdaptation: 'Uçarken açık tutularak böcekleri süzen geniş ağız.',
    voiceDescription: 'Gökyüzünde yankılanan tiz "Sriii-sriii!" çığlığı',
    hotspotsSummary: 'İstanbul Boğazı & Tarihi Yarımada surları, Ankara Kalesi',
    hotspotIds: ['bogazici'],
    features: [
      'Yaşamının büyük kısmını (uyku dahil) kesintisiz havada geçirir',
      'Hilal şeklindeki aerodinamik dar kanatlarıyla 110 km/s hız'
    ],
    color: {
      badgeBg: 'bg-slate-200',
      badgeText: 'text-slate-800',
      accent: '#334155'
    }
  },
  {
    id: 'kelaynak',
    name: 'Kelaynak',
    scientificName: 'Geronticus eremita',
    family: 'Threskiornithidae',
    category: 'Bozkır & Yer',
    imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=1200&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1582845512747-e42001c95638?auto=format&fit=crop&w=1200&q=80',
    habitat: 'Şanlıurfa Birecik kayalıkları ve çevresindeki bozkır',
    habitatKey: 'bozkir',
    diet: 'Akrep, örümcek, çekirge ve kınkanatlılar',
    dietKey: 'akrep-bocek',
    migration: 'Tarihsel Göçmen (Yarı-Yabani Koruma Altında)',
    conservationStatus: 'EN (Tehlikede)',
    wingspan: '125 - 135 cm',
    weight: '1.0 - 1.5 kg',
    beakType: 'Aşağı Kıvrık Sonda Gaga',
    beakAdaptation: 'Kaya yarıkları ve topraktaki akrepleri çıkarmaya yarar.',
    voiceDescription: 'Gırtlaksı boru tınılı kaba "Kraupp-kraupp"',
    hotspotsSummary: 'Şanlıurfa Birecik Fırat Vadisi Üreme İstasyonu',
    hotspotIds: ['birecik'],
    features: [
      'Çıplak kırmızı baş ve metalik koyu yeşil-mor tüyler',
      'Dünyadaki kritik kolonisi Birecik Fırat kıyısındadır'
    ],
    color: {
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-900',
      accent: '#059669'
    }
  },
  {
    id: 'turac',
    name: 'Turaç',
    scientificName: 'Francolinus francolinus',
    family: 'Phasianidae',
    category: 'Bozkır & Yer',
    imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80',
    habitat: 'Çukurova fundalıkları, narenciye altı ve sazlık sınırları',
    habitatKey: 'bozkir',
    diet: 'Tohum, filiz, böcek ve tane',
    dietKey: 'tohum-filiz',
    migration: 'Yerli (Yerleşik)',
    conservationStatus: 'LC (Koruma Altında)',
    wingspan: '50 - 55 cm',
    weight: '400 - 550 g',
    beakType: 'Tohum Kırıcı Sağlam Gaga',
    beakAdaptation: 'Sert tohumları kırmak ve kökleri eşelemek için güçlü form.',
    voiceDescription: 'Ritmik, unutulmaz çağrı: "Klık-klık-kvee-çrr"',
    hotspotsSummary: 'Adana Çukurova, Akyatan Lagünü kıyı çalılıkları',
    hotspotIds: ['cukurova'],
    features: [
      'Kadife siyah göğüs üzerindeki beyaz damla benekler',
      'Uçmak yerine çalılar arasında hızla koşmayı tercih eder'
    ],
    color: {
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-900',
      accent: '#B45309'
    }
  }
];
