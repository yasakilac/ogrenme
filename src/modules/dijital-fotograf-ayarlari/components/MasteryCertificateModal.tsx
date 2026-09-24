import React, { useState } from 'react';
import {
  Award,
  Download,
  Printer,
  X,
  CheckCircle2,
  Sparkles,
  Camera,
  Calendar,
  Share2,
  Check,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { cameraAudio } from '../utils/cameraAudio';

interface MasteryCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedCount: number;
  totalScore: number;
  finalTestScore?: number;
}

export const MasteryCertificateModal: React.FC<MasteryCertificateModalProps> = ({
  isOpen,
  onClose,
  completedCount,
  totalScore,
  finalTestScore,
}) => {
  const [studentName, setStudentName] = useState<string>('Değerli Fotoğrafçı');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const todayFormatted = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const certNumber = `FG-EXP-${Math.max(100, totalScore)}-${new Date().getFullYear()}`;

  const handlePrint = () => {
    cameraAudio.playShutterSound(0.008);
    window.print();
  };

  const handleCopyShare = () => {
    const text = `🏆 FotoGrafi Fotoğrafçılık Ustalık Sertifikamı aldım! Pozlama Üçgeni (Diyafram, Enstantane, ISO) ve DSLR Çekim eğitimini %100 başarıyla tamamladım. Sertifika No: ${certNumber}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      cameraAudio.playSuccessSound();
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-amber-400/60 overflow-hidden my-auto print:border-none print:shadow-none print:rounded-none print:max-w-none">
        {/* Üst Eylemler & Kapatma Çubuğu (Yazdırmada Gizlenir) */}
        <div className="no-print bg-stone-900 text-stone-300 px-6 py-3.5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-white">FotoGrafi Akademi • Resmi Başarı Belgesi</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-colors cursor-pointer"
              title="Başarıyı Kopyala"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Kopyalandı!' : 'Paylaş'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title="Yazdır veya PDF Olarak Kaydet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır / PDF İndir</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer ml-1"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* İsim Düzenleme Çubuğu (Yazdırmada Gizlenir) */}
        <div className="no-print bg-amber-50/70 border-b border-amber-200/80 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-amber-900 font-medium flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Sertifikada görünecek adınızı özelleştirebilirsiniz:
          </span>

          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Adınız Soyadınız"
              className="w-full px-3 py-1 text-xs bg-white border border-amber-300 rounded-lg text-stone-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* ===================== SERTİFİKA GÖVDESİ ===================== */}
        <div className="p-6 sm:p-12 bg-[#FFFDF9] text-stone-900 relative">
          {/* Klasik Altın Süsleme Dış Çerçevesi */}
          <div className="relative border-4 border-double border-amber-600/40 rounded-2xl p-6 sm:p-10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#FFFDF9]">
            {/* Köşe Süsleri */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-600/80" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-600/80" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-600/80" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-600/80" />

            {/* Üst Başlık & Logo */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 text-stone-950 shadow-md mb-1">
                <Camera className="w-8 h-8" />
              </div>

              <div className="tracking-[0.25em] text-xs uppercase font-extrabold text-amber-800 font-mono">
                FotoGrafi Eğitim Portalı & Optik Akademisi
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-stone-900 uppercase">
                Fotoğrafçılık Ustalık Sertifikası
              </h1>

              <div className="text-xs sm:text-sm font-serif italic text-stone-600">
                Certificate of Digital Photography & Exposure Mastery
              </div>
            </div>

            {/* Orta Metin & Alıcı */}
            <div className="text-center space-y-4 my-6">
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
                Bu başarı belgesi; Dijital Fotoğrafçılık Pozlama Üçgeni, Diyafram Alan Derinliği, Enstantane Hızı,
                ISO Sensör Dinamiği ve Manuel DSLR Simülasyon modüllerini üstün başarıyla tamamlayan
              </p>

              {/* Öğrenci Adı (Görkemli Tipografi) */}
              <div className="py-2 border-b-2 border-amber-500/40 max-w-md mx-auto">
                <span className="text-2xl sm:text-4xl font-serif font-bold text-amber-950 block">
                  {studentName || 'Öğrenci'}
                </span>
              </div>

              <p className="text-xs text-stone-500 max-w-lg mx-auto">
                adına düzenlenmiş olup, manuel kamera parametrelerini bağımsız ve yetkin bir şekilde yönetme ustalığını onaylar.
              </p>
            </div>

            {/* Kazanılan Temel Yetkinlikler (5+ Modül Listesi) */}
            <div className="my-6 p-4 rounded-xl bg-amber-100/40 border border-amber-200/60 max-w-2xl mx-auto">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 font-mono text-center mb-2.5">
                Onaylanan Ustalık Yetkinlikleri:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Diyafram (f/stop) & Alan Derinliği Bokeh</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Enstantane & Hareket Dondurma / Uzun Pozlama</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>ISO & Sensör Sinyal Kazancı / Gren Kontrolü</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>İnteraktif DSLR Pozlama Simülatörü Hakimiyeti</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2 justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Ünite Sonu Bitirme Değerlendirmesi ({finalTestScore ? `%${finalTestScore}` : 'Tam Puan'})</span>
                </div>
              </div>
            </div>

            {/* Alt Bilgiler: Mühür, Tarih, İmzalar */}
            <div className="pt-6 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              {/* Tarih ve Kod */}
              <div className="space-y-1 text-xs text-stone-500 font-mono">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-stone-700 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>Veriliş Tarihi: {todayFormatted}</span>
                </div>
                <div>Sertifika No: {certNumber}</div>
                <div className="text-emerald-800 font-bold">
                  Tamamlanan Modül: {completedCount} / 6 • Toplam Puan: {totalScore}
                </div>
              </div>

              {/* Altın Mühür Rozeti */}
              <div className="w-20 h-20 rounded-full border-4 border-amber-500 bg-gradient-to-br from-amber-400 via-amber-200 to-yellow-500 p-1 flex flex-col items-center justify-center text-stone-900 shadow-md text-center shrink-0">
                <Star className="w-4 h-4 text-amber-900 fill-amber-900" />
                <span className="text-[8px] font-black uppercase tracking-wider font-mono block leading-tight">
                  FotoGrafi
                </span>
                <span className="text-[7px] font-extrabold uppercase font-mono block text-amber-950">
                  Resmi Onay
                </span>
                <ShieldCheck className="w-3 h-3 text-amber-950 mt-0.5" />
              </div>

              {/* Yetkili İmza Hattı */}
              <div className="space-y-1 text-center">
                <div className="font-serif italic text-sm text-stone-800 font-bold tracking-wider">
                  FotoGrafi Eğitim Kurulu
                </div>
                <div className="w-36 h-0.5 bg-stone-400 mx-auto" />
                <div className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">
                  Dijital Optik Kürsüsü
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
