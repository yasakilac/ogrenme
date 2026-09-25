import React, { useState } from 'react';
import { Check, X, RotateCcw, Award } from 'lucide-react';
import { TURKEY_BIRDS } from '../data/birds';
import { BirdPhoto } from './BirdPhoto';
import { CORRECT, WRONG, PrimaryButton, CheckBar } from '../../../components/ui';

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
      <div className="space-y-4 text-center rounded-[24px] bg-white p-8" style={{ border: '1px solid #E6E0D6' }}>
        <div className="w-14 h-14 rounded-[20px] flex items-center justify-center mx-auto" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          <Award className="w-8 h-8" />
        </div>

        <div>
          <h3 className="font-display text-2xl font-extrabold" style={{ color: '#1C1B19' }}>Test Tamamlandı</h3>
          <p className="text-xs mt-1" style={{ color: '#6B665E' }}>
            {QUIZ_QUESTIONS.length} kavram sorusunu başarıyla yanıtladın.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 p-3 rounded-[20px]" style={{ background: '#FAF8F5', border: '1px solid #E6E0D6' }}>
          <span className="text-xs" style={{ color: '#6B665E' }}>Skor:</span>
          <span className="text-xl font-extrabold" style={{ color: 'var(--accent)' }}>{score} / {QUIZ_QUESTIONS.length * 10}</span>
        </div>

        <PrimaryButton onClick={handleRestart} icon={RotateCcw} className="mx-auto px-6">
          Yeniden Başlat
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Üst İlerleme */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold" style={{ color: '#6B665E' }}>Soru {currentIdx + 1} / {QUIZ_QUESTIONS.length}</span>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          {q.conceptTag}
        </span>
        <span className="font-bold" style={{ color: 'var(--accent)' }}>{score} Puan</span>
      </div>

      <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: '#EDE6DB' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%`, background: 'var(--accent)' }}
        />
      </div>

      {/* Soru Kartı */}
      <div className="rounded-[24px] bg-white p-6 space-y-4" style={{ border: '1px solid #E6E0D6' }}>
        <div className="flex items-center gap-4">
          {relatedBird && (
            <div className="w-16 h-16 rounded-[18px] overflow-hidden shrink-0" style={{ background: '#F7F4EE' }}>
              <BirdPhoto
                src={relatedBird.imageUrl}
                fallbackSrc={relatedBird.fallbackImageUrl}
                alt={relatedBird.name}
                birdId={relatedBird.id}
                aspectRatio="square"
                className="w-full h-full rounded-[18px]"
              />
            </div>
          )}
          <h3 className="font-display text-lg font-extrabold leading-snug" style={{ color: '#1C1B19' }}>
            {q.question}
          </h3>
        </div>

        {/* Şıklar */}
        <div className="space-y-2">
          {q.options.map((opt, idx) => {
            const isSelected = selectedOpt === idx;
            const isCorrectOpt = idx === q.correctIndex;
            const letter = 'ABCD'[idx];

            let style: { bg: string; border: string; fg: string; kbg: string; kfg: string } = {
              bg: '#FFFFFF', border: '#E6E0D6', fg: '#1C1B19', kbg: '#EDE6DB', kfg: '#6B665E',
            };
            if (isAnswered) {
              if (isCorrectOpt) style = { ...CORRECT, kbg: CORRECT.border, kfg: '#FFFFFF' };
              else if (isSelected) style = { ...WRONG, kbg: WRONG.border, kfg: '#FFFFFF' };
              else style = { bg: '#FFFFFF', border: '#F2EEE7', fg: '#A39C91', kbg: '#F2EEE7', kfg: '#A39C91' };
            }

            return (
              <button
                key={idx}
                id={`quiz-opt-${idx}`}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                style={{ background: style.bg, borderWidth: isAnswered && (isCorrectOpt || isSelected) ? 3 : 1, borderStyle: 'solid', borderColor: style.border, color: style.fg }}
                className="w-full min-h-[56px] rounded-[18px] pl-2.5 pr-4 py-2 flex items-center gap-3 text-left font-bold text-sm transition-all"
              >
                <span
                  className="w-9 h-9 rounded-[12px] flex items-center justify-center text-sm font-extrabold shrink-0"
                  style={{ background: style.kbg, color: style.kfg }}
                >
                  {letter}
                </span>
                <span className="flex-grow">{opt}</span>
                {isAnswered && isCorrectOpt && <Check className="w-5 h-5 shrink-0" strokeWidth={3} style={{ color: style.border }} />}
                {isAnswered && isSelected && !isCorrectOpt && <X className="w-5 h-5 shrink-0" strokeWidth={3} style={{ color: style.border }} />}
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <CheckBar
          correct={selectedOpt === q.correctIndex}
          message={q.explanation}
          onNext={handleNext}
        />
      )}
    </div>
  );
};
