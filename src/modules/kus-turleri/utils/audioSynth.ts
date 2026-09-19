// Web Audio API Synthesizer for 10 Turkish Bird Species

class BirdAudioSynth {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playBirdCall(birdId: string): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      switch (birdId) {
        case 'flamingo':
          this.playFlamingo(ctx, now);
          break;
        case 'ibibik':
          this.playIbibik(ctx, now);
          break;
        case 'sah-kartal':
          this.playSahKartal(ctx, now);
          break;
        case 'yalicapkini':
          this.playYalicapkini(ctx, now);
          break;
        case 'ebabil':
          this.playEbabil(ctx, now);
          break;
        case 'kelaynak':
          this.playKelaynak(ctx, now);
          break;
        case 'kizilgerdan':
          this.playKizilgerdan(ctx, now);
          break;
        case 'ak-pelikan':
          this.playAkPelikan(ctx, now);
          break;
        case 'gokdogan':
          this.playGokdogan(ctx, now);
          break;
        case 'turac':
          this.playTurac(ctx, now);
          break;
        default:
          this.playChirp(ctx, now);
      }
    } catch (err) {
      console.warn('Audio synthesis error:', err);
    }
  }

  // Flamingo: Nazal, kazımsı ritmik "Ka-hank! Ka-hank!"
  private playFlamingo(ctx: AudioContext, now: number): void {
    [0, 0.35, 0.8].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now + offset);
      osc.frequency.linearRampToValueAtTime(450, now + offset + 0.08);
      osc.frequency.exponentialRampToValueAtTime(280, now + offset + 0.22);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now + offset);
      filter.Q.setValueAtTime(3, now + offset);

      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.linearRampToValueAtTime(0.3, now + offset + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.26);
    });
  }

  // İbibik: Meşhur boğuk ve yankılı "Hup-hup-hup"
  private playIbibik(ctx: AudioContext, now: number): void {
    [0, 0.28, 0.56].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now + offset);
      osc.frequency.exponentialRampToValueAtTime(430, now + offset + 0.18);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, now + offset);

      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.linearRampToValueAtTime(0.35, now + offset + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.22);
    });
  }

  // Şah Kartal: Yüksek frekanslı, görkemli yırtıcı çığlığı "Kiyeeeer-kyok"
  private playSahKartal(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc2.type = 'triangle';

    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(2600, now + 0.2);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.7);

    osc2.frequency.setValueAtTime(1420, now);
    osc2.frequency.exponentialRampToValueAtTime(2650, now + 0.2);
    osc2.frequency.exponentialRampToValueAtTime(1120, now + 0.7);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.8);
    osc2.stop(now + 0.8);
  }

  // Yalıçapkını: Su üzerinde hızla uçarken çınlayan tiz "Tsiiii-tsik!"
  private playYalicapkini(ctx: AudioContext, now: number): void {
    [0, 0.15, 0.3].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(4200, now + offset);
      osc.frequency.linearRampToValueAtTime(5600, now + offset + 0.05);
      osc.frequency.exponentialRampToValueAtTime(4500, now + offset + 0.1);

      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.linearRampToValueAtTime(0.25, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.11);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.12);
    });
  }

  // Ebabil: Havada süzülen çığlık sürüsü "Sriiiiii-sriiiiii"
  private playEbabil(ctx: AudioContext, now: number): void {
    [0, 0.4].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(3800, now + offset);
      osc.frequency.linearRampToValueAtTime(4400, now + offset + 0.15);
      osc.frequency.exponentialRampToValueAtTime(3600, now + offset + 0.32);

      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.linearRampToValueAtTime(0.18, now + offset + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.36);
    });
  }

  // Kelaynak: Boğazdan gelen gırtlaksı "Kraupp-kraupp"
  private playKelaynak(ctx: AudioContext, now: number): void {
    [0, 0.3].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'square';
      osc.frequency.setValueAtTime(380, now + offset);
      osc.frequency.exponentialRampToValueAtTime(260, now + offset + 0.2);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(550, now + offset);
      filter.Q.setValueAtTime(4, now + offset);

      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.linearRampToValueAtTime(0.28, now + offset + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.25);
    });
  }

  // Kızıl Gerdan: Melodik şakıma, tatlı triller "Tii-rü-rü-li-lii"
  private playKizilgerdan(ctx: AudioContext, now: number): void {
    const notes = [
      { f: 3100, t: 0.08 },
      { f: 4200, t: 0.1 },
      { f: 3600, t: 0.09 },
      { f: 4900, t: 0.12 },
      { f: 4400, t: 0.15 },
      { f: 5200, t: 0.2 }
    ];

    let current = now;
    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, current);
      osc.frequency.exponentialRampToValueAtTime(note.f * 1.08, current + note.t * 0.5);

      gain.gain.setValueAtTime(0.001, current);
      gain.gain.linearRampToValueAtTime(0.25, current + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, current + note.t);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(current);
      osc.stop(current + note.t + 0.01);
      current += note.t + 0.03;
    });
  }

  // Ak Pelikan: Derin gaga çarpma ve göğüs sesi "Klok-klok-grrr"
  private playAkPelikan(ctx: AudioContext, now: number): void {
    [0, 0.15, 0.3, 0.45].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now + offset);
      osc.frequency.exponentialRampToValueAtTime(90, now + offset + 0.08);

      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.linearRampToValueAtTime(0.4, now + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.11);
    });
  }

  // Gökdoğan: Seri ve keskin saldırı kahkahası "Kek-kek-kek-kek!"
  private playGokdogan(ctx: AudioContext, now: number): void {
    [0, 0.12, 0.24, 0.36, 0.48].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2200, now + offset);
      osc.frequency.exponentialRampToValueAtTime(1700, now + offset + 0.07);

      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.linearRampToValueAtTime(0.28, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.1);
    });
  }

  // Turaç: Çukurova'nın meşhur ritmik çağrısı "Klık-klık-kvee-çrr"
  private playTurac(ctx: AudioContext, now: number): void {
    // Tıkırtı
    [0, 0.1].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now + offset);
      osc.frequency.exponentialRampToValueAtTime(200, now + offset + 0.04);
      gain.gain.setValueAtTime(0.3, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.06);
    });

    // Yükselen ıslık
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1600, now + 0.22);
    osc2.frequency.exponentialRampToValueAtTime(2800, now + 0.45);
    gain2.gain.setValueAtTime(0.001, now + 0.22);
    gain2.gain.linearRampToValueAtTime(0.3, now + 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.22);
    osc2.stop(now + 0.56);
  }

  private playChirp(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(2000, now);
    osc.frequency.exponentialRampToValueAtTime(3000, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }
}

export const birdAudioSynth = new BirdAudioSynth();

// Web Speech API for Turkish Voice Identification Tip
export function speakBirdDescription(text: string): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'tr-TR';
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}
