/**
 * Web Audio API tabanlı kamera ses efektleri ve geribildirim sentezleyicisi.
 * Dış ses dosyasına gerek kalmadan gerçekçi mekanik deklanşör sesleri üretir.
 */

class CameraAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Enstantane hızına göre gerçekçi çift deklanşör tık sesi (ayna kalkışı + perde kapanışı)
   * @param durationInSeconds Deklanşörün açık kalma süresi (sn)
   */
  public playShutterSound(durationInSeconds: number = 0.004): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const playClick = (timeOffset: number, pitchMod: number = 1) => {
      const now = ctx.currentTime + timeOffset;

      // Mekanik ayna tıkı (gürültü + bant geçiren filtre)
      const bufferSize = ctx.sampleRate * 0.05;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 * pitchMod, now);
      filter.Q.setValueAtTime(3, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // Gövde rezonansı (metalik tok vuruş)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180 * pitchMod, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.035);

      oscGain.gain.setValueAtTime(0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    };

    // 1. Tık: Perde açılışı
    playClick(0, 1.0);

    // 2. Tık: Perde kapanışı
    // Hızlı enstantanelerde (örn. 1/1000s) insan kulağı için minimum 45ms ara bırakılır.
    // Uzun pozlamada (örn. 1s veya 2s) tam süre kadar sonra çalar.
    const closeDelay = Math.max(0.045, Math.min(durationInSeconds, 3));
    playClick(closeDelay, 0.85);
  }

  /**
   * Diyafram kadranı / tekerlek çevirme klik sesi
   */
  public playDialTick(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.012);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.015);
  }

  /**
   * Otomatik netleme onay bip sesi (Kamera odak kilidi)
   */
  public playFocusBeep(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const playNote = (time: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.09);
    };

    playNote(now, 1760);       // A6
    playNote(now + 0.09, 1760); // A6
  }

  /**
   * Doğru cevap melodisi
   */
  public playSuccessSound(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = now + idx * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.15);
    });
  }

  /**
   * Yanlış cevap uyarı sesi
   */
  public playErrorSound(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [260, 220].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = now + idx * 0.08;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.1, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.12);
    });
  }

  /**
   * Ustalık Sertifikası ve büyük başarılar için tantana (fanfare) melodisi
   */
  public playFanfareSound(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // C4, E4, G4, C5, E5, G5, C6 (coşkulu arpej ve final akor)
    const notes = [
      { f: 523.25, t: 0.0, d: 0.12 },
      { f: 659.25, t: 0.1, d: 0.12 },
      { f: 783.99, t: 0.2, d: 0.12 },
      { f: 1046.5, t: 0.3, d: 0.45 },
      { f: 1318.5, t: 0.45, d: 0.5 },
      { f: 1567.98, t: 0.6, d: 0.9 },
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = now + note.t;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, time);
      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + note.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + note.d + 0.05);
    });
  }
}

export const cameraAudio = new CameraAudioSynthesizer();
