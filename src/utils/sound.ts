/**
 * Professional Japanese Sound Controller
 * 100% AUTHENTIC NATIVE HUMAN AUDIO RECORDINGS (Zero Mechanical TTS)
 * 
 * - Source: Real Japanese native speaker studio recordings (Female & Male Tokyo accents)
 * - Single letters (Kana): Direct high-fidelity human MP3 playback
 * - Multi-character words: Sequential morae playback in the EXACT SAME native speaker's voice
 * - Preloaded audio caching for zero-latency instant response
 * - Active mora/syllable synchronization callbacks for visual highlight
 */

export type SoundStateListener = (isSpeaking: boolean, text: string, currentMora?: string, moraIndex?: number) => void;

// Comprehensive Kana to Romaji Audio mapping
export const KANA_TO_ROMAJI: Record<string, string> = {
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

/**
 * Splits Japanese text into individual phonetic morae (syllables).
 * Takes compound yoon sounds (e.g. きゃ, しゅ, ちょ) as a single mora unit.
 */
export function splitKanaIntoMorae(text: string): string[] {
  if (!text) return [];
  const morae: string[] = [];
  const smallKana = new Set([
    'ゃ', 'ゅ', 'ょ', 'ゎ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ',
    'ャ', 'ュ', 'ョ', 'ヮ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ'
  ]);

  const chars = Array.from(text.trim());
  let i = 0;
  while (i < chars.length) {
    const char = chars[i];
    // Check if next character is a small kana (Yoon compound)
    if (i + 1 < chars.length && smallKana.has(chars[i + 1])) {
      morae.push(char + chars[i + 1]);
      i += 2;
    } else {
      morae.push(char);
      i += 1;
    }
  }
  return morae;
}

class SoundController {
  private audioCtx: AudioContext | null = null;
  private listeners: Set<SoundStateListener> = new Set();
  private audioPool: Map<string, HTMLAudioElement> = new Map();
  private playbackToken = 0;

  public isSpeaking = false;
  public currentlyPlayingText = '';
  public activeMoraIndex = -1;
  public speakerSet: '0' | '1' = '0'; // 0: Native Tokyo Female, 1: Native Tokyo Male

  constructor() {
    if (typeof window !== 'undefined') {
      // Preload the most frequent 5 vowels
      ['a', 'i', 'u', 'e', 'o'].forEach((v) => {
        this.getOrCreateAudio(v);
      });
    }
  }

  public setSpeaker(speaker: '0' | '1') {
    if (this.speakerSet !== speaker) {
      this.speakerSet = speaker;
      this.stopAllAudio();
      this.audioPool.clear(); // Flush cache to reload with new speaker
    }
  }

  public addListener(listener: SoundStateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(isSpeaking: boolean, text: string, currentMora?: string, moraIndex?: number) {
    this.isSpeaking = isSpeaking;
    this.currentlyPlayingText = isSpeaking ? text : '';
    this.activeMoraIndex = moraIndex ?? -1;
    this.listeners.forEach((l) => l(isSpeaking, text, currentMora, moraIndex));
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
   * Stops all active audio elements and cancels ongoing sequential word playback
   */
  public stopAllAudio() {
    this.playbackToken++;
    this.audioPool.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {}
    });
    this.notify(false, '');
  }

  /**
   * Retrieves or creates an HTMLAudioElement for a given romaji key
   */
  private getOrCreateAudio(romaji: string): HTMLAudioElement {
    const key = `${this.speakerSet}_${romaji}`;
    let audio = this.audioPool.get(key);
    if (!audio) {
      const primaryUrl = `https://cdn.jsdelivr.net/gh/Kuuuube/kana-quiz-sounds/audio/${this.speakerSet}/${romaji}.mp3`;
      audio = new Audio(primaryUrl);
      audio.preload = 'auto';
      this.audioPool.set(key, audio);
    }
    return audio;
  }

  /**
   * Plays a single mora (e.g. 'a', 'ka', 'ne') in the native human studio recording.
   */
  public playSingleMoraAudio(romaji: string, token?: number): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const myToken = token ?? ++this.playbackToken;
        const key = `${this.speakerSet}_${romaji}`;
        const primaryUrl = `https://cdn.jsdelivr.net/gh/Kuuuube/kana-quiz-sounds/audio/${this.speakerSet}/${romaji}.mp3`;
        const fallbackUrl = `https://raw.githubusercontent.com/Kuuuube/kana-quiz-sounds/master/audio/${this.speakerSet}/${romaji}.mp3`;

        const audio = this.getOrCreateAudio(romaji);
        let resolved = false;

        const done = (success: boolean) => {
          if (!resolved) {
            resolved = true;
            resolve(success);
          }
        };

        if (token !== undefined && this.playbackToken !== myToken) {
          done(false);
          return;
        }

        try {
          audio.currentTime = 0;
        } catch {}

        audio.onended = () => done(true);

        audio.onerror = () => {
          // Backup URL from raw github
          const backup = new Audio(fallbackUrl);
          backup.onended = () => done(true);
          backup.onerror = () => done(false);
          backup.play().catch(() => done(false));
        };

        // Safety fallback timer (standard mora length is ~350-500ms)
        const safetyTimer = setTimeout(() => done(true), 650);

        const p = audio.play();
        if (p) {
          p.catch(() => {
            clearTimeout(safetyTimer);
            done(false);
          });
        }
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Plays a multi-mora word (e.g. "あめ", "ねこ", "さかな", "すし") by seamlessly
   * playing each syllable in the EXACT SAME native human voice from the kana table.
   * 
   * @param word Japanese kana word string
   * @param onMoraChange Optional callback invoked when each syllable begins playing
   */
  public async playWordInNativeVoice(
    word: string,
    onMoraChange?: (mora: string, index: number) => void
  ): Promise<boolean> {
    this.stopAllAudio();
    const clean = word.trim();
    const morae = splitKanaIntoMorae(clean);

    if (morae.length === 0) return false;

    // If it's a single kana, play directly
    if (morae.length === 1) {
      return this.speakSingleLetter(morae[0]);
    }

    const currentToken = ++this.playbackToken;
    this.notify(true, clean, morae[0], 0);

    try {
      for (let i = 0; i < morae.length; i++) {
        if (this.playbackToken !== currentToken) {
          break; // Cancelled by another audio request
        }

        const mora = morae[i];
        this.notify(true, clean, mora, i);
        if (onMoraChange) {
          onMoraChange(mora, i);
        }

        // Sokuon (っ / ッ) or space: natural 140ms silent glottal stop
        if (mora === 'っ' || mora === 'ッ' || mora === ' ') {
          await new Promise((r) => setTimeout(r, 140));
          continue;
        }

        // Chōon (ー): vowel extension pause
        if (mora === 'ー') {
          await new Promise((r) => setTimeout(r, 180));
          continue;
        }

        const romaji = KANA_TO_ROMAJI[mora] || KANA_TO_ROMAJI[mora.toLowerCase()];
        if (romaji) {
          await this.playSingleMoraAudio(romaji, currentToken);
          // Natural inter-mora rhythm interval (50ms) for fluent Japanese tempo
          if (i < morae.length - 1 && this.playbackToken === currentToken) {
            await new Promise((r) => setTimeout(r, 55));
          }
        }
      }
      return true;
    } catch {
      return false;
    } finally {
      if (this.playbackToken === currentToken) {
        this.notify(false, clean, '', -1);
        if (onMoraChange) {
          onMoraChange('', -1);
        }
      }
    }
  }

  /**
   * Plays a single kana letter in the authentic native speaker's voice.
   */
  public async speakSingleLetter(letter: string): Promise<boolean> {
    this.stopAllAudio();
    const clean = letter.trim();
    const romaji = KANA_TO_ROMAJI[clean] || KANA_TO_ROMAJI[clean.toLowerCase()];

    if (!romaji) {
      // If it's a multi-character compound, try word player
      return this.playWordInNativeVoice(clean);
    }

    const currentToken = ++this.playbackToken;
    this.notify(true, clean, clean, 0);

    const success = await this.playSingleMoraAudio(romaji, currentToken);
    if (this.playbackToken === currentToken) {
      this.notify(false, clean);
    }
    return success;
  }

  /**
   * Main universal speak method:
   * 100% human voice - if it's 1 kana, plays that kana's recording.
   * If it's a multi-character word, decomposes into morae and plays all
   * syllables in that EXACT SAME PERSON'S VOICE!
   */
  public async speak(text: string): Promise<void> {
    if (!text) return;
    const clean = text.trim();
    const directRomaji = KANA_TO_ROMAJI[clean] || KANA_TO_ROMAJI[clean.toLowerCase()];

    if (directRomaji) {
      await this.speakSingleLetter(clean);
    } else {
      await this.playWordInNativeVoice(clean);
    }
  }

  /**
   * Plays the target red letter first, pauses slightly, then plays the full word.
   * Perfect for connecting letter recognition with vocabulary memory!
   */
  public async playLetterThenWord(letter: string, word: string): Promise<void> {
    this.stopAllAudio();
    const currentToken = ++this.playbackToken;

    // Step 1: Play target letter
    await this.speakSingleLetter(letter);

    // Natural 280ms pause
    if (this.playbackToken !== currentToken) return;
    await new Promise((r) => setTimeout(r, 280));

    // Step 2: Play full word in that same person's voice
    if (this.playbackToken !== currentToken) return;
    await this.playWordInNativeVoice(word);
  }

  // Backward-compatible tone helpers for exercises & flips
  public playSuccessTone() {
    this.playCorrectSound();
  }

  public playCorrectSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.0001, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.16, now + i * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.32);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    } catch {}
  }

  public playErrorTone() {
    this.playIncorrectSound();
  }

  public playIncorrectSound() {
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
        gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.14 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.14 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.14);
        osc.stop(now + i * 0.14 + 0.28);
      });
    } catch {}
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
}

export const soundManager = new SoundController();
