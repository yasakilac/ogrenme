import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, BookOpen } from 'lucide-react';
import { TURKEY_BIRDS } from '../data/birds';
import { BirdPhoto } from './BirdPhoto';

interface Question {
  id: number;
  birdId?: string;
  type: 'multiple-choice' | 'true-false';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTag: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    birdId: 'flamingo',
    type: 'multiple-choice',
    question: 'Büyük Flamingoların tüylerinin pembe rengini almasının asıl sebebi nedir?',
    options: [
      'Güneş ışınlarının tuz kristalleriyle optik yansıması',
      'Beslendikleri Artemia ve alglerdeki karotenoid pigmentleri',
      'Yuvadaki çamurun kimyasal yapısı',
      'Sadece üreme döneminde salgılanan hormonlar'
    ],
    correctIndex: 1,
    explanation: 'Flamingolar doğduklarında gridir. Karotenoid zengini küçük tuz karidesleri ve algleri süzdükçe pembeleşirler.',
    conceptTag: 'Besin & Adaptasyon'
  },
  {
    id: 2,
    birdId: 'yalicapkini',
    type: 'multiple-choice',
    question: 'Şinkansen hızlı trenlerinin tünel çıkışındaki patlama sesini kesen aerodinamik burun hangi kuştan esinlenilmiştir?',
    options: [
      'Gökçe Yalıçapkını (Mızrak gaga)',
      'Gökdoğan (Çentikli gaga)',
      'Şah Kartal (Kanca gaga)',
      'Ebabil (Geniş ağız)'
    ],
    correctIndex: 0,
    explanation: 'Yalıçapkınının havadan suya sessizce ve sürtünmesiz dalmasını sağlayan hançer gagası, biyomimikri ile hızlı trenlere uygulanmıştır.',
    conceptTag: 'Biyomimikri'
  },
  {
    id: 3,
    birdId: 'ebabil',
    type: 'true-false',
    question: 'Ebabil kuşu geceleri bile yere inmeden havada süzülerek uyuyabilir.',
    options: ['Doğru', 'Yanlış'],
    correctIndex: 0,
    explanation: 'Doğrudur! Ebabiller ayak yapıları yere basmaya uygun olmadığı için beslenme ve uykuyu havada gerçekleştirir.',
    conceptTag: 'Hava Adaptasyonu'
  },
  {
    id: 4,
    birdId: 'gokdogan',
    type: 'multiple-choice',
    question: 'Dünyanın en hızlı hayvanı olan Gökdoğan, dik av dalışında yaklaşık kaç km/s hıza ulaşabilir?',
    options: [
      '120 km/s',
      '220 km/s',
      '390 km/s ve üzeri',
      '600 km/s'
    ],
    correctIndex: 2,
    explanation: 'Gökdoğan dikine av dalışında 390 km/s hızı aşarak gezegenin en hızlı canlısı rekorunu elinde tutar.',
    conceptTag: 'Hız Rekoru'
  },
  {
    id: 5,
    birdId: 'kelaynak',
    type: 'multiple-choice',
    question: 'Türkiye\'de dünyadaki kritik kolonisi Şanlıurfa Birecik\'te korunan tür hangisidir?',
    options: [
      'Turaç',
      'Kelaynak (Kırmızı çıplak başlı sonda gagalı)',
      'Ak Pelikan',
      'İbibik'
    ],
    correctIndex: 1,
    explanation: 'Kelaynaklar aşırı tarım ilacı kullanımı sonrası tükenme sınırına gelmiş ve Birecik Üreme İstasyonu\'nda korunmaktadır.',
    conceptTag: 'Biyoçeşitlilik'
  },
  {
    id: 6,
    birdId: 'sah-kartal',
    type: 'true-false',
    question: 'Doğu Şah Kartalı İç Anadolu bozkırlarında kemirgenleri (gelengi / yer sincabı) avlayarak ekosistemi dengeler.',
    options: ['Doğru', 'Yanlış'],
    correctIndex: 0,
    explanation: 'Doğrudur! Şah Kartal tepe avcı olarak kemirgen popülasyonunu dengede tutar.',
    conceptTag: 'Ekolojik Denge'
  },
  {
    id: 7,
    birdId: 'ak-pelikan',
    type: 'multiple-choice',
    question: 'Ak Pelikanın alt gagasındaki esnek sarı deri torba (kese) ne amaçla kullanılır?',
    options: [
      'Günlerce balık ve et depolamak',
      'Suyu ve balıkları kepçeleyip suyu dışarı süzerek avı yutmak',
      'Solunum oksijeni depolamak',
      'Düşmanlarına sıvı püskürtmek'
    ],
    correctIndex: 1,
    explanation: 'Pelikanın gaga kesesi bir buzdolabı değil, doğal bir balık süzgeci ve kepçesidir.',
    conceptTag: 'Gaga Morfolojisi'
  },
  {
    id: 8,
    birdId: 'ibibik',
    type: 'multiple-choice',
    question: 'Heyecanlandığında başındaki taç tüylerini yelpaze gibi açan, topraktaki böcekleri arayan kuş hangisidir?',
    options: [
      'İbibik (Çavuşkuşu)',
      'Kızıl Gerdan',
      'Turaç',
      'Ebabil'
    ],
    correctIndex: 0,
    explanation: 'İbibik yelpaze ibiği ve ince kavisli böcek cımbızı gagasıyla çok kolay ayırt edilir.',
    conceptTag: 'Morfoloji'
  },
  {
    id: 9,
    birdId: 'turac',
    type: 'true-false',
    question: 'Turaç kuşu gökyüzünde durmaksızın uçarak göç eden bir leylek akrabasıdır.',
    options: ['Doğru', 'Yanlış'],
    correctIndex: 1,
    explanation: 'Yanlıştır! Turaç bir yer kuşudur. Çukurova maki ve fundalıklarında yerde koşarak yaşar.',
    conceptTag: 'Habitat Uyumu'
  },
  {
    id: 10,
    birdId: 'kizilgerdan',
    type: 'multiple-choice',
    question: 'Kızılgerdanın göğsündeki parlak turuncu-kırmızı yamanın evrimsel rolü nedir?',
    options: [
      'Kendi beslenme bölgesini diğer kuşlara karşı savunmak ve sinyal vermek',
      'Gece parıldayarak böcek çekmek',
      'Su geçirmezlik sağlamak',
      'Zehir taklidi yapmak'
    ],
    correctIndex: 0,
    explanation: 'Kızılgerdanlar bölgecidir. Parlak kırmızı gerdanları diğer kuşlara alan sınırı sinyali verir.',
    conceptTag: 'Davranış'
  }
];

