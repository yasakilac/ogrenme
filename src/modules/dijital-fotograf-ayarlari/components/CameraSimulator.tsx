import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Camera,
  RotateCcw,
  Sliders,
  Grid,
  Info,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  Zap,
} from 'lucide-react';
import {
  APERTURE_STOPS,
  SHUTTER_STOPS,
  ISO_STOPS,
  CAMERA_PRESETS,
  type PhotoPreset,
} from '../data/photographyData';
import { cameraAudio } from '../utils/cameraAudio';
import { CORRECT, WRONG } from '../../../components/ui';

interface CapturedPhoto {
  id: string;
  timestamp: string;
  preset: PhotoPreset;
  aperture: number;
  shutter: { value: number; label: string };
  iso: number;
  evDiff: number;
  qualityTag: 'Mükemmel' | 'Az Pozlanmış' | 'Aşırı Pozlanmış' | 'Bulanık' | 'Grenli';
  comment: string;
}

export const CameraSimulator: React.FC = () => {
  // Aktif Preset / Sahne
  const [selectedPreset, setSelectedPreset] = useState<PhotoPreset>(CAMERA_PRESETS[0]);

  // Kamera Ayarları
  const [aperture, setAperture] = useState<number>(1.8);
  const [shutterIndex, setShutterIndex] = useState<number>(4); // 1/250s
  const [iso, setIso] = useState<number>(100);

  // Görünüm & UI Ayarları
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showHistogram, setShowHistogram] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(cameraAudio.getIsMuted());
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [recentShots, setRecentShots] = useState<CapturedPhoto[]>([]);
  const [selectedShotForReview, setSelectedShotForReview] = useState<CapturedPhoto | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentShutter = SHUTTER_STOPS[shutterIndex] || SHUTTER_STOPS[4];

  // Ses kapatma / açma
  const toggleMute = () => {
    const next = !isMuted;
    cameraAudio.setMuted(next);
    setIsMuted(next);
  };

  // Preset seçildiğinde ayarları otomatik olarak önerilen değerlere getir
  const handleSelectPreset = (preset: PhotoPreset) => {
    setSelectedPreset(preset);
    setAperture(preset.recommendedAperture);
    const sIndex = SHUTTER_STOPS.findIndex((s) => Math.abs(s.value - preset.recommendedShutter) < 0.0001);
    setShutterIndex(sIndex !== -1 ? sIndex : 4);
    setIso(preset.recommendedIso);
    cameraAudio.playDialTick();
  };

  // Pozlama Değeri (EV) ve Farkı Hesaplama
  // EV_settings = log2(N^2 / t) - log2(ISO / 100)
  // Delta_EV = EV_scene - EV_settings (Pozometre mantığı: + ise sahne ayarlardan parlak, - ise karanlık)
  const { evDiff, exposureBrightness, dofBlurPx, motionBlurPx, grainAmount } = useMemo(() => {
    const N = aperture;
    const t = currentShutter.value;
    const S = iso;

    // Ayarların karşılayabildiği EV
    const evSettings = Math.log2((N * N) / t) - Math.log2(S / 100);
    // Sahnenin ambient EV'si ile fark (Pozometre ibresi)
    // Pozometre: Eğer ayarlar az ışık alıyorsa ibre eksiye (-) gider
    const deltaEv = selectedPreset.ambientLightEv - evSettings;
    const clampedEv = Math.max(-3.5, Math.min(3.5, deltaEv));

    // Görsel parlaklık çarpanı: 0 EV = 1.0 (normal)
    // -2 EV = 0.25 (karanlık), +2 EV = 2.2 (patlak)
    const brightness = Math.max(0.08, Math.min(2.5, Math.pow(2, deltaEv)));

    // Alan derinliği bulanıklığı (Küçük f/ sayısı = büyük arka plan bulanıklığı)
    // f/1.4 -> 20px blur, f/22 -> 0px blur
    const dofBlur = Math.max(0, (22 - aperture) * 1.1);

    // Hareket bulanıklığı (Enstantane süresine ve konunun hızına göre)
    let motionVelocity = 1.0;
    if (selectedPreset.subjectType === 'action') motionVelocity = 8.0;
    if (selectedPreset.subjectType === 'waterfall') motionVelocity = 3.5;
    if (selectedPreset.subjectType === 'night_city') motionVelocity = 4.0;
    if (selectedPreset.subjectType === 'portrait') motionVelocity = 0.4;

    // 1/500s ve daha hızlısında el/konu hareketi donar
    const motionBlur = Math.max(0, (t - 0.002) * 80 * motionVelocity);

    // Gren miktarı (ISO 100-200 temiz, ISO 3200+ belirgin gren)
    const grain = Math.max(0, (iso - 400) / 12800);

    return {
      evDiff: Number(clampedEv.toFixed(1)),
      exposureBrightness: brightness,
      dofBlurPx: dofBlur,
      motionBlurPx: Math.min(30, motionBlur),
      grainAmount: grain,
    };
  }, [aperture, currentShutter, iso, selectedPreset]);

  // Canvas üzerine simüle edilmiş görüntüyü çizme (Gerçek zamanlı render)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Temizle
    ctx.clearRect(0, 0, width, height);

    // 1. Arka Plan Katmanı (DoF bulanıklığı ve Sahne Rengi/Gradı)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    if (selectedPreset.subjectType === 'portrait') {
      bgGrad.addColorStop(0, '#3a241d');
      bgGrad.addColorStop(0.5, '#784333');
      bgGrad.addColorStop(1, '#1f130e');
    } else if (selectedPreset.subjectType === 'action') {
      bgGrad.addColorStop(0, '#1c382b');
      bgGrad.addColorStop(0.7, '#346547');
      bgGrad.addColorStop(1, '#0e2017');
    } else if (selectedPreset.subjectType === 'waterfall') {
      bgGrad.addColorStop(0, '#1a3344');
      bgGrad.addColorStop(0.6, '#315f7a');
      bgGrad.addColorStop(1, '#0c1a24');
    } else if (selectedPreset.subjectType === 'night_city') {
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(0.7, '#131e33');
      bgGrad.addColorStop(1, '#05070a');
    } else {
      bgGrad.addColorStop(0, '#2e122b');
      bgGrad.addColorStop(0.7, '#592051');
      bgGrad.addColorStop(1, '#150614');
    }

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Arka Plandaki Bokeh Işık Daireleri (Açık Diyaframda Büyüyen Küreler)
    if (dofBlurPx > 4) {
      const bokehCount = Math.floor(dofBlurPx * 1.5) + 6;
      ctx.save();
      for (let i = 0; i < bokehCount; i++) {
        const bx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
        const by = (Math.cos(i * 33) * 0.4 + 0.3) * height;
        const br = 12 + dofBlurPx * 1.8 * (0.6 + (i % 3) * 0.3);

        const bokehGrad = ctx.createRadialGradient(bx, by, br * 0.2, bx, by, br);
        bokehGrad.addColorStop(0, 'rgba(255, 230, 180, 0.45)');
        bokehGrad.addColorStop(0.8, 'rgba(255, 200, 140, 0.18)');
        bokehGrad.addColorStop(1, 'rgba(255, 200, 140, 0)');

        ctx.fillStyle = bokehGrad;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. Konu Çizimi (Ortadaki Odaklanmış Nesne)
    ctx.save();
    // Hareket bulanıklığı varsa yatayda kaydırıp saydam katmanlar çiz
    const blurSteps = motionBlurPx > 1 ? Math.min(8, Math.floor(motionBlurPx)) : 1;
    for (let s = 0; s < blurSteps; s++) {
      const offset = (s - blurSteps / 2) * (motionBlurPx / blurSteps);
      const alpha = 1.0 / blurSteps;

      ctx.save();
      ctx.translate(offset, 0);
      ctx.globalAlpha = alpha;

      // Konu Şekli (Kamera Silüeti / Portre / Aksiyon Kuşu / Şelale Çizgileri)
      if (selectedPreset.subjectType === 'portrait') {
        // Portre Silüeti & Yüz Çizgisi
        ctx.fillStyle = '#ffdfc4';
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.44, 75, 0, Math.PI * 2);
        ctx.fill();

        // Omuzlar
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.ellipse(width * 0.5, height * 0.88, 140, 90, 0, 0, Math.PI * 2);
        ctx.fill();

        // Saç
        ctx.fillStyle = '#4a2912';
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.4, 82, Math.PI * 0.8, Math.PI * 2.2);
        ctx.fill();

        // Gözler (Netleme noktası)
        ctx.fillStyle = '#2c1e13';
        ctx.beginPath();
        ctx.arc(width * 0.46, height * 0.43, 6, 0, Math.PI * 2);
        ctx.arc(width * 0.54, height * 0.43, 6, 0, Math.PI * 2);
        ctx.fill();
      } else if (selectedPreset.subjectType === 'action') {
        // Hızlı Kuş Silüeti
        ctx.fillStyle = '#e8f0fe';
        ctx.beginPath();
        // Gövde
        ctx.ellipse(width * 0.5, height * 0.48, 45, 22, -0.2, 0, Math.PI * 2);
        ctx.fill();
        // Kanatlar (Hızlı hareket eden parçalar)
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(width * 0.5, height * 0.46);
        ctx.lineTo(width * 0.35, height * 0.22);
        ctx.lineTo(width * 0.46, height * 0.46);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(width * 0.5, height * 0.46);
        ctx.lineTo(width * 0.65, height * 0.22);
        ctx.lineTo(width * 0.54, height * 0.46);
        ctx.fill();
        // Gaga
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(width * 0.54, height * 0.46);
        ctx.lineTo(width * 0.6, height * 0.47);
        ctx.lineTo(width * 0.54, height * 0.49);
        ctx.fill();
      } else if (selectedPreset.subjectType === 'waterfall') {
        // Şelale ve Kayalar
        ctx.fillStyle = '#262d35';
        ctx.fillRect(0, 0, width * 0.35, height);
        ctx.fillRect(width * 0.65, 0, width * 0.35, height);

        // Akan Su (Yavaş enstantanede ipeksi beyaz sis, hızlıda pütürlü su damlaları)
        const waterGrad = ctx.createLinearGradient(0, 0, 0, height);
        waterGrad.addColorStop(0, 'rgba(230, 245, 255, 0.85)');
        waterGrad.addColorStop(1, 'rgba(210, 235, 250, 0.95)');
        ctx.fillStyle = waterGrad;

        if (motionBlurPx > 6) {
          // İpeksi akış
          ctx.fillRect(width * 0.35, 0, width * 0.3, height);
        } else {
          // Donmuş damlacıklar
          ctx.fillRect(width * 0.36, 0, width * 0.28, height);
          ctx.fillStyle = '#ffffff';
          for (let d = 0; d < 40; d++) {
            const dx = width * 0.36 + Math.random() * (width * 0.28);
            const dy = Math.random() * height;
            ctx.beginPath();
            ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (selectedPreset.subjectType === 'night_city') {
        // Gece Şehir Binaları ve Işık Çizgileri
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(width * 0.1, height * 0.2, 70, height * 0.8);
        ctx.fillRect(width * 0.3, height * 0.1, 90, height * 0.9);
        ctx.fillRect(width * 0.65, height * 0.15, 80, height * 0.85);

        // Işık Çizgileri (Uzun pozlamada akan neon nehirleri)
        const lineCount = motionBlurPx > 5 ? 12 : 3;
        for (let l = 0; l < lineCount; l++) {
          const ly = height * 0.75 + l * 8;
          ctx.strokeStyle = l % 2 === 0 ? '#ef4444' : '#eab308';
          ctx.lineWidth = motionBlurPx > 5 ? 4 : 2;
          ctx.beginPath();
          ctx.moveTo(0, ly);
          ctx.lineTo(width, ly);
          ctx.stroke();
        }
      } else {
        // Konser ve Gitarist
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.38, 55, 0, Math.PI * 2);
        ctx.fill();
        // Mikrofon
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(width * 0.49, height * 0.35, 8, 45);
      }

      ctx.restore();
    }
    ctx.restore();

    // 4. Pozlama Parlaklık Filtresi (Over / Under Exposure Uygulaması)
    ctx.save();
    if (exposureBrightness < 0.9) {
      // Karanlık (Az Pozlama): Siyah şeffaf katman
      const darkness = Math.min(0.92, 1 - exposureBrightness);
      ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`;
      ctx.fillRect(0, 0, width, height);
    } else if (exposureBrightness > 1.1) {
      // Aşırı Pozlama: Beyaz patlama katmanı
      const blown = Math.min(0.88, (exposureBrightness - 1) * 0.65);
      ctx.fillStyle = `rgba(255, 255, 255, ${blown})`;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();

    // 5. ISO Gren / Kumlanma (Noise) Sentezi
    if (grainAmount > 0.05) {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const noiseIntensity = grainAmount * 65;

      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < 0.4) {
          const randNoise = (Math.random() - 0.5) * noiseIntensity;
          data[i] = Math.max(0, Math.min(255, data[i] + randNoise));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + randNoise));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + randNoise));
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
  }, [selectedPreset, aperture, currentShutter, iso, exposureBrightness, dofBlurPx, motionBlurPx, grainAmount]);

  // Deklanşöre Basma & Fotoğraf Çekme
  const handleShutterRelease = () => {
    if (isShooting) return;
    setIsShooting(true);

    // Gerçekçi deklanşör sesini tetikle (enstantane süresi kadar bekletir)
    cameraAudio.playShutterSound(currentShutter.value);

    // Vizör yanıp sönme efekti
    setTimeout(() => {
      setIsShooting(false);

      // Fotoğrafı analiz et ve galeriye ekle
      let tag: CapturedPhoto['qualityTag'] = 'Mükemmel';
      let comment = 'Harika dengelenmiş pozlama! Konu net ve tonlar pürüzsüz.';

      if (evDiff <= -1.8) {
        tag = 'Az Pozlanmış';
        comment = 'Kare çok karanlık (-' + Math.abs(evDiff) + ' EV). Diyaframı açın veya enstantaneyi uzatın.';
      } else if (evDiff >= 1.8) {
        tag = 'Aşırı Pozlanmış';
        comment = 'Beyazlar patlamış (+' + evDiff + ' EV). Diyaframı kısın veya enstantaneyi hızlandırın.';
      } else if (motionBlurPx > 10) {
        tag = 'Bulanık';
        comment = 'Hareket bulanıklığı oluştu (' + currentShutter.label + '). Hızlı hareket için 1/500s veya daha hızlı seçin.';
      } else if (grainAmount > 0.35) {
        tag = 'Grenli';
        comment = 'ISO ' + iso + ' yüksek gürültü üretti. Mümkünse diyaframı açarak ISO\'yu düşürün.';
      }

      const newShot: CapturedPhoto = {
        id: 'shot-' + Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        preset: selectedPreset,
        aperture,
        shutter: currentShutter,
        iso,
        evDiff,
        qualityTag: tag,
        comment,
      };

      setRecentShots((prev) => [newShot, ...prev.slice(0, 5)]);
    }, Math.max(120, Math.min(currentShutter.value * 1000, 2000)));
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Preset Seçici */}
      <div className="bg-white border border-[#EBE7E0] rounded-[20px] p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0ECE6]">
          <div>
            <h2 className="text-xl font-bold text-[#1F1E1B] flex items-center gap-2">
              <Camera className="w-5 h-5 text-[var(--accent)]" />
              İnteraktif Pozlama & Kamera Simülatörü
            </h2>
            <p className="text-sm text-[#66635E] mt-0.5">
              Diyafram, Enstantane ve ISO ayarlarının gerçek zamanlı etkisini vizörde deneyimleyin.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isMuted
                  ? 'bg-[var(--accent-light)] text-[var(--accent)] border-[var(--accent)]/30'
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {isMuted ? 'Sessiz' : 'Mekanik Ses Açık'}
            </button>
            <button
              onClick={() => handleSelectPreset(selectedPreset)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 transition-colors"
              title="Önerilen ayarlara dön"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Sıfırla
            </button>
          </div>
        </div>

        {/* Sahne / Senaryo Butonları */}
        <div className="pt-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A8680] block mb-2">
            Çekim Senaryosu Seç:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {CAMERA_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-2.5 rounded-[16px] border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[var(--accent-light)] border-[var(--accent)] ring-2 ring-[var(--accent)]/20 text-[var(--accent)] font-medium'
                      : 'bg-[#FAF8F5] border-[#EBE7E0] hover:bg-[#F3EFEA] text-[#333]'
                  }`}
                >
                  <span className="font-bold block truncate">{preset.name}</span>
                  <span className="text-[11px] text-[#7A7670] mt-1 line-clamp-1">{preset.category}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vizör (DSLR / Mirrorless Viewfinder) + Ayar Paneli */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol Kolon: Vizör ve Gerçek Zamanlı Görsel Ekran (7 Kolon) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative bg-black rounded-[20px] overflow-hidden shadow-xl border-4 border-stone-800">
            {/* Vizör Üst Bilgi Barı */}
            <div className="absolute top-0 left-0 right-0 z-20 px-4 py-2 flex items-center justify-between text-[11px] tracking-wider text-[var(--accent)] bg-black/60 backdrop-blur-xs">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                  CANLI VİZÖR
                </span>
                <span className="text-stone-300">RAW • L</span>
                <span className="text-[var(--accent)] font-semibold">AF-S</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-1 rounded transition-colors ${showGrid ? 'text-[var(--accent)] bg-white/10' : 'text-stone-400'}`}
                  title="Izgara Çizgileri"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowHistogram(!showHistogram)}
                  className={`p-1 rounded transition-colors ${showHistogram ? 'text-[var(--accent)] bg-white/10' : 'text-stone-400'}`}
                  title="Histogram"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
                <span className="text-stone-400">PIL [||||] 92%</span>
              </div>
            </div>

            {/* Simüle Edilen Canvas Görüntüsü */}
            <div className="relative aspect-4/3 w-full bg-stone-900 flex items-center justify-center overflow-hidden">
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="w-full h-full object-cover transition-opacity duration-75"
              />

              {/* Deklanşör Siyah Perde Flaş Efekti */}
              {isShooting && (
                <div className="absolute inset-0 bg-black z-40 animate-out fade-out duration-150" />
              )}

              {/* 3x3 Kompozisyon Izgarası */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10">
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-white/20" />
                  <div className="border-r border-white/20" />
                  <div className="" />
                </div>
              )}

              {/* Merkezi Netleme Retikülü */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-16 h-16 border border-[var(--accent)]/80 rounded-sm flex items-center justify-center shadow-xs">
                  <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
                </div>
              </div>

              {/* Canlı Histogram Mini Widget */}
              {showHistogram && (
                <div className="absolute top-10 right-3 z-20 bg-black/70 border border-stone-700/80 rounded-md p-2 w-28 pointer-events-none">
                  <span className="text-[9px] text-stone-400 block mb-1">HISTOGRAM</span>
                  <div className="h-10 w-full flex items-end gap-0.5">
                    {/* Basit dinamik luma çubukları */}
                    <div
                      className="flex-1 bg-stone-500 rounded-t-xs"
                      style={{ height: `${Math.max(10, Math.min(100, (1 - exposureBrightness * 0.5) * 100))}%` }}
                    />
                    <div
                      className="flex-1 bg-[var(--accent)] rounded-t-xs"
                      style={{ height: `${Math.max(20, Math.min(100, 100 - Math.abs(evDiff) * 25))}%` }}
                    />
                    <div
                      className="flex-1 bg-[var(--accent)] rounded-t-xs"
                      style={{ height: `${Math.max(10, Math.min(100, exposureBrightness * 40))}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Pozlama Durum Uyarısı Overlay */}
              <div className="absolute bottom-14 left-4 z-20 pointer-events-none">
                {evDiff <= -2.0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black/80 border border-[var(--accent)]/70 text-[var(--accent)] text-xs font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" /> Çok Karanlık (-{Math.abs(evDiff)} EV)
                  </span>
                )}
                {evDiff >= 2.0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black/80 border border-[var(--accent)]/70 text-[var(--accent)] text-xs font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" /> Patlamış Beyazlar (+{evDiff} EV)
                  </span>
                )}
                {Math.abs(evDiff) < 1.0 && motionBlurPx < 8 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black/80 border border-[var(--accent)]/70 text-[var(--accent)] text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mükemmel Pozlama Dengesi
                  </span>
                )}
              </div>
            </div>

            {/* Vizör Alt Bilgi HUD'ı (Kamera Ekranı) */}
            <div className="bg-stone-950 px-4 py-3 border-t border-stone-800 text-stone-200 flex flex-col gap-2 ">
              <div className="flex items-center justify-between">
                {/* Enstantane */}
                <div className="text-center">
                  <span className="text-[10px] text-stone-400 block">ENSTANTANE</span>
                  <span className="text-base sm:text-lg font-bold text-[var(--accent)]">{currentShutter.label}</span>
                </div>
                {/* Diyafram */}
                <div className="text-center">
                  <span className="text-[10px] text-stone-400 block">DİYAFRAM</span>
                  <span className="text-base sm:text-lg font-bold text-[var(--accent)]">f/{aperture}</span>
                </div>
                {/* ISO */}
                <div className="text-center">
                  <span className="text-[10px] text-stone-400 block">ISO</span>
                  <span className="text-base sm:text-lg font-bold text-[var(--accent)]">{iso}</span>
                </div>
              </div>

              {/* Pozometre Skalası (-3 .. 0 .. +3) */}
              <div className="pt-1 border-t border-stone-800/80">
                <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                  <span>-3 (Karanlık)</span>
                  <span className="text-[var(--accent)] font-bold">0 (Dengeli)</span>
                  <span>+3 (Patlak)</span>
                </div>
                {/* Gösterge Çubuğu */}
                <div className="relative h-3 bg-stone-900 rounded-full border border-stone-700 overflow-hidden flex items-center px-1">
                  {/* Merkez çizgisi */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[var(--accent)]/60" />
                  {/* Dinamik İbre */}
                  <div
                    className="absolute top-0.5 bottom-0.5 w-3.5 rounded-full transition-all duration-150 flex items-center justify-center text-[8px] font-bold text-black"
                    style={{
                      left: `calc(${((evDiff + 3) / 6) * 100}% - 7px)`,
                      backgroundColor: Math.abs(evDiff) < 0.6 ? '#10b981' : Math.abs(evDiff) < 1.5 ? '#f59e0b' : '#ef4444',
                    }}
                  >
                    {evDiff > 0 ? `+${evDiff}` : evDiff}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Büyük Deklanşör Butonu */}
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={handleShutterRelease}
              disabled={isShooting}
              className={`group relative flex items-center justify-center gap-3 w-full sm:w-80 py-4 px-6 rounded-[20px] font-bold text-base shadow-lg transition-all active:scale-95 ${
                isShooting
                  ? 'bg-stone-400 text-stone-200 cursor-not-allowed'
                  : 'bg-[var(--accent)] hover:bg-[var(--accent)] text-white ring-4 ring-[var(--accent)]/20 hover:shadow-[var(--accent)]/30'
              }`}
            >
              <span className="w-5 h-5 rounded-full border-2 border-white/80 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white group-hover:scale-125 transition-transform" />
              </span>
              <span>{isShooting ? 'Fotoğraf Çekiliyor...' : 'DEKLANŞÖRE BAS (Fotoğrafı Çek)'}</span>
            </button>
          </div>
        </div>

        {/* Sağ Kolon: Pozlama Üçgeni Kadranları & Canlı Analiz (5 Kolon) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Kontrol Paneli */}
          <div className="bg-white border border-[#EBE7E0] rounded-[20px] p-5 shadow-sm space-y-5">
            <h3 className="font-bold text-[#1F1E1B] text-base flex items-center gap-2 border-b border-[#F0ECE6] pb-3">
              <Sliders className="w-4 h-4 text-[var(--accent)]" />
              Manuel Pozlama Kadranları
            </h3>

            {/* 1. Diyafram Kontrolü */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1F1E1B] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] inline-block" />
                  Diyafram Açıklığı (Aperture)
                </span>
                <span className="font-bold text-[var(--accent)] text-sm">f/{aperture}</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {APERTURE_STOPS.map((stop) => {
                  const active = stop === aperture;
                  return (
                    <button
                      key={stop}
                      onClick={() => {
                        setAperture(stop);
                        cameraAudio.playDialTick();
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 ${
                        active
                          ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-xs'
                          : 'bg-[#FAF8F5] text-[#333] border-[#E0DCD6] hover:bg-stone-200'
                      }`}
                    >
                      f/{stop}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#66635E]">
                {aperture <= 2.8
                  ? '✨ Geniş diyafram: Arka plan yumuşak erir (bokeh), bol ışık girer.'
                  : aperture >= 11
                  ? '⛰️ Kısık diyafram: Manzara için baştan sona geniş netlik, az ışık girer.'
                  : '⚖️ Dengeli diyafram: Genel çekimler için ideal netlik.'}
              </p>
            </div>

            {/* 2. Enstantane Hızı Kontrolü */}
            <div className="space-y-2 pt-2 border-t border-[#F0ECE6]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1F1E1B] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] inline-block" />
                  Enstantane Hızı (Shutter Speed)
                </span>
                <span className="font-bold text-[var(--accent)] text-sm">{currentShutter.label}</span>
              </div>
              <input
                type="range"
                min={0}
                max={SHUTTER_STOPS.length - 1}
                value={shutterIndex}
                onChange={(e) => {
                  setShutterIndex(Number(e.target.value));
                  cameraAudio.playDialTick();
                }}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
              />
              <div className="flex justify-between text-[10px] text-stone-500 ">
                <span>1/4000s (Hızlı)</span>
                <span>1/60s (Elde sınır)</span>
                <span>4s (Uzun)</span>
              </div>
              <p className="text-[11px] text-[#66635E]">
                {currentShutter.value <= 0.002
                  ? '⚡ Hareketi dondurur: Sporcular ve uçan kuşlar havada asılı kalır.'
                  : currentShutter.value >= 0.5
                  ? '🌊 Uzun pozlama: Akan sular tül gibi ipeksi akar, ışık izleri oluşur.'
                  : '📷 Standart hız: Portre ve durağan konular için uygundur.'}
              </p>
            </div>

            {/* 3. ISO Kontrolü */}
            <div className="space-y-2 pt-2 border-t border-[#F0ECE6]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1F1E1B] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] inline-block" />
                  ISO (Sensör Kazancı)
                </span>
                <span className="font-bold text-[var(--accent)] text-sm">ISO {iso}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {ISO_STOPS.map((isoVal) => {
                  const active = isoVal === iso;
                  return (
                    <button
                      key={isoVal}
                      onClick={() => {
                        setIso(isoVal);
                        cameraAudio.playDialTick();
                      }}
                      className={`py-1 rounded-lg text-xs font-medium border transition-colors ${
                        active
                          ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                          : 'bg-[#FAF8F5] text-[#333] border-[#E0DCD6] hover:bg-stone-200'
                      }`}
                    >
                      {isoVal}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#66635E]">
                {iso <= 200
                  ? '💎 Taban ISO: En temiz, grensiz ve dinamik aralığı en yüksek görüntü.'
                  : iso >= 3200
                  ? '⚠️ Yüksek ISO: Karanlığı kurtarır fakat kumlanma (gren) kaçınılmazdır.'
                  : '🌿 Orta ISO: Kapalı mekanlar ve gün batımı için dengeli kazanç.'}
              </p>
            </div>
          </div>

          {/* Canlı Pedagojik Fotoğraf Koçu / Durum Analizi */}
          <div className="bg-[#FAF8F5] border border-[#EBE7E0] rounded-[20px] p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8680] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[var(--accent)]" />
              Canlı Pozlama Koçu
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 bg-white p-2.5 rounded-[16px] border border-[#EBE7E0]">
                <span className="p-1 rounded-md bg-stone-100 text-stone-700 mt-0.5">
                  <Eye className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="font-bold text-[#1F1E1B] block">Alan Derinliği Durumu:</span>
                  <span className="text-[#66635E]">
                    {dofBlurPx > 10 ? 'Arka plan güçlü şekilde bulanıklaştırıldı (Bokeh açık).' : 'Geniş netlik derinliği sağlanıyor.'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white p-2.5 rounded-[16px] border border-[#EBE7E0]">
                <span className="p-1 rounded-md bg-stone-100 text-stone-700 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="font-bold text-[#1F1E1B] block">Hareket Karakteri:</span>
                  <span className="text-[#66635E]">
                    {motionBlurPx > 10
                      ? '⚠️ Dikkat: Konu hareketli ise karede hareket izi ve bulanıklık oluşacak!'
                      : 'Hareketi dondurma garantili.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Son Çekilen Fotoğraflar Galerisi & EXIF İnceleme */}
      {recentShots.length > 0 && (
        <div className="bg-white border border-[#EBE7E0] rounded-[20px] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#1F1E1B] text-base flex items-center gap-2">
              <Camera className="w-4 h-4 text-[var(--accent)]" />
              Çekilen Fotoğraflar & EXIF İnceleme ({recentShots.length})
            </h3>
            <span className="text-xs text-[#7A7670]">Tıklayarak detaylı geri bildirimi görün</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {recentShots.map((shot) => {
              const isSelected = selectedShotForReview?.id === shot.id;
              return (
                <button
                  key={shot.id}
                  onClick={() => setSelectedShotForReview(shot)}
                  className={`text-left rounded-[16px] p-2.5 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent-light)]/50 ring-2 ring-[var(--accent)]/20'
                      : 'border-[#EBE7E0] bg-[#FAF8F5] hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#7A7670] mb-1">
                    <span>{shot.timestamp}</span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                      style={
                        shot.qualityTag === 'Mükemmel'
                          ? { background: CORRECT.bg, color: CORRECT.fg }
                          : { background: WRONG.bg, color: WRONG.fg }
                      }
                    >
                      {shot.qualityTag}
                    </span>
                  </div>
                  <span className="font-bold text-xs text-[#1F1E1B] truncate">{shot.preset.name}</span>
                  <div className="text-[11px] text-stone-600 mt-1">
                    f/{shot.aperture} • {shot.shutter.label} • ISO {shot.iso}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Seçili Fotoğraf Değerlendirme Kartı */}
          {selectedShotForReview && (
            <div className="bg-[#FAF8F5] border border-[#EBE7E0] rounded-[16px] p-4 mt-3 flex flex-col sm:flex-row items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[var(--accent)] block uppercase tracking-wide">
                  Eğitmen Değerlendirmesi:
                </span>
                <p className="text-sm text-[#1F1E1B] mt-1 font-medium">{selectedShotForReview.comment}</p>
                <div className="text-xs text-[#66635E] mt-1">
                  Pozometre Durumu:{' '}
                  <span className="font-bold text-[#1F1E1B]">
                    {selectedShotForReview.evDiff > 0 ? `+${selectedShotForReview.evDiff}` : selectedShotForReview.evDiff} EV
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedShotForReview(null)}
                className="text-xs text-[#8A8680] hover:text-[#1F1E1B] underline self-end sm:self-center"
              >
                Kapat
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
