import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { cameraAudio } from '../utils/cameraAudio';

interface FeynmanVoiceActivityProps {
  onScoreUpdate?: (points: number) => void;
}

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

  // Mikrofon Kaydını Başlat
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      cameraAudio.playDialTick();

      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      alert('Mikrofon erişimi sağlanamadı. Tarayıcınızdan mikrofon iznini onaylayınız.');
    }
  };

  // Kaydı Durdur
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

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-[20px] border border-[#EBE7E0]">
        <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block">
          Sesli Anlatım & Sözlü Pratik (Feynman Tekniği)
        </span>
        <h3 className="text-lg font-bold text-[#1F1E1B]">Sesli Anlatım & Öğretme Laboratuvarı</h3>
        <p className="text-sm text-[#66635E] mt-0.5">
          "Bir şeyi basitçe anlatamıyorsanız, onu yeterince anlamamışsınız demektir." — Richard Feynman.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white border border-[#EBE7E0] rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
        {/* Görev Tanımı */}
        <div className="space-y-2 bg-[#FAF8F5] p-5 rounded-[20px] border border-[#EBE7E0]">
          <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block">
            Sesli Anlatım Göreviniz:
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#1F1E1B] leading-snug">
            Pozlama Üçgenini (Diyafram, Enstantane, ISO) fotoğrafçılığa yeni başlayan 10 yaşındaki bir çocuğa
            anlatır gibi 30-60 saniye boyunca sesli olarak açıklayın.
          </h2>
          <p className="text-xs text-[#66635E]">
            Mikrofon butonuna basarak kayda başlayın, sesinizi kaydedin ve ardından kriterlere göre kendinizi değerlendirin.
          </p>
        </div>

        {/* Ses Kayıt Paneli */}
        <div className="flex flex-col items-center justify-center p-6 bg-stone-50 rounded-[20px] border border-stone-200 space-y-4">
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs bg-[var(--accent)] hover:bg-[var(--accent)] text-white shadow-md transition-all active:scale-95"
              >
                <Mic className="w-4 h-4" />
                Ses Kaydını Başlat
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs bg-stone-900 hover:bg-black text-white shadow-md animate-pulse"
              >
                <Square className="w-4 h-4 text-[var(--accent)] fill-[var(--accent)]" />
                Kaydı Bitir ({recordingDuration}s)
              </button>
            )}

            {audioUrl && !isRecording && (
              <button
                onClick={handlePlayToggle}
                className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Durdur' : 'Kendi Sesimi Dinle'}
              </button>
            )}
          </div>

          <span className="text-xs text-[#7A7670] ">
            {isRecording
              ? `🎙️ Kaydediliyor: ${recordingDuration} sn...`
              : audioUrl
              ? '✅ Kayıt tamamlandı, aşağıdan kontrol listesini işaretleyin.'
              : 'Henüz kayıt yapılmadı.'}
          </span>
        </div>

        {/* Feynman Öz Değerlendirme Rubriği */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
            Anlatımınızda Bu Noktalara Değindiniz mi? ({checkCount} / {rubricItems.length})
          </label>
          <div className="space-y-2">
            {rubricItems.map((r) => {
              const isChecked = rubricChecks[r.id] || false;
              return (
                <button
                  key={r.id}
                  onClick={() => toggleRubric(r.id)}
                  className={`w-full p-3.5 rounded-[16px] border text-left text-xs font-medium transition-all flex items-start justify-between gap-3 ${
                    isChecked
                      ? 'bg-[var(--accent-light)] border-[var(--accent)] text-[var(--accent)] font-bold'
                      : 'bg-[#FAF8F5] border-[#E0DCD6] text-[#333] hover:bg-stone-100'
                  }`}
                >
                  <span>{r.text}</span>
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isChecked ? 'text-[var(--accent)]' : 'text-stone-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Onay & Tamamlama */}
        {!completed ? (
          <button
            onClick={handleCompleteFeynman}
            disabled={checkCount < 3}
            className="w-full py-3.5 rounded-[16px] font-bold text-xs bg-[var(--accent)] hover:bg-[var(--accent)] text-white transition-all disabled:opacity-50 shadow-sm"
          >
            Feynman Anlatımımı Tamamla (+30 Puan)
          </button>
        ) : (
          <div className="p-4 rounded-[20px] bg-[var(--accent-light)] border border-[var(--accent)]/30 text-[var(--accent)] text-xs flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--accent)] shrink-0" />
            <span>
              <strong>Tebrikler!</strong> Kendi cümlelerinizle öğreterek pozlama üçgenini zihninizde kalıcı hale getirdiniz.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
