import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Copy, Check, ExternalLink } from 'lucide-react';

interface InteractiveMapProps {
  akadVenue: string;
  akadAddress: string;
  akadCoords: { lat: number; lng: number };
  akadGmaps: string;
  resepsiVenue: string;
  resepsiAddress: string;
  resepsiCoords: { lat: number; lng: number };
  resepsiGmaps: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  akadVenue,
  akadAddress,
  akadCoords,
  akadGmaps,
  resepsiVenue,
  resepsiAddress,
  resepsiCoords,
  resepsiGmaps,
}) => {
  const [activeTab, setActiveTab] = useState<'resepsi' | 'akad'>('resepsi');
  const [copied, setCopied] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const activeVenue = activeTab === 'resepsi' ? resepsiVenue : akadVenue;
  const activeAddress = activeTab === 'resepsi' ? resepsiAddress : akadAddress;
  const activeCoords = activeTab === 'resepsi' ? resepsiCoords : akadCoords;
  const activeGmaps = activeTab === 'resepsi' ? resepsiGmaps : akadGmaps;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Fix default marker icon path issue in bundlers
      const customIcon = L.divIcon({
        className: 'custom-wedding-marker',
        html: `
          <div style="
            background: linear-gradient(135deg, #be7382, #8a3848);
            width: 38px;
            height: 38px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 14px rgba(138, 56, 72, 0.45);
            border: 2.5px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-size: 16px;
              font-weight: bold;
            ">📍</span>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
      });

      const map = L.map(mapContainerRef.current, {
        center: [activeCoords.lat, activeCoords.lng],
        zoom: 15,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([activeCoords.lat, activeCoords.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${activeVenue}</b><br/><span style="font-size:12px">${activeAddress}</span>`)
        .openPopup();

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      mapInstanceRef.current.setView([activeCoords.lat, activeCoords.lng], 15);
      if (markerRef.current) {
        markerRef.current.setLatLng([activeCoords.lat, activeCoords.lng]);
        markerRef.current.setPopupContent(`<b>${activeVenue}</b><br/><span style="font-size:12px">${activeAddress}</span>`);
        markerRef.current.openPopup();
      }
    }

    return () => {
      // Keep instance intact across tab changes, destroy on unmount
    };
  }, [activeCoords, activeVenue, activeAddress]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${activeCoords.lat}, ${activeCoords.lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-xl border border-[#eedfe5] transition-all">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#be7382]/15 text-[#be7382] flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif-title text-lg font-semibold text-[#4a3b44]">
              Peta Lokasi Interaktif
            </h4>
            <p className="text-xs text-[#826b77]">
              Jelajahi denah venue & rute perjalanan
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="inline-flex rounded-full bg-[#f6ecf0] p-1 border border-[#ebd6df]">
          <button
            type="button"
            onClick={() => setActiveTab('resepsi')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
              activeTab === 'resepsi'
                ? 'bg-[#be7382] text-white shadow-sm'
                : 'text-[#6b5863] hover:text-[#4a3b44]'
            }`}
          >
            Resepsi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('akad')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
              activeTab === 'akad'
                ? 'bg-[#be7382] text-white shadow-sm'
                : 'text-[#6b5863] hover:text-[#4a3b44]'
            }`}
          >
            Akad Nikah
          </button>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="relative rounded-xl overflow-hidden border border-[#eedfe5] shadow-inner mb-4">
        <div ref={mapContainerRef} className="w-full h-64 md:h-72 z-0" />
        <div className="absolute top-2 right-2 z-[400] bg-white/90 backdrop-blur-sm text-[11px] px-2.5 py-1 rounded-md shadow text-[#4a3b44] font-mono border border-slate-200">
          📍 {activeCoords.lat.toFixed(4)}, {activeCoords.lng.toFixed(4)}
        </div>
      </div>

      {/* Venue Info & Actions */}
      <div className="bg-[#faf4f6] rounded-xl p-3.5 border border-[#ebd6df] mb-4">
        <div className="text-sm font-semibold text-[#5a2c3c]">{activeVenue}</div>
        <p className="text-xs text-[#6e5966] mt-1 leading-relaxed">{activeAddress}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <a
          href={activeGmaps}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#be7382] to-[#a35c6b] text-white text-xs font-medium hover:opacity-95 shadow-md shadow-[#be7382]/20 active:scale-[0.98] transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Buka Google Maps
        </a>

        <button
          type="button"
          onClick={handleCopyCoords}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-[#ebd6df] text-[#6b5863] hover:text-[#4a3b44] text-xs font-medium hover:bg-[#fbf7f9] shadow-sm active:scale-[0.98] transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Koordinat Disalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#be7382]" />
              <span>Salin Koordinat GPS</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
