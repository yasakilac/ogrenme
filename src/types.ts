export type KanaCategory = 'seion' | 'dakuon' | 'handakuon' | 'yoon';

export type AlphabetType = 'hiragana' | 'katakana';

export interface SampleWord {
  word: string;
  romaji: string;
  meaningTr: string;
  kanaOnly: string;
}

export interface KanaCharacter {
  id: string; // e.g. "a", "ka", "kya", etc.
  hiragana: string;
  katakana: string;
  romaji: string;
  trPronunciation: string;
  strokeCount: number;
  strokeDirections?: string[];
  mnemonic: string;
  sampleWords: SampleWord[];
  category: KanaCategory;
  row: string; // e.g. 'a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'
  audioRomaji?: string; // For text-to-speech if special
}

export interface CharacterProgress {
  masteryLevel: 0 | 1 | 2 | 3; // 0: Henüz Başlanmadı, 1: Öğreniliyor, 2: İyi, 3: Ustalaşıldı
  correctAnswers: number;
  incorrectAnswers: number;
  lastStudiedAt: number;
}

export interface UserProgressData {
  characters: Record<string, CharacterProgress>; // key: `${alphabet}_${kanaId}`
  stats: {
    totalQuizzesCompleted: number;
    totalQuizQuestions: number;
    correctQuizQuestions: number;
    cardsFlipped: number;
    strokeDrawingsCompleted: number;
    streakDays: number;
    lastActiveDate: string; // YYYY-MM-DD
  };
}

export interface PracticeWord {
  id: string;
  kana: string; // e.g. "あめ"
  romaji: string; // e.g. "ame"
  meaningTr: string; // e.g. "Yağmur"
  targetKana: string; // e.g. "あ"
  targetRomaji: string; // e.g. "a"
  imageUrl: string; // high-quality image URL
  alphabet: AlphabetType;
  hint: string;
  category: string;
}

export interface TopicLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  row: string;
  kanaIds: string[];
  descriptionTr: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: 'student' | 'admin';
  createdAt: string;
  lastActiveAt: string;
  currentTopicId?: string;
  lastStudiedKanaId?: string;
}

export type ActiveTab = 'home' | 'table' | 'practice' | 'drawing' | 'visual_words' | 'flashcards' | 'quiz' | 'guide' | 'admin' | 'dashboard';
