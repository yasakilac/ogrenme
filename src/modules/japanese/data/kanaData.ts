import { KanaCharacter } from '../../../types';
import type { FinalTestQuestion } from '../../types';

export const KANA_DATA: KanaCharacter[] = [
  // --- TEMEL SESLER (GOJŪON / SEION) ---
  // A Sırası
  {
    id: 'a',
    hiragana: 'あ',
    katakana: 'ア',
    romaji: 'a',
    trPronunciation: "Türkçe 'a' gibi açık ve nettir.",
    strokeCount: 3,
    mnemonic: "Bir elmanın (Apple) yuvarlağına ve üstündeki sapına benzer.",
    sampleWords: [
      { word: 'あめ', romaji: 'ame', meaningTr: 'Yağmur / Şekerleme', kanaOnly: 'あめ / アメ' },
      { word: 'あさ', romaji: 'asa', meaningTr: 'Sabah', kanaOnly: 'あさ / アサ' }
    ],
    category: 'seion',
    row: 'a'
  },
  {
    id: 'i',
    hiragana: 'い',
    katakana: 'イ',
    romaji: 'i',
    trPronunciation: "Türkçe 'i' gibi, hafif tebessüm eder gibi söylenir.",
    strokeCount: 2,
    mnemonic: "Yan yana duran iki yılan veya 'İ'ki dik çizgi.",
    sampleWords: [
      { word: 'いぬ', romaji: 'inu', meaningTr: 'Köpek', kanaOnly: 'いぬ / イヌ' },
      { word: 'いえ', romaji: 'ie', meaningTr: 'Ev', kanaOnly: 'いえ / イエ' }
    ],
    category: 'seion',
    row: 'a'
  },
  {
    id: 'u',
    hiragana: 'う',
    katakana: 'ウ',
    romaji: 'u',
    trPronunciation: "Dudaklar Türkçe 'u' kadar öne uzatılmaz, 'u' ile 'ı' arasında rahat bir sestir.",
    strokeCount: 2,
    mnemonic: "Ağır bir yük taşırken iki büklüm olmuş bir insan (Uff!).",
    sampleWords: [
      { word: 'うみ', romaji: 'umi', meaningTr: 'Deniz', kanaOnly: 'うみ / ウミ' },
      { word: 'うた', romaji: 'uta', meaningTr: 'Şarkı', kanaOnly: 'うた / ウタ' }
    ],
    category: 'seion',
    row: 'a'
  },
  {
    id: 'e',
    hiragana: 'え',
    katakana: 'エ',
    romaji: 'e',
    trPronunciation: "Türkçe 'e' gibidir.",
    strokeCount: 2,
    mnemonic: "Yarışta koşan enerjik bir atlet.",
    sampleWords: [
      { word: 'えき', romaji: 'eki', meaningTr: 'Tren İstasyonu', kanaOnly: 'えき / エキ' },
      { word: 'えんぴつ', romaji: 'enpitsu', meaningTr: 'Kurşun Kalem', kanaOnly: 'えんぴつ' }
    ],
    category: 'seion',
    row: 'a'
  },
  {
    id: 'o',
    hiragana: 'お',
    katakana: 'オ',
    romaji: 'o',
    trPronunciation: "Türkçe 'o' gibidir, yuvarlak dudak hareketiyle çıkarılır.",
    strokeCount: 3,
    mnemonic: "Top oynamak için koşan bir çocuk veya 'O' harfini çevreleyen kıvrım.",
    sampleWords: [
      { word: 'おちゃ', romaji: 'ocha', meaningTr: 'Yeşil Çay', kanaOnly: 'おちゃ' },
      { word: 'おにぎり', romaji: 'onigiri', meaningTr: 'Pirinç Topu', kanaOnly: 'おにぎり' }
    ],
    category: 'seion',
    row: 'a'
  },

  // KA Sırası
  {
    id: 'ka',
    hiragana: 'か',
    katakana: 'カ',
    romaji: 'ka',
    trPronunciation: "Türkçe 'ka' gibidir.",
    strokeCount: 3,
    mnemonic: "Kılıç çeken bir samurayın keskin hamlesi (KAtana).",
    sampleWords: [
      { word: 'かさ', romaji: 'kasa', meaningTr: 'Şemsiye', kanaOnly: 'かさ / カサ' },
      { word: 'かわ', romaji: 'kawa', meaningTr: 'Nehir', kanaOnly: 'かわ / カワ' }
    ],
    category: 'seion',
    row: 'ka'
  },
  {
    id: 'ki',
    hiragana: 'き',
    katakana: 'キ',
    romaji: 'ki',
    trPronunciation: "Türkçe 'ki' gibidir.",
    strokeCount: 4,
    mnemonic: "Eski model bir kapı anahtarına (Key) benzer.",
    sampleWords: [
      { word: 'き', romaji: 'ki', meaningTr: 'Ağaç', kanaOnly: 'き / キ' },
      { word: 'きもの', romaji: 'kimono', meaningTr: 'Geleneksel Giysi', kanaOnly: 'きもの' }
    ],
    category: 'seion',
    row: 'ka'
  },
  {
    id: 'ku',
    hiragana: 'く',
    katakana: 'ク',
    romaji: 'ku',
    trPronunciation: "Türkçe 'ku' gibi ancak dudaklar biraz daha serbest.",
    strokeCount: 1,
    mnemonic: "Ötüşen bir guguk kuşunun açık gagası (Ku ku!).",
    sampleWords: [
      { word: 'くるま', romaji: 'kuruma', meaningTr: 'Araba', kanaOnly: 'くるま / クルマ' },
      { word: 'くつ', romaji: 'kutsu', meaningTr: 'Ayakkabı', kanaOnly: 'くつ / クツ' }
    ],
    category: 'seion',
    row: 'ka'
  },
  {
    id: 'ke',
    hiragana: 'け',
    katakana: 'ケ',
    romaji: 'ke',
    trPronunciation: "Türkçe 'ke' gibidir.",
    strokeCount: 3,
    mnemonic: "Bira veya şarap fıçısına (Keg) benzer bir şekil.",
    sampleWords: [
      { word: 'けさ', romaji: 'kesa', meaningTr: 'Bu sabah', kanaOnly: 'けさ' },
      { word: 'けいさつ', romaji: 'keisatsu', meaningTr: 'Polis', kanaOnly: 'けいさつ' }
    ],
    category: 'seion',
    row: 'ka'
  },
  {
    id: 'ko',
    hiragana: 'こ',
    katakana: 'コ',
    romaji: 'ko',
    trPronunciation: "Türkçe 'ko' gibidir.",
    strokeCount: 2,
    mnemonic: "Üst üste duran iki kütük veya bir fincan kahve.",
    sampleWords: [
      { word: 'こども', romaji: 'kodomo', meaningTr: 'Çocuk', kanaOnly: 'こども' },
      { word: 'こおり', romaji: 'koori', meaningTr: 'Buz', kanaOnly: 'こおり' }
    ],
    category: 'seion',
    row: 'ka'
  },

  // SA Sırası
  {
    id: 'sa',
    hiragana: 'さ',
    katakana: 'サ',
    romaji: 'sa',
    trPronunciation: "Türkçe 'sa' gibidir.",
    strokeCount: 3,
    mnemonic: "Japonların meşhur pirinç şarabı Sake bardağı.",
    sampleWords: [
      { word: 'さくら', romaji: 'sakura', meaningTr: 'Kiraz Çiçeği', kanaOnly: 'さくら / サクラ' },
      { word: 'さかな', romaji: 'sakana', meaningTr: 'Balık', kanaOnly: 'さかな / サカナ' }
    ],
    category: 'seion',
    row: 'sa'
  },
  {
    id: 'shi',
    hiragana: 'し',
    katakana: 'シ',
    romaji: 'shi',
    trPronunciation: "Türkçe 'şi' sesi gibi okunur ('si' değil, 'şi'dir).",
    strokeCount: 1,
    mnemonic: "Olta kancası veya kadın saçının güzel bir lülesi (She).",
    sampleWords: [
      { word: 'しろ', romaji: 'shiro', meaningTr: 'Beyaz / Kale', kanaOnly: 'しろ / シロ' },
      { word: 'しんかんせん', romaji: 'shinkansen', meaningTr: 'Hızlı Tren', kanaOnly: 'しんかんせん' }
    ],
    category: 'seion',
    row: 'sa'
  },
  {
    id: 'su',
    hiragana: 'す',
    katakana: 'ス',
    romaji: 'su',
    trPronunciation: "Türkçe 'su' ile 'sı' arasında, dudaklar düzdür.",
    strokeCount: 2,
    mnemonic: "Kıvrılarak sarkan lezzetli bir erişte / sushi parçası.",
    sampleWords: [
      { word: 'すし', romaji: 'sushi', meaningTr: 'Suşi', kanaOnly: 'すし / スシ' },
      { word: 'すき', romaji: 'suki', meaningTr: 'Sevilen / Hoşlanılan', kanaOnly: 'すき / スキ' }
    ],
    category: 'seion',
    row: 'sa'
  },
  {
    id: 'se',
    hiragana: 'せ',
    katakana: 'セ',
    romaji: 'se',
    trPronunciation: "Türkçe 'se' gibidir.",
    strokeCount: 3,
    mnemonic: "Batan güneşin (Sunset) oluşturduğu silüet.",
    sampleWords: [
      { word: 'せんせい', romaji: 'sensei', meaningTr: 'Öğretmen', kanaOnly: 'せんせい' },
      { word: 'せかい', romaji: 'sekai', meaningTr: 'Dünya', kanaOnly: 'せかい' }
    ],
    category: 'seion',
    row: 'sa'
  },
  {
    id: 'so',
    hiragana: 'そ',
    katakana: 'ソ',
    romaji: 'so',
    trPronunciation: "Türkçe 'so' gibidir.",
    strokeCount: 1,
    mnemonic: "Zikzak çizerek dikiş diken iğne-iplik (Sew).",
    sampleWords: [
      { word: 'そら', romaji: 'sora', meaningTr: 'Gökyüzü', kanaOnly: 'そら / ソラ' },
      { word: 'そば', romaji: 'soba', meaningTr: 'Karabuğday Eriştesi', kanaOnly: 'そば / ソバ' }
    ],
    category: 'seion',
    row: 'sa'
  },

  // TA Sırası
  {
    id: 'ta',
    hiragana: 'た',
    katakana: 'タ',
    romaji: 'ta',
    trPronunciation: "Türkçe 'ta' gibidir.",
    strokeCount: 4,
    mnemonic: "Latin 'ta' harflerinin bir araya gelmiş haline benzer.",
    sampleWords: [
      { word: 'たまご', romaji: 'tamago', meaningTr: 'Yumurta', kanaOnly: 'たまご / タマゴ' },
      { word: 'たべる', romaji: 'taberu', meaningTr: 'Yemek yemek', kanaOnly: 'たべる' }
    ],
    category: 'seion',
    row: 'ta'
  },
  {
    id: 'chi',
    hiragana: 'ち',
    katakana: 'チ',
    romaji: 'chi',
    trPronunciation: "Türkçe 'çi' sesi gibi okunur ('ti' değil 'çi'dir).",
    strokeCount: 2,
    mnemonic: "Tezahürat yapan ponpon kız (Cheerleader) veya '5' rakamının tersi.",
    sampleWords: [
      { word: 'ちち', romaji: 'chichi', meaningTr: 'Baba', kanaOnly: 'ちち / チチ' },
      { word: 'ちず', romaji: 'chizu', meaningTr: 'Harita', kanaOnly: 'ちず / チズ' }
    ],
    category: 'seion',
    row: 'ta'
  },
  {
    id: 'tsu',
    hiragana: 'つ',
    katakana: 'ツ',
    romaji: 'tsu',
    trPronunciation: "Türkçe 'ts' ve 'u' (Tsunami'deki tsu gibi). Dil dişlerin arkasından patlatılır.",
    strokeCount: 1,
    mnemonic: "Dev bir dalganın (TSUnami) kıyıya vuran dalgası.",
    sampleWords: [
      { word: 'つき', romaji: 'tsuki', meaningTr: 'Ay (Gökyüzü)', kanaOnly: 'つき / ツキ' },
      { word: 'つくえ', romaji: 'tsukue', meaningTr: 'Çalışma Masası', kanaOnly: 'つくえ' }
    ],
    category: 'seion',
    row: 'ta'
  },
  {
    id: 'te',
    hiragana: 'て',
    katakana: 'テ',
    romaji: 'te',
    trPronunciation: "Türkçe 'te' gibidir.",
    strokeCount: 1,
    mnemonic: "Büyük 'T' harfinin alt kıvrımı veya bir el (Japonca 'te' el demektir).",
    sampleWords: [
      { word: 'て', romaji: 'te', meaningTr: 'El (Vücut parçası)', kanaOnly: 'て / テ' },
      { word: 'てんき', romaji: 'tenki', meaningTr: 'Hava durumu', kanaOnly: 'てんき / テンキ' }
    ],
    category: 'seion',
    row: 'ta'
  },
  {
    id: 'to',
    hiragana: 'と',
    katakana: 'ト',
    romaji: 'to',
    trPronunciation: "Türkçe 'to' gibidir.",
    strokeCount: 2,
    mnemonic: "Ayak parmağına (Toe) batan bir kıymık.",
    sampleWords: [
      { word: 'ともだち', romaji: 'tomodachi', meaningTr: 'Arkadaş', kanaOnly: 'ともだち' },
      { word: 'とり', romaji: 'tori', meaningTr: 'Kuş', kanaOnly: 'とり / トリ' }
    ],
    category: 'seion',
    row: 'ta'
  },

  // NA Sırası
  {
    id: 'na',
    hiragana: 'な',
    katakana: 'ナ',
    romaji: 'na',
    trPronunciation: "Türkçe 'na' gibidir.",
    strokeCount: 4,
    mnemonic: "Haç önünde diz çöküp dua eden bir rahibe (Nun).",
    sampleWords: [
      { word: 'なつ', romaji: 'natsu', meaningTr: 'Yaz mevsimi', kanaOnly: 'なつ / ナツ' },
      { word: 'なまえ', romaji: 'namae', meaningTr: 'İsim', kanaOnly: 'なまえ' }
    ],
    category: 'seion',
    row: 'na'
  },
  {
    id: 'ni',
    hiragana: 'に',
    katakana: 'ニ',
    romaji: 'ni',
    trPronunciation: "Türkçe 'ni' gibidir.",
    strokeCount: 3,
    mnemonic: "Dikiş iğnesi ve iplik (Needle) veya Japonca '2' (ni) sayısı.",
    sampleWords: [
      { word: 'にほん', romaji: 'nihon', meaningTr: 'Japonya', kanaOnly: 'にほん / ニホン' },
      { word: 'にく', romaji: 'niku', meaningTr: 'Et', kanaOnly: 'にく / ニク' }
    ],
    category: 'seion',
    row: 'na'
  },
  {
    id: 'nu',
    hiragana: 'ぬ',
    katakana: 'ヌ',
    romaji: 'nu',
    trPronunciation: "Türkçe 'nu' gibidir.",
    strokeCount: 2,
    mnemonic: "Erişte çubuklarıyla (Noodles) düğüm atılmış bir makarna parçası.",
    sampleWords: [
      { word: 'ぬいぐるみ', romaji: 'nuigurumi', meaningTr: 'Peluş Oyuncak', kanaOnly: 'ぬいぐるみ' },
      { word: 'ぬま', romaji: 'numa', meaningTr: 'Bataklık', kanaOnly: 'ぬま' }
    ],
    category: 'seion',
    row: 'na'
  },
  {
    id: 'ne',
    hiragana: 'ね',
    katakana: 'ネ',
    romaji: 'ne',
    trPronunciation: "Türkçe 'ne' gibidir.",
    strokeCount: 2,
    mnemonic: "Kuyruğu kıvrılmış sevimli bir kedi (Japonca kedi: Neko).",
    sampleWords: [
      { word: 'ねこ', romaji: 'neko', meaningTr: 'Kedi', kanaOnly: 'ねこ / ネコ' },
      { word: 'ねつ', romaji: 'netsu', meaningTr: 'Ateş (Hastalık)', kanaOnly: 'ねつ' }
    ],
    category: 'seion',
    row: 'na'
  },
  {
    id: 'no',
    hiragana: 'の',
    katakana: 'ノ',
    romaji: 'no',
    trPronunciation: "Türkçe 'no' gibidir.",
    strokeCount: 1,
    mnemonic: "'Yasak' (NO) işareti gibi tek bir yuvarlak kıvrım.",
    sampleWords: [
      { word: 'のみもの', romaji: 'nomimono', meaningTr: 'İçecek', kanaOnly: 'のみもの' },
      { word: 'のり', romaji: 'nori', meaningTr: 'Deniz Yosunu / Yapıştırıcı', kanaOnly: 'のり / ノリ' }
    ],
    category: 'seion',
    row: 'na'
  },

  // HA Sırası
  {
    id: 'ha',
    hiragana: 'は',
    katakana: 'ハ',
    romaji: 'ha',
    trPronunciation: "Kelime başında 'ha', cümle sonu parçacık olarak kullanıldığında 'wa' okunur.",
    strokeCount: 3,
    mnemonic: "Bir direk ve arkasında kahkaha atan ağız (Ha ha!).",
    sampleWords: [
      { word: 'はな', romaji: 'hana', meaningTr: 'Çiçek / Burun', kanaOnly: 'はな / ハナ' },
      { word: 'はし', romaji: 'hashi', meaningTr: 'Köprü / Yemek Çubuğu', kanaOnly: 'はし / ハシ' }
    ],
    category: 'seion',
    row: 'ha'
  },
  {
    id: 'hi',
    hiragana: 'ひ',
    katakana: 'ヒ',
    romaji: 'hi',
    trPronunciation: "Türkçe 'hi' gibidir, biraz daha nefesli söylenebilir.",
    strokeCount: 1,
    mnemonic: "Kocaman gülen bir ağız (Hi hi hi!).",
    sampleWords: [
      { word: 'ひ', romaji: 'hi', meaningTr: 'Ateş / Güneş / Gün', kanaOnly: 'ひ / ヒ' },
      { word: 'ひかり', romaji: 'hikari', meaningTr: 'Işık', kanaOnly: 'ひかり / ヒカリ' }
    ],
    category: 'seion',
    row: 'ha'
  },
  {
    id: 'fu',
    hiragana: 'ふ',
    katakana: 'フ',
    romaji: 'fu',
    trPronunciation: "Türkçe 'fu' ile 'hu' arasında; dişler dudağa değmeden üflenerek çıkarılır.",
    strokeCount: 4,
    mnemonic: "Fuji Dağı'nın etekleri ve dumanı (Mt. FUji).",
    sampleWords: [
      { word: 'ふゆ', romaji: 'fuyu', meaningTr: 'Kış mevsimi', kanaOnly: 'ふゆ / フユ' },
      { word: 'ふね', romaji: 'fune', meaningTr: 'Gemi', kanaOnly: 'ふね / フネ' }
    ],
    category: 'seion',
    row: 'ha'
  },
  {
    id: 'he',
    hiragana: 'へ',
    katakana: 'ヘ',
    romaji: 'he',
    trPronunciation: "Kelime içinde 'he', yön parçacığı olarak 'e' okunur. Katakana ile neredeyse aynıdır.",
    strokeCount: 1,
    mnemonic: "Tırmanılan dik bir tepe (Hill).",
    sampleWords: [
      { word: 'へや', romaji: 'heya', meaningTr: 'Oda', kanaOnly: 'へや / ヘヤ' },
      { word: 'へび', romaji: 'hebi', meaningTr: 'Yılan', kanaOnly: 'へび / ヘビ' }
    ],
    category: 'seion',
    row: 'ha'
  },
  {
    id: 'ho',
    hiragana: 'ほ',
    katakana: 'ホ',
    romaji: 'ho',
    trPronunciation: "Türkçe 'ho' gibidir.",
    strokeCount: 4,
    mnemonic: "Üstünde şapkası olan bir Noel Baba (Ho ho ho!).",
    sampleWords: [
      { word: 'ほし', romaji: 'hoshi', meaningTr: 'Yıldız', kanaOnly: 'ほし / ホシ' },
      { word: 'ほん', romaji: 'hon', meaningTr: 'Kitap', kanaOnly: 'ほん / ホン' }
    ],
    category: 'seion',
    row: 'ha'
  },

  // MA Sırası
  {
    id: 'ma',
    hiragana: 'ま',
    katakana: 'マ',
    romaji: 'ma',
    trPronunciation: "Türkçe 'ma' gibidir.",
    strokeCount: 3,
    mnemonic: "Tiyatro maskesi takmış bir yüz (Mask).",
    sampleWords: [
      { word: 'まち', romaji: 'machi', meaningTr: 'Şehir / Kasaba', kanaOnly: 'まち / マチ' },
      { word: 'まど', romaji: 'mado', meaningTr: 'Pencere', kanaOnly: 'まど / マド' }
    ],
    category: 'seion',
    row: 'ma'
  },
  {
    id: 'mi',
    hiragana: 'み',
    katakana: 'ミ',
    romaji: 'mi',
    trPronunciation: "Türkçe 'mi' gibidir.",
    strokeCount: 2,
    mnemonic: "Müzik notasındaki 21 rakamına veya 'mi' notasına benzer.",
    sampleWords: [
      { word: 'みず', romaji: 'mizu', meaningTr: 'Su', kanaOnly: 'みず / ミズ' },
      { word: 'みち', romaji: 'michi', meaningTr: 'Yol', kanaOnly: 'みち / ミチ' }
    ],
    category: 'seion',
    row: 'ma'
  },
  {
    id: 'mu',
    hiragana: 'む',
    katakana: 'ム',
    romaji: 'mu',
    trPronunciation: "Türkçe 'mu' gibidir.",
    strokeCount: 3,
    mnemonic: "Burnunda halka olan bir inek (Möö/Muu sesi).",
    sampleWords: [
      { word: 'むし', romaji: 'mushi', meaningTr: 'Böcek', kanaOnly: 'むし / ムシ' },
      { word: 'むら', romaji: 'mura', meaningTr: 'Köy', kanaOnly: 'むら / ムラ' }
    ],
    category: 'seion',
    row: 'ma'
  },
  {
    id: 'me',
    hiragana: 'め',
    katakana: 'メ',
    romaji: 'me',
    trPronunciation: "Türkçe 'me' gibidir.",
    strokeCount: 2,
    mnemonic: "Kıvrımlı bir göz yapısı (Japonca göz: Me). 'Nu' harfinden düğümsüz olmasıyla ayrılır.",
    sampleWords: [
      { word: 'め', romaji: 'me', meaningTr: 'Göz', kanaOnly: 'め / メ' },
      { word: 'めがね', romaji: 'megane', meaningTr: 'Gözlük', kanaOnly: 'めがね' }
    ],
    category: 'seion',
    row: 'ma'
  },
  {
    id: 'mo',
    hiragana: 'も',
    katakana: 'モ',
    romaji: 'mo',
    trPronunciation: "Türkçe 'mo' gibidir.",
    strokeCount: 3,
    mnemonic: "İki solucanı aynı anda yakalamış bir balık kancası (More worms).",
    sampleWords: [
      { word: 'もり', romaji: 'mori', meaningTr: 'Orman', kanaOnly: 'もり / モリ' },
      { word: 'もの', romaji: 'mono', meaningTr: 'Eşya / Şey', kanaOnly: 'もの / モノ' }
    ],
    category: 'seion',
    row: 'ma'
  },

  // YA Sırası
  {
    id: 'ya',
    hiragana: 'や',
    katakana: 'ヤ',
    romaji: 'ya',
    trPronunciation: "Türkçe 'ya' gibidir.",
    strokeCount: 3,
    mnemonic: "Boynuzları olan bir dağ keçisi veya Yak öküzü.",
    sampleWords: [
      { word: 'やま', romaji: 'yama', meaningTr: 'Dağ', kanaOnly: 'やま / ヤマ' },
      { word: 'やすみ', romaji: 'yasumi', meaningTr: 'Tatil / Dinlenme', kanaOnly: 'やすみ' }
    ],
    category: 'seion',
    row: 'ya'
  },
  {
    id: 'yu',
    hiragana: 'ゆ',
    katakana: 'ユ',
    romaji: 'yu',
    trPronunciation: "Türkçe 'yu' gibidir.",
    strokeCount: 2,
    mnemonic: "Suda yüzen bir balığın kuyruğu.",
    sampleWords: [
      { word: 'ゆき', romaji: 'yuki', meaningTr: 'Kar', kanaOnly: 'ゆき / ユキ' },
      { word: 'ゆめ', romaji: 'yume', meaningTr: 'Rüya', kanaOnly: 'ゆめ / ユメ' }
    ],
    category: 'seion',
    row: 'ya'
  },
  {
    id: 'yo',
    hiragana: 'よ',
    katakana: 'ヨ',
    romaji: 'yo',
    trPronunciation: "Türkçe 'yo' gibidir.",
    strokeCount: 2,
    mnemonic: "Yo-yo oyuncağının asılı olduğu ip.",
    sampleWords: [
      { word: 'よる', romaji: 'yoru', meaningTr: 'Gece', kanaOnly: 'よる / ヨル' },
      { word: 'よむ', romaji: 'yomu', meaningTr: 'Okumak', kanaOnly: 'よむ' }
    ],
    category: 'seion',
    row: 'ya'
  },

  // RA Sırası (Özel Japonca R/L Sesi)
  {
    id: 'ra',
    hiragana: 'ら',
    katakana: 'ラ',
    romaji: 'ra',
    trPronunciation: "Türkçe 'R' gibi sert dil titremesi yapılmaz. Dil damağa tek bir dokunuş yapar (R ile L arası yumuşak ses).",
    strokeCount: 2,
    mnemonic: "Kambur duran bir lama veya tavşan (Rabbit).",
    sampleWords: [
      { word: 'らいおん', romaji: 'raion', meaningTr: 'Aslan (katakana: ライオン)', kanaOnly: 'ライオン' },
      { word: 'らーめん', romaji: 'raamen', meaningTr: 'Ramen', kanaOnly: 'ラーメン' }
    ],
    category: 'seion',
    row: 'ra'
  },
  {
    id: 'ri',
    hiragana: 'り',
    katakana: 'リ',
    romaji: 'ri',
    trPronunciation: "Dil damağa hafifçe dokunur, 'ri' ile 'li' arası.",
    strokeCount: 2,
    mnemonic: "Akan bir nehirin (River) iki kolu.",
    sampleWords: [
      { word: 'りんご', romaji: 'ringo', meaningTr: 'Elma', kanaOnly: 'りんご / リンゴ' },
      { word: 'りす', romaji: 'risu', meaningTr: 'Sincap', kanaOnly: 'りす / リス' }
    ],
    category: 'seion',
    row: 'ra'
  },
  {
    id: 'ru',
    hiragana: 'る',
    katakana: 'ル',
    romaji: 'ru',
    trPronunciation: "Dudaklar yuvarlatılmaz, damağa tek vuruş.",
    strokeCount: 1,
    mnemonic: "Ucunda bir yakut (Ruby) tutan kıvrım. 'Ro'dan farkı ucundaki halkadır.",
    sampleWords: [
      { word: 'くるま', romaji: 'kuruma', meaningTr: 'Araba', kanaOnly: 'くるま' },
      { word: 'はる', romaji: 'haru', meaningTr: 'İlkbahar', kanaOnly: 'はる / ハル' }
    ],
    category: 'seion',
    row: 'ra'
  },
  {
    id: 're',
    hiragana: 'れ',
    katakana: 'レ',
    romaji: 're',
    trPronunciation: "Yumuşak 're'.",
    strokeCount: 2,
    mnemonic: "Koşan bir insanın geriye doğru savrulan bacağı.",
    sampleWords: [
      { word: 'れいぞうこ', romaji: 'reizouko', meaningTr: 'Buzdolabı', kanaOnly: 'れいぞうこ' },
      { word: 'れきし', romaji: 'rekishi', meaningTr: 'Tarih (Geçmiş)', kanaOnly: 'れきし' }
    ],
    category: 'seion',
    row: 'ra'
  },
  {
    id: 'ro',
    hiragana: 'ろ',
    katakana: 'ロ',
    romaji: 'ro',
    trPronunciation: "Yumuşak 'ro'.",
    strokeCount: 1,
    mnemonic: "3 rakamına benzer, 'ru' harfi gibi alt ucunda halkası yoktur (Road).",
    sampleWords: [
      { word: 'ろうそく', romaji: 'rousoku', meaningTr: 'Mum', kanaOnly: 'ろうそく' },
      { word: 'ろく', romaji: 'roku', meaningTr: '6 (Altı)', kanaOnly: 'ろく / ロク' }
    ],
    category: 'seion',
    row: 'ra'
  },

  // WA / WO / N Sırası
  {
    id: 'wa',
    hiragana: 'わ',
    katakana: 'ワ',
    romaji: 'wa',
    trPronunciation: "Türkçe 'va' değil, İngilizce 'water'daki gibi dudaklar öne yuvarlatılarak 'wa' denir.",
    strokeCount: 2,
    mnemonic: "Zarif bir kuğu (Swan / WAn).",
    sampleWords: [
      { word: 'わたし', romaji: 'watashi', meaningTr: 'Ben', kanaOnly: 'わたし / ワタシ' },
      { word: 'わに', romaji: 'wani', meaningTr: 'Timsah', kanaOnly: 'わに / ワニ' }
    ],
    category: 'seion',
    row: 'wa'
  },
  {
    id: 'wo',
    hiragana: 'を',
    katakana: 'ヲ',
    romaji: 'o (wo)',
    trPronunciation: "Günümüz Japoncasında 'o' olarak telaffuz edilir. Sadece nesne belirten dilbilgisi parçacığıdır!",
    strokeCount: 3,
    mnemonic: "Amigo kızın tekerlekli sandalyede gösteri yapması.",
    sampleWords: [
      { word: 'ほん を よむ', romaji: 'hon o yomu', meaningTr: 'Kitap okumak (nesne eki を)', kanaOnly: 'ほんをよむ' }
    ],
    category: 'seion',
    row: 'wa'
  },
  {
    id: 'n',
    hiragana: 'ん',
    katakana: 'ン',
    romaji: 'n',
    trPronunciation: "Japonca'da tek başına sesli harf olmadan durabilen tek sessiz harftir. Genizden gelen 'n' sesidir.",
    strokeCount: 1,
    mnemonic: "Latin 'n' harfinin kıvrımlı el yazısına benzer.",
    sampleWords: [
      { word: 'にほん', romaji: 'nihon', meaningTr: 'Japonya', kanaOnly: 'にほん' },
      { word: 'みかん', romaji: 'mikan', meaningTr: 'Mandalina', kanaOnly: 'みかん' }
    ],
    category: 'seion',
    row: 'n'
  },

  // --- DAKUON (TENTEN - İKİ ÇİZGİ İLE SERTLEŞEN / YUMUŞAYAN SESLER) ---
  // GA Sırası
  {
    id: 'ga',
    hiragana: 'が',
    katakana: 'ガ',
    romaji: 'ga',
    trPronunciation: "Türkçe 'ga' gibidir. Ka (か) harfine tenten (\") eklenerek oluşur.",
    strokeCount: 5,
    mnemonic: "Ka üzerine iki çizgi = Ga",
    sampleWords: [{ word: 'がくせい', romaji: 'gakusei', meaningTr: 'Öğrenci', kanaOnly: 'がくせい' }],
    category: 'dakuon',
    row: 'ka'
  },
  {
    id: 'gi',
    hiragana: 'ぎ',
    katakana: 'ギ',
    romaji: 'gi',
    trPronunciation: "Türkçe 'gi' gibidir. Ki (き) üzerine tenten eklenir.",
    strokeCount: 6,
    mnemonic: "Ki üzerine iki çizgi = Gi",
    sampleWords: [{ word: 'ぎんこう', romaji: 'ginkou', meaningTr: 'Banka', kanaOnly: 'ぎんこう' }],
    category: 'dakuon',
    row: 'ka'
  },
  {
    id: 'gu',
    hiragana: 'ぐ',
    katakana: 'グ',
    romaji: 'gu',
    trPronunciation: "Türkçe 'gu' gibidir. Ku (く) üzerine tenten eklenir.",
    strokeCount: 3,
    mnemonic: "Ku üzerine iki çizgi = Gu",
    sampleWords: [{ word: 'ぐあい', romaji: 'guai', meaningTr: 'Durum / Sağlık hali', kanaOnly: 'ぐあい' }],
    category: 'dakuon',
    row: 'ka'
  },
  {
    id: 'ge',
    hiragana: 'げ',
    katakana: 'ゲ',
    romaji: 'ge',
    trPronunciation: "Türkçe 'ge' gibidir. Ke (け) üzerine tenten eklenir.",
    strokeCount: 5,
    mnemonic: "Ke üzerine iki çizgi = Ge",
    sampleWords: [{ word: 'げんき', romaji: 'genki', meaningTr: 'Sağlıklı / Enerjik', kanaOnly: 'げんき' }],
    category: 'dakuon',
    row: 'ka'
  },
  {
    id: 'go',
    hiragana: 'ご',
    katakana: 'ゴ',
    romaji: 'go',
    trPronunciation: "Türkçe 'go' gibidir. Ko (こ) üzerine tenten eklenir.",
    strokeCount: 4,
    mnemonic: "Ko üzerine iki çizgi = Go",
    sampleWords: [{ word: 'ごはん', romaji: 'gohan', meaningTr: 'Pilav / Yemek', kanaOnly: 'ごはん' }],
    category: 'dakuon',
    row: 'ka'
  },

  // ZA Sırası
  {
    id: 'za',
    hiragana: 'ざ',
    katakana: 'ザ',
    romaji: 'za',
    trPronunciation: "Türkçe 'za' gibidir. Sa (さ) üzerine tenten eklenir.",
    strokeCount: 5,
    mnemonic: "Sa + tenten = Za",
    sampleWords: [{ word: 'ざっし', romaji: 'zasshi', meaningTr: 'Dergi', kanaOnly: 'ざっし' }],
    category: 'dakuon',
    row: 'sa'
  },
  {
    id: 'ji',
    hiragana: 'じ',
    katakana: 'ジ',
    romaji: 'ji',
    trPronunciation: "Türkçe 'ci' gibi okunur ('zi' değil, 'ci'dir). Shi (し) + tenten.",
    strokeCount: 3,
    mnemonic: "Shi + tenten = Ji (ci sesi)",
    sampleWords: [{ word: 'じかん', romaji: 'jikan', meaningTr: 'Zaman / Saat', kanaOnly: 'じかん' }],
    category: 'dakuon',
    row: 'sa'
  },
  {
    id: 'zu',
    hiragana: 'ず',
    katakana: 'ズ',
    romaji: 'zu',
    trPronunciation: "Türkçe 'zu' gibidir. Su (す) + tenten.",
    strokeCount: 4,
    mnemonic: "Su + tenten = Zu",
    sampleWords: [{ word: 'みず', romaji: 'mizu', meaningTr: 'Su', kanaOnly: 'みず' }],
    category: 'dakuon',
    row: 'sa'
  },
  {
    id: 'ze',
    hiragana: 'ぜ',
    katakana: 'ゼ',
    romaji: 'ze',
    trPronunciation: "Türkçe 'ze' gibidir. Se (せ) + tenten.",
    strokeCount: 5,
    mnemonic: "Se + tenten = Ze",
    sampleWords: [{ word: 'ぜんぶ', romaji: 'zenbu', meaningTr: 'Hepsi / Tamamı', kanaOnly: 'ぜんぶ' }],
    category: 'dakuon',
    row: 'sa'
  },
  {
    id: 'zo',
    hiragana: 'ぞ',
    katakana: 'ゾ',
    romaji: 'zo',
    trPronunciation: "Türkçe 'zo' gibidir. So (そ) + tenten.",
    strokeCount: 3,
    mnemonic: "So + tenten = Zo",
    sampleWords: [{ word: 'ぞう', romaji: 'zou', meaningTr: 'Fil', kanaOnly: 'ぞう' }],
    category: 'dakuon',
    row: 'sa'
  },

  // DA Sırası
  {
    id: 'da',
    hiragana: 'だ',
    katakana: 'ダ',
    romaji: 'da',
    trPronunciation: "Türkçe 'da' gibidir. Ta (た) + tenten.",
    strokeCount: 6,
    mnemonic: "Ta + tenten = Da",
    sampleWords: [{ word: 'だいがく', romaji: 'daigaku', meaningTr: 'Üniversite', kanaOnly: 'だいがく' }],
    category: 'dakuon',
    row: 'ta'
  },
  {
    id: 'dji',
    hiragana: 'ぢ',
    katakana: 'ヂ',
    romaji: 'ji (di)',
    trPronunciation: "Çok nadir kullanılır, 'ci' gibi okunur (ち + tenten).",
    strokeCount: 4,
    mnemonic: "Chi + tenten = Ji (nadirdir)",
    sampleWords: [{ word: 'はなぢ', romaji: 'hanaji', meaningTr: 'Burun Kanaması', kanaOnly: 'はなぢ' }],
    category: 'dakuon',
    row: 'ta'
  },
  {
    id: 'dzu',
    hiragana: 'づ',
    katakana: 'ヅ',
    romaji: 'zu (du)',
    trPronunciation: "Nadir kullanılır, 'zu' gibi okunur (つ + tenten).",
    strokeCount: 3,
    mnemonic: "Tsu + tenten = Zu (nadirdir)",
    sampleWords: [{ word: 'つづく', romaji: 'tsuzuku', meaningTr: 'Devam etmek', kanaOnly: 'つづく' }],
    category: 'dakuon',
    row: 'ta'
  },
  {
    id: 'de',
    hiragana: 'で',
    katakana: 'デ',
    romaji: 'de',
    trPronunciation: "Türkçe 'de' gibidir. Te (て) + tenten.",
    strokeCount: 3,
    mnemonic: "Te + tenten = De",
    sampleWords: [{ word: 'でんしゃ', romaji: 'densha', meaningTr: 'Tren', kanaOnly: 'でんしゃ' }],
    category: 'dakuon',
    row: 'ta'
  },
  {
    id: 'do',
    hiragana: 'ど',
    katakana: 'ド',
    romaji: 'do',
    trPronunciation: "Türkçe 'do' gibidir. To (と) + tenten.",
    strokeCount: 4,
    mnemonic: "To + tenten = Do",
    sampleWords: [{ word: 'どこ', romaji: 'doko', meaningTr: 'Nerede', kanaOnly: 'どこ' }],
    category: 'dakuon',
    row: 'ta'
  },

  // BA Sırası
  {
    id: 'ba',
    hiragana: 'ば',
    katakana: 'バ',
    romaji: 'ba',
    trPronunciation: "Türkçe 'ba' gibidir. Ha (は) + tenten.",
    strokeCount: 5,
    mnemonic: "Ha + tenten = Ba",
    sampleWords: [{ word: 'ばしょ', romaji: 'basho', meaningTr: 'Yer / Mekan', kanaOnly: 'ばしょ' }],
    category: 'dakuon',
    row: 'ha'
  },
  {
    id: 'bi',
    hiragana: 'び',
    katakana: 'ビ',
    romaji: 'bi',
    trPronunciation: "Türkçe 'bi' gibidir. Hi (ひ) + tenten.",
    strokeCount: 3,
    mnemonic: "Hi + tenten = Bi",
    sampleWords: [{ word: 'びょういん', romaji: 'byouin', meaningTr: 'Hastane', kanaOnly: 'びょういん' }],
    category: 'dakuon',
    row: 'ha'
  },
  {
    id: 'bu',
    hiragana: 'ぶ',
    katakana: 'ブ',
    romaji: 'bu',
    trPronunciation: "Türkçe 'bu' gibidir. Fu (ふ) + tenten.",
    strokeCount: 6,
    mnemonic: "Fu + tenten = Bu",
    sampleWords: [{ word: 'ぶた', romaji: 'buta', meaningTr: 'Domuz', kanaOnly: 'ぶた' }],
    category: 'dakuon',
    row: 'ha'
  },
  {
    id: 'be',
    hiragana: 'べ',
    katakana: 'ベ',
    romaji: 'be',
    trPronunciation: "Türkçe 'be' gibidir. He (へ) + tenten.",
    strokeCount: 3,
    mnemonic: "He + tenten = Be",
    sampleWords: [{ word: 'べんきょう', romaji: 'benkyou', meaningTr: 'Ders Çalışma', kanaOnly: 'べんきょう' }],
    category: 'dakuon',
    row: 'ha'
  },
  {
    id: 'bo',
    hiragana: 'ぼ',
    katakana: 'ボ',
    romaji: 'bo',
    trPronunciation: "Türkçe 'bo' gibidir. Ho (ほ) + tenten.",
    strokeCount: 6,
    mnemonic: "Ho + tenten = Bo",
    sampleWords: [{ word: 'ぼうし', romaji: 'boushi', meaningTr: 'Şapka', kanaOnly: 'ぼうし' }],
    category: 'dakuon',
    row: 'ha'
  },

  // --- HANDAKUON (MARU - KÜÇÜK YUVARLAK İLE P SESİNE DÖNÜŞENLER) ---
  {
    id: 'pa',
    hiragana: 'ぱ',
    katakana: 'パ',
    romaji: 'pa',
    trPronunciation: "Türkçe 'pa' gibidir. Ha (は) üzerine küçük daire (maru) eklenir.",
    strokeCount: 4,
    mnemonic: "Ha + daire = Pa (Patlayan ses!)",
    sampleWords: [{ word: 'ぱん', romaji: 'pan', meaningTr: 'Ekmek (Katakana: パン)', kanaOnly: 'パン' }],
    category: 'handakuon',
    row: 'ha'
  },
  {
    id: 'pi',
    hiragana: 'ぴ',
    katakana: 'ピ',
    romaji: 'pi',
    trPronunciation: "Türkçe 'pi' gibidir. Hi (ひ) + maru.",
    strokeCount: 2,
    mnemonic: "Hi + daire = Pi",
    sampleWords: [{ word: 'ぴあの', romaji: 'piano', meaningTr: 'Piyano (Katakana: ピアノ)', kanaOnly: 'ピアノ' }],
    category: 'handakuon',
    row: 'ha'
  },
  {
    id: 'pu',
    hiragana: 'ぷ',
    katakana: 'プ',
    romaji: 'pu',
    trPronunciation: "Türkçe 'pu' gibidir. Fu (ふ) + maru.",
    strokeCount: 5,
    mnemonic: "Fu + daire = Pu",
    sampleWords: [{ word: 'ぷーる', romaji: 'puuru', meaningTr: 'Havuz (Katakana: プール)', kanaOnly: 'プール' }],
    category: 'handakuon',
    row: 'ha'
  },
  {
    id: 'pe',
    hiragana: 'ぺ',
    katakana: 'ペ',
    romaji: 'pe',
    trPronunciation: "Türkçe 'pe' gibidir. He (へ) + maru.",
    strokeCount: 2,
    mnemonic: "He + daire = Pe",
    sampleWords: [{ word: 'ぺん', romaji: 'pen', meaningTr: 'Tükenmez Kalem (Katakana: ペン)', kanaOnly: 'ペン' }],
    category: 'handakuon',
    row: 'ha'
  },
  {
    id: 'po',
    hiragana: 'ぽ',
    katakana: 'ポ',
    romaji: 'po',
    trPronunciation: "Türkçe 'po' gibidir. Ho (ほ) + maru.",
    strokeCount: 5,
    mnemonic: "Ho + daire = Po",
    sampleWords: [{ word: 'ぽすと', romaji: 'posuto', meaningTr: 'Posta Kutusu (Katakana: ポスト)', kanaOnly: 'ポスト' }],
    category: 'handakuon',
    row: 'ha'
  },

  // --- YŌON (BİLEŞİK SESLER - KÜÇÜK YA, YU, YO İLE BİRLEŞENLER) ---
  {
    id: 'kya',
    hiragana: 'きゃ',
    katakana: 'キャ',
    romaji: 'kya',
    trPronunciation: "'Ki' ile küçük 'ya' tek hecede kaynaşır.",
    strokeCount: 6,
    mnemonic: "Ki + küçük ya = Kya",
    sampleWords: [{ word: 'きゃく', romaji: 'kyaku', meaningTr: 'Müşteri / Misafir', kanaOnly: 'きゃく' }],
    category: 'yoon',
    row: 'ka'
  },
  {
    id: 'kyu',
    hiragana: 'きゅ',
    katakana: 'キュ',
    romaji: 'kyu',
    trPronunciation: "'Ki' ile küçük 'yu' kaynaşır.",
    strokeCount: 6,
    mnemonic: "Ki + küçük yu = Kyu",
    sampleWords: [{ word: 'きゅう', romaji: 'kyuu', meaningTr: 'Dokuz (9)', kanaOnly: 'きゅう' }],
    category: 'yoon',
    row: 'ka'
  },
  {
    id: 'kyo',
    hiragana: 'きょ',
    katakana: 'キョ',
    romaji: 'kyo',
    trPronunciation: "'Ki' ile küçük 'yo' kaynaşır.",
    strokeCount: 6,
    mnemonic: "Ki + küçük yo = Kyo",
    sampleWords: [{ word: 'きょう', romaji: 'kyou', meaningTr: 'Bugün', kanaOnly: 'きょう' }],
    category: 'yoon',
    row: 'ka'
  },
  {
    id: 'sha',
    hiragana: 'しゃ',
    katakana: 'シャ',
    romaji: 'sha',
    trPronunciation: "Türkçe 'şa' sesi gibi tek hecedir.",
    strokeCount: 4,
    mnemonic: "Shi + küçük ya = Sha (Şa)",
    sampleWords: [{ word: 'しゃしん', romaji: 'shashin', meaningTr: 'Fotoğraf', kanaOnly: 'しゃしん' }],
    category: 'yoon',
    row: 'sa'
  },
  {
    id: 'shu',
    hiragana: 'しゅ',
    katakana: 'シュ',
    romaji: 'shu',
    trPronunciation: "Türkçe 'şu' sesi gibi tek hecedir.",
    strokeCount: 3,
    mnemonic: "Shi + küçük yu = Shu (Şu)",
    sampleWords: [{ word: 'しゅくだい', romaji: 'shukudai', meaningTr: 'Ev Ödevi', kanaOnly: 'しゅくだい' }],
    category: 'yoon',
    row: 'sa'
  },
  {
    id: 'sho',
    hiragana: 'しょ',
    katakana: 'ショ',
    romaji: 'sho',
    trPronunciation: "Türkçe 'şo' sesi gibi tek hecedir.",
    strokeCount: 3,
    mnemonic: "Shi + küçük yo = Sho (Şo)",
    sampleWords: [{ word: 'しょうゆ', romaji: 'shouyu', meaningTr: 'Soya Sosu', kanaOnly: 'しょうゆ' }],
    category: 'yoon',
    row: 'sa'
  },
  {
    id: 'cha',
    hiragana: 'ちゃ',
    katakana: 'チャ',
    romaji: 'cha',
    trPronunciation: "Türkçe 'ça' sesi gibi tek hecedir.",
    strokeCount: 5,
    mnemonic: "Chi + küçük ya = Cha (Ça)",
    sampleWords: [{ word: 'おちゃ', romaji: 'ocha', meaningTr: 'Çay', kanaOnly: 'おちゃ' }],
    category: 'yoon',
    row: 'ta'
  },
  {
    id: 'chu',
    hiragana: 'ちゅ',
    katakana: 'チュ',
    romaji: 'chu',
    trPronunciation: "Türkçe 'çu' sesi gibi tek hecedir.",
    strokeCount: 4,
    mnemonic: "Chi + küçük yu = Chu (Çu)",
    sampleWords: [{ word: 'ちゅうごく', romaji: 'chuugoku', meaningTr: 'Çin', kanaOnly: 'ちゅうごく' }],
    category: 'yoon',
    row: 'ta'
  },
  {
    id: 'cho',
    hiragana: 'ちょ',
    katakana: 'チョ',
    romaji: 'cho',
    trPronunciation: "Türkçe 'ço' sesi gibi tek hecedir.",
    strokeCount: 4,
    mnemonic: "Chi + küçük yo = Cho (Ço)",
    sampleWords: [{ word: 'ちょっと', romaji: 'chotto', meaningTr: 'Birazcık', kanaOnly: 'ちょっと' }],
    category: 'yoon',
    row: 'ta'
  },
  {
    id: 'nya',
    hiragana: 'にゃ',
    katakana: 'ニャ',
    romaji: 'nya',
    trPronunciation: "Kedi miyavlaması gibi 'nya'.",
    strokeCount: 6,
    mnemonic: "Ni + küçük ya = Nya (Miyav sesi)",
    sampleWords: [{ word: 'にゃんこ', romaji: 'nyanko', meaningTr: 'Kedicik', kanaOnly: 'にゃんこ' }],
    category: 'yoon',
    row: 'na'
  },
  {
    id: 'ryo',
    hiragana: 'りょ',
    katakana: 'リョ',
    romaji: 'ryo',
    trPronunciation: "Yumuşak 'ryo'.",
    strokeCount: 4,
    mnemonic: "Ri + küçük yo = Ryo",
    sampleWords: [{ word: 'りょこう', romaji: 'ryokou', meaningTr: 'Seyahat', kanaOnly: 'りょこう' }],
    category: 'yoon',
    row: 'ra'
  },
  {
    id: 'ja',
    hiragana: 'じゃ',
    katakana: 'ジャ',
    romaji: 'ja',
    trPronunciation: "Türkçe 'ca' sesi gibi okunur.",
    strokeCount: 6,
    mnemonic: "Ji + küçük ya = Ja (Ca)",
    sampleWords: [{ word: 'じゃあね', romaji: 'jaane', meaningTr: 'Görüşürüz', kanaOnly: 'じゃあね' }],
    category: 'yoon',
    row: 'sa'
  },
  {
    id: 'ju',
    hiragana: 'じゅ',
    katakana: 'ジュ',
    romaji: 'ju',
    trPronunciation: "Türkçe 'cu' sesi gibi okunur.",
    strokeCount: 5,
    mnemonic: "Ji + küçük yu = Ju (Cu)",
    sampleWords: [{ word: 'じゅう', romaji: 'juu', meaningTr: 'On (10)', kanaOnly: 'じゅう' }],
    category: 'yoon',
    row: 'sa'
  },
  {
    id: 'jo',
    hiragana: 'じょ',
    katakana: 'ジョ',
    romaji: 'jo',
    trPronunciation: "Türkçe 'co' sesi gibi okunur.",
    strokeCount: 5,
    mnemonic: "Ji + küçük yo = Jo (Co)",
    sampleWords: [{ word: 'じょせい', romaji: 'josei', meaningTr: 'Kadın', kanaOnly: 'じょせい' }],
    category: 'yoon',
    row: 'sa'
  }
];

export const GOJUON_ROW_LABELS: { row: string; label: string; desc: string }[] = [
  { row: 'a', label: 'A Sırası', desc: 'Sesliler (a, i, u, e, o)' },
  { row: 'ka', label: 'Ka Sırası', desc: 'K sessizi (ka, ki, ku, ke, ko)' },
  { row: 'sa', label: 'Sa Sırası', desc: 'S sessizi (sa, shi, su, se, so)' },
  { row: 'ta', label: 'Ta Sırası', desc: 'T sessizi (ta, chi, tsu, te, to)' },
  { row: 'na', label: 'Na Sırası', desc: 'N sessizi (na, ni, nu, ne, no)' },
  { row: 'ha', label: 'Ha Sırası', desc: 'H sessizi (ha, hi, fu, he, ho)' },
  { row: 'ma', label: 'Ma Sırası', desc: 'M sessizi (ma, mi, mu, me, mo)' },
  { row: 'ya', label: 'Ya Sırası', desc: 'Y sessizi (ya, yu, yo)' },
  { row: 'ra', label: 'Ra Sırası', desc: 'R/L sessizi (ra, ri, ru, re, ro)' },
  { row: 'wa', label: 'Wa / N', desc: 'W ve N sessizleri (wa, o, n)' }
];

/**
 * Deneme Sınavı havuzu için temel hiragana tanıma soruları (karakter → okunuş, 4 şık).
 * A/Ka/Sa sıralarındaki 15 temel karakterden üretilir; yanlış şıklar 3/6/9 kaydırmayla
 * havuzdaki diğer karakterlerden deterministik seçilir (aynı 15'lik döngüde çakışmaz).
 */
const FINAL_TEST_KANA_IDS = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'shi', 'su', 'se', 'so'];

export const JAPANESE_FINAL_TEST: FinalTestQuestion[] = FINAL_TEST_KANA_IDS.map((id, index) => {
  const chars = FINAL_TEST_KANA_IDS.map((cid) => KANA_DATA.find((k) => k.id === cid)!);
  const char = chars[index];
  const wrongOffsets = [3, 6, 9];
  const options = [
    char.romaji,
    ...wrongOffsets.map((offset) => chars[(index + offset) % chars.length].romaji)
  ];
  return {
    id: `final_${char.id}`,
    question: `「${char.hiragana}」karakterinin okunuşu (romaji) nedir?`,
    options,
    correctIndex: 0,
    explanation: char.trPronunciation,
    mode: 'recognition'
  };
});
