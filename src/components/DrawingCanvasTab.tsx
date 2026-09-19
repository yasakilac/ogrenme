import React, { useRef, useState, useEffect } from 'react';
import { KanaCharacter, AlphabetType } from '../types';
import { KANA_DATA } from '../data/kanaData';
import { 
  Eraser, 
  RotateCcw, 
  Check, 
  Volume2, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight,
  PenTool,
  Sparkles,
  Info
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface DrawingCanvasTabProps {
  alphabet: AlphabetType;
  setAlphabet: (alp: AlphabetType) => void;
  selectedChar: KanaCharacter | null;
  onSelectCharacter: (char: KanaCharacter) => void;
  onDrawingCompleted: () => void;
}

export const DrawingCanvasTab: React.FC<DrawingCanvasTabProps> = ({
  alphabet,
  setAlphabet,
  selectedChar,
  onSelectCharacter,
  onDrawingCompleted
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [strokeColor, setStrokeColor] = useState('#2D2A26');
  const [strokeWidth, setStrokeWidth] = useState(12);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Active character
  const currentChar = selectedChar || KANA_DATA[0];
  const currentKana = alphabet === 'hiragana' ? currentChar.hiragana : currentChar.katakana;

  // Clear canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Reset and clear when character changes
  useEffect(() => {
    handleClear();
    setFeedbackSuccess(false);
  }, [currentChar.id, alphabet]);

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
    setIsDrawing(true);
    setHasDrawn(true);
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
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

  const handleConfirmDrawing = () => {
    soundManager.playCorrectSound();
    onDrawingCompleted();
    setFeedbackSuccess(true);

    setTimeout(() => {
      setFeedbackSuccess(false);
      handleNext();
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Character Navigator */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8E3D8] shadow-xs flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 font-bold text-3xl flex items-center justify-center border border-rose-200">
            {currentKana}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#1F1E1D]">
                {currentChar.romaji.toUpperCase()} Çizim Alıştırması
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">
                {currentChar.strokeCount} Vuruş
              </span>
            </div>
            <p className="text-xs text-[#7A756D]">
              {currentChar.trPronunciation}
            </p>
          </div>
        </div>

        {/* Audio & Prev/Next */}
        <div className="flex items-center gap-2">
          <button
            id="btn-speak-drawing-char"
            onClick={() => soundManager.speak(currentKana)}
            title="Karakteri dinle"
            className="p-2.5 rounded-xl bg-[#FAF8F5] text-rose-600 hover:bg-rose-50 border border-[#E8E2D6] transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          
          <button
            id="btn-prev-draw-char"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className="p-2 rounded-xl border border-[#E8E2D6] text-[#555047] hover:bg-white disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            id="btn-next-draw-char"
            disabled={currentIndex === KANA_DATA.length - 1}
            onClick={handleNext}
            className="p-2 rounded-xl border border-[#E8E2D6] text-[#555047] hover:bg-white disabled:opacity-30 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Drawing Canvas Stage */}
      <div className="relative rounded-3xl bg-white border-2 border-[#E2DDD3] shadow-md overflow-hidden select-none">
        
        {/* Japanese Calligraphy Grid Watermark (4 quadrants + diagonals) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Subtle Grid cross lines */}
          <div className="w-full h-[1px] bg-red-200/50 absolute top-1/2 left-0" />
          <div className="h-full w-[1px] bg-red-200/50 absolute top-0 left-1/2" />
          <div className="w-full h-full border border-dashed border-red-200/40 rounded-2xl m-4" />
          
          {/* Background Kana Watermark for tracing */}
          {showGuide && (
            <span className="text-[200px] sm:text-[240px] font-bold text-black/10 select-none font-japanese leading-none transition-opacity duration-300">
              {currentKana}
            </span>
          )}
        </div>

        {/* HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          width={450}
          height={420}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="relative z-10 w-full h-[360px] sm:h-[420px] cursor-crosshair touch-none"
        />

        {/* Success Overlay Flash */}
        {feedbackSuccess && (
          <div className="absolute inset-0 z-20 bg-emerald-500/80 backdrop-blur-xs flex items-center justify-center text-white font-bold text-xl gap-2 animate-in fade-in zoom-in duration-200">
            <Check className="w-8 h-8 text-white" />
            <span>Harika Çizim! İlerlemene Eklendi</span>
          </div>
        )}

      </div>

      {/* Canvas Tool Controls */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8E3D8] shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Brush Color & Width */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {[
              { color: '#2D2A26', label: 'Sumi Mürekkebi' },
              { color: '#E11D48', label: 'Sakura Kırmızı' },
              { color: '#4F46E5', label: 'İndigo Mavi' },
            ].map((c) => (
              <button
                key={c.color}
                onClick={() => setStrokeColor(c.color)}
                style={{ backgroundColor: c.color }}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  strokeColor === c.color ? 'scale-110 border-amber-400 shadow-xs' : 'border-white'
                }`}
                title={c.label}
              />
            ))}
          </div>

          <div className="h-5 w-[1px] bg-[#EAE5DA]" />

          {/* Stroke Width Buttons */}
          <div className="flex items-center gap-1">
            {[
              { width: 8, label: 'İnce' },
              { width: 14, label: 'Orta' },
              { width: 22, label: 'Fırça' },
            ].map((w) => (
              <button
                key={w.width}
                onClick={() => setStrokeWidth(w.width)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                  strokeWidth === w.width ? 'bg-[#1F1E1D] text-white' : 'bg-[#F5F2EC] text-[#555047]'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear & Guide Toggle */}
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-guide"
            onClick={() => setShowGuide(!showGuide)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              showGuide
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-[#F5F2EC] text-[#555047] border-transparent'
            }`}
          >
            {showGuide ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showGuide ? 'Kılavuz Açık' : 'Kılavuzu Gizle'}</span>
          </button>

          <button
            id="btn-clear-canvas"
            onClick={handleClear}
            className="p-2 rounded-xl bg-[#F5F2EC] hover:bg-[#EBE6DC] text-[#555047] transition-colors"
            title="Çizimi Temizle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Confirmation Action Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D6]">
        <div className="flex items-center gap-2 text-xs text-[#6A655C]">
          <Info className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Şablonu takip ederek parmağınız veya farenizle karakteri çizin.</span>
        </div>

        <button
          id="btn-confirm-drawing"
          disabled={!hasDrawn}
          onClick={handleConfirmDrawing}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Check className="w-4 h-4 text-white" />
          <span>Çizdim, Tamamla!</span>
        </button>
      </div>

    </div>
  );
};
