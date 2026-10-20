import React from 'react';

interface AyatSectionProps {
  bismillah: string;
  salamPembuka: string;
  intro: string;
  arabicText: string;
  translation: string;
  source: string;
}

export const AyatSection: React.FC<AyatSectionProps> = ({
  bismillah,
  salamPembuka,
  intro,
  arabicText,
  translation,
  source,
}) => {
  return (
    <section className="relative w-full py-12 px-6 text-center overflow-hidden">
      {/* Background soft flower corners */}
      <img
        src="https://lib.simanten.com/wp-content/uploads/2023/04/bunga_putih.png"
        alt="Ornament"
        className="absolute -top-10 -left-10 w-28 opacity-25 pointer-events-none"
      />
      <img
        src="https://lib.simanten.com/wp-content/uploads/2023/04/bunga_putih.png"
        alt="Ornament"
        className="absolute -bottom-10 -right-10 w-28 opacity-25 pointer-events-none rotate-180"
      />

      <div className="relative z-10 max-w-md mx-auto">
        {/* Quranic Verse Box */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-sm border border-[#f0e2e8] mb-8">
          <div className="w-12 h-1 bg-[#be7382]/30 mx-auto rounded-full mb-6" />

          {/* Arabic Calligraphy */}
          <p className="font-arabic text-xl md:text-2xl leading-loose text-[#542d3e] font-normal mb-5 px-1">
            {arabicText}
          </p>

          {/* Indonesian Translation */}
          <p className="text-xs md:text-sm text-[#6c5563] leading-relaxed italic mb-3">
            {translation}
          </p>

          <p className="font-serif-title text-xs font-semibold tracking-wider text-[#9e4e61]">
            {source}
          </p>
        </div>

        {/* Bismillah & Salam */}
        <div className="mt-8 space-y-3">
          <div className="font-arabic text-2xl text-[#843648] select-none py-1">
            {bismillah}
          </div>
          <h3 className="font-serif-title text-base md:text-lg font-semibold text-[#542d3e]">
            {salamPembuka}
          </h3>
          <p className="text-xs md:text-sm text-[#745e6c] leading-relaxed max-w-sm mx-auto">
            {intro}
          </p>
        </div>
      </div>
    </section>
  );
};