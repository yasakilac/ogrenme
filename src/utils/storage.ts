import { UserProgressData, AlphabetType, UserProfile, PracticeWord } from '../types';

/** Jenerik localStorage yardımcıları — modüllerin kendi ilerleme verisini tutması için. */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error);
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
}

const PROGRESS_PREFIX = 'nihongo_kana_progress_user_';
const PROFILES_KEY = 'nihongo_kana_profiles_v2';
const ACTIVE_USER_KEY = 'nihongo_kana_active_user_v2';
const CUSTOM_WORDS_KEY = 'nihongo_kana_custom_words_v2';
const LAST_STUDIED_KEY = 'nihongo_kana_last_studied_v2';

export interface LastStudiedState {
  topicId: string;
  kanaId: string;
  alphabet: AlphabetType;
  updatedAt: number;
}

export const getInitialProgress = (): UserProgressData => {
  const today = new Date().toISOString().split('T')[0];
  return {
    characters: {},
    stats: {
      totalQuizzesCompleted: 0,
      totalQuizQuestions: 0,
      correctQuizQuestions: 0,
      cardsFlipped: 0,
      strokeDrawingsCompleted: 0,
      streakDays: 1,
      lastActiveDate: today
    }
  };
};

const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'user_default',
    name: 'Öğrenci',
    avatar: '🌸',
    role: 'student',
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    currentTopicId: 'topic_vowels',
    lastStudiedKanaId: 'a'
  },
  {
    id: 'user_admin',
    name: 'İlyas (Yönetici)',
    avatar: '⛩️',
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    currentTopicId: 'topic_vowels',
    lastStudiedKanaId: 'a'
  }
];

// --- Profile & User Management ---

export const loadProfiles = (): UserProfile[] => {
  if (typeof window === 'undefined') return DEFAULT_PROFILES;
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) {
      saveProfiles(DEFAULT_PROFILES);
      return DEFAULT_PROFILES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROFILES;
  }
};

export const saveProfiles = (profiles: UserProfile[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save profiles', e);
  }
};

export const getActiveUserId = (): string => {
  if (typeof window === 'undefined') return 'user_default';
  try {
    const active = localStorage.getItem(ACTIVE_USER_KEY);
    if (active) return active;
    localStorage.setItem(ACTIVE_USER_KEY, 'user_default');
    return 'user_default';
  } catch {
    return 'user_default';
  }
};

export const setActiveUserId = (userId: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_USER_KEY, userId);
  } catch (e) {
    console.error('Failed to set active user', e);
  }
};

export const createProfile = (name: string, avatar: string, role: 'student' | 'admin' = 'student'): UserProfile => {
  const profiles = loadProfiles();
  const newProfile: UserProfile = {
    id: `user_${Date.now()}`,
    name: name.trim() || 'Yeni Öğrenci',
    avatar: avatar || '🎌',
    role,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    currentTopicId: 'topic_vowels',
    lastStudiedKanaId: 'a'
  };
  profiles.push(newProfile);
  saveProfiles(profiles);
  setActiveUserId(newProfile.id);
  return newProfile;
};

export const deleteProfile = (userId: string): void => {
  const profiles = loadProfiles().filter((p) => p.id !== userId);
  if (profiles.length === 0) {
    saveProfiles(DEFAULT_PROFILES);
    setActiveUserId('user_default');
    return;
  }
  saveProfiles(profiles);
  if (getActiveUserId() === userId) {
    setActiveUserId(profiles[0].id);
  }
};

// --- Progress Loading & Saving per User ---

export const loadProgress = (userId?: string): UserProgressData => {
  if (typeof window === 'undefined') return getInitialProgress();
  const uid = userId || getActiveUserId();
  const storageKey = `${PROGRESS_PREFIX}${uid}`;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      // Legacy fallback
      const oldRaw = localStorage.getItem('nihongo_kana_progress_v1');
      if (oldRaw && uid === 'user_default') {
        const parsed = JSON.parse(oldRaw);
        saveProgress(parsed, uid);
        return parsed;
      }
      return getInitialProgress();
    }
    const data: UserProgressData = JSON.parse(raw);

    // Check streak
    const today = new Date().toISOString().split('T')[0];
    if (data.stats.lastActiveDate !== today) {
      const lastDate = new Date(data.stats.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        data.stats.streakDays += 1;
      } else if (diffDays > 1) {
        data.stats.streakDays = 1;
      }
      data.stats.lastActiveDate = today;
      saveProgress(data, uid);
    }
    return data;
  } catch (e) {
    console.error('Failed to load progress', e);
    return getInitialProgress();
  }
};

