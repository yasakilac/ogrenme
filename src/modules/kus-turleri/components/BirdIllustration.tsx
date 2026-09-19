import React from 'react';

interface BirdIllustrationProps {
  birdId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const BirdIllustration: React.FC<BirdIllustrationProps> = ({
  birdId,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
    hero: 'w-full max-w-sm h-64'
  }[size];

  switch (birdId) {
    case 'flamingo':
      return (
        <svg viewBox="0 0 200 200" className={`${sizeClasses} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#FFE4E6" />
          {/* Su halkaları */}
          <path d="M20 170 C60 165 140 175 180 170" stroke="#F43F5E" strokeWidth="2.5" strokeOpacity="0.3" strokeLinecap="round" />
          <path d="M40 182 C80 178 130 185 165 180" stroke="#F43F5E" strokeWidth="2" strokeOpacity="0.2" strokeLinecap="round" />
          {/* Bacaklar */}
          <path d="M100 135 L95 185" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" />
          <path d="M105 135 L125 155 L110 185" stroke="#E11D48" strokeWidth="3.5" strokeLinecap="round" />
          {/* Gövde */}
          <ellipse cx="105" cy="115" rx="36" ry="24" fill="#FB7185" />
          <ellipse cx="112" cy="118" rx="28" ry="18" fill="#F43F5E" />
          <path d="M125 105 C140 110 148 125 142 135 C132 130 120 120 125 105 Z" fill="#E11D48" />
          {/* S şeklinde zarif boyun */}
          <path d="M78 112 C60 90 60 55 85 45 C95 40 110 42 108 55" stroke="#FB7185" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M80 112 C63 90 63 56 86 46 C95 41 109 43 107 55" stroke="#FDA4AF" strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* Kafa */}
          <ellipse cx="112" cy="52" rx="14" ry="11" fill="#FB7185" />
          <circle cx="114" cy="49" r="3.5" fill="#FFF1F2" />
          <circle cx="114.5" cy="49" r="2" fill="#1F1E1B" />
          {/* Kıvrık Süzgeç Gaga */}
          <path d="M122 51 C132 53 138 60 134 72 C131 77 127 75 125 66 C124 59 122 55 122 51 Z" fill="#FDE047" />
          <path d="M132 63 C136 67 135 73 133 75 C130 76 128 72 129 67 Z" fill="#18181B" />
        </svg>
      );

    case 'ibibik':
      return (
        <svg viewBox="0 0 200 200" className={`${sizeClasses} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#FEF3C7" />
          {/* Dal */}
          <path d="M30 160 C70 155 130 158 175 150" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
          <path d="M140 154 L155 142" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          {/* Yelpaze Taç Tüyleri (İbik) */}
          <path d="M100 48 L125 20 L132 23 L105 52 Z" fill="#D97706" stroke="#B45309" strokeWidth="1" />
          <path d="M122 21 L126 19 L133 22 L128 25 Z" fill="#18181B" />
          <path d="M96 50 L110 18 L117 20 L99 55 Z" fill="#D97706" />
          <path d="M107 19 L111 17 L117 19 L113 22 Z" fill="#18181B" />
          <path d="M92 52 L94 20 L101 21 L94 56 Z" fill="#D97706" />
          <path d="M93 21 L97 19 L102 20 L98 23 Z" fill="#18181B" />
          <path d="M88 55 L78 26 L85 27 L89 58 Z" fill="#D97706" />
          <path d="M78 27 L81 24 L86 26 L83 29 Z" fill="#18181B" />
          <path d="M84 58 L64 36 L70 38 L85 62 Z" fill="#D97706" />
          <path d="M64 37 L67 34 L71 37 L68 40 Z" fill="#18181B" />
          {/* Gövde */}
          <ellipse cx="105" cy="115" rx="30" ry="24" fill="#D97706" transform="rotate(-15 105 115)" />
          {/* Siyah-Beyaz Zebra Çizgili Kanat */}
          <path d="M100 102 C125 105 145 125 142 150 C125 152 110 145 100 130 Z" fill="#18181B" />
          <path d="M110 110 L138 126 L134 133 L108 116 Z" fill="#FFFFFF" />
          <path d="M108 124 L134 140 L130 146 L105 129 Z" fill="#FFFFFF" />
          {/* Kafa & Göz */}
          <circle cx="85" cy="68" r="16" fill="#F59E0B" />
          <circle cx="80" cy="64" r="3" fill="#18181B" />
          <circle cx="81" cy="63" r="1" fill="#FFFFFF" />
          {/* Uzun Kavisli Cımbız Gaga */}
          <path d="M72 68 C50 72 32 82 20 95 C33 87 52 79 72 75 Z" fill="#451A03" />
        </svg>
      );

    case 'sah-kartal':
      return (
        <svg viewBox="0 0 200 200" className={`${sizeClasses} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#FEF3C7" />
          {/* Dağ silüeti */}
          <path d="M10 160 L60 120 L105 150 L155 110 L190 155 L190 195 L10 195 Z" fill="#E5E7EB" opacity="0.6" />
          {/* Omuz ve Gövde */}
          <path d="M70 180 C60 135 75 95 110 85 C145 95 160 135 150 180 Z" fill="#451A03" />
          {/* Omuzdaki Beyaz Apoletler (Ayırt Edici Özellik) */}
          <ellipse cx="88" cy="115" rx="8" ry="16" fill="#F8FAFC" transform="rotate(-20 88 115)" />
          <ellipse cx="132" cy="115" rx="8" ry="16" fill="#F8FAFC" transform="rotate(20 132 115)" />
          {/* Boyun ve Kafa */}
          <path d="M92 90 C92 70 95 55 110 50 C125 55 128 70 128 90 Z" fill="#B45309" />
          <path d="M100 50 C105 45 118 45 124 50 C122 65 110 70 100 50 Z" fill="#FDE68A" />
          {/* Yırtıcı Keskin Göz */}
          <circle cx="118" cy="62" r="4.5" fill="#F59E0B" />
          <circle cx="119" cy="62" r="2.5" fill="#18181B" />
          {/* Kıvrık Yırtıcı Kanca Gaga */}
          <path d="M126 62 C134 62 142 66 145 74 C143 82 135 84 133 76 C131 71 127 68 126 62 Z" fill="#FBBF24" />
          <path d="M138 72 C142 75 144 80 141 83 C137 84 135 78 136 73 Z" fill="#18181B" />
        </svg>
      );

    case 'yalicapkini':
      return (
        <svg viewBox="0 0 200 200" className={`${sizeClasses} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#E0F2FE" />
          {/* Su damlaları ve dalga */}
          <path d="M15 165 C60 155 120 170 185 160" stroke="#0284C7" strokeWidth="3" strokeOpacity="0.4" strokeLinecap="round" />
          <circle cx="65" cy="148" r="3" fill="#38BDF8" />
          <circle cx="75" cy="155" r="2" fill="#38BDF8" />
          {/* Dal */}
          <path d="M110 155 C130 145 160 148 185 142" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
          {/* Gövde - Parlak Zıt Renkler */}
          <ellipse cx="118" cy="115" rx="25" ry="28" fill="#EA580C" />
          <ellipse cx="128" cy="115" rx="18" ry="24" fill="#F97316" />
          {/* Metalik Turkuaz Sırt & Kanat */}
          <path d="M102 95 C115 92 132 108 128 135 C115 138 98 125 102 95 Z" fill="#06B6D4" />
          <path d="M106 100 C114 98 124 108 122 125 C114 127 104 118 106 100 Z" fill="#0891B2" />
          {/* Kafa */}
          <circle cx="102" cy="78" r="20" fill="#0891B2" />
          <ellipse cx="114" cy="85" rx="7" ry="10" fill="#FFFFFF" />
          <circle cx="94" cy="75" r="4.5" fill="#18181B" />
          <circle cx="95" cy="74" r="1.5" fill="#FFFFFF" />
          {/* Hançer (Mızrak) Balıkçı Gaga */}
          <path d="M88 78 L25 86 L86 92 Z" fill="#1E293B" />
          <path d="M88 84 L40 87 L86 91 Z" fill="#DC2626" opacity="0.6" />
        </svg>
      );

    case 'ebabil':
      return (
        <svg viewBox="0 0 200 200" className={`${sizeClasses} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#F1F5F9" />
          {/* Bulutlar */}
          <path d="M25 70 C35 55 60 55 70 70 C80 65 95 75 90 85 C65 85 30 85 25 70 Z" fill="#E2E8F0" />
          <path d="M120 140 C130 130 150 130 160 140 C170 135 180 145 175 152 C155 152 125 152 120 140 Z" fill="#E2E8F0" />
          {/* Hilal Kanatlar (Sürekli Havada Uçuş) */}
          <path d="M100 115 C75 90 35 70 15 80 C28 95 65 115 95 125 Z" fill="#1E293B" />
          <path d="M105 115 C130 90 170 70 190 80 C177 95 140 115 110 125 Z" fill="#1E293B" />
          {/* Gövde ve Çatallı Kuyruk */}
          <ellipse cx="102" cy="115" rx="12" ry="24" fill="#334155" />
          <path d="M96 135 L90 165 L102 148 L114 165 L108 135 Z" fill="#1E293B" />
          {/* Minik Baş & Geniş Ağız */}
          <circle cx="102" cy="95" r="9" fill="#475569" />
          <circle cx="102" cy="98" r="4" fill="#F8FAFC" opacity="0.8" />
          <path d="M98 90 L102 85 L106 90 Z" fill="#0F172A" />
        </svg>
      );

    case 'kelaynak':
      return (
        <svg viewBox="0 0 200 200" className={`${sizeClasses} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#ECFDF5" />
          {/* Birecik Kireçtaşı Kayalığı */}
          <path d="M120 190 L130 130 L160 110 L190 125 L190 190 Z" fill="#D1D5DB" />
          {/* Gövde (Metalik Yanardöner Siyah-Yeşil) */}
          <ellipse cx="90" cy="125" rx="34" ry="26" fill="#064E3B" transform="rotate(-15 90 125)" />
          <ellipse cx="90" cy="125" rx="30" ry="22" fill="#0F172A" transform="rotate(-15 90 125)" opacity="0.7" />
          {/* Ensedeki Dağınık Sorguç Tüyleri */}
          <path d="M110 75 L135 60 L115 78 Z" fill="#0F172A" />
          <path d="M112 80 L142 70 L116 83 Z" fill="#0F172A" />
          <path d="M110 85 L138 82 L114 88 Z" fill="#0F172A" />
          {/* Çıplak Kırmızı Kel Baş (Ayırt Edici) */}
          <path d="M102 95 C108 85 110 75 105 68 C98 60 88 62 82 72 C78 80 82 92 88 98 Z" fill="#DC2626" />
          <circle cx="90" cy="74" r="3.5" fill="#FEF08A" />
          <circle cx="89" cy="74" r="2" fill="#18181B" />
          {/* Uzun Aşağı Kıvrık Kırmızı Sonda Gaga */}
          <path d="M82 76 C65 80 48 95 38 120 C48 102 65 88 82 82 Z" fill="#EF4444" />
        </svg>
      );

    case 'kizilgerdan':
      return (
        <svg viewBox="0 0 200 200" className={`${sizeClasses} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#FFEDD5" />
          {/* Kar tanesi / kış yaprağı */}
          <path d="M40 160 C75 150 135 155 170 150" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
          {/* Tombul Gövde */}
          <ellipse cx="108" cy="115" rx="34" ry="30" fill="#78716C" />
          <ellipse cx="120" cy="120" rx="20" ry="24" fill="#E7E5E4" />
          {/* İkonik Pas Kırmızı / Turuncu Gerdan */}
          <path d="M85 80 C95 72 108 72 118 80 C125 95 125 115 110 130 C95 132 82 120 80 102 C79 92 82 85 85 80 Z" fill="#EA580C" />
          <circle cx="98" cy="98" r="14" fill="#F97316" />
          {/* İri Sevimli Siyah Göz */}
          <circle cx="92" cy="80" r="5" fill="#1C1917" />
          <circle cx="93.5" cy="78.5" r="1.8" fill="#FFFFFF" />
          {/* İnce Cımbız Gaga */}
          <path d="M82 82 L65 85 L81 88 Z" fill="#292524" />
        </svg>
      );

    case 'ak-pelikan':
      return (
        <svg viewBox="0 0 200 200" className={`${sizeClasses} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#DBEAFE" />
          {/* Su */}
          <path d="M15 155 C55 148 135 160 185 150" stroke="#2563EB" strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" />
          {/* Devasa Gövde */}
          <ellipse cx="115" cy="130" rx="42" ry="26" fill="#F8FAFC" />
          <path d="M140 120 C160 125 175 140 165 155 C148 152 135 142 140 120 Z" fill="#334155" />
          {/* Kıvrık Kalın Boyun */}
          <path d="M88 128 C75 115 75 95 86 85 C95 78 112 80 108 92" stroke="#F8FAFC" strokeWidth="16" strokeLinecap="round" fill="none" />
          {/* Kafa */}
          <circle cx="108" cy="88" r="14" fill="#F8FAFC" />
          <circle cx="108" cy="86" r="3.5" fill="#18181B" />
          {/* Dev Deri Kese Gaga */}
          <path d="M102 90 L30 92 L98 100 Z" fill="#FBBF24" />
          <path d="M96 98 C80 118 45 118 32 94 C55 104 78 104 96 98 Z" fill="#FDE047" opacity="0.9" />
          <path d="M30 92 L25 93 L32 95 Z" fill="#DC2626" />
        </svg>
      );

    case 'gokdogan':
      return (
        <svg viewBox="0 0 200 200" className={`${sizeClasses} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#EEF2FF" />
          {/* Hız çizgileri / Süpersonik dalış hissi */}
          <path d="M40 30 L25 60" stroke="#818CF8" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M170 40 L155 70" stroke="#818CF8" strokeWidth="2" strokeDasharray="4 4" />
          {/* Sivri Orak Kanatlar */}
          <path d="M95 105 C70 70 40 40 25 35 C42 62 65 95 88 115 Z" fill="#334155" />
          <path d="M105 105 C130 70 160 40 175 35 C158 62 135 95 112 115 Z" fill="#334155" />
          {/* Gövde - Enine Çizgili Karın */}
          <ellipse cx="100" cy="118" rx="16" ry="24" fill="#F8FAFC" />
          <path d="M90 115 L110 115 M88 122 L112 122 M90 129 L110 129" stroke="#475569" strokeWidth="1.5" />
          {/* Kafa & İkonik Siyah Bıyık Deseni */}
          <circle cx="100" cy="85" r="14" fill="#1E293B" />
          <path d="M96 88 L92 102 L98 96 Z" fill="#0F172A" />
          <path d="M104 88 L108 102 L102 96 Z" fill="#0F172A" />
          {/* Sarı Göz Halkası ve Dişli Çentikli Gaga */}
          <circle cx="95" cy="82" r="4" fill="#FBBF24" />
          <circle cx="95" cy="82" r="2.2" fill="#0F172A" />
          <circle cx="105" cy="82" r="4" fill="#FBBF24" />
          <circle cx="105" cy="82" r="2.2" fill="#0F172A" />
          <path d="M98 86 L100 95 L102 86 Z" fill="#F59E0B" />
        </svg>
      );

    case 'turac':
      return (
        <svg viewBox="0 0 200 200" className={`${sizeClasses} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#FEF3C7" />
          {/* Maki Fundalık Çalılık */}
          <path d="M20 170 C40 145 65 175 90 160 C120 175 150 145 180 170" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
          {/* Gövde */}
          <ellipse cx="105" cy="120" rx="34" ry="26" fill="#1C1917" />
          {/* Siyah Göğüste Beyaz Damla Benekler (Karakteristik Turaç Deseni) */}
          <circle cx="95" cy="115" r="2" fill="#FFFFFF" />
          <circle cx="102" cy="112" r="2" fill="#FFFFFF" />
          <circle cx="110" cy="116" r="2" fill="#FFFFFF" />
          <circle cx="98" cy="122" r="2" fill="#FFFFFF" />
          <circle cx="106" cy="125" r="2" fill="#FFFFFF" />
          <circle cx="114" cy="123" r="2" fill="#FFFFFF" />
          {/* Kestane Renkli Boyun Yakalığı */}
          <path d="M88 95 C95 90 115 90 122 95 C125 105 118 108 105 108 C92 108 85 105 88 95 Z" fill="#9A3412" />
          {/* Kafa & Beyaz Yanak Yaması */}
          <circle cx="92" cy="82" r="14" fill="#1C1917" />
          <ellipse cx="94" cy="84" rx="6" ry="4" fill="#FFFFFF" />
          <circle cx="89" cy="80" r="2.5" fill="#F59E0B" />
          {/* Kuvvetli Tohum Kırıcı Gaga */}
          <path d="M82 82 L68 85 L82 88 Z" fill="#44403C" />
          {/* Mahmuzlu Koşucu Ayakları */}
          <path d="M96 145 L92 175" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
          <path d="M112 145 L118 175" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <div className={`${sizeClasses} ${className} flex items-center justify-center bg-stone-100 rounded-2xl text-3xl`}>
          🐦
        </div>
      );
  }
};