export const QuizActivity: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const q = QUIZ_QUESTIONS[currentIdx];
  const relatedBird = q.birdId ? TURKEY_BIRDS.find((b) => b.id === q.birdId) : null;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
    if (idx === q.correctIndex) {
      setScore((prev) => prev + 10);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setIsFinished(false);
    setScore(0);
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 bg-white rounded-3xl border border-stone-200 text-center shadow-xs space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-2xl font-bold text-stone-900 font-serif">Test Tamamlandı</h3>
          <p className="text-xs text-stone-500 mt-1">10 kavram sorusunu başarıyla yanıtladın.</p>
        </div>

        <div className="inline-flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
          <span className="text-stone-500">Skor:</span>
          <span className="text-xl font-bold text-rose-600 font-mono">{score} / 100</span>
        </div>

        <div>
          <button
            id="restart-quiz-btn"
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Yeniden Başlat</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Üst İlerleme */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span className="font-semibold text-stone-800">Soru {currentIdx + 1} / {QUIZ_QUESTIONS.length}</span>
        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px]">
          {q.conceptTag}
        </span>
        <span className="font-mono text-rose-600 font-bold">{score} Puan</span>
      </div>

      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-rose-500 transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Soru Kartı */}
      <div className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-4">
          {relatedBird && (
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-stone-100">
              <BirdPhoto
                src={relatedBird.imageUrl}
                fallbackSrc={relatedBird.fallbackImageUrl}
                alt={relatedBird.name}
                birdId={relatedBird.id}
                aspectRatio="square"
                className="w-full h-full rounded-2xl"
              />
            </div>
          )}
          <h3 className="text-base font-bold text-stone-900 leading-snug">
            {q.question}
          </h3>
        </div>

        {/* Seçenekler */}
        <div className="space-y-2">
          {q.options.map((opt, idx) => {
            const isSelected = selectedOpt === idx;
            const isCorrect = idx === q.correctIndex;

            let style = 'bg-stone-50 hover:bg-stone-100/80 border-stone-200 text-stone-800';

            if (isAnswered) {
              if (isCorrect) {
                style = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-200';
              } else if (isSelected && !isCorrect) {
                style = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold ring-1 ring-rose-200';
              } else {
                style = 'bg-stone-50/50 border-stone-100 text-stone-400 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                id={`quiz-opt-${idx}`}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${style}`}
              >
                <span>{opt}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Açıklama */}
        {isAnswered && (
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 animate-fade-in text-xs">
            <div className="flex items-start gap-2">
              <BookOpen className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
              <p className="text-stone-700 leading-relaxed">{q.explanation}</p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                id="next-quiz-btn"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 font-semibold shadow-xs text-xs"
              >
                <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Sonraki Soru' : 'Sonuç'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
