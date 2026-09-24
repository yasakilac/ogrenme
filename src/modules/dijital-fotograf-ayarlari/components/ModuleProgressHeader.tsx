import React from 'react';
import { ArrowLeft, RotateCcw, Award } from 'lucide-react';

export interface ModuleProgressHeaderProps {
  currentView: string;
  completedTopics?: string[];
  totalScore?: number;
  finalTestScore?: number;
  onNavigate: (viewId: string) => void;
  onResetProgress?: () => void;
  onOpenCertificate?: () => void;
}

const TOTAL_COUNT = 6;

export const ModuleProgressHeader: React.FC<ModuleProgressHeaderProps> = ({
  currentView,
  completedTopics = [],
  onNavigate,
  onResetProgress,
  onOpenCertificate,
}) => {
  const safeCompletedTopics = Array.isArray(completedTopics) ? completedTopics : [];
  const completedCount = safeCompletedTopics.length;
  const percent = Math.min(100, Math.round((completedCount / TOTAL_COUNT) * 100));
  const isMastery = completedCount >= 5 || percent === 100;

  return (
    <div className="bg-white border border-[#EBE7E0] rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
        {/* Sade Öğrenci İlerlemesi & İlerleme Çubuğu */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-stone-900">Öğrenci İlerlemesi</span>
            <div className="flex items-center gap-2">
              {isMastery && (
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md font-mono flex items-center gap-1 border border-amber-300">
                  <Award className="w-3 h-3 text-amber-700" />
                  Ustalık Belgesi Açıldı
                </span>
              )}
              <span className="text-xs font-mono font-bold text-stone-600">
                %{percent} ({completedCount}/{TOTAL_COUNT})
              </span>
            </div>
          </div>

          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${percent}%`,
                backgroundImage:
                  'linear-gradient(90deg, #E11D48 0%, #EA580C 50%, #10B981 100%)',
              }}
            />
          </div>
        </div>

        {/* Sağ Butonlar: Ustalık Sertifikası + Konudan Dönüş / Sıfırlama */}
        <div className="flex items-center gap-2 shrink-0">
          {isMastery && onOpenCertificate && (
            <button
              onClick={onOpenCertificate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 hover:from-amber-400 hover:to-yellow-300 transition-all shadow-xs cursor-pointer border border-amber-300 animate-pulse"
              title="Fotoğrafçılık Ustalık Sertifikasını Görüntüle"
            >
              <Award className="w-4 h-4 text-amber-950" />
              <span className="font-bold">Sertifika</span>
            </button>
          )}

          {currentView !== 'home' ? (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-black text-white transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-rose-400" />
              <span>Konulara Dön</span>
            </button>
          ) : (
            onResetProgress && completedCount > 0 && (
              <button
                onClick={onResetProgress}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                title="İlerlemeyi Sıfırla"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
