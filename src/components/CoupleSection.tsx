import React from 'react';
import { Instagram } from 'lucide-react';
import { InvitationData } from '../types/invitation';

interface CoupleSectionProps {
  groom: InvitationData['mempelai']['groom'];
  bride: InvitationData['mempelai']['bride'];
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ groom, bride }) => {
  return (
    <section id="sec-couple" className="relative w-full py-12 px-5 text-center overflow-hidden">
      {/* Botanical floral trees backdrop */}
      <img
        src="https://lib.simanten.com/wp-content/uploads/2025/04/pohon-tosca-ar.png"
        alt="Botanical ornament"
        className="absolute top-10 -right-12 w-36 opacity-35 pointer-events-none"
      />
      <img
        src="https://lib.simanten.com/wp-content/uploads/2025/04/pohon-demo-pink-l.png"
        alt="Botanical ornament"
        className="absolute bottom-20 -left-12 w-36 opacity-35 pointer-events-none"
      />

      <div className="relative z-10 max-w-md mx-auto space-y-10">
        {/* GROOM CARD */}
        <div className="flex flex-col items-center">
          <div className="relative mb-5">
            {/* Arched photo container */}
            <div className="w-44 h-56 rounded-t-full rounded-b-3xl overflow-hidden shadow-xl border-4 border-white/90 bg-[#eedbe3] relative">
              <img
                src={groom.photo}
                alt={groom.name}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>
            {/* Subtle decorative ring behind */}
            <div className="absolute -inset-2 rounded-t-full rounded-b-3xl border border-[#be7382]/35 -z-10 pointer-events-none" />
          </div>

          <h3 className="font-serif-title text-2xl font-bold text-[#562d3f] tracking-wide">
            {groom.name}
          </h3>
          <p className="text-xs uppercase tracking-widest text-[#94697c] font-semibold mt-1">
            {groom.nickname}
          </p>

          <div className="mt-3 text-xs text-[#6e5866] leading-relaxed max-w-xs">
            <p className="font-medium text-[#7c4355]">{groom.order} dari Pasangan:</p>
            <p className="font-semibold text-[#4e3643] mt-0.5">{groom.father}</p>
            <p className="text-[#846b79]">&</p>
            <p className="font-semibold text-[#4e3643]">{groom.mother}</p>
          </div>

          {groom.instagram && (
            <a
              href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-white/80 border border-[#ebd6df] text-[11px] text-[#863e52] hover:bg-white shadow-sm transition-all"
            >
              <Instagram className="w-3.5 h-3.5 text-[#be7382]" />
              <span>@{groom.instagram.replace('@', '')}</span>
            </a>
          )}
        </div>

        {/* ELEGANT AMPERSAND DIVIDER */}
        <div className="flex items-center justify-center gap-4 my-2">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#be7382]/50 to-[#be7382]" />
          <span className="font-script text-5xl text-[#be7382] select-none py-1 leading-none">
            &
          </span>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent via-[#be7382]/50 to-[#be7382]" />
        </div>

        {/* BRIDE CARD */}
        <div className="flex flex-col items-center">
          <div className="relative mb-5">
            {/* Arched photo container */}
            <div className="w-44 h-56 rounded-t-full rounded-b-3xl overflow-hidden shadow-xl border-4 border-white/90 bg-[#eedbe3] relative">
              <img
                src={bride.photo}
                alt={bride.name}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>
            {/* Subtle decorative ring */}
            <div className="absolute -inset-2 rounded-t-full rounded-b-3xl border border-[#be7382]/35 -z-10 pointer-events-none" />
          </div>

          <h3 className="font-serif-title text-2xl font-bold text-[#562d3f] tracking-wide">
            {bride.name}
          </h3>
          <p className="text-xs uppercase tracking-widest text-[#94697c] font-semibold mt-1">
            {bride.nickname}
          </p>

          <div className="mt-3 text-xs text-[#6e5866] leading-relaxed max-w-xs">
            <p className="font-medium text-[#7c4355]">{bride.order} dari Pasangan:</p>
            <p className="font-semibold text-[#4e3643] mt-0.5">{bride.father}</p>
            <p className="text-[#846b79]">&</p>
            <p className="font-semibold text-[#4e3643]">{bride.mother}</p>
          </div>

          {bride.instagram && (
            <a
              href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-white/80 border border-[#ebd6df] text-[11px] text-[#863e52] hover:bg-white shadow-sm transition-all"
            >
              <Instagram className="w-3.5 h-3.5 text-[#be7382]" />
              <span>@{bride.instagram.replace('@', '')}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
