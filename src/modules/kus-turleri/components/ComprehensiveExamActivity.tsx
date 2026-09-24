import React, { useState, useEffect } from 'react';
import {
  Award,
  Volume2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Eye,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { TURKEY_BIRDS, BirdSpecies } from '../data/birds';
import { BirdPhoto } from './BirdPhoto';
import { birdAudioSynth } from '../utils/audioSynth';
import { CORRECT, WRONG } from '../../../components/ui';

export interface PoolQuestion {
  id: number;
  birdId: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

// 30 Soruluk Zengin Soru Havuzu (Görsel + Ses + Bilgi)
export const COMPREHENSIVE_QUESTION_POOL: PoolQuestion[] = [
  {
    id: 1,
    birdId: 'flamingo',
    category: 'Gaga Anatomisi & Besin',
    question: 'Büyük Flamingolar sığ tuzlu sularda başlarını ters tutarak beslenirler. Bu beslenme sırasında gaganın kenarlarında bulunan ve Artemia karideslerini süzen filtre yapısının adı nedir?',
    options: ['Lamella (Süzgeç lameller)', 'Tomium dişi', 'Kürsü (Rostrum)', 'Pami pençesi'],
    correctIndex: 0,
    explanation: 'Flamingoların gagasında saç teli inceliğinde "lamella" adı verilen lameller bulunur. Bu lameller tuzlu sudan mikroskobik algleri ve Artemia karideslerini süzer.',
    hint: 'Süzgeç benzeri mikro plakacıklardır.'
  },
  {
    id: 2,
    birdId: 'yalicapkini',
    category: 'Biyomimikri & Aerodinamik',
    question: 'Japon Şinkansen hızlı trenlerinin tünellerden yüksek hızda çıkarken oluşturduğu şiddetli ses patlamasını önlemek için tren burnunun aerodinamik tasarımı hangi kuşun gaga formundan kopyalanmıştır?',
    options: ['Gökçe Yalıçapkını', 'Doğu Şah Kartalı', 'Ak Pelikan', 'Turaç'],
    correctIndex: 0,
    explanation: 'Yalıçapkını havadan suya dalarken su direncini ve sıçramayı sıfırlayan mızrak gaga yapısına sahiptir. Mühendis Eiji Nakatsu bu biyomimikri tasarımıyla tren sesini kesmiştir.',
    hint: 'Zıpkın gibi ince ve uzun hançer gagasıyla bilinir.'
  },
  {
    id: 3,
    birdId: 'gokdogan',
    category: 'Biyomimikri & Jet Motorları',
    question: 'Gökdoğan saatte 390 km hıza ulaşan dik av dalışı yaparken, burun deliklerindeki hava basıncını dengeleyerek ciğerlerinin patlamasını önleyen konik yapı, modern teknolojide neye ilham vermiştir?',
    options: ['Jet uçak motorlarının hava giriş konilerine', 'Denizaltı pervanelerine', 'Rüzgar türbinlerinin kanatlarına', 'Uzay mekiği ısı kalkanlarına'],
    correctIndex: 0,
    explanation: 'Gökdoğanın burun deliklerindeki konik hava saptırıcılar (baffle), süpersonik jet motorlarının hava giriş kanallarında hava akışını düzenlemek için kullanılmıştır.',
    hint: 'Süpersonik hızlarda hava akışını yönlendiren hava aracı motorlarıdır.'
  },
  {
    id: 4,
    birdId: 'ak-pelikan',
    category: 'Morfoloji & Av Stratejisi',
    question: 'Ak Pelikanın alt gagasında bulunan ve 13 litreye kadar su alabilen esnek sarı torbanın temel biyolojik işlevi nedir?',
    options: [
      'Sürü halinde balıkları suyla birlikte kepçeleyip, suyu dışarı süzerek avı yutmak',
      'Yavrular için günlerce balık depolamak',
      'Uçuş sırasında ağırlık dengesi sağlamak',
      'Vücut ısısını düşürmek için soğuk su depolamak'
    ],
    correctIndex: 0,
    explanation: 'Pelikan gaga kesesini bir buzdolabı gibi yiyecek saklamak için değil, anlık bir kepçe olarak kullanır; suyu yanlardan boşaltıp sadece balıkları yutar.',
    hint: 'Gaga bir balık kepçesi ve su süzgecidir.'
  },
  {
    id: 5,
    birdId: 'kelaynak',
    category: 'Biyoçeşitlilik & Koruma',
    question: 'Dünyada nesli kritik derecede tehlike altında olan ve Türkiye\'de Şanlıurfa Birecik Fırat Vadisi\'ndeki istasyonda özel olarak korunan kırmızı çıplak başlı kuş türü hangisidir?',
    options: ['Kelaynak', 'İbibik', 'Ebabil', 'Kızılgerdan'],
    correctIndex: 0,
    explanation: 'Kelaynaklar (Geronticus eremita), 1950\'lerdeki aşırı tarım zehirleri (DDT) nedeniyle tükenme noktasına gelmiş ve Birecik\'te kurulan istasyonda koruma altına alınmıştır.',
    hint: 'Aşağı kıvrık uzun sonda gagası ve tüysüz kırmızı başı vardır.'
  },
  {
    id: 6,
    birdId: 'ebabil',
    category: 'Hava Adaptasyonu & Yaşam Tarzı',
    question: 'Ebabillerin neredeyse tüm hayatlarını havada geçirmelerini sağlayan ve yere konduklarında kolay kolay havalanamamalarına yol açan anatomik özellikleri nedir?',
    options: [
      'Dört parmağının da öne dönük olması ve bacaklarının çok kısa (pamidopod) yapıda olması',
      'Kanat kemiklerinin esnek olmaması',
      'Kuyruk tüylerinin yön değiştirmeye izin vermemesi',
      'Gözlerinin sadece gündüz görmesi'
    ],
    correctIndex: 0,
    explanation: 'Apus apus (ayakları olmayan demektir). Bacakları çok kısadır ve parmakları dikey duvarlara tutunmaya yarar; düz zeminden kanat vurup kalkmaları zordur.',
    hint: 'Bacakları yürümek için değil, sadece tarihi surlara ve kayalara tutunmak içindir.'
  },
  {
    id: 7,
    birdId: 'sah-kartal',
    category: 'Ekolojik Rol & Av Zinciri',
    question: 'İç Anadolu bozkırlarında ve açık platolarda yaşayan Doğu Şah Kartalı, aşağıdaki canlılardan hangisini avlayarak tarım alanlarında ekolojik dengeyi sağlar?',
    options: ['Gelengi (Anadolu yer sincabı) ve yabani tavşanlar', 'Sadece akrep ve çıyanlar', 'Ağaç gövdesindeki kabuk böcekleri', 'Göl suyundaki planktonlar'],
    correctIndex: 0,
    explanation: 'Şah Kartal tepe avcıdır; özellikle koloniler halinde yaşayan yer sincaplarını (gelengi) ve bozkır kemirgenlerini avlayarak ekosistemi düzenler.',
    hint: 'Bozkırın kemirgen memelileridir.'
  },
  {
    id: 8,
    birdId: 'ibibik',
    category: 'Morfolojik Teşhis',
    question: 'Heyecanlandığında veya yere indiğinde başındaki taç tüylerini yelpaze gibi açan, uzun kavisli cımbız gagasıyla toprak altındaki böcekleri çıkaran tür hangisidir?',
    options: ['İbibik (Çavuşkuşu)', 'Turaç', 'Kızılgerdan', 'Gökçe Yalıçapkını'],
    correctIndex: 0,
    explanation: 'İbibik (Upupa epops), karakteristik turuncu-siyah benekli ibiği ve yumuşak toprağı yoklayan ince cımbız gagasıyla kolayca tanınır.',
    hint: 'Adını "hup-hup-hup" şeklindeki ötüşünden alır.'
  },
  {
    id: 9,
    birdId: 'turac',
    category: 'Habitat & Türkiye Dağılımı',
    question: 'Türkiye\'de özellikle Çukurova Deltası\'ndaki narenciye bahçeleri, taban sazlıkları ve maki çalılıklarında yaşayan, yerde eşeleyen gizemli sülün benzeri yer kuşu hangisidir?',
    options: ['Turaç', 'Ebabil', 'Kelaynak', 'Gökdoğan'],
    correctIndex: 0,
    explanation: 'Turaç (Francolinus francolinus), Akdeniz ve Çukurova bölgesine özgü, yerde yaşayan, tohum ve çalı kökleriyle beslenen karakteristik bir türdür.',
    hint: 'Karakteristik "dırak-dırak" ötüşüyle tanınan iri yer kuşudur.'
  },
  {
    id: 10,
    birdId: 'kizilgerdan',
    category: 'Davranış & Teşhis',
    question: 'Sonbahar ve kış aylarında parklarda, orman zeminlerinde turuncu-kızıl göğsüyle dikkat çeken, bahçe işleri sırasında sürülen topraktan solucan toplayan cesur ötücü kuş hangisidir?',
    options: ['Kızılgerdan (Robin / Narbülbülü)', 'Şah Kartal', 'Ak Pelikan', 'Flamingo'],
    correctIndex: 0,
    explanation: 'Kızılgerdan (Erithacus rubecula), pas kırmızısı göğüs lekesi, melodik su şırıltısı benzeri ötüşü ve insana yakın durmasıyla bilinen kış ziyaretçisi orman kuşudur.',
    hint: 'Göğsündeki pas kızılı renk tonu belirleyicidir.'
  },
  {
    id: 11,
    birdId: 'flamingo',
    category: 'Türkiye\'nin Sulak Alanları',
    question: 'Türkiye\'de Büyük Flamingoların her yıl on binlerce yavru dünyaya getirdiği en büyük doğal kuluçka ve üreme kolonisi hangi sulak alanımızdadır?',
    options: ['Tuz Gölü', 'Sapanca Gölü', 'Van Gölü', 'Uzungöl'],
    correctIndex: 0,
    explanation: 'Tuz Gölü, Güney ve Orta kesimlerindeki sığ adacıklarıyla Büyük Flamingo türünün Akdeniz havzasındaki en büyük üreme kolonisine ev sahipliği yapar.',
    hint: 'İç Anadolu\'nun devasa tuzlu sığ gölüdür.'
  },
  {
    id: 12,
    birdId: 'yalicapkini',
    category: 'Duyu Organları & Avlanma',
    question: 'Yalıçapkını berrak akarsulara daldığında gözlerini korumak ve su altında avını net görebilmek için hangi anatomik yapıyı kullanır?',
    options: [
      'Yarı saydam üçüncü göz kapağını (Niktitant zar)',
      'Gözlerini tamamen kapatarak sadece işitmeyle avlanır',
      'Göz bebeklerini geriye çeker',
      'Gözyaşı bezinden tuzlu koruyucu tabaka salgılar'
    ],
    correctIndex: 0,
    explanation: 'Kuşun gözünde doğal bir deniz gözlüğü görevi gören yarı saydam niktitant zar vardır. Suya dalış anında gözün üzerine kapanarak su altı netliğini sağlar.',
    hint: 'Doğal şeffaf gözlük zarıdır.'
  },
  {
    id: 13,
    birdId: 'gokdogan',
    category: 'Gaga Anatomisi & Av',
    question: 'Gökdoğanın üst gagasında avladığı güvercin veya ördeğin omurilik kemiğini anında kırmaya yarayan özel sivri diş çıkıntısının adı nedir?',
    options: ['Tomium dişi', 'Lamella', 'Rhamphotheca kılıfı', 'Mahmuz'],
    correctIndex: 0,
    explanation: 'Gökdoğanın gagasında bulunan "tomium dişi", yakalanan avın boyun omurunu tek hamlede kırarak avın acı çekmeden anında etkisiz hale gelmesini sağlar.',
    hint: 'Yırtıcı kuşlarda omur kıran gaga dişidir.'
  },
  {
    id: 14,
    birdId: 'ak-pelikan',
    category: 'Göç & Sosyal Davranış',
    question: 'Ak Pelikanlar göç sırasında enerji tasarrufu sağlamak ve öndeki kuşun kanat ucunda oluşan hava akımından faydalanmak için havada hangi düzende uçarlar?',
    options: ['"V" şeklinde düzenli filo dizilimi', 'Rastgele dağınık bulut düzeni', 'Tek sıra dikey sütun', 'Dairesel girdap düzeni'],
    correctIndex: 0,
    explanation: 'Pelikanlar ve turnalar "V" formasyonuyla uçarak arkadaki kuşun %20-30 oranında daha az enerji harcamasını sağlarlar.',
    hint: 'Göçmen kuşların aerodinamik filo şeklidir.'
  },
  {
    id: 15,
    birdId: 'kelaynak',
    category: 'Kavram & Ekoloji',
    question: 'Kelaynakların baş bölgesinde tüy bulunmamasının ve derilerinin çıplak olmasının en önemli evrimsel adaptasyon gerekçesi nedir?',
    options: [
      'Kaya yarıkları ve çamur içinden böcek ararken baş tüylerinin kirlenmesini ve enfeksiyonu önlemek',
      'Uçarken rüzgar direncini azaltmak',
      'Güneş ışığını doğrudan emip vücudu ısıtmak',
      'Yırtıcı kuşları korkutmak'
    ],
    correctIndex: 0,
    explanation: 'Akbabalarda ve kelaynaklarda çıplak baş yapısı, organik kalıntılar veya çamurlu oyuklardan beslenirken parazit ve bakteri bulaşmasını önleyen hijyen adaptasyonudur.',
    hint: 'Hijyen ve parazitlenmeyi engelleme ile ilgilidir.'
  },
  {
    id: 16,
    birdId: 'ebabil',
    category: 'Göç & Şehir Ekolojisi',
    question: 'Ebabiller ilkbaharda Afrika\'dan Türkiye\'ye geldiklerinde yuvalarını genellikle nerede kurarlar?',
    options: [
      'Tarihi taş binaların çatı altları, sur yarıkları ve kule çatlakları',
      'Göl kenarındaki sık sazlıkların dibi',
      'Geniş tarlaların düz toprak yüzeyi',
      'Ağaçların en alt yapraklı dalları'
    ],
    correctIndex: 0,
    explanation: 'Ebabiller doğal kanyonların yanı sıra İstanbul surları, Galata Kulesi ve tarihi camilerin taş yarıklarını dikey yuva alanı olarak seçerler.',
    hint: 'Tarihi yapılar, yüksek taş surlar ve dikey yarıklar.'
  },
  {
    id: 17,
    birdId: 'turac',
    category: 'Gaga & Besin Adaptasyonu',
    question: 'Turacın konik ve sağlam gaga yapısı hangi besin grubunu tüketmeye en uygun şekilde özelleşmiştir?',
    options: [
      'Sert yabani tohumlar, tahıl taneleri ve çalı kökleri',
      'Sadece göl sularındaki küçük balıklar',
      'Yüksek gökyüzündeki uçan böcekler',
      'Büyük memeli hayvan leşleri'
    ],
    correctIndex: 0,
    explanation: 'Turaç, tohum kırıcı konik gagası ve kazıcı pençeleriyle Çukurova\'nın fundalık tabanında tohum, böcek larvası ve körpe kökleri eşeler.',
    hint: 'Tohum kabuklarını kırabilen dayanıklı gaga tipidir.'
  },
  {
    id: 18,
    birdId: 'sah-kartal',
    category: 'Fiziksel Özellikler',
    question: 'Doğu Şah Kartalını (Aquila heliaca) diğer kartal türlerinden ayıran en belirgin omuz deseni hangisidir?',
    options: [
      'Koyu kahverengi omuz başlarındaki belirgin beyaz lekeler',
      'Kanat altında tamamen pembe tüyler',
      'Gaga ucundaki kırmızı boya halkası',
      'Bacaklarında hiç tüy olmaması'
    ],
    correctIndex: 0,
    explanation: 'Yetişkin Şah Kartalların omuzlarında apolet benzeri saf beyaz yamalar ve başın arkasında altın-sarımsı bir ense tacı bulunur.',
    hint: 'Omuz bölgesindeki parlak beyaz apolet lekeleridir.'
  },
  {
    id: 19,
    birdId: 'ibibik',
    category: 'Halk Kültürü & İsim',
    question: 'İbibik kuşunun halk arasında "Çavuşkuşu" olarak da anılmasının sebebi nedir?',
    options: [
      'Başındaki ibiğin açıldığında çavuş miğferi veya apoletini andırması',
      'Askerlerin önünde nöbet tutması',
      'Sadece ordu kışlalarında yaşaması',
      'Savaş borusu gibi yüksek ses çıkarması'
    ],
    correctIndex: 0,
    explanation: 'Kuşun açıldığında gösterişli bir askeri tolga veya nişanı andıran taç tüyleri nedeniyle Anadolu\'da Çavuşkuşu adı yaygındır.',
    hint: 'Başındaki gösterişli taç tüylerinin askeri nişana benzetilmesidir.'
  },
  {
    id: 20,
    birdId: 'kizilgerdan',
    category: 'Ekoloji & Bahçe',
    question: 'Kızılgerdanın kış aylarında bahçelerde kürekle toprak kazan insanların hemen yanına kadar yaklaşmasının temel amacı nedir?',
    options: [
      'Ters yüz edilen topraktan açığa çıkan solucan ve böcekleri kolayca avlamak',
      'İnsanlardan ısınmak için yardım istemek',
      'Bahçeye yuva yapmak için dal toplamak',
      'Yırtıcı kedilerden kaçmak'
    ],
    correctIndex: 0,
    explanation: 'Kızılgerdanlar fırsatçı avcılardır; yabandomuzlarının veya çiftçilerin toprağı havalandırmasını fırsat bilip yüzeye çıkan solucanları kaparlar.',
    hint: 'Topraktan fırlayan böcek ve solucanları kapma fırsatıdır.'
  },
  {
    id: 21,
    birdId: 'yalicapkini',
    category: 'Habitat Kalitesi & Biyoindikatör',
    question: 'Bir akarsu havzasında Gökçe Yalıçapkınlarının yoğun şekilde üremesi ve avlanması o çevre hakkında neyin kesin göstergesidir (Biyoindikatör)?',
    options: [
      'Suyun berrak, temiz ve balık popülasyonunun sağlıklı olduğunun',
      'Suyun aşırı kimyasal kirlilik içerdiğinin',
      'Alanda hiç ağaç kalmadığının',
      'Bölgenin çölleştiğinin'
    ],
    correctIndex: 0,
    explanation: 'Yalıçapkını gözleriyle su altındaki balığı görerek dalar. Suyun bulanık veya kirli olduğu yerlerde avlanamaz; bu nedenle temiz suyun en hassas göstergesidir.',
    hint: 'Berrak, temiz tatlı su göstergesidir.'
  },
  {
    id: 22,
    birdId: 'flamingo',
    category: 'Tüy Rengi Biyokimyası',
    question: 'Yumurtadan yeni çıkan yavru flamingoların tüyleri pembe değil gridir. Yavruların pembe renge kavuşması hangi biyolojik mekanizmayla gerçekleşir?',
    options: [
      'Yedikleri tuz karidesi ve mikro alglerdeki beta-karoten pigmentlerinin tüylerde depolanmasıyla',
      'Güneş ışınlarının keratin dokusunu yakmasıyla',
      'Çamurdaki demir oksidin tüyleri boyamasıyla',
      'Yetişkinlerin tükürük bezlerinden renk boyası sürmesiyle'
    ],
    correctIndex: 0,
    explanation: 'Flamingolar karotenoid zengini kabukluları ve algleri tükettikçe bu pigmentler karaciğerde işlenip yeni çıkan tüylerin liflerine yerleşir.',
    hint: 'Besinlerdeki karotenoid pigmentleridir.'
  },
  {
    id: 23,
    birdId: 'ak-pelikan',
    category: 'Türkiye Koruma Alanı',
    question: 'Marmara Bölgesi\'nde her bahar Ak Pelikanların ve yüzlerce göçmen kuşun taşkın söğütlüklerde yuva kurduğu dünyaca ünlü Ramsar alanı hangisidir?',
    options: ['Manyas Kuşcenneti Milli Parkı', 'Abant Gölü', 'Tortum Şelalesi', 'Pamukkale Travertenleri'],
    correctIndex: 0,
    explanation: 'Balıkesir sınırlarında yer alan Manyas Kuşcenneti, söğüt ağaçları üzerindeki pelikan ve balıkçıl kolonileriyle Türkiye\'nin ilk Ramsar koruma alanlarından biridir.',
    hint: 'Bandırma / Manyas Kuşcenneti.'
  },
  {
    id: 24,
    birdId: 'gokdogan',
    category: 'Göz Anatomisi',
    question: 'Gökdoğanın dalış sırasında gözünün kurumasını önleyen ve saniyede 120 kareye varan inanılmaz hızda görüntü işlemesini sağlayan duyusu hangisidir?',
    options: [
      'İnsandan katbekat gelişmiş yüksek çözünürlüklü çift fovealı görme duyusu',
      'Ultrasonik ses dalgalarıyla görme',
      'Manyetik pusula hissiyle görme',
      'Koku reseptörleriyle göz yönlendirme'
    ],
    correctIndex: 0,
    explanation: 'Gökdoğanın gözünde iki ayrı odak noktası (çift fovea) bulunur. Biri geniş açıyı tararken diğeri teleobjektif gibi avı odakta kilitler.',
    hint: 'Avını 3 kilometre öteden netleştiren çift odaklı görme duyusudur.'
  },
  {
    id: 25,
    birdId: 'kelaynak',
    category: 'Göç & Kışlama',
    question: 'Tarihte Fırat kıyısındaki Kelaynakların göç dönüşü ilkbaharda halk tarafından nasıl karşılanırdı?',
    options: [
      'Baharın ve bereketin müjdecisi olarak kabul edilip festivaller düzenlenirdi',
      'Kötü şans getirdiğine inanılıp uzaklaştırılırdı',
      'Tarım zararlısı sanılıp avlanırdı',
      'Sadece kış mevsiminde görüldükleri için fark edilmezdi'
    ],
    correctIndex: 0,
    explanation: 'Birecik halkı Kelaynakların Fırat\'a dönüşünü bereketin, tarım sezonunun ve baharın gelişi olarak kutlar; kuşlara kutsal koruma sağlardı.',
    hint: 'Baharın ve bereketin gelişi müjdecisidir.'
  }
];

export const ComprehensiveExamActivity: React.FC = () => {
  // Soru Havuzundan Seçilen 10 Soru
  const [activeQuestions, setActiveQuestions] = useState<PoolQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Kullanıcı Cevapları: { [questionIndex]: selectedOptionIndex }
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [examAttemptCount, setExamAttemptCount] = useState(1);

  // Havuzdan 10 Rastgele Soru Seçme ve Şıkları Karıştırma
  const generateNewExamSession = () => {
    // Havuzu karıştır
    const shuffledPool = [...COMPREHENSIVE_QUESTION_POOL].sort(() => 0.5 - Math.random());
    const selected10 = shuffledPool.slice(0, 10);

    // Her sorunun seçeneklerini de dinamik olarak karıştır
    const processedQuestions = selected10.map((q) => {
      const correctText = q.options[q.correctIndex];
      const shuffledOptions = [...q.options].sort(() => 0.5 - Math.random());
      const newCorrectIndex = shuffledOptions.indexOf(correctText);

      return {
        ...q,
        options: shuffledOptions,
        correctIndex: newCorrectIndex
      };
    });

    setActiveQuestions(processedQuestions);
    setCurrentIndex(0);
    setUserAnswers({});
    setShowExplanation(false);
    setIsExamFinished(false);
  };

  useEffect(() => {
    generateNewExamSession();
  }, [examAttemptCount]);

  const currentQuestion = activeQuestions[currentIndex];
  const associatedBird = currentQuestion
    ? TURKEY_BIRDS.find((b) => b.id === currentQuestion.birdId)
    : null;

  // Ses Çalma (Kullanıcı Tıklayınca)
  const handlePlaySound = (birdId?: string) => {
    const idToPlay = birdId || currentQuestion?.birdId;
    if (!idToPlay) return;

    setIsPlayingAudio(true);
    birdAudioSynth.playBirdCall(idToPlay);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 2000);
  };

  // Şık Seçimi
  const handleSelectOption = (optionIndex: number) => {
    if (userAnswers[currentIndex] !== undefined) return; // Zaten cevaplandı

    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
    setShowExplanation(true);
  };

  // Sonraki Soruya Geçiş
  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsExamFinished(true);
    }
  };

  // Sınavı Yeni Sorularla Baştan Başlatma
  const handleRestartExam = () => {
    setExamAttemptCount((prev) => prev + 1);
  };

  // Skor Hesaplama
  const correctAnswersCount = Object.entries(userAnswers).filter(
    ([qIdx, selectedOpt]) => {
      const q = activeQuestions[Number(qIdx)];
      return q && selectedOpt === q.correctIndex;
    }
  ).length;

  const isPassed = correctAnswersCount >= 8;

  if (activeQuestions.length === 0 || !currentQuestion) {
    return (
      <div className="p-8 text-center bg-white rounded-[24px] border border-stone-200">
        <Sparkles className="w-8 h-8 text-[var(--accent)] animate-spin mx-auto mb-2" />
        <p className="text-sm font-semibold text-stone-700">Soru havuzundan yeni sınav hazırlanıyor...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Üst Bilgi Kartı */}
      <div className="bg-white rounded-[24px] border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-[16px] bg-[var(--accent)]/10 text-[var(--accent)]">
              <Trophy className="w-5 h-5" />
            </span>
            <h2 className="font-display text-lg sm:text-xl font-bold text-stone-900">
              Kapsamlı Kuş Uzmanlığı Sınavı
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600">
            Görsel, ses ve ekolojik bilgi soruları. Soru havuzundan rastgele 10 soru gelir; en az <strong className="text-[var(--accent)] font-bold">8 tanesini</strong> bilerek etkinliği tamamlayın.
          </p>
        </div>

        {/* İlerleme ve Hedef Rozeti */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-[16px] bg-stone-100 border border-stone-200 text-xs font-bold text-stone-700">
            Soru {currentIndex + 1} / {activeQuestions.length}
          </div>
          <div className="px-3 py-1.5 rounded-[16px] bg-[var(--accent-light)] border border-[var(--accent)]/30 text-xs font-bold text-[var(--accent)] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Hedef: En Az 8 Doğru</span>
          </div>
        </div>
      </div>

      {/* İlerleme Çubuğu */}
      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-[var(--accent)] h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
        />
      </div>

      {/* ===================== TEST SONUÇ EKRANI ===================== */}
      {isExamFinished ? (
        <div className="bg-white rounded-[24px] border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6 text-center animate-fade-in">
          {/* Başarı veya Tekrar İkonu */}
          <div
            className="w-20 h-20 rounded-[24px] mx-auto flex items-center justify-center shadow-lg text-white"
            style={{ background: isPassed ? CORRECT.border : WRONG.border, boxShadow: `0 0 0 8px ${isPassed ? CORRECT.bg : WRONG.bg}` }}
          >
            {isPassed ? <Award className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="font-display text-2xl font-bold text-stone-900">
              {isPassed ? 'Tebrikler! Etkinliği Başarıyla Tamamladınız! 🎉' : 'Gelişmeye Devam! Tekrar Deneyin'}
            </h3>
            <p className="text-sm text-stone-600">
              {isPassed
                ? `10 sorudan tam ${correctAnswersCount} tanesini doğru cevapladınız (Asgari 8 doğru barajını aştınız). Türkiye'nin kuş türleri morfolojisi ve ekolojisinde uzmanlaştınız.`
                : `10 sorudan ${correctAnswersCount} doğru yaptınız. Etkinliği tamamlamak için en az 8 doğru gereklidir. Soru havuzundan yeni sorularla hemen tekrar deneyebilirsiniz.`}
            </p>
          </div>

          {/* Skor Kartı */}
          <div className="inline-flex items-center gap-6 p-4 rounded-[20px] bg-stone-50 border border-stone-200 text-stone-800">
            <div>
              <span className="text-2xl font-extrabold text-stone-900">{correctAnswersCount}</span>
              <span className="text-xs text-stone-400 block">Doğru</span>
            </div>
            <div className="w-px h-8 bg-stone-200"></div>
            <div>
              <span className="text-2xl font-extrabold text-stone-900">{10 - correctAnswersCount}</span>
              <span className="text-xs text-stone-400 block">Yanlış</span>
            </div>
            <div className="w-px h-8 bg-stone-200"></div>
            <div>
              <span className="text-2xl font-extrabold text-[var(--accent)]">%{correctAnswersCount * 10}</span>
              <span className="text-xs text-stone-400 block">Başarı</span>
            </div>
          </div>

          {/* Yeniden Başlat Butonu (Yeni Sorular Çeker) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="restart-pool-exam-btn"
              onClick={handleRestartExam}
              className="flex items-center gap-2 px-6 py-3 rounded-[20px] bg-[var(--accent)] hover:bg-[var(--accent)] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yeni Sorularla Testi Tekrarla</span>
            </button>
          </div>

          {/* Sınavda Çıkan Soruların Özeti */}
          <div className="mt-8 pt-6 border-t border-stone-100 text-left space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Sınav Sorularının İncelenmesi
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeQuestions.map((q, idx) => {
                const userChoice = userAnswers[idx];
                const isCorrect = userChoice === q.correctIndex;
                const bird = TURKEY_BIRDS.find((b) => b.id === q.birdId);

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-[20px] border text-xs space-y-1.5"
                    style={{
                      background: `${isCorrect ? CORRECT.bg : WRONG.bg}99`,
                      borderColor: `${isCorrect ? CORRECT.border : WRONG.border}4D`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800">
                        {idx + 1}. {bird?.name}
                      </span>
                      {isCorrect ? (
                        <span className="font-bold flex items-center gap-1 text-[11px]" style={{ color: CORRECT.border }}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Doğru
                        </span>
                      ) : (
                        <span className="font-bold flex items-center gap-1 text-[11px]" style={{ color: WRONG.border }}>
                          <XCircle className="w-3.5 h-3.5" /> Yanlış
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600 line-clamp-2">{q.question}</p>
                    <p className="text-[11px] text-stone-500 font-medium">
                      Doğru: <strong className="text-stone-800">{q.options[q.correctIndex]}</strong>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ===================== AKTİF SORU GÖRÜNÜMÜ ===================== */
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] border border-stone-200/80 overflow-hidden shadow-xs">
            {/* Soru Üst Paneli: Görsel + Ses Dinleme Butonu */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-stone-100">
              {/* Sol: Gerçek Fotoğraf */}
              <div className="md:col-span-5 relative bg-stone-100 aspect-video md:aspect-auto overflow-hidden">
                {associatedBird && (
                  <BirdPhoto
                    src={associatedBird.imageUrl}
                    fallbackSrc={associatedBird.fallbackImageUrl}
                    alt={associatedBird.name}
                    birdId={associatedBird.id}
                    aspectRatio="video"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-[16px] text-[10px] font-bold">
                  {currentQuestion.category}
                </div>
              </div>

              {/* Sağ: Kuş Sesini Dinle & İpucu Kartı */}
              <div className="md:col-span-7 p-5 flex flex-col justify-between space-y-4 bg-stone-50/40">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      İşitsel & Morfolojik İpucu
                    </span>
                    <span className="text-xs font-semibold text-stone-600">
                      {associatedBird?.scientificName}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed italic">
                    "{currentQuestion.hint}"
                  </p>
                </div>

                {/* Ses Çalma Butonu */}
                <div className="pt-2">
                  <button
                    id="play-exam-question-audio-btn"
                    onClick={() => handlePlaySound()}
                    className={`w-full py-2.5 px-4 rounded-[20px] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                      isPlayingAudio
                        ? 'bg-[var(--accent)] text-white ring-4 ring-[var(--accent)] shadow-[var(--accent-light)] animate-pulse'
                        : 'bg-white hover:bg-stone-50 text-stone-800 border border-stone-200'
                    }`}
                  >
                    <Volume2 className={`w-4 h-4 text-[var(--accent)] ${isPlayingAudio ? 'animate-bounce text-white' : ''}`} />
                    <span>{isPlayingAudio ? 'Kuşun Sesi Çalıyor...' : 'Kuşun Sesini Dinle (🔊)'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Soru Metni */}
            <div className="p-6 space-y-4">
              <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 leading-snug">
                {currentQuestion.question}
              </h3>

              {/* 4 Şık */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQuestion.options.map((optionText, optIdx) => {
                  const isSelected = userAnswers[currentIndex] === optIdx;
                  const hasAnswered = userAnswers[currentIndex] !== undefined;
                  const isCorrect = optIdx === currentQuestion.correctIndex;

                  let cardStyle: React.CSSProperties = { background: '#FAFAF9B3', borderColor: '#E7E5E4', color: '#292524' };
                  let badgeStyle: React.CSSProperties = { background: '#FFFFFF', borderColor: '#D6D3D1', color: '#57534E', border: '1px solid #D6D3D1' };

                  if (hasAnswered) {
                    if (isCorrect) {
                      cardStyle = { background: CORRECT.bg, borderColor: CORRECT.border, color: CORRECT.fg, fontWeight: 700, boxShadow: `0 0 0 2px ${CORRECT.border}` };
                      badgeStyle = { background: CORRECT.border, color: '#FFFFFF' };
                    } else if (isSelected) {
                      cardStyle = { background: WRONG.bg, borderColor: WRONG.border, color: WRONG.fg, fontWeight: 700, boxShadow: `0 0 0 2px ${WRONG.border}` };
                      badgeStyle = { background: WRONG.border, color: '#FFFFFF' };
                    } else {
                      cardStyle = { background: '#FAFAF980', borderColor: '#E7E5E4', color: '#A8A29E', opacity: 0.6 };
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      id={`exam-opt-${optIdx}`}
                      onClick={() => handleSelectOption(optIdx)}
                      disabled={hasAnswered}
                      style={cardStyle}
                      className="p-4 rounded-[20px] border text-left text-xs sm:text-sm transition-all flex items-start gap-3 hover:border-stone-400 hover:bg-stone-100"
                    >
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs"
                        style={badgeStyle}
                      >
                        {['A', 'B', 'C', 'D'][optIdx]}
                      </span>
                      <span className="leading-relaxed grow">{optionText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Cevap Sonrası Pedagojik Açıklama */}
              {showExplanation && (
                <div className="mt-4 p-4 rounded-[20px] bg-[var(--accent-light)]/80 border border-[var(--accent)]/30 space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent)]">
                    <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                    <span>Ekolojik Bilgi & Çözüm Analizi</span>
                  </div>
                  <p className="text-xs text-[var(--accent)] leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Sonraki Soru Butonu */}
              {userAnswers[currentIndex] !== undefined && (
                <div className="pt-4 flex justify-end">
                  <button
                    id="exam-next-question-btn"
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-6 py-3 rounded-[20px] bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  >
                    <span>{currentIndex === activeQuestions.length - 1 ? 'Sınavı Tamamla & Sonucu Gör' : 'Sonraki Soru'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
