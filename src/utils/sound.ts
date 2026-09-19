/**
 * Professional Japanese Sound Controller
 * Tier 1: Authentic Native Human Audio Recordings (Real Studio Recordings of Japanese Kana)
 *         - Source: Verified native Japanese speaker sets (Female & Male)
 *         - Format: MP3 via ultra-fast global CDN
 * Tier 2: Real Google Japanese Voice TTS Stream
 * Tier 3: Browser Web Speech API (ja-JP)
 * Tier 4: Harmonic Melodic Web Audio Synthesizer fallback
 */

type SoundStateListener = (isSpeaking: boolean, text: string) => void;

// Comprehensive Kana & Romaji to Audio File mapping
const KANA_TO_ROMAJI: Record<string, string> = {
  // --- Vowels (A, I, U, E, O) ---
  'あ': 'a', 'ア': 'a', 'a': 'a',
  'い': 'i', 'イ': 'i', 'i': 'i',
  'う': 'u', 'ウ': 'u', 'u': 'u',
  'え': 'e', 'エ': 'e', 'e': 'e',
  'お': 'o', 'オ': 'o', 'o': 'o',

  // --- K-Row ---
  'か': 'ka', 'カ': 'ka', 'ka': 'ka',
  'き': 'ki', 'キ': 'ki', 'ki': 'ki',
  'く': 'ku', 'ク': 'ku', 'ku': 'ku',
  'け': 'ke', 'ケ': 'ke', 'ke': 'ke',
  'こ': 'ko', 'コ': 'ko', 'ko': 'ko',

  // --- S-Row ---
  'さ': 'sa', 'サ': 'sa', 'sa': 'sa',
  'し': 'shi', 'シ': 'shi', 'shi': 'shi', 'si': 'shi',
  'す': 'su', 'ス': 'su', 'su': 'su',
  'せ': 'se', 'セ': 'se', 'se': 'se',
  'そ': 'so', 'ソ': 'so', 'so': 'so',

  // --- T-Row ---
  'た': 'ta', 'タ': 'ta', 'ta': 'ta',
  'ち': 'chi', 'チ': 'chi', 'chi': 'chi', 'ti': 'chi',
  'つ': 'tsu', 'ツ': 'tsu', 'tsu': 'tsu', 'tu': 'tsu',
  'て': 'te', 'テ': 'te', 'te': 'te',
  'と': 'to', 'ト': 'to', 'to': 'to',

  // --- N-Row ---
  'な': 'na', 'ナ': 'na', 'na': 'na',
  'に': 'ni', 'ニ': 'ni', 'ni': 'ni',
  'ぬ': 'nu', 'ヌ': 'nu', 'nu': 'nu',
  'ね': 'ne', 'ネ': 'ne', 'ne': 'ne',
  'の': 'no', 'ノ': 'no', 'no': 'no',

  // --- H-Row ---
  'は': 'ha', 'ハ': 'ha', 'ha': 'ha',
  'ひ': 'hi', 'ヒ': 'hi', 'hi': 'hi',
  'ふ': 'fu', 'フ': 'fu', 'fu': 'fu', 'hu': 'fu',
  'へ': 'he', 'ヘ': 'he', 'he': 'he',
  'ほ': 'ho', 'ホ': 'ho', 'ho': 'ho',

  // --- M-Row ---
  'ま': 'ma', 'マ': 'ma', 'ma': 'ma',
  'み': 'mi', 'ミ': 'mi', 'mi': 'mi',
  'む': 'mu', 'ム': 'mu', 'mu': 'mu',
  'め': 'me', 'メ': 'me', 'me': 'me',
  'も': 'mo', 'モ': 'mo', 'mo': 'mo',

  // --- Y-Row ---
  'や': 'ya', 'ヤ': 'ya', 'ya': 'ya',
  'ゆ': 'yu', 'ユ': 'yu', 'yu': 'yu',
  'よ': 'yo', 'ヨ': 'yo', 'yo': 'yo',

  // --- R-Row ---
  'ら': 'ra', 'ラ': 'ra', 'ra': 'ra',
  'り': 'ri', 'リ': 'ri', 'ri': 'ri',
  'る': 'ru', 'ル': 'ru', 'ru': 'ru',
  'れ': 're', 'レ': 're', 're': 're',
  'ろ': 'ro', 'ロ': 'ro', 'ro': 'ro',

  // --- W & N-Row ---
  'わ': 'wa', 'ワ': 'wa', 'wa': 'wa',
  'を': 'wo', 'ヲ': 'wo', 'wo': 'wo',
  'ん': 'n', 'ン': 'n', 'n': 'n',

  // --- Dakuon (Tenten) ---
  'が': 'ga', 'ガ': 'ga', 'ga': 'ga',
  'ぎ': 'gi', 'ギ': 'gi', 'gi': 'gi',
  'ぐ': 'gu', 'グ': 'gu', 'gu': 'gu',
  'げ': 'ge', 'ゲ': 'ge', 'ge': 'ge',
  'ご': 'go', 'ゴ': 'go', 'go': 'go',

  'ざ': 'za', 'ザ': 'za', 'za': 'za',
  'じ': 'ji', 'ジ': 'ji', 'ji': 'ji', 'zi': 'ji',
  'ず': 'zu', 'ズ': 'zu', 'zu': 'zu',
  'ぜ': 'ze', 'ゼ': 'ze', 'ze': 'ze',
  'ぞ': 'zo', 'ゾ': 'zo', 'zo': 'zo',

  'だ': 'da', 'ダ': 'da', 'da': 'da',
  'ぢ': 'ji', 'ヂ': 'ji', 'di': 'ji',
  'づ': 'zu', 'ヅ': 'zu', 'du': 'zu',
  'で': 'de', 'デ': 'de', 'de': 'de',
  'ど': 'do', 'ド': 'do', 'do': 'do',

  'ば': 'ba', 'バ': 'ba', 'ba': 'ba',
  'び': 'bi', 'ビ': 'bi', 'bi': 'bi',
  'ぶ': 'bu', 'ブ': 'bu', 'bu': 'bu',
  'べ': 'be', 'ベ': 'be', 'be': 'be',
  'ぼ': 'bo', 'ボ': 'bo', 'bo': 'bo',

  // --- Handakuon (Maru) ---
  'ぱ': 'pa', 'パ': 'pa', 'pa': 'pa',
  'ぴ': 'pi', 'ピ': 'pi', 'pi': 'pi',
  'ぷ': 'pu', 'プ': 'pu', 'pu': 'pu',
  'ぺ': 'pe', 'ペ': 'pe', 'pe': 'pe',
  'ぽ': 'po', 'ポ': 'po', 'po': 'po',

  // --- Yoon (Bileşik Sesler) ---
  'きゃ': 'kya', 'キャ': 'kya', 'kya': 'kya',
  'きゅ': 'kyu', 'キュ': 'kyu', 'kyu': 'kyu',
  'きょ': 'kyo', 'キョ': 'kyo', 'kyo': 'kyo',
  'しゃ': 'sha', 'シャ': 'sha', 'sha': 'sha',
  'しゅ': 'shu', 'シュ': 'shu', 'shu': 'shu',
  'しょ': 'sho', 'ショ': 'sho', 'sho': 'sho',
  'ちゃ': 'cha', 'チャ': 'cha', 'cha': 'cha',
  'ちゅ': 'chu', 'チュ': 'chu', 'chu': 'chu',
  'ちょ': 'cho', 'チョ': 'cho', 'cho': 'cho',
  'にゃ': 'nya', 'ニャ': 'nya', 'nya': 'nya',
  'にゅ': 'nyu', 'ニュ': 'nyu', 'nyu': 'nyu',
  'にょ': 'nyo', 'ニョ': 'nyo', 'nyo': 'nyo',
  'ひゃ': 'hya', 'ヒャ': 'hya', 'hya': 'hya',
  'ひゅ': 'hyu', 'ヒュ': 'hyu', 'hyu': 'hyu',
  'ひょ': 'hyo', 'ヒョ': 'hyo', 'hyo': 'hyo',
  'みゃ': 'mya', 'ミャ': 'mya', 'mya': 'mya',
  'みゅ': 'myu', 'ミュ': 'myu', 'myu': 'myu',
  'みょ': 'myo', 'ミョ': 'myo', 'myo': 'myo',
  'りゃ': 'rya', 'リャ': 'rya', 'rya': 'rya',
  'りゅ': 'ryu', 'リュ': 'ryu', 'ryu': 'ryu',
  'りょ': 'ryo', 'リョ': 'ryo', 'ryo': 'ryo',
  'ぎゃ': 'gya', 'ギャ': 'gya', 'gya': 'gya',
  'ぎゅ': 'gyu', 'ギュ': 'gyu', 'gyu': 'gyu',
  'ぎょ': 'gyo', 'ギョ': 'gyo', 'gyo': 'gyo',
  'じゃ': 'ja', 'ジャ': 'ja', 'ja': 'ja',
  'じゅ': 'ju', 'ジュ': 'ju', 'ju': 'ju',
  'じょ': 'jo', 'ジョ': 'jo', 'jo': 'jo',
  'びゃ': 'bya', 'ビャ': 'bya', 'bya': 'bya',
  'びゅ': 'byu', 'ビュ': 'byu', 'byu': 'byu',
  'びょ': 'byo', 'ビョ': 'byo', 'byo': 'byo',
  'ぴゃ': 'pya', 'ピャ': 'pya', 'pya': 'pya',
  'ぴゅ': 'pyu', 'ピュ': 'pyu', 'pyu': 'pyu',
  'ぴょ': 'pyo', 'ピョ': 'pyo', 'pyo': 'pyo',
};

