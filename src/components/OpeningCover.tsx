import React from 'react';
import { MailOpen, Heart } from 'lucide-react';

interface OpeningCoverProps {
  groomNickname: string;
  brideNickname: string;
  monogram: string;
  eventDateDisplay: string;
  guestName: string;
  isOpen: boolean;
  onOpen: () => void;
}

export const OpeningCover: React.FC<OpeningCoverProps> = ({
  groomNickname,
  brideNickname,
  monogram,
  eventDateDisplay,
  guestName,
  isOpen,
  onOpen,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-transform duration-1000 ease-in-out ${
        isOpen ? '-translate-y-full pointer-events-none' : 'translate-y-0'
      }`}
    >
      {/* Background container constrained to max-w-md or responsive frame just like Simanten mobile experience */}
      <div className="relative w-full max-w-lg h-full overflow-hidden shadow-2xl bg-[#fdf8fa] flex flex-col items-center justify-between py-12 px-6">
        {/* Background Palace & Botanical Layers */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Subtle sky gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f3e3ea] via-[#faf0f4] to-[#fbebed]" />

          {/* Palace / Mosque silhouette */}
          <img
            src="https://lib.simanten.com/wp-content/uploads/2025/11/masjid-mei.png"
            alt="Palace"
            className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[85%] max-w-[380px] object-contain opacity-55 animate-float"
          />

          {/* Ornate Arch Frame */}
          <img
            src="https://lib.simanten.com/wp-content/uploads/2025/04/pilar-demo-pink-b.png"
            alt="Arch"
            className="absolute top-0 left-0 right-0 w-full h-[65%] object-fill opacity-90"
          />

          {/* Trees left and right */}
          <img
            src="https://lib.simanten.com/wp-content/uploads/2025/04/pohon-demo-pink-al.png"
            alt="Tree Left"
            className="absolute top-2 -left-8 w-44 object-contain opacity-80"
          />
          <img
            src="https://lib.simanten.com/wp-content/uploads/2025/04/pohon-demo-pink-r2.png"
            alt="Tree Right"
            className="absolute top-2 -right-8 w-44 object-contain opacity-80"
          />

          {/* Animated Butterflies */}
          <img
            src="https://lib.simanten.com/wp-content/uploads/2025/03/kupu_botanical-1.gif"
            alt="Butterfly"
            className="absolute bottom-28 left-8 w-12 h-12 object-contain animate-butterfly pointer-events-none z-20"
          />
          <img
            src="https://lib.simanten.com/wp-content/uploads/2025/03/kupu_botanical-2.gif"
            alt="Butterfly"
            className="absolute bottom-20 right-8 w-14 h-14 object-contain animate-butterfly pointer-events-none z-20"
            style={{ animationDelay: '1.8s' }}
          />

          {/* Bottom Flower Bush cluster */}
          <img
            src="https://lib.simanten.com/wp-content/uploads/2025/04/bunga-demo-pink-bl.png"
            alt="Flower Left"
            className="absolute bottom-0 -left-6 w-48 object-contain z-10 opacity-95"
          />
          <img
            src="https://lib.simanten.com/wp-content/uploads/2025/04/bunga-demo-pink-br.png"
            alt="Flower Right"
            className="absolute bottom-0 -right-6 w-48 object-contain z-10 opacity-95"
          />
          <img
            src="https://lib.simanten.com/wp-content/uploads/2025/04/bunga-demo-pink-b.png"
            alt="Flower Center"
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[110%] object-contain z-10 opacity-95"
          />
        </div>

        {/* Top Header & Monogram */}
        <div className="relative z-20 flex flex-col items-center text-center mt-6">
          <p className="text-[11px] tracking-[0.3em] font-medium text-[#7d5e6d] uppercase mb-2">
            The Wedding Of
          </p>
          <div className="relative mb-2">
            <h1 className="font-serif-title text-6xl md:text-7xl font-bold tracking-wider text-[#9b495b] select-none">
              {monogram}
            </h1>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#be7382] to-transparent mx-auto mt-2" />
          </div>
          <h2 className="font-serif-title text-2xl font-semibold tracking-wide text-[#593748] mt-1">
            {groomNickname} & {brideNickname}
          </h2>
          <p className="text-xs text-[#8c6778] mt-1 tracking-widest uppercase">
            {eventDateDisplay}
          </p>
        </div>

        {/* Center/Bottom Guest Greeting Card & Action Button */}
        <div className="relative z-20 w-full flex flex-col items-center text-center mb-8 px-4">
          <div className="bg-white/85 backdrop-blur-md px-6 py-4 rounded-2xl border border-[#eedfe5] shadow-lg max-w-xs w-full mb-6 transform transition-all duration-300 hover:scale-[1.02]">
            <p className="text-[10px] uppercase tracking-widest text-[#94697c]">
              Kepada Yth. Bapak/Ibu/Saudara/i:
            </p>
            <h3 className="font-serif-title text-base md:text-lg font-bold text-[#592c3d] mt-1 line-clamp-2">
              {guestName || 'Tamu Undangan'}
            </h3>
            <p className="text-[10px] text-[#917684] italic mt-1">
              *Mohon maaf bila ada kesalahan penulisan nama/gelar
            </p>
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#be7382] via-[#af586a] to-[#be7382] bg-size-200 text-white font-medium text-xs tracking-wider uppercase shadow-xl shadow-[#be7382]/35 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <MailOpen className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span className="relative z-10 font-semibold tracking-widest">
              Buka Undangan
            </span>
            <Heart className="w-3.5 h-3.5 fill-white/80 text-white/80 animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );
};