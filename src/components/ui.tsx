import React from 'react';
import type { LucideIcon } from 'lucide-react';

/** Tasarım dilinin ortak küçük UI parçaları — modül içi etkinlik/konu component'leri bunları kullanır.
 * Renk her zaman App.tsx'in modül wrapper'ına koyduğu --accent/--accent-light CSS değişkenlerinden gelir. */

export const CORRECT = { bg: '#DBEAFE', border: '#1D4ED8', fg: '#1E3A8A' };
export const WRONG = { bg: '#FFEDD5', border: '#C2410C', fg: '#7C2D12' };

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div
    className={`rounded-[24px] bg-white p-6 ${className}`}
    style={{ border: '1px solid #E6E0D6' }}
  >
    {children}
  </div>
);

export const PrimaryButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: LucideIcon }
> = ({ children, icon: Icon, className = '', ...props }) => (
  <button
    type="button"
    {...props}
    style={{ background: '#1C1B19', color: '#FFFFFF' }}
    className={`h-14 rounded-[18px] flex items-center justify-center gap-2 font-bold text-sm transition-all disabled:opacity-40 ${className}`}
  >
    {Icon && <Icon className="w-5 h-5" />}
    {children}
  </button>
);

interface CheckBarProps {
  correct: boolean;
  message: React.ReactNode;
  onNext: () => void;
}

/** Doğru/yanlış cevap sonrası geri bildirim şeridi (04-etkinlik tasarımı): ikon + mesaj + koyu ileri butonu. */
export const CheckBar: React.FC<CheckBarProps> = ({ correct, message, onNext }) => {
  const palette = correct ? CORRECT : WRONG;
  return (
    <div className="rounded-[24px] p-4 flex items-center gap-3.5" style={{ background: palette.bg }}>
      <p className="flex-grow text-sm font-semibold leading-snug" style={{ color: palette.fg }}>
        {message}
      </p>
      <button
        type="button"
        onClick={onNext}
        aria-label="Sonraki"
        className="w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0"
        style={{ background: '#1C1B19' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

interface TopicHeaderProps {
  icon: LucideIcon;
  title: string;
  eyebrow?: string;
}

/** 03-konu tasarımındaki "renkli ikon kutusu + büyük başlık" bloğu. */
export const TopicHeader: React.FC<TopicHeaderProps> = ({ icon: Icon, title, eyebrow }) => (
  <div className="flex items-center gap-3">
    <div
      className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
      style={{ background: 'var(--accent)' }}
    >
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'var(--accent)' }}>
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-2xl font-extrabold leading-tight" style={{ color: '#1C1B19' }}>
        {title}
      </h2>
    </div>
  </div>
);

interface DropZoneProps {
  active?: boolean;
  filled?: boolean;
  onDrop?: (e: React.DragEvent) => void;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

/** E1/E4 tarzı kesikli-kenarlı bırakma alanı. */
export const DropZone: React.FC<DropZoneProps> = ({ active, filled, onDrop, onClick, className = '', children }) => (
  <div
    onDragOver={(e) => e.preventDefault()}
    onDrop={onDrop}
    onClick={onClick}
    style={{
      background: filled ? 'var(--accent-light)' : '#FFFFFF',
      borderColor: active || filled ? 'var(--accent)' : '#E6E0D6',
      borderStyle: filled ? 'solid' : 'dashed',
      borderWidth: 2
    }}
    className={`rounded-[22px] transition-all ${className}`}
  >
    {children}
  </div>
);