class SoundController {
  private audioCtx: AudioContext | null = null;
  private jaVoice: SpeechSynthesisVoice | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private listeners: Set<SoundStateListener> = new Set();
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  public isSpeaking = false;
  public currentlyPlayingText = '';
  public speakerSet: '0' | '1' = '0'; // 0: Native Female, 1: Native Male

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadVoices();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  public setSpeaker(speaker: '0' | '1') {
    this.speakerSet = speaker;
  }

  public addListener(listener: SoundStateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(isSpeaking: boolean, text: string) {
    this.isSpeaking = isSpeaking;
    this.currentlyPlayingText = isSpeaking ? text : '';
    this.listeners.forEach((l) => l(isSpeaking, text));
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        this.jaVoice =
          voices.find(
            (v) =>
              v.lang.toLowerCase() === 'ja-jp' ||
              v.lang.toLowerCase() === 'ja_jp' ||
              v.lang.toLowerCase().startsWith('ja') ||
              v.name.toLowerCase().includes('japan')
          ) || null;
      }
    } catch {
      // Ignore
    }
  }

  public getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    } catch {
      // Ignore
    }
    return this.audioCtx;
  }

  /**
   * Main pronunciation trigger:
   * Prioritizes REAL NATIVE HUMAN AUDIO RECORDINGS for all Japanese Kana characters!
   */
  public async speak(text: string, rate: number = 0.85): Promise<void> {
    if (!text || typeof window === 'undefined') return;

    this.getAudioContext();
    this.notify(true, text);

    // Stop any existing sound
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {}
      this.currentAudioElement = null;
    }

    const clean = text.trim();
    const romajiKey = KANA_TO_ROMAJI[clean] || KANA_TO_ROMAJI[clean.toLowerCase()];

    // Tier 1: Real Native Human Recording if it's a Kana
    if (romajiKey) {
      const nativeSuccess = await this.tryNativeHumanAudio(romajiKey);
      if (nativeSuccess) {
        this.notify(false, text);
        return;
      }
    }

    // Tier 2: Real Google Japanese TTS Stream (ideal for multi-character words)
    const onlineSuccess = await this.tryOnlineTTS(clean);
    if (onlineSuccess) {
      this.notify(false, text);
      return;
    }

    // Tier 3: Web Speech API (with ja-JP voice)
    const speechSuccess = await this.trySpeechSynthesis(clean, rate);
    if (speechSuccess) {
      this.notify(false, text);
      return;
    }

    // Tier 4: Harmonic Melodic Chime Fallback
    this.playJapaneseFormantTone(clean);
    this.notify(false, text);
  }

  /**
   * Directly plays the real recorded human native audio file
   */
  private tryNativeHumanAudio(romaji: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const primaryUrl = `https://cdn.jsdelivr.net/gh/Kuuuube/kana-quiz-sounds/audio/${this.speakerSet}/${romaji}.mp3`;
        const fallbackUrl = `https://raw.githubusercontent.com/Kuuuube/kana-quiz-sounds/master/audio/${this.speakerSet}/${romaji}.mp3`;

        const audio = new Audio(primaryUrl);
        audio.preload = 'auto';
        this.currentAudioElement = audio;

        let resolved = false;

        const onEnd = () => {
          if (!resolved) {
            resolved = true;
            this.currentAudioElement = null;
            resolve(true);
          }
        };

        audio.onended = onEnd;

        audio.onerror = () => {
          // Try raw github fallback
          const backupAudio = new Audio(fallbackUrl);
          this.currentAudioElement = backupAudio;

          backupAudio.onended = onEnd;
          backupAudio.onerror = () => {
            if (!resolved) {
              resolved = true;
              this.currentAudioElement = null;
              resolve(false);
            }
          };

          backupAudio.play().catch(() => {
            if (!resolved) {
              resolved = true;
              this.currentAudioElement = null;
              resolve(false);
            }
          });
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Audio play failed or blocked, fallback
            if (!resolved) {
              resolved = true;
              this.currentAudioElement = null;
              resolve(false);
            }
          });
        }

        // Safety timeout
        setTimeout(() => {
          if (!resolved && !audio.paused && !audio.ended) {
            // Still playing normally
          } else if (!resolved) {
            resolved = true;
            this.currentAudioElement = null;
            resolve(false);
          }
        }, 3500);
      } catch {
        resolve(false);
      }
    });
  }

  private tryOnlineTTS(text: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const encoded = encodeURIComponent(text);
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encoded}`;
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.currentAudioElement = audio;

        let resolved = false;

        audio.onended = () => {
          if (!resolved) {
            resolved = true;
            this.currentAudioElement = null;
            resolve(true);
          }
        };

        audio.onerror = () => {
          if (!resolved) {
            resolved = true;
            this.currentAudioElement = null;
            resolve(false);
          }
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (!resolved) {
              resolved = true;
              this.currentAudioElement = null;
              resolve(false);
            }
          });
        }

        // Timeout
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            this.currentAudioElement = null;
            resolve(false);
          }
        }, 3000);
      } catch {
        resolve(false);
      }
    });
  }

  private trySpeechSynthesis(text: string, rate: number): Promise<boolean> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        return resolve(false);
      }

      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();
        this.loadVoices();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = rate;
        utterance.pitch = 1.0;

        if (this.jaVoice) {
          utterance.voice = this.jaVoice;
        }

        let started = false;
        let finished = false;

        const timer = setTimeout(() => {
          if (!started && !finished) {
            finished = true;
            resolve(false);
          }
        }, 800);

        utterance.onstart = () => {
          started = true;
          clearTimeout(timer);
        };

        utterance.onend = () => {
          finished = true;
          clearTimeout(timer);
          resolve(true);
        };

        utterance.onerror = () => {
          finished = true;
          clearTimeout(timer);
          resolve(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Sound effect for correct answers (uplifting major triad chime)
   */
  public playSuccessTone() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.0001, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.18, now + i * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } catch {}
  }

  public playCorrectSound() {
    this.playSuccessTone();
  }

  public playIncorrectSound() {
    this.playErrorTone();
  }

  public playFlipSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  /**
   * Sound effect for incorrect answers (gentle reminder chime)
   */
  public playErrorTone() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [329.63, 311.13]; // E4 -> Eb4
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.14);

        gain.gain.setValueAtTime(0.0001, now + i * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.14, now + i * 0.14 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.14 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.14);
        osc.stop(now + i * 0.14 + 0.3);
      });
    } catch {}
  }

  /**
   * Elegant Japanese Koto-inspired harmonic tone for offline fallback
   */
  public playJapaneseFormantTone(text: string) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const kotoScale = [261.63, 293.66, 311.13, 392.0, 415.3, 523.25];
      const baseFreq = kotoScale[hash % kotoScale.length];

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  }
}

export const soundManager = new SoundController();
