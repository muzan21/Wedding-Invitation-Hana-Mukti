import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { InvitationData } from '../types/invitation';

interface ClosingSectionProps {
  closing: InvitationData['closing'];
  monogram: string;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ closing, monogram }) => {
  return (
    <footer className="relative w-full pt-12 pb-24 px-5 text-center overflow-hidden">
      {/* Background floral footer */}
      <img
        src="https://lib.simanten.com/wp-content/uploads/2025/04/bunga-demo-pink-b.png"
        alt="Floral Footer"
        className="w-full max-w-sm mx-auto mb-4 opacity-70 object-contain pointer-events-none"
      />
      <div className="max-w-md mx-auto space-y-5">
        <h3 className="font-serif-title text-2xl font-bold text-[#562c3f]">
          {closing.thanksTitle}
        </h3>
        <p className="text-xs text-[#6e5866] leading-relaxed max-w-sm mx-auto">
          {closing.thanksMessage}
        </p>
        <p className="font-serif-title text-sm font-semibold text-[#8a4256]">
          {closing.salamPenutup}
        </p>
        <div className="pt-2 pb-4">
          <p className="text-[11px] text-[#866978] uppercase tracking-wider">
            Turut Berbahagia:
          </p>
          <div className="whitespace-pre-line font-serif-title text-base font-bold text-[#542d3e] mt-1 leading-snug">
            {closing.familySignature}
          </div>
        </div>

        {/* Monogram emblem */}
        <div className="w-14 h-14 rounded-full bg-white shadow-md border border-[#ebd6df] flex items-center justify-center mx-auto text-[#be7382] font-serif-title text-xl font-bold">
          {monogram}
        </div>

        {/* CUSTOM WATERMARK DESIGN (Website Invitation by Saefulmzn) */}
        <div className="pt-6 border-t border-[#f0e2e8] space-y-1.5">
          <p className="font-serif-title text-[11px] tracking-[0.2em] uppercase text-[#8a5b6f] font-semibold">
            Website Invitation By
          </p>
          <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[#ebd6df] shadow-xs">
            <span className="font-serif-title text-xs font-bold text-[#542d3e]">
              Saefulmzn
            </span>
            <span className="text-[#be7382] text-[10px]">•</span>
            <a
              href="https://wa.me/62895336754249"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8a4256] hover:text-[#542d3e] transition-colors"
            >
              <MessageCircle className="w-3 h-3 text-emerald-600 fill-emerald-600/20" />
              <span>+62895336754249</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};