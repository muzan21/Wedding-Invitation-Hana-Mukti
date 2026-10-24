import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, XCircle, HelpCircle, Heart, Search, MessageSquareHeart } from 'lucide-react';
import { RsvpEntry } from '../types/invitation';

interface RsvpGuestbookSectionProps {
  rsvps: RsvpEntry[];
  defaultGuestName?: string;
  onAddRsvp: (entry: Omit<RsvpEntry, 'id' | 'createdAt' | 'likes'>) => void;
  onLikeRsvp: (id: string) => void;
}

export const RsvpGuestbookSection: React.FC<RsvpGuestbookSectionProps> = ({
  rsvps,
  defaultGuestName = '',
  onAddRsvp,
  onLikeRsvp,
}) => {
  const [name, setName] = useState(defaultGuestName);
  const [attendance, setAttendance] = useState<'hadir' | 'tidak' | 'ragu'>('hadir');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [relation, setRelation] = useState('Sahabat Mempelai');
  const [message, setMessage] = useState('');
  const [filterType, setFilterType] = useState<'semua' | 'hadir' | 'tidak'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    // 1. Kirim ke fungsi utama dari props
    onAddRsvp({
      name: name.trim(),
      attendance,
      guestCount: attendance === 'hadir' ? guestCount : 0,
      relation,
      message: message.trim(),
    });

    // 2. BACKUP LOCALSTORAGE: Memastikan data langsung tersimpan di browser HP tamu 
    // agar langsung muncul di list bawah tanpa hilang saat direfresh.
    try {
      const newEntry: RsvpEntry = {
        id: 'local-' + Date.now(),
        name: name.trim(),
        attendance,
        guestCount: attendance === 'hadir' ? guestCount : 0,
        relation,
        message: message.trim(),
        createdAt: 'Baru saja',
        likes: 0,
      };
      const existingLocal = JSON.parse(localStorage.getItem('saved_local_rsvps') || '[]');
      localStorage.setItem('saved_local_rsvps', JSON.stringify([newEntry, ...existingLocal]));
    } catch {
      // ignore
    }

    setMessage('');
    setSubmitted(true);

    // Trigger sweet celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#be7382', '#f43f5e', '#fb7185', '#fda4af', '#fef08a'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => setSubmitted(false), 5000);
  };

  // Menggabungkan data dari props utama dan backup lokal agar langsung tampil
  const localSavedRsvps: RsvpEntry[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('saved_local_rsvps') || '[]');
    } catch {
      return [];
    }
  })();

  // Gabungkan dan hilangkan duplikat berdasarkan nama & pesan
  const combinedRsvps = [...rsvps];
  localSavedRsvps.forEach((localItem) => {
    if (!combinedRsvps.some((r) => r.name === localItem.name && r.message === localItem.message)) {
      combinedRsvps.unshift(localItem);
    }
  });

  const filteredRsvps = combinedRsvps
    .filter((item) => {
      if (filterType === 'hadir') return item.attendance === 'hadir';
      if (filterType === 'tidak') return item.attendance === 'tidak';
      return true;
    })
    .filter((item) => {
      if (!searchQuery.trim()) return true;
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const totalHadirCount = combinedRsvps
    .filter((r) => r.attendance === 'hadir')
    .reduce((sum, curr) => sum + (curr.guestCount || 1), 0);

  return (
    <section id="sec-rsvp" className="relative w-full py-12 px-5 overflow-hidden">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#be7382]/15 text-[#be7382] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <MessageSquareHeart className="w-6 h-6" />
          </div>
          <p className="text-[11px] tracking-[0.25em] font-semibold text-[#8a5b6f] uppercase">
            Konfirmasi & Doa
          </p>
          <h2 className="font-serif-title text-3xl font-bold text-[#542d3e] mt-1">
            Ucapan & Kehadiran
          </h2>
          <div className="w-12 h-0.5 bg-[#be7382]/40 mx-auto mt-2 rounded-full mb-3" />
          <p className="text-xs text-[#6e5866] leading-relaxed max-w-sm mx-auto">
            Dengan penuh hormat, kami mohon kesediaan Bapak/Ibu/Saudara/i untuk memberikan konfirmasi kehadiran serta doa dan restu kepada kedua mempelai.
          </p>
        </div>

        {/* RSVP FORM */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-[#eedee5] mb-10">
          <h3 className="font-serif-title text-lg font-bold text-[#542d3e] mb-4 flex items-center gap-2">
            <span>Formulir Konfirmasi Kehadiran</span>
          </h3>

          {submitted && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Terima kasih banyak! Ucapan & konfirmasi Anda telah tersimpan di buku tamu.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Tamu */}
            <div>
              <label className="block text-xs font-semibold text-[#542d3e] mb-1.5">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso & Keluarga"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf5f7] border border-[#ebd6df] text-xs text-[#4a3742] focus:outline-none focus:ring-2 focus:ring-[#be7382]/40 focus:bg-white transition-all"
              />
            </div>

            {/* Konfirmasi Kehadiran */}
            <div>
              <label className="block text-xs font-semibold text-[#542d3e] mb-1.5">
                Konfirmasi Kehadiran <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAttendance('hadir')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                    attendance === 'hadir'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-[#634e5b] border-[#ebd6df] hover:bg-[#faf4f6]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Hadir</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendance('tidak')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                    attendance === 'tidak'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-white text-[#634e5b] border-[#ebd6df] hover:bg-[#faf4f6]'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Tidak Hadir</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendance('ragu')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                    attendance === 'ragu'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-white text-[#634e5b] border-[#ebd6df] hover:bg-[#faf4f6]'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Masih Ragu</span>
                </button>
              </div>
            </div>

            {/* Jumlah Tamu (jika hadir) */}
            {attendance === 'hadir' && (
              <div className="animate-fade-in">
                <label className="block text-xs font-semibold text-[#542d3e] mb-1.5">
                  Jumlah Orang yang Hadir
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setGuestCount(count)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                        guestCount === count
                          ? 'bg-[#be7382] text-white border-[#be7382] shadow-sm'
                          : 'bg-white text-[#634e5b] border-[#ebd6df] hover:bg-[#faf4f6]'
                      }`}
                    >
                      {count} {count === 4 ? '+' : ''} Orang
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hubungan */}
            <div>
              <label className="block text-xs font-semibold text-[#542d3e] mb-1.5">
                Hubungan / Kategori
              </label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf5f7] border border-[#ebd6df] text-xs text-[#4a3742] focus:outline-none focus:ring-2 focus:ring-[#be7382]/40 focus:bg-white transition-all"
              >
                <option value="Sahabat Mempelai">Sahabat Mempelai</option>
                <option value="Keluarga Besar">Keluarga Besar</option>
                <option value="Teman Kuliah / Sekolah">Teman Kuliah / Sekolah</option>
                <option value="Rekan Kerja">Rekan Kerja</option>
                <option value="Tamu Kehormatan">Tamu Kehormatan</option>
                <option value="Tetangga / Kerabat">Tetangga / Kerabat</option>
              </select>
            </div>

            {/* Doa & Ucapan */}
            <div>
              <label className="block text-xs font-semibold text-[#542d3e] mb-1.5">
                Doa & Ucapan Selamat <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan ucapan dan doa terbaik Anda untuk kedua mempelai..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf5f7] border border-[#ebd6df] text-xs text-[#4a3742] focus:outline-none focus:ring-2 focus:ring-[#be7382]/40 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#be7382] to-[#a05263] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#be7382]/25 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Konfirmasi & Doa</span>
            </button>
          </form>
        </div>

        {/* GUESTBOOK WISHES LIST */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-[#eedee5]">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="font-serif-title text-lg font-bold text-[#542d3e]">
                Buku Tamu Digital ({combinedRsvps.length})
              </h3>
              <p className="text-[11px] text-[#7d5f6f]">
                {totalHadirCount} tamu telah mengonfirmasi hadir
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-[#faf4f6] p-1 rounded-xl border border-[#ebd6df]">
              <button
                type="button"
                onClick={() => setFilterType('semua')}
                className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
                  filterType === 'semua'
                    ? 'bg-[#be7382] text-white shadow-sm'
                    : 'text-[#6e5866] hover:text-[#4a3742]'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setFilterType('hadir')}
                className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
                  filterType === 'hadir'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-[#6e5866] hover:text-[#4a3742]'
                }`}
              >
                Hadir
              </button>
              <button
                type="button"
                onClick={() => setFilterType('tidak')}
                className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
                  filterType === 'tidak'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-[#6e5866] hover:text-[#4a3742]'
                }`}
              >
                Tidak Hadir
              </button>
            </div>
          </div>

          {/* Search box */}
          <div className="relative mb-4">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari ucapan atau nama tamu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#faf5f7] border border-[#ebd6df] text-xs text-[#4a3742] focus:outline-none focus:bg-white"
            />
          </div>

          {/* Messages list with max height and smooth scroll */}
          <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
            {filteredRsvps.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#8c7482]">
                Belum ada ucapan yang sesuai filter pencarian.
              </div>
            ) : (
              filteredRsvps.map((rsvp) => {
                const isHadir = rsvp.attendance === 'hadir';
                const isTidak = rsvp.attendance === 'tidak';

                return (
                  <div
                    key={rsvp.id}
                    className="p-4 rounded-2xl bg-[#faf5f7] border border-[#ebd6df]/90 hover:bg-white transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#be7382] to-[#994759] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          {rsvp.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-[#52293b]">
                            {rsvp.name}
                          </div>
                          {rsvp.relation && (
                            <span className="text-[10px] text-[#866a79]">
                              {rsvp.relation}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Attendance Badge */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 flex items-center gap-1 ${
                          isHadir
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isTidak
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isHadir && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isTidak && <XCircle className="w-3 h-3 text-rose-600" />}
                        <span>
                          {isHadir
                            ? `Hadir (${rsvp.guestCount || 1})`
                            : isTidak
                            ? 'Tidak Hadir'
                            : 'Ragu-ragu'}
                        </span>
                      </span>
                    </div>

                    <p className="text-xs text-[#5c4955] leading-relaxed mb-2.5">
                      {rsvp.message}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-[#8e7785] pt-1 border-t border-[#f0e1e7]">
                      <span>{rsvp.createdAt}</span>

                      <button
                        type="button"
                        onClick={() => onLikeRsvp(rsvp.id)}
                        className="flex items-center gap-1 text-[#be7382] hover:text-[#943f52] font-medium transition-colors"
                      >
                        <Heart className="w-3 h-3 fill-[#be7382]/20 hover:fill-[#be7382]" />
                        <span>{rsvp.likes || 0}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};