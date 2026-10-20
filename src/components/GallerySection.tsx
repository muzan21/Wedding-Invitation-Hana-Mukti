import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Heart } from 'lucide-react';
import { GalleryItem } from '../types/invitation';

interface GallerySectionProps {
  gallery: GalleryItem[];
  videoUrl?: string;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActivePhotoIdx(index);
  };

  const closeLightbox = () => {
    setActivePhotoIdx(null);
  };

  const nextPhoto = () => {
    if (activePhotoIdx === null) return;
    setActivePhotoIdx((activePhotoIdx + 1) % gallery.length);
  };

  const prevPhoto = () => {
    if (activePhotoIdx === null) return;
    setActivePhotoIdx((activePhotoIdx - 1 + gallery.length) % gallery.length);
  };

  return (
    <section id="sec-gallery" className="relative w-full py-12 px-5 overflow-hidden">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <p className="text-[11px] tracking-[0.25em] font-semibold text-[#8a5b6f] uppercase">
            Momen Bahagia
          </p>
          <h2 className="font-serif-title text-3xl font-bold text-[#542d3e] mt-1">
            Galeri Prewedding
          </h2>
          <div className="w-12 h-0.5 bg-[#be7382]/40 mx-auto mt-2 rounded-full" />
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 gap-3">
          {gallery.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(idx)}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer shadow-md border border-white/70 bg-[#eedbe3] ${
                idx % 3 === 0 ? 'col-span-2 h-56' : 'h-40'
              }`}
            >
              <img
                src={photo.url}
                alt={photo.caption || `Prewedding ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div className="flex items-center justify-between w-full text-white text-xs">
                  <span className="truncate font-medium">{photo.caption || 'Lihat Foto'}</span>
                  <ZoomIn className="w-4 h-4 shrink-0 text-white/90" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Kutipan Cinta / Quotes Card Pengganti Video Teaser */}
        <div className="mt-8 bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-md border border-[#ebd6df] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#be7382]/15 to-transparent rounded-bl-full pointer-events-none" />
          <div className="w-10 h-10 rounded-full bg-[#be7382]/15 text-[#be7382] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Heart className="w-5 h-5 fill-[#be7382]/30" />
          </div>
          <h4 className="font-serif-title text-base font-bold text-[#562c3f] mb-2">
            Mutiara Cinta
          </h4>
          <p className="text-xs md:text-sm text-[#6e5866] leading-relaxed italic px-2">
            "Pernikahan yang bahagia bukanlah tentang menemukan pasangan yang sempurna tanpa cela, melainkan tentang belajar mencintai ketidaksempurnaan itu dengan cara yang sempurna dalam ridha-Nya."
          </p>
          <div className="w-12 h-0.5 bg-[#be7382]/30 mx-auto mt-4 rounded-full" />
          <p className="text-[11px] font-serif-title font-semibold text-[#8a4256] mt-2">
            — Mukti & Hana —
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhotoIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/15 text-white hover:bg-white/30 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={prevPhoto}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/15 text-white hover:bg-white/30 transition-all cursor-pointer z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={nextPhoto}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/15 text-white hover:bg-white/30 transition-all cursor-pointer z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-2xl max-h-[85vh] flex flex-col items-center">
            <img
              src={gallery[activePhotoIdx].url}
              alt="Preview"
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            {gallery[activePhotoIdx].caption && (
              <p className="text-white/90 text-sm mt-3 font-serif-title tracking-wide text-center">
                {gallery[activePhotoIdx].caption}
              </p>
            )}
            <p className="text-white/50 text-xs mt-1">
              {activePhotoIdx + 1} / {gallery.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};