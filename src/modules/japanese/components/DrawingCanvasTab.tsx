import React, { useRef, useState, useEffect, useCallback } from 'react';
import { KanaCharacter, AlphabetType } from '../../../types';
import { KANA_DATA } from '../data/kanaData';
import {
  Check,
  Volume2,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  PenTool,
  Undo2,
  Trash2
} from 'lucide-react';
import { soundManager } from '../../../utils/sound';
import { CORRECT } from '../../../components/ui';

interface DrawingCanvasTabProps {
  alphabet: AlphabetType;
  setAlphabet: (alp: AlphabetType) => void;
  selectedChar: KanaCharacter | null;
  onSelectCharacter: (char: KanaCharacter) => void;
  onDrawingCompleted: () => void;
}

type Point = { x: number; y: number };
type Stroke = { points: Point[]; color: string; width: number };

const BRUSH_COLORS = [
  { color: '#1C1B19', label: 'Sumi Mürekkebi' },
  { color: '#E11D48', label: 'Sakura Kırmızı' },
  { color: '#4F46E5', label: 'İndigo Mavi' }
];
const BRUSH_WIDTHS = [
  { width: 8, label: 'İnce' },
  { width: 14, label: 'Orta' },
  { width: 22, label: 'Fırça' }
];

export const DrawingCanvasTab: React.FC<DrawingCanvasTabProps> = ({
  alphabet,
  setAlphabet,
  selectedChar,
  onSelectCharacter,
  onDrawingCompleted
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [strokeColor, setStrokeColor] = useState('#1C1B19');
  const [strokeWidth, setStrokeWidth] = useState(12);
  const [checked, setChecked] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Active character
  const currentChar = selectedChar || KANA_DATA[0];
  const currentKana = alphabet === 'hiragana' ? currentChar.hiragana : currentChar.katakana;
  const targetStrokes = currentChar.strokeCount || 1;
  const isDone = strokes.length >= targetStrokes;

  const redraw = useCallback((allStrokes: Stroke[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    allStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
  }, []);

  const handleClear = useCallback(() => {
    setStrokes([]);
    redraw([]);
    setChecked(false);
  }, [redraw]);

  const handleUndo = () => {
    setStrokes((prev) => {
      const next = prev.slice(0, -1);
      redraw(next);
      return next;
    });
    setChecked(false);
  };

  // Reset and clear when character changes
  useEffect(() => {
    handleClear();
    setFeedbackSuccess(false);
  }, [currentChar.id, alphabet, handleClear]);

  // Canvas drawing handlers
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    } else if ('clientX' in e) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    currentStrokeRef.current = { points: [{ x, y }], color: strokeColor, width: strokeWidth };
    setIsDrawing(true);
    setChecked(false);

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStrokeRef.current) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    currentStrokeRef.current.points.push({ x, y });

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 1) {
      const finished = currentStrokeRef.current;
      setStrokes((prev) => [...prev, finished]);
    }
    currentStrokeRef.current = null;
    setIsDrawing(false);
  };

  // Handle previous & next character
  const currentIndex = KANA_DATA.findIndex((c) => c.id === currentChar.id);

  const handlePrev = () => {
    soundManager.playFlipSound();
    if (currentIndex > 0) {
      onSelectCharacter(KANA_DATA[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    soundManager.playFlipSound();
    if (currentIndex < KANA_DATA.length - 1) {
      onSelectCharacter(KANA_DATA[currentIndex + 1]);
    }
  };

  const handleCheck = () => {
    if (!isDone) return;
    soundManager.playCorrectSound();
    setChecked(true);
    onDrawingCompleted();
    setFeedbackSuccess(true);

    setTimeout(() => {
      setFeedbackSuccess(false);
      handleNext();
    }, 800);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 animate-in fade-in duration-300">

      {/* Icon box + title (design screen header) */}
      <div className="flex items-center gap-2.5 px-1">
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: 'var(--accent)' }}>
          <PenTool className="w-[22px] h-[22px] text-white" />
        </div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight" style={{ color: '#1C1B19' }}>Çiz</h1>
      </div>

      {/* Character info row: kana + romaji + stroke dots, and nav/audio controls */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-baseline gap-2.5">
          <span className="font-extrabold text-[34px] leading-none" style={{ color: 'var(--accent)' }}>{currentKana}</span>
          <span className="font-extrabold text-xl leading-none" style={{ color: '#1C1B19' }}>{currentChar.romaji}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: targetStrokes }).map((_, i) => {
            const filled = i < strokes.length;
            const bg = filled ? (checked ? CORRECT.border : 'var(--accent)') : '#EDE6DB';
            const fg = filled ? '#FFFFFF' : '#6B665E';
            return (
              <span
                key={i}
                className="w-[30px] h-[30px] rounded-[15px] flex items-center justify-center font-extrabold text-[13px]"
                style={{ background: bg, color: fg }}
              >
                {i + 1}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <button
            id="btn-prev-draw-char"
            aria-label="Önceki karakter"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className="w-9 h-9 rounded-[12px] border border-[#E6E0D6] bg-white text-[#1C1B19] flex items-center justify-center disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            id="btn-next-draw-char"
            aria-label="Sonraki karakter"
            disabled={currentIndex === KANA_DATA.length - 1}
            onClick={handleNext}
            className="w-9 h-9 rounded-[12px] border border-[#E6E0D6] bg-white text-[#1C1B19] flex items-center justify-center disabled:opacity-30 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <button
          id="btn-speak-drawing-char"
          aria-label="Karakteri dinle"
          onClick={() => soundManager.speak(currentKana)}
          className="px-3 py-2 rounded-[12px] bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/30 flex items-center gap-1.5 text-xs font-bold transition-colors"
        >
          <Volume2 className="w-4 h-4" />
          <span>Dinle</span>
        </button>
      </div>

      {/* Compact brush tool strip (renk & kalınlık — tasarımda yok, mevcut özellik korunur) */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-[16px] bg-white border border-[#E6E0D6]">
        <div className="flex items-center gap-1.5">
          {BRUSH_COLORS.map((c) => (
            <button
              key={c.color}
              aria-label={c.label}
              title={c.label}
              onClick={() => setStrokeColor(c.color)}
              style={{ backgroundColor: c.color }}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                strokeColor === c.color ? 'scale-110 border-[var(--accent)]' : 'border-white'
              }`}
            />
          ))}
        </div>
        <div className="h-5 w-[1px] bg-[#EAE5DA]" />
        <div className="flex items-center gap-1">
          {BRUSH_WIDTHS.map((w) => (
            <button
              key={w.width}
              aria-label={`Kalınlık: ${w.label}`}
              title={w.label}
              onClick={() => setStrokeWidth(w.width)}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                strokeWidth === w.width ? 'bg-[#1C1B19] text-white' : 'bg-[#F5F2EC] text-[#555047]'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drawing Canvas Stage — 350x350 (design E17) */}
      <div className="@container relative w-full aspect-square rounded-[28px] bg-white border border-[#E6E0D6] overflow-hidden select-none">
        {/* Dashed guide cross */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed pointer-events-none" style={{ borderColor: 'var(--accent-light)' }} />
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l-2 border-dashed pointer-events-none" style={{ borderColor: 'var(--accent-light)' }} />

        {/* Faded guide character */}
        {showGuide && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-japanese font-medium leading-none select-none" style={{ fontSize: '76cqw', color: 'var(--accent-light)' }}>
              {currentKana}
            </span>
          </div>
        )}

        {/* HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          width={350}
          height={350}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          role="img"
          aria-label="Çizim alanı"
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />

        {/* Success Overlay Flash */}
        {feedbackSuccess && (
          <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 text-white font-bold text-lg backdrop-blur-xs animate-in fade-in zoom-in duration-200" style={{ background: 'color-mix(in srgb, var(--accent) 85%, transparent)' }}>
            <Check className="w-7 h-7 text-white" />
            <span>Harika Çizim!</span>
          </div>
        )}
      </div>

      {/* Footer action bar: guide toggle, undo, clear, check (design E17) */}
      <div className="flex items-center gap-2.5">
        <button
          id="btn-toggle-guide"
          aria-label="Rehberi aç/kapat"
          onClick={() => setShowGuide(!showGuide)}
          style={{ background: showGuide ? 'var(--accent-light)' : '#FFFFFF' }}
          className="w-14 h-14 rounded-[18px] border border-[#E6E0D6] flex items-center justify-center shrink-0 transition-colors"
        >
          {showGuide ? <Eye className="w-[22px] h-[22px]" style={{ color: '#1C1B19' }} /> : <EyeOff className="w-[22px] h-[22px]" style={{ color: '#1C1B19' }} />}
        </button>
        <button
          id="btn-undo-stroke"
          aria-label="Geri al"
          onClick={handleUndo}
          disabled={strokes.length === 0}
          className="w-14 h-14 rounded-[18px] bg-white border border-[#E6E0D6] flex items-center justify-center shrink-0 disabled:opacity-30 transition-colors"
        >
          <Undo2 className="w-[22px] h-[22px]" style={{ color: '#1C1B19' }} />
        </button>
        <button
          id="btn-clear-canvas"
          aria-label="Temizle"
          onClick={handleClear}
          disabled={strokes.length === 0}
          className="w-14 h-14 rounded-[18px] bg-white border border-[#E6E0D6] flex items-center justify-center shrink-0 disabled:opacity-30 transition-colors"
        >
          <Trash2 className="w-[22px] h-[22px]" style={{ color: '#1C1B19' }} />
        </button>
        <button
          id="btn-confirm-drawing"
          aria-label="Çizimi kontrol et"
          disabled={!isDone}
          onClick={handleCheck}
          style={{ background: isDone ? '#1C1B19' : '#A39C91' }}
          className="flex-grow h-14 rounded-[18px] flex items-center justify-center transition-all active:scale-95"
        >
          <Check className="w-6 h-6 text-white" strokeWidth={2.6} />
        </button>
      </div>

    </div>
  );
};