export const saveProgress = (data: UserProgressData, userId?: string): void => {
  if (typeof window === 'undefined') return;
  const uid = userId || getActiveUserId();
  const storageKey = `${PROGRESS_PREFIX}${uid}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
};

export const recordCharacterAnswer = (
  progress: UserProgressData,
  alphabet: AlphabetType,
  kanaId: string,
  isCorrect: boolean,
  userId?: string
): UserProgressData => {
  const key = `${alphabet}_${kanaId}`;
  const existing = progress.characters[key] || {
    masteryLevel: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    lastStudiedAt: Date.now()
  };

  const newCorrect = existing.correctAnswers + (isCorrect ? 1 : 0);
  const newIncorrect = existing.incorrectAnswers + (isCorrect ? 0 : 1);

  let newLevel = existing.masteryLevel;
  const total = newCorrect + newIncorrect;
  const ratio = total > 0 ? newCorrect / total : 0;

  if (newCorrect >= 5 && ratio >= 0.8) {
    newLevel = 3;
  } else if (newCorrect >= 3 && ratio >= 0.65) {
    newLevel = 2;
  } else if (newCorrect >= 1) {
    newLevel = 1;
  } else {
    newLevel = 0;
  }

  const updated: UserProgressData = {
    ...progress,
    characters: {
      ...progress.characters,
      [key]: {
        masteryLevel: newLevel,
        correctAnswers: newCorrect,
        incorrectAnswers: newIncorrect,
        lastStudiedAt: Date.now()
      }
    },
    stats: {
      ...progress.stats,
      totalQuizQuestions: progress.stats.totalQuizQuestions + 1,
      correctQuizQuestions: progress.stats.correctQuizQuestions + (isCorrect ? 1 : 0)
    }
  };

  saveProgress(updated, userId);
  return updated;
};

export const setDirectMastery = (
  progress: UserProgressData,
  alphabet: AlphabetType,
  kanaId: string,
  level: 0 | 1 | 2 | 3,
  userId?: string
): UserProgressData => {
  const key = `${alphabet}_${kanaId}`;
  const existing = progress.characters[key] || {
    masteryLevel: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    lastStudiedAt: Date.now()
  };

  const updated: UserProgressData = {
    ...progress,
    characters: {
      ...progress.characters,
      [key]: {
        ...existing,
        masteryLevel: level,
        lastStudiedAt: Date.now()
      }
    }
  };

  saveProgress(updated, userId);
  return updated;
};

export const incrementCardFlip = (progress: UserProgressData, userId?: string): UserProgressData => {
  const updated: UserProgressData = {
    ...progress,
    stats: {
      ...progress.stats,
      cardsFlipped: progress.stats.cardsFlipped + 1
    }
  };
  saveProgress(updated, userId);
  return updated;
};

export const incrementDrawingPractice = (progress: UserProgressData, userId?: string): UserProgressData => {
  const updated: UserProgressData = {
    ...progress,
    stats: {
      ...progress.stats,
      strokeDrawingsCompleted: progress.stats.strokeDrawingsCompleted + 1
    }
  };
  saveProgress(updated, userId);
  return updated;
};

export const completeQuizSession = (progress: UserProgressData, userId?: string): UserProgressData => {
  const updated: UserProgressData = {
    ...progress,
    stats: {
      ...progress.stats,
      totalQuizzesCompleted: progress.stats.totalQuizzesCompleted + 1
    }
  };
  saveProgress(updated, userId);
  return updated;
};

export const resetProgressData = (userId?: string): UserProgressData => {
  const initial = getInitialProgress();
  saveProgress(initial, userId);
  return initial;
};

// --- Last Studied Position Tracking ---

export const loadLastStudied = (): LastStudiedState => {
  if (typeof window === 'undefined') {
    return { topicId: 'topic_vowels', kanaId: 'a', alphabet: 'hiragana', updatedAt: Date.now() };
  }
  try {
    const raw = localStorage.getItem(LAST_STUDIED_KEY);
    if (!raw) {
      return { topicId: 'topic_vowels', kanaId: 'a', alphabet: 'hiragana', updatedAt: Date.now() };
    }
    return JSON.parse(raw);
  } catch {
    return { topicId: 'topic_vowels', kanaId: 'a', alphabet: 'hiragana', updatedAt: Date.now() };
  }
};

export const saveLastStudied = (topicId: string, kanaId: string, alphabet: AlphabetType): void => {
  if (typeof window === 'undefined') return;
  try {
    const state: LastStudiedState = {
      topicId,
      kanaId,
      alphabet,
      updatedAt: Date.now()
    };
    localStorage.setItem(LAST_STUDIED_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save last studied position', e);
  }
};

// --- Custom Practice Words (Admin Feature) ---

export const loadCustomWords = (): PracticeWord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_WORDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCustomWord = (word: PracticeWord): PracticeWord[] => {
  const words = loadCustomWords();
  const index = words.findIndex((w) => w.id === word.id);
  if (index >= 0) {
    words[index] = word;
  } else {
    words.push(word);
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(words));
  }
  return words;
};

export const deleteCustomWord = (wordId: string): PracticeWord[] => {
  const words = loadCustomWords().filter((w) => w.id !== wordId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(words));
  }
  return words;
};

// --- Export / Import Full Application Data ---

export const exportAllAppData = (): string => {
  const profiles = loadProfiles();
  const activeUserId = getActiveUserId();
  const customWords = loadCustomWords();
  const lastStudied = loadLastStudied();

  const allProgress: Record<string, UserProgressData> = {};
  profiles.forEach((p) => {
    allProgress[p.id] = loadProgress(p.id);
  });

  const payload = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    profiles,
    activeUserId,
    customWords,
    lastStudied,
    allProgress
  };

  return JSON.stringify(payload, null, 2);
};

export const importAllAppData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (!data.profiles || !Array.isArray(data.profiles)) {
      throw new Error('Geçersiz veri formatı');
    }

    saveProfiles(data.profiles);
    if (data.activeUserId) setActiveUserId(data.activeUserId);
    if (data.customWords && Array.isArray(data.customWords)) {
      localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(data.customWords));
    }
    if (data.lastStudied) {
      localStorage.setItem(LAST_STUDIED_KEY, JSON.stringify(data.lastStudied));
    }
    if (data.allProgress) {
      Object.entries(data.allProgress).forEach(([uid, prog]) => {
        saveProgress(prog as UserProgressData, uid);
      });
    }
    return true;
  } catch (e) {
    console.error('Import error', e);
    return false;
  }
};
