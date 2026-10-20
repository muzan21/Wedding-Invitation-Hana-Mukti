import React from 'react';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  groomNickname: string;
  brideNickname: string;
  eventDateDisplay: string;
  hijriDateDisplay: string;
  monogram: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  groomNickname,
  brideNickname,
  eventDateDisplay,
  hijriDateDisplay,
  monogram,
}) => {
  return (
    <section id="sec-hero" className="relative w-full min-h-[92vh] flex flex-col items-center justify-between text-center py-12 px-6 overflow-hidden">
      {/* Background illustration layers */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7eef2] via-[#faf2f5] to-[#fcf7f9]" />

        {/* Palace illustration */}
        <img
          src="https://lib.simanten.com/wp-content/uploads/2025/11/masjid-mei.png"
          alt="Palace"
          className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[85%] max-w-[380px] object-contain opacity-45 animate-float"
        />

        {/* Arch pillar frame */}
        <img
          src="https://lib.simanten.com/wp-content/uploads/2025/04/pilar-demo-pink-b.png"
          alt="Arch"
          className="absolute top-0 left-0 right-0 w-full h-[65%] object-fill opacity-85"
        />

        {/* Trees */}
        <img
          src="https://lib.simanten.com/wp-content/uploads/2025/04/pohon-demo-pink-al.png"
          alt="Tree"
          className="absolute top-2 -left-8 w-44 object-contain opacity-75"
        />
        <img
          src="https://lib.simanten.com/wp-content/uploads/2025/04/pohon-demo-pink-r2.png"
          alt="Tree"
          className="absolute top-2 -right-8 w-44 object-contain opacity-75"
        />

        {/* Animated Butterflies */}
        <img
          src="https://lib.simanten.com/wp-content/uploads/2025/03/kupu_botanical-1.gif"
          alt="Butterfly"
          className="absolute top-1/3 left-10 w-12 h-12 object-contain animate-butterfly pointer-events-none"
        />
        <img
          src="https://lib.simanten.com/wp-content/uploads/2025/03/kupu_botanical-2.gif"
          alt="Butterfly"
          className="absolute top-1/2 right-10 w-14 h-14 object-contain animate-butterfly pointer-events-none"
          style={{ animationDelay: '2s' }}
        />

        {/* Bottom Flower Bush */}
        <img
          src="https://lib.simanten.com/wp-content/uploads/2025/04/bunga-demo-pink-b.png"
          alt="Floral"
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[110%] object-contain opacity-95"
        />
      </div>

      {/* Top spacing */}
      <div className="relative z-10 pt-4" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        <p className="text-[11px] tracking-[0.3em] font-medium text-[#7d5e6d] uppercase mb-2">
          The Wedding Of
        </p>

        <div className="relative my-2">
          <div className="font-serif-title text-6xl md:text-7xl font-bold tracking-wider text-[#9b495b] select-none">
            {monogram}
          </div>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#be7382] to-transparent mx-auto mt-2" />
        </div>

        <h1 className="font-serif-title text-3xl md:text-4xl font-bold tracking-wide text-[#542d3e] mt-2">
          {groomNickname} & {brideNickname}
        </h1>

        <div className="mt-4 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#ebd6df] shadow-xs">
          <p className="text-xs text-[#7e586b] font-medium tracking-wider">
            {eventDateDisplay}
          </p>
        </div>

        <p className="text-[11px] text-[#937584] mt-1.5 font-medium">
          {hijriDateDisplay}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex flex-col items-center pb-8 animate-bounce">
        <span className="text-[10px] tracking-widest uppercase text-[#886978] font-medium">
          Scroll ke Bawah
        </span>
        <ChevronDown className="w-4 h-4 text-[#be7382] mt-0.5" />
      </div>
    </section>
  );
};
