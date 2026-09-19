import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  Lightbulb, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../utils/sound';

export const GuideTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'system' | 'pronunciation' | 'katakana_confusion' | 'calligraphy'>('system');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Guide Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E3D8] shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F1E1D]">
            Japonca Alfabe & Telaffuz Rehberi
          </h2>
        </div>
        <p className="text-sm text-[#6A655C] max-w-3xl leading-relaxed">
          Japonca fonetik olarak Türkçe ile büyük benzerlikler gösterir. Hece yapısı sayesinde seslerin çıkarılışı Türkçeye çok yakındır. Bu rehberde alfabenin mantığını, telaffuz kurallarını ve en çok karıştırılan noktaları öğreneceksin.
        </p>

        {/* Navigation Tabs within Guide */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[#EAE5DA]">
          {[
            { id: 'system' as const, label: '1. Yazı Sisteminin Mantığı' },
            { id: 'pronunciation' as const, label: '2. Telaffuz İncelikleri' },
            { id: 'katakana_confusion' as const, label: '3. Karıştırılan Harfler' },
            { id: 'calligraphy' as const, label: '4. Çizim Kuralları (Vuruşlar)' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                soundManager.playFlipSound();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeSection === item.id
                  ? 'bg-[#1F1E1D] text-white shadow-xs'
                  : 'bg-[#F5F2EC] text-[#555047] hover:bg-[#EBE6DC]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: YAZI SİSTEMİ */}
      {activeSection === 'system' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E3D8] shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-[#1F1E1D] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center">1</span>
              Neden Japonca'da 3 Farklı Yazı Sistemi Var?
            </h3>
            
            <p className="text-sm text-[#47433B] leading-relaxed">
              Japonca yazılırken üç farklı karakter kümesi bir arada kullanılır. Bu karmaşık gibi görünse de her birinin çok net bir görevi vardır:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Hiragana Card */}
              <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-rose-700">ひらがな</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-200 text-rose-900">46 Temel Karakter</span>
                </div>
                <h4 className="text-base font-bold text-[#1F1E1D]">Hiragana</h4>
                <p className="text-xs text-[#524E47] leading-relaxed">
                  Kıvrımlı ve yumuşak hatlara sahiptir. Saf Japonca kelimeler, fiil çekimleri ve gramer ekleri (parçacıklar) için kullanılır. Japonca öğrenmeye başlarken ilk öğrenilen alfabedir.
                </p>
                <div className="p-2.5 rounded-xl bg-white/80 border border-rose-200/60 text-xs">
                  <strong>Örnek:</strong> ありがとう (Arigatou), ねこ (Neko)
                </div>
              </div>

              {/* Katakana Card */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-indigo-700">カタカナ</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-200 text-indigo-900">46 Temel Karakter</span>
                </div>
                <h4 className="text-base font-bold text-[#1F1E1D]">Katakana</h4>
                <p className="text-xs text-[#524E47] leading-relaxed">
                  Daha keskin, köşeli ve düz hatlara sahiptir. Yabancı dillerden (İngilizce vb.) geçen kelimeler, yabancı kişi/ülke isimleri ve doğadaki ses yansımaları (şapırtı, miyav vb.) için kullanılır.
                </p>
                <div className="p-2.5 rounded-xl bg-white/80 border border-indigo-200/60 text-xs">
                  <strong>Örnek:</strong> コーヒー (Kahve), トルコ (Türkiye)
                </div>
              </div>

              {/* Kanji Card */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-800">漢字</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-200 text-amber-900">Binlerce İdeogram</span>
                </div>
                <h4 className="text-base font-bold text-[#1F1E1D]">Kanji</h4>
                <p className="text-xs text-[#524E47] leading-relaxed">
                  Çin'den geçen kavram işaretleridir. Her karakter bir hece değil, doğrudan bir anlam veya nesne (su, ağaç, insan, sevgi) temsil eder. Cümlede isim ve fiil köklerini oluşturur.
                </p>
                <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/60 text-xs">
                  <strong>Örnek:</strong> 日本 (Japonya), 水 (Su)
                </div>
              </div>

            </div>

            {/* Practical Example Sentence */}
            <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#E4DED4]">
              <h4 className="text-xs font-bold text-[#7A756D] uppercase tracking-wider mb-2">
                Hepsini Bir Cümlede Görelim:
              </h4>
              <div className="text-lg sm:text-xl font-bold text-[#1F1E1D] flex flex-wrap items-center gap-2">
                <span className="text-amber-700 underline decoration-amber-400" title="Kanji: Ben">私</span>
                <span className="text-rose-600" title="Hiragana: Konu eki (wa)">は</span>
                <span className="text-indigo-600 underline decoration-indigo-300" title="Katakana: Kahve">コーヒー</span>
                <span className="text-rose-600" title="Hiragana: Nesne eki (o)">を</span>
                <span className="text-amber-700 underline decoration-amber-400" title="Kanji: İçmek">飲</span>
                <span className="text-rose-600" title="Hiragana: Fiil çekim eki (mimasu)">みます</span>。
              </div>
              <p className="text-xs text-[#6A655C] mt-2">
                <strong>Okunuşu:</strong> Watashi wa koohii o nomimasu. (Ben kahve içerim.)
                <br />
                <em>Görüldüğü gibi kahve kelimesi Katakana, kişi ve içmek kökü Kanji, ekler ise Hiragana ile yazılmıştır.</em>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: TELAFFUZ İNCELİKLERİ */}
      {activeSection === 'pronunciation' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E3D8] shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-[#1F1E1D] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center">2</span>
              Türkçe Konuşanlar İçin Japonca Telaffuz Püf Noktaları
            </h3>

            <div className="space-y-4">
              
              {/* Tsu Sesi */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D6] flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 font-bold text-2xl flex items-center justify-center border border-rose-200 shrink-0">
                  つ
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1F1E1D]">
                      1. "Tsu" Sesi (つ / ツ)
                    </h4>
                    <button
                      onClick={() => soundManager.speak('つき')}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-1 text-xs font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dinle (Tsuki)</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#524E47] leading-relaxed">
                    Türkçede bulunmayan en özel sestir. <strong>T</strong> ve <strong>S</strong> seslerinin tek bir patlamada birleşmesiyle çıkar (Tsunami derken olduğu gibi). Dil ucu ön üst dişlerin hemen arkasına yaslanır ve hafifçe patlatılır.
                  </p>
                </div>
              </div>

              {/* R / L Sesi */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D6] flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 font-bold text-2xl flex items-center justify-center border border-rose-200 shrink-0">
                  ら
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1F1E1D]">
                      2. Japonca "R" Sesi (ら・り・る・れ・ろ)
                    </h4>
                    <button
                      onClick={() => soundManager.speak('さくら')}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-1 text-xs font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dinle (Sakura)</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#524E47] leading-relaxed">
                    Japoncada Türkçe gibi dili titreterek "Rrr" denmez. Dil ucu üst damağa tek bir hafif dokunuş ("flap") yapar. Bu ses <strong>R ile L arasındadır</strong>. "Sakura" derken R'yi çok yumuşak söyleyin.
                  </p>
                </div>
              </div>

              {/* Fu Sesi */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D6] flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 font-bold text-2xl flex items-center justify-center border border-rose-200 shrink-0">
                  ふ
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1F1E1D]">
                      3. "Fu" Sesi (ふ / フ)
                    </h4>
                    <button
                      onClick={() => soundManager.speak('ふじさん')}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-1 text-xs font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dinle (Fuji-san)</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#524E47] leading-relaxed">
                    Türkçe "F" gibi dişler alt dudağa DEĞMEZ. Sanki önünüzdeki bir mumu hafifçe üflüyormuş gibi iki dudak arasından hava çıkararak söylenir (F ve H arası nefesli ses).
                  </p>
                </div>
              </div>

              {/* Küçük Tsu (Çift Sessizler) */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D6] flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 font-bold text-xl flex items-center justify-center border border-rose-200 shrink-0">
                  っ
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1F1E1D]">
                      4. Küçük Tsu (Sokuon - っ / ッ) ile Çift Sessiz
                    </h4>
                    <button
                      onClick={() => soundManager.speak('ちょっと')}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-1 text-xs font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dinle (Chotto)</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#524E47] leading-relaxed">
                    Kelimelerin ortasında küçük boyutta yazılan <strong>っ</strong> (sokuon), kendisinden sonraki sessiz harfin Türkçedeki gibi çift okunmasını sağlar ve kısa bir nefes duraklaması yaratır.
                    <br />
                    <em>Örnek: きって (kitte - pul), ちょっと (chotto - biraz).</em>
                  </p>
                </div>
              </div>

              {/* Uzun Ünlüler */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D6] flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-2xl flex items-center justify-center border border-indigo-200 shrink-0">
                  ー
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1F1E1D]">
                      5. Uzun Ünlüler (Chōonpu / ー)
                    </h4>
                    <button
                      onClick={() => soundManager.speak('コーヒー')}
                      className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 flex items-center gap-1 text-xs font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dinle (Kōhī)</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#524E47] leading-relaxed">
                    Katakana'da uzun sesler düz bir yatay çizgiyle <strong>(ー)</strong> gösterilir ve önceki heceyi 1 hece uzatır (Örn: コーヒー Koohii). Hiragana'da ise genellikle 'う' (u) harfi eklenerek uzatılır (とうきょう Tōkyō).
                  </p>
                </div>
              </div>

              {/* İstisnai Parçacıklar */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 font-bold text-xl flex items-center justify-center border border-amber-300 shrink-0">
                  は/を
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-bold text-amber-950">
                    6. Çok Önemli 3 Okunuş İstisnası!
                  </h4>
                  <ul className="text-xs text-amber-900 space-y-1 list-disc pl-4 mt-1">
                    <li><strong>は (ha)</strong>: Konu belirten gramer eki olarak kullanıldığında <strong>"WA"</strong> okunur. (こんにちは → Konnichiwa).</li>
                    <li><strong>へ (he)</strong>: Bir yere doğru gitme yön eki olduğunda <strong>"E"</strong> okunur. (日本へ → Nihon e).</li>
                    <li><strong>を (wo)</strong>: Sadece nesne eki olarak kullanılır ve günümüzde <strong>"O"</strong> olarak telaffuz edilir.</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: KARIŞTIRILAN KATAKANA HARFLERİ */}
      {activeSection === 'katakana_confusion' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E3D8] shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1F1E1D] flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center">3</span>
                En Çok Karıştırılan Katakana Karakterleri Ayırt Etme Kılavuzu
              </h3>
            </div>
            
            <p className="text-sm text-[#47433B] leading-relaxed">
              Katakana öğrenirken neredeyse herkesin kafasını karıştıran 4 ünlü karakter vardır: <strong>シ (Shi), ツ (Tsu), ソ (So), ン (N)</strong>. İşte onları bir daha asla karıştırmamanı sağlayacak altın kurallar:
            </p>

            {/* Shi vs Tsu Big Comparison Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Shi Card */}
              <div className="p-6 rounded-2xl bg-white border-2 border-indigo-200 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-6xl font-black text-indigo-700">シ</span>
                  <span className="text-xl font-bold font-mono text-[#1F1E1D]">SHI</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-indigo-950">Göz Kuralı: "Gözlerini Yukarı Çeviren Kız (She)"</h4>
                  <p className="text-xs text-[#555047] leading-relaxed">
                    İki küçük çizgi <strong>yatay hizadadır</strong>. Uzun çizgi ise <strong>aşağıdan yukarıya</strong> doğru hafifçe fırçalanır.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50 text-xs text-indigo-900 font-medium">
                  <strong>İpucu:</strong> Hiragana し harfi gibi dipten yukarı kıvrılır.
                </div>
              </div>

              {/* Tsu Card */}
              <div className="p-6 rounded-2xl bg-white border-2 border-rose-200 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-6xl font-black text-rose-700">ツ</span>
                  <span className="text-xl font-bold font-mono text-[#1F1E1D]">TSU</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-rose-950">Göz Kuralı: "Aşağıya Bakan Tsunami Dalgası"</h4>
                  <p className="text-xs text-[#555047] leading-relaxed">
                    İki küçük çizgi <strong>dikey hizadadır</strong> (üst üste gibi). Uzun çizgi ise <strong>yukarıdan aşağıya</strong> doğru düşer.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 text-xs text-rose-900 font-medium">
                  <strong>İpucu:</strong> Tsunami dalgası yukarıdan aşağıya çarpar!
                </div>
              </div>

            </div>

            {/* So vs N Big Comparison Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              
              {/* So Card */}
              <div className="p-6 rounded-2xl bg-white border-2 border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-6xl font-black text-amber-700">ソ</span>
                  <span className="text-xl font-bold font-mono text-[#1F1E1D]">SO</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-amber-950">"Yukarıdan Aşağı Düşen İğne"</h4>
                  <p className="text-xs text-[#555047] leading-relaxed">
                    Küçük çizgi dik durur. Ana çizgi <strong>yukarıdan aşağıya doğru</strong> eğik şekilde çizilir (Tsu harfine benzer).
                  </p>
                </div>
              </div>

              {/* N Card */}
              <div className="p-6 rounded-2xl bg-white border-2 border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-6xl font-black text-emerald-700">ン</span>
                  <span className="text-xl font-bold font-mono text-[#1F1E1D]">N</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-950">"Aşağıdan Yukarıya Uçan Çizgi"</h4>
                  <p className="text-xs text-[#555047] leading-relaxed">
                    Küçük çizgi yatık durur. Ana çizgi ise <strong>aşağıdan yukarıya doğru</strong> fırçalanır (Shi harfine benzer).
                  </p>
                </div>
              </div>

            </div>

            {/* Other confusing pairs */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D6] space-y-3">
              <h4 className="text-xs font-bold text-[#7A756D] uppercase tracking-wider">
                Diğer Dikkat Edilmesi Gereken Çiftler:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#47433B]">
                <div className="p-3 bg-white rounded-xl border border-[#E2DDD3]">
                  <strong>Hiragana さ (sa) vs ち (chi):</strong>
                  <p className="mt-0.5 text-[#6A655C]">
                    さ (sa) harfinin alt kıvrımı <strong>sağa</strong> bakar. ち (chi) harfinin alt göbeği ise <strong>sola</strong> bakar (5 rakamına benzer).
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E2DDD3]">
                  <strong>Hiragana れ (re) vs わ (wa) vs ね (ne):</strong>
                  <p className="mt-0.5 text-[#6A655C]">
                    わ (wa) düz yay gibi biter. れ (re) sağa dışa doğru kıvrılır. ね (ne) ise ucunda küçük bir düğüm taşır.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 4: ÇİZİM KURALLARI */}
      {activeSection === 'calligraphy' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E3D8] shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-[#1F1E1D] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center">4</span>
              Japon Kaligrafi & Vuruş Kuralları (Tome, Hane, Harai)
            </h3>

            <p className="text-sm text-[#47433B] leading-relaxed">
              Japon karakterlerini çizerken sadece şekil değil, fırçanın veya kalemin vuruş bitişi de büyük önem taşır. Bu üç temel vuruş stili vardır:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#1F1E1D]">止め (Tome)</span>
                  <span className="text-xs font-semibold text-rose-600">DURMA</span>
                </div>
                <p className="text-xs text-[#524E47] leading-relaxed">
                  Çizginin bittiği noktada kalemi aniden kaldırmadan, fırçayı o noktada net ve sağlam bir şekilde durdurmaktır.
                </p>
                <p className="text-[11px] text-[#7A756D] font-mono">Örn: 一 (1 rakamı) sonu</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#1F1E1D]">跳ね (Hane)</span>
                  <span className="text-xs font-semibold text-indigo-600">SIÇRAMA / ÇENGELLENME</span>
                </div>
                <p className="text-xs text-[#524E47] leading-relaxed">
                  Çizginin sonunda kalemi hafifçe yukarı veya sola doğru hızlıca çengelleyerek serbest bırakmaktır.
                </p>
                <p className="text-[11px] text-[#7A756D] font-mono">Örn: い veya か harflerinin ilk çizgisi</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#1F1E1D]">払い (Harai)</span>
                  <span className="text-xs font-semibold text-emerald-600">SÜZÜLME</span>
                </div>
                <p className="text-xs text-[#524E47] leading-relaxed">
                  Çizgi sonuna yaklaşırken kalemin baskısı yavaş yavaş azaltılır, çizgi incelerek zarifçe havaya doğru süzülür.
                </p>
                <p className="text-[11px] text-[#7A756D] font-mono">Örn: 人 veya ノ harfinin ucu</p>
              </div>

            </div>

            {/* General Stroke Order Rules */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Altın Çizim Sırası Kuralları:
              </h4>
              <ul className="text-xs text-[#47433B] space-y-1.5 list-disc pl-5 leading-relaxed">
                <li><strong>Yukarıdan Aşağıya:</strong> Üstteki çizgiler alttaki çizgilerden önce çizilir.</li>
                <li><strong>Soldan Sağa:</strong> Soldaki dikey ya da yatay çizgiler sağdakilerden önce gelir.</li>
                <li><strong>Yatay önce, Dikey sonra:</strong> Kesişen çizgilerde genellikle önce yatay çizgi, sonra kesen dikey çizgi çizilir (Örn: 十).</li>
                <li><strong>Tenten (\") ve Maru (°):</strong> Her zaman karakterin ana gövdesi tamamen bittikten sonra en son eklenir!</li>
              </ul>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
