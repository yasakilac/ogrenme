import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ModuleTopBarProps {
  /** Sol geri butonu: modül içi ekranlarda modül giriş ekranına, giriş ekranında hub'a döner. */
  onBack: () => void;
  onHome: () => void;
  accentColor: string;
  accentLight: string;
  /** Ortada gösterilecek ilerleme yüzdesi (0-100). Yoksa ortada boşluk kalır. */
  progressPercent?: number;
  /** Modül giriş ekranına dönen ikinci bir rozet buton (içerik ekranlarında). */
  showModuleBadge?: boolean;
  ModuleIcon?: LucideIcon;
  /** ModuleIcon yoksa (ör. Japonca) rozette gösterilecek metin glif ('日'). */
  moduleGlyph?: string;
}

const iconBtn = 'w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 border transition-transform active:scale-95';

export const ModuleTopBar: React.FC<ModuleTopBarProps> = ({
  onBack,
  onHome,
  accentColor,
  accentLight,
  progressPercent,
  showModuleBadge,
  ModuleIcon,
  moduleGlyph
}) => {
  return (
    <nav className="h-16 px-4 flex items-center gap-2.5">
      <button
        type="button"
        onClick={onBack}
        aria-label="Geri"
        className={`${iconBtn} bg-white border-[#E6E0D6]`}
      >
        <ArrowLeft className="w-5 h-5" style={{ color: '#1C1B19' }} />
      </button>

      {progressPercent !== undefined ? (
        <div className="flex-grow h-2.5 rounded-full" style={{ background: '#EDE6DB' }}>
          <div
            className="h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%`, background: accentColor }}
          />
        </div>
      ) : (
        <div className="flex-grow" />
      )}

      {showModuleBadge && (ModuleIcon || moduleGlyph) && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Modül ana sayfası"
          className={`${iconBtn} border-transparent`}
          style={{ background: accentLight }}
        >
          {ModuleIcon ? (
            <ModuleIcon className="w-5 h-5" style={{ color: accentColor }} />
          ) : (
            <span className="font-japanese font-black text-base" style={{ color: accentColor }}>
              {moduleGlyph}
            </span>
          )}
        </button>
      )}

      <button
        type="button"
        onClick={onHome}
        aria-label="Ana sayfa"
        className={`${iconBtn} bg-white border-[#E6E0D6]`}
      >
        <Home className="w-5 h-5" style={{ color: '#1C1B19' }} />
      </button>
    </nav>
  );
};
