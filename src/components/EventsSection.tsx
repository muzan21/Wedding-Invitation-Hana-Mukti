import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CalendarPlus, Sparkles, Shirt } from 'lucide-react';
import { InvitationData } from '../types/invitation';
import { InteractiveMap } from './InteractiveMap';

interface EventsSectionProps {
  akad: InvitationData['events']['akad'];
  resepsi: InvitationData['events']['resepsi'];
}

export const EventsSection: React.FC<EventsSectionProps> = ({ akad, resepsi }) => {
  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(resepsi.isoTargetDateTime || '2029-05-31T10:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [resepsi.isoTargetDateTime]);

  // Google Calendar Link generator
  const createGoogleCalendarLink = () => {
    const title = encodeURIComponent(`${resepsi.title} Alfan & Mecca`);
    const details = encodeURIComponent(
      `Pernikahan Alfan & Mecca\nAkad: ${akad.time} di ${akad.venue}\nResepsi: ${resepsi.time} di ${resepsi.venue}\nDresscode: ${resepsi.dressCode}`
    );
    const location = encodeURIComponent(`${resepsi.venue}, ${resepsi.address}`);
    // Format YYYYMMDDTHHmmssZ
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20290531T030000Z/20290531T070000Z`;
  };

  // iCal download
  const handleDownloadICal = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Simanten Wedding//ID',
      'BEGIN:VEVENT',
      'SUMMARY:Pernikahan Alfan & Mecca',
      `DESCRIPTION:Resepsi Pernikahan Alfan & Mecca di ${resepsi.venue}`,
      `LOCATION:${resepsi.venue}, ${resepsi.address}`,
      'DTSTART:20290531T030000Z',
      'DTEND:20290531T070000Z',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Pernikahan-Alfan-Mecca.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="sec-events" className="relative w-full py-12 px-5 overflow-hidden">
      {/* Background floral flourishes */}
      <img
        src="https://lib.simanten.com/wp-content/uploads/2025/04/bunga-demo-pink-b.png"
        alt="Floral garland"
        className="w-full max-w-sm mx-auto mb-6 opacity-60 object-contain pointer-events-none"
      />

      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <p className="text-[11px] tracking-[0.25em] font-semibold text-[#8a5b6f] uppercase">
            Rangkaian Acara
          </p>
          <h2 className="font-serif-title text-3xl font-bold text-[#542d3e] mt-1">
            Waktu & Tempat
          </h2>
          <div className="w-12 h-0.5 bg-[#be7382]/40 mx-auto mt-2 rounded-full" />
        </div>

        {/* AKAD NIKAH CARD */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 md:p-7 shadow-lg border border-[#eedee5] relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#be7382]/15 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#be7382]/15 text-[#be7382] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title text-xl font-bold text-[#562c3f]">
                {akad.title}
              </h3>
              <p className="text-[11px] text-[#866373]">{akad.hijri}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#634e5b]">
            <div className="flex items-start gap-3 bg-[#faf4f6] p-3 rounded-xl border border-[#eedfe5]">
              <Calendar className="w-4 h-4 text-[#be7382] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#4e3643]">{akad.date}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#7d5f6f] mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#be7382]" />
                  <span>{akad.time}</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#faf4f6] p-3 rounded-xl border border-[#eedfe5]">
              <MapPin className="w-4 h-4 text-[#be7382] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#4e3643]">{akad.venue}</p>
                <p className="text-[11px] text-[#7d5f6f] mt-0.5 leading-relaxed">
                  {akad.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RESEPSI CARD */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 md:p-7 shadow-lg border border-[#eedee5] relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#be7382]/15 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#be7382]/15 text-[#be7382] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title text-xl font-bold text-[#562c3f]">
                {resepsi.title}
              </h3>
              <p className="text-[11px] text-[#866373]">{resepsi.hijri}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#634e5b]">
            <div className="flex items-start gap-3 bg-[#faf4f6] p-3 rounded-xl border border-[#eedfe5]">
              <Calendar className="w-4 h-4 text-[#be7382] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#4e3643]">{resepsi.date}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#7d5f6f] mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#be7382]" />
                  <span>{resepsi.time}</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#faf4f6] p-3 rounded-xl border border-[#eedfe5]">
              <MapPin className="w-4 h-4 text-[#be7382] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#4e3643]">{resepsi.venue}</p>
                <p className="text-[11px] text-[#7d5f6f] mt-0.5 leading-relaxed">
                  {resepsi.address}
                </p>
              </div>
            </div>

            {resepsi.dressCode && (
              <div className="flex items-start gap-3 bg-[#fff8fa] p-3 rounded-xl border border-[#f3e1e8]">
                <Shirt className="w-4 h-4 text-[#be7382] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#663548]">Dresscode:</p>
                  <p className="text-[11px] text-[#7d5f6f] mt-0.5">
                    {resepsi.dressCode}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COUNTDOWN TIMER */}
        <div className="bg-gradient-to-br from-[#be7382] to-[#994759] text-white rounded-3xl p-6 shadow-xl text-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[11px] tracking-widest uppercase text-white/80 font-medium">
              Hitung Mundur Acara Resepsi
            </p>
            <h4 className="font-serif-title text-xl font-bold mt-1 text-white">
              Menuju Hari Bahagia
            </h4>

            {/* Countdown Boxes */}
            <div className="grid grid-cols-4 gap-2 md:gap-3 my-5">
              {[
                { label: 'Hari', value: timeLeft.days },
                { label: 'Jam', value: timeLeft.hours },
                { label: 'Menit', value: timeLeft.minutes },
                { label: 'Detik', value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/20 backdrop-blur-md rounded-2xl py-3 px-1 border border-white/25 shadow-sm"
                >
                  <span className="font-serif-title text-2xl md:text-3xl font-bold block text-white leading-none">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] tracking-wider uppercase text-white/85 font-medium mt-1 block">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Save Date Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <a
                href={createGoogleCalendarLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#943f52] font-semibold text-xs shadow-md hover:bg-[#fff5f7] active:scale-95 transition-all"
              >
                <CalendarPlus className="w-4 h-4 text-[#be7382]" />
                <span>Simpan Tanggal (Google Cal)</span>
              </a>

              <button
                type="button"
                onClick={handleDownloadICal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/20 border border-white/40 text-white font-medium text-xs hover:bg-white/30 active:scale-95 transition-all"
              >
                <span>Unduh iCal (.ics)</span>
              </button>
            </div>
          </div>
        </div>

        {/* INTERACTIVE COORDINATE MAP */}
        <InteractiveMap
          akadVenue={akad.venue}
          akadAddress={akad.address}
          akadCoords={akad.coordinates}
          akadGmaps={akad.gmapsUrl}
          resepsiVenue={resepsi.venue}
          resepsiAddress={resepsi.address}
          resepsiCoords={resepsi.coordinates}
          resepsiGmaps={resepsi.gmapsUrl}
        />
      </div>
    </section>
  );
};
