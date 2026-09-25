import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, CheckCircle2, Sparkles } from 'lucide-react';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT } from '../../../components/ui';

interface FeynmanVoiceActivityProps {
  onScoreUpdate?: (points: number) => void;
}

const DARK = '#1F2A44';
const WAVE_BASE = [8, 14, 22, 30, 18, 10, 26, 36, 20, 12, 28, 34, 16, 24, 32, 14, 20, 28, 12, 18, 10];

export const FeynmanVoiceActivity: React.FC<FeynmanVoiceActivityProps> = ({ onScoreUpdate }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [rubricChecks, setRubricChecks] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const rubricItems = [
    { id: 'r1', text: 'Diyaframın (f/stop) ışık miktarı ve arka plan bulanıklığına etkisinden bahsettim.' },
    { id: 'r2', text: 'Enstantane süresinin hareketi dondurma veya hareket izi bırakma rolünü açıkladım.' },
    { id: 'r3', text: 'ISO yükseltildiğinde gelen aydınlanmanın gren (kumlanma) bedelini belirttim.' },
    { id: 'r4', text: 'Bir ayardan kısarken diğerinden açarak teraziyi (0 EV) nasıl koruduğumu özetledim.' },
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      cameraAudio.playDialTick();

      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => Math.min(59, prev + 1));
      }, 1000);
    } catch {
      alert('Mikrofon erişimi sağlanamadı. Tarayıcınızdan mikrofon iznini onaylayınız.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      cameraAudio.playDialTick();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handlePlayToggle = () => {
    if (!audioElementRef.current && audioUrl) {
      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;
      audio.onended = () => setIsPlaying(false);
    }
    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleRubric = (id: string) => {
    setRubricChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCompleteFeynman = () => {
    setCompleted(true);
    cameraAudio.playSuccessSound();
    if (onScoreUpdate) onScoreUpdate(30);
  };

  const checkCount = Object.values(rubricChecks).filter(Boolean).length;
  const sec = recordingDuration;
  const detectedTags = ['Işık', 'Süre', 'Hassasiyet'].map((t, i) => {
    const on = Boolean(audioUrl) || (isRecording && sec > (i + 1) * 3);
    return { t, on };
  });

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] bg-white p-4.5 flex items-center gap-3.5" style={{ border: '1px solid #E6E0D6' }}>
        <div className="w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0" style={{ background: DARK }}>
          <Mic className="w-[30px] h-[30px]" style={{ color: '#FCD34D' }} />
        </div>
        <p className="font-display font-extrabold text-lg leading-snug">
          Pozlama Üçgenini 10 yaşındaki bir çocuğa anlatır gibi 30-60 saniye sesli anlat
        </p>
      </div>

      <div className="rounded-[28px] py-7 flex flex-col items-center gap-5" style={{ background: DARK }}>
        <span className="font-mono font-bold text-3xl text-white">0:{String(sec).padStart(2, '0')}</span>
        <div className="flex items-center gap-1 h-10">
          {WAVE_BASE.map((h, i) => (
            <span
              key={i}
              className="block w-[5px] rounded-full transition-all"
              style={{
                height: isRecording ? Math.max(4, (h + sec * 7 * ((i % 3) + 1)) % 38) : 4,
                background: isRecording ? '#FCD34D' : '#4A5A7D',
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          aria-label={isRecording ? 'Kaydı durdur' : 'Kaydet'}
          style={{
            background: isRecording ? '#C2410C' : '#FCD34D',
            boxShadow: `0 0 0 10px ${isRecording ? 'rgba(194,65,12,0.3)' : 'rgba(252,211,77,0.15)'}`,
          }}
          className="w-[100px] h-[100px] rounded-full border-none flex items-center justify-center transition-shadow"
        >
          {isRecording ? (
            <span className="block w-8 h-8 rounded-lg bg-white" />
          ) : (
            <Mic className="w-11 h-11" style={{ color: DARK }} />
          )}
        </button>
        <div className="flex gap-2 justify-center flex-wrap px-4">
          {detectedTags.map((k) => (
            <span
              key={k.t}
              className="h-11 px-3.5 rounded-2xl flex items-center gap-1.5 font-extrabold text-sm"
              style={{
                background: k.on ? CORRECT.bg : '#FFFFFF',
                color: k.on ? CORRECT.fg : '#6B665E',
                border: k.on ? `2px solid ${CORRECT.border}` : '1px solid #E6E0D6',
              }}
            >
              {k.on && <CheckCircle2 className="w-4 h-4" style={{ color: CORRECT.border }} />}
              {k.t}
            </span>
          ))}
        </div>
      </div>

      {audioUrl && !isRecording && (
        <button
          type="button"
          onClick={handlePlayToggle}
          className="w-full h-12 rounded-[16px] flex items-center justify-center gap-2 font-bold text-sm"
          style={{ background: '#FAF8F5', border: '1px solid #E6E0D6', color: '#1C1B19' }}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Durdur' : 'Kendi Sesimi Dinle'}
        </button>
      )}

      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: '#6B665E' }}>
          Anlatımınızda bu noktalara değindiniz mi? ({checkCount} / {rubricItems.length})
        </label>
        <div className="flex flex-col gap-2">
          {rubricItems.map((r) => {
            const isChecked = rubricChecks[r.id] || false;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleRubric(r.id)}
                className="p-3.5 rounded-[16px] text-left text-xs font-semibold flex items-start justify-between gap-3 transition-all"
                style={{
                  background: isChecked ? 'var(--accent-light)' : '#FAF8F5',
                  color: isChecked ? 'var(--accent)' : '#1C1B19',
                  border: `1px solid ${isChecked ? 'var(--accent)' : '#E6E0D6'}`,
                  fontWeight: isChecked ? 800 : 600,
                }}
              >
                <span>{r.text}</span>
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: isChecked ? 'var(--accent)' : '#C9BFAF' }} />
              </button>
            );
          })}
        </div>
      </div>

      {!completed ? (
        <button
          type="button"
          onClick={handleCompleteFeynman}
          disabled={checkCount < 3}
          className="w-full h-14 rounded-[18px] font-bold text-sm disabled:opacity-40 transition-all"
          style={{ background: '#1C1B19', color: '#FFFFFF' }}
        >
          Anlatımımı Tamamla (+30 Puan)
        </button>
      ) : (
        <div className="rounded-[20px] p-4 flex items-center gap-2.5 text-xs font-semibold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          <Sparkles className="w-5 h-5 shrink-0" />
          <span>Tebrikler! Kendi cümlelerinizle öğreterek pozlama üçgenini zihninizde kalıcı hale getirdiniz.</span>
        </div>
      )}
    </div>
  );
};
