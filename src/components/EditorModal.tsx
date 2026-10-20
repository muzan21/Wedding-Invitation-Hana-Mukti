import React, { useState } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Users,
  Calendar,
  BookOpen,
  Heart,
  Image as ImageIcon,
  Gift,
  Music,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Video,
  Camera,
  UploadCloud,
  Play,
  Film,
  Sparkles,
  Info,
} from 'lucide-react';
import { InvitationData } from '../types/invitation';
import { DEFAULT_INVITATION } from '../data/defaultInvitation';
import { compressImage, formatVideoUrl } from '../utils/mediaUpload';

interface EditorModalProps {
  data: InvitationData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newData: InvitationData) => void;
  onReset: () => void;
}

export const EditorModal: React.FC<EditorModalProps> = ({
  data,
  isOpen,
  onClose,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<InvitationData>(data);
  const [activeTab, setActiveTab] = useState<
    'mempelai' | 'acara' | 'ayat' | 'cerita' | 'galeri' | 'kado' | 'musik' | 'tamu' | 'data'
  >('galeri');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Guest Link Generator State
  const [guestInput, setGuestInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSave = () => {
    onSave(formData);
    showToast('Semua perubahan berhasil disimpan!');
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh data ke draf awal demo Simanten?')) {
      setFormData(DEFAULT_INVITATION);
      onReset();
      showToast('Data berhasil di-reset ke draf awal!');
    }
  };

  // Upload Groom Photo
  const handleUploadGroomPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const dataUrl = await compressImage(file, 800, 1000, 0.85);
      setFormData({
        ...formData,
        mempelai: {
          ...formData.mempelai,
          groom: { ...formData.mempelai.groom, photo: dataUrl },
        },
      });
      showToast('Foto mempelai pria berhasil diperbarui!');
    } catch {
      alert('Gagal memproses gambar. Silakan gunakan format JPG atau PNG.');
    } finally {
      setIsUploading(false);
    }
  };

  // Upload Bride Photo
  const handleUploadBridePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const dataUrl = await compressImage(file, 800, 1000, 0.85);
      setFormData({
        ...formData,
        mempelai: {
          ...formData.mempelai,
          bride: { ...formData.mempelai.bride, photo: dataUrl },
        },
      });
      showToast('Foto mempelai wanita berhasil diperbarui!');
    } catch {
      alert('Gagal memproses gambar. Silakan gunakan format JPG atau PNG.');
    } finally {
      setIsUploading(false);
    }
  };

  // Multi-Photo Upload for Gallery
  const handleUploadGalleryPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const newItems = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressed = await compressImage(file, 1200, 1200, 0.8);
        newItems.push({
          id: `gal-${Date.now()}-${i}`,
          url: compressed,
          caption: file.name.replace(/\.[^/.]+$/, ''),
        });
      }
      setFormData({
        ...formData,
        gallery: [...formData.gallery, ...newItems],
      });
      showToast(`${newItems.length} foto berhasil diunggah ke galeri!`);
    } catch {
      alert('Gagal mengunggah foto. Pastikan format gambar valid.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Replace Single Gallery Photo
  const handleReplaceGalleryPhoto = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const compressed = await compressImage(file, 1200, 1200, 0.8);
      const updated = [...formData.gallery];
      updated[idx].url = compressed;
      setFormData({ ...formData, gallery: updated });
      showToast('Foto galeri berhasil diganti!');
    } catch {
      alert('Gagal mengganti gambar.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeGalleryPhoto = (id: string) => {
    setFormData({
      ...formData,
      gallery: formData.gallery.filter((g) => g.id !== id),
    });
  };

  const addManualPhoto = () => {
    const newPhoto = {
      id: `gal-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      caption: 'Momen Bahagia',
    };
    setFormData({
      ...formData,
      gallery: [...formData.gallery, newPhoto],
    });
  };

  // Video File Upload
  const handleUploadVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (recommend under 50MB for smooth playback)
    if (file.size > 75 * 1024 * 1024) {
      alert('Ukuran video terlalu besar (>75MB). Disarankan menggunakan tautan YouTube untuk kualitas terbaik tanpa membebani memori browser.');
      return;
    }

    try {
      setIsUploading(true);
      const videoObjectUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        videoUrl: videoObjectUrl,
      });
      showToast('Video berhasil dimuat dari perangkat!');
    } catch {
      alert('Gagal memuat berkas video.');
    } finally {
      setIsUploading(false);
    }
  };

 // Video URL Input Handler with auto-formatting
  const handleVideoUrlChange = (val: string) => {
    const formatted = formatVideoUrl(val);
    setFormData({
      ...formData,
      videoUrl: formatted,
    });
  };

  // QRIS Photo Upload
  const handleUploadQris = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 600, 600, 0.85);
      setFormData({
        ...formData,
        gifts: { ...formData.gifts, qrisUrl: dataUrl },
      });
      showToast('Gambar QRIS berhasil diperbarui!');
    } catch {
      alert('Gagal memproses gambar QRIS.');
    }
  };

  // Music File Upload / Import dari Perangkat
  const handleUploadMusicFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Batas ukuran file maksimal 20MB
    if (file.size > 20 * 1024 * 1024) {
      alert('Ukuran file musik terlalu besar (>20MB). Silakan gunakan file MP3 yang lebih kecil.');
      return;
    }

    try {
      setIsUploading(true);
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '');

      // Jika file <= 4MB, ubah ke Data URL (Base64) agar tersimpan permanen di browser & file JSON
      if (file.size <= 4 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setFormData({
            ...formData,
            general: {
              ...formData.general,
              musicUrl: result,
              musicTitle: cleanTitle,
            },
          });
          setIsUploading(false);
          showToast(`Musik "${cleanTitle}" berhasil diimpor!`);
        };
        reader.onerror = () => {
          setIsUploading(false);
          alert('Gagal membaca file audio.');
        };
        reader.readAsDataURL(file);
      } else {
        // Jika > 4MB, gunakan Object URL
        const audioObjectUrl = URL.createObjectURL(file);
        setFormData({
          ...formData,
          general: {
            ...formData.general,
            musicUrl: audioObjectUrl,
            musicTitle: cleanTitle,
          },
        });
        setIsUploading(false);
        showToast(`Musik "${cleanTitle}" berhasil dimuat!`);
      }
    } catch {
      setIsUploading(false);
      alert('Gagal mengimpor file musik.');
    } finally {
      e.target.value = '';
    }
  };

  // Love Story handlers
  const addStory = () => {
    const newStory = {
      id: `story-${Date.now()}`,
      title: 'Babak Baru Cerita',
      year: new Date().getFullYear().toString(),
      story: 'Tuliskan kisah perjalanan cinta Anda di sini...',
    };
    setFormData({
      ...formData,
      stories: [...formData.stories, newStory],
    });
  };

  const removeStory = (id: string) => {
    setFormData({
      ...formData,
      stories: formData.stories.filter((s) => s.id !== id),
    });
  };

  // Bank Account handlers
  const addBankAccount = () => {
    const newBank = {
      id: `bank-${Date.now()}`,
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountHolder: formData.mempelai.bride.name || 'Nama Pemilik Rekening',
    };
    setFormData({
      ...formData,
      gifts: {
        ...formData.gifts,
        bankAccounts: [...formData.gifts.bankAccounts, newBank],
      },
    });
  };

  const removeBankAccount = (id: string) => {
    setFormData({
      ...formData,
      gifts: {
        ...formData.gifts,
        bankAccounts: formData.gifts.bankAccounts.filter((b) => b.id !== id),
      },
    });
  };

  // Export JSON
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `undangan-${formData.general.groomNickname}-${formData.general.brideNickname}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('File konfigurasi JSON berhasil diunduh!');
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.general && parsed.mempelai && parsed.events) {
          setFormData(parsed);
          onSave(parsed);
          showToast('Data undangan berhasil diimpor!');
        } else {
          alert('Format JSON tidak sesuai template undangan.');
        }
      } catch {
        alert('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Guest Link generation
  const generatedUrl = `${window.location.origin}${window.location.pathname}?to=${encodeURIComponent(
    guestInput.trim()
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const waText = `Kepada Yth. Bapak/Ibu/Saudara/i *${
      guestInput.trim() || 'Tamu Undangan'
    }*,\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk menghadiri pernikahan kami:\n\n*${
      formData.mempelai.groom.name
    } & ${formData.mempelai.bride.name}*\n\nBerikut tautan undangan digital kami:\n${generatedUrl}\n\nMerupakan suatu kehormatan & kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nTerima kasih.`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`, '_blank');
  };

 return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[95vh] sm:h-[92vh] max-h-[820px] shadow-2xl flex flex-col sm:flex-row overflow-hidden border border-[#eedfe5] animate-fade-in">
        
        {/* Modal Top Header */}
       <div className="px-4 md:px-6 py-3 bg-gradient-to-r from-[#faf2f5] to-white border-b border-[#ebd6df] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#be7382] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              ⚙️
            </div>
            <div>
              <h2 className="font-serif-title text-xl font-bold text-[#52293b]">
                Panel Editor Undangan
              </h2>
              <p className="text-xs text-[#8c6b7c]">
                Sesuaikan teks, upload foto/video, acara, koordinat peta, dan kado digital
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#be7382] hover:bg-[#a55263] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Toast alert */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white text-xs font-medium py-2.5 px-6 flex items-center justify-between animate-fade-in">
            <span>✓ {toastMsg}</span>
            <button type="button" onClick={() => setToastMsg(null)}>
              ✕
            </button>
          </div>
        )}

        {/* Uploading progress indicator */}
        {isUploading && (
          <div className="bg-rose-50 text-rose-700 text-xs py-2 px-6 flex items-center gap-2 border-b border-rose-200">
            <span className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
            <span>Sedang memproses dan mengompres berkas gambar/video...</span>
          </div>
        )}

        {/* Modal Body: Sidebar Tabs + Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Tabs Sidebar */}
         <div className="w-full md:w-56 bg-[#faf4f6] border-b md:border-b-0 md:border-r border-[#ebd6df] p-2 md:p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
            {[
              { id: 'galeri', label: 'Galeri & Video', icon: ImageIcon },
              { id: 'mempelai', label: 'Mempelai & Foto', icon: Users },
              { id: 'acara', label: 'Acara & Lokasi', icon: Calendar },
              { id: 'ayat', label: 'Ayat & Sambutan', icon: BookOpen },
              { id: 'cerita', label: 'Kisah Cinta', icon: Heart },
              { id: 'kado', label: 'Kado & QRIS', icon: Gift },
              { id: 'musik', label: 'Musik & Tema', icon: Music },
              { id: 'tamu', label: 'Link Tamu (WA)', icon: Share2 },
              { id: 'data', label: 'Backup & Reset', icon: Download },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                    isActive
                      ? 'bg-[#be7382] text-white shadow-sm font-semibold'
                      : 'text-[#6e5866] hover:bg-white hover:text-[#52293b]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            {/* TAB: GALERI & VIDEO (HIGHLIGHTED FOR USER'S QUESTION) */}
            {activeTab === 'galeri' && (
              <div className="space-y-6">
                {/* Petunjuk Penggunaan Cepat */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#faf2f5] to-[#fbf7f9] border border-[#ebd6df] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#be7382]/15 text-[#be7382] flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-[#6e5866] leading-relaxed">
                    <p className="font-semibold text-[#542d3e]">
                      Cara Mengunggah Foto & Video:
                    </p>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                      <li><strong>Foto Galeri:</strong> Klik tombol pink <span className="text-[#be7382] font-semibold">"Pilih Foto dari HP / Komputer"</span> untuk memilih satu atau beberapa foto langsung dari galeri perangkat Anda.</li>
                      <li><strong>Video Teaser:</strong> Masukkan link video YouTube (misal: link video prewedding Anda) atau pilih berkas video langsung dari perangkat.</li>
                    </ul>
                  </div>
                </div>

                {/* SECTION 1: UPLOAD FOTO GALERI */}
                <div>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div>
                      <h3 className="font-serif-title text-base font-bold text-[#52293b] flex items-center gap-2">
                        <Camera className="w-4 h-4 text-[#be7382]" />
                        <span>Koleksi Foto Prewedding ({formData.gallery.length} Foto)</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Foto akan ditampilkan di halaman galeri dengan fitur perbesaran (*lightbox*)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* File Upload Button (Multi-select) */}
                      <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#be7382] to-[#a85566] text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-[#be7382]/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer">
                        <UploadCloud className="w-4 h-4" />
                        <span>Unggah Foto dari Perangkat</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleUploadGalleryPhotos}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={addManualPhoto}
                        className="px-3 py-2 rounded-xl bg-white border border-[#ebd6df] text-[#6e5866] hover:text-[#52293b] text-xs font-medium flex items-center gap-1.5 hover:bg-slate-50 transition-all"
                        title="Tambah slot foto manual"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah URL</span>
                      </button>
                    </div>
                  </div>

                  {/* Foto Grid in Editor */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {formData.gallery.map((photo, idx) => (
                      <div
                        key={photo.id}
                        className="p-3 rounded-2xl bg-[#faf5f7] border border-[#ebd6df] space-y-2 relative group hover:shadow-md transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => removeGalleryPhoto(photo.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-rose-500 hover:bg-rose-50 transition-all shadow-xs z-10 cursor-pointer"
                          title="Hapus foto ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="relative h-36 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                          <img
                            src={photo.url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          {/* Change photo button on hover */}
                          <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer text-xs font-medium">
                            <Camera className="w-5 h-5 text-white" />
                            <span>Ganti Foto Ini</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleReplaceGalleryPhoto(idx, e)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                            Keterangan / Caption
                          </label>
                          <input
                            type="text"
                            value={photo.caption || ''}
                            onChange={(e) => {
                              const updated = [...formData.gallery];
                              updated[idx].caption = e.target.value;
                              setFormData({ ...formData, gallery: updated });
                            }}
                            placeholder="Contoh: The Beginning"
                            className="w-full px-2.5 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#be7382]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                            Atau Tautan URL Foto
                          </label>
                          <input
                            type="text"
                            value={photo.url.startsWith('data:') ? '(Foto Terunggah dari Perangkat)' : photo.url}
                            disabled={photo.url.startsWith('data:')}
                            onChange={(e) => {
                              const updated = [...formData.gallery];
                              updated[idx].url = e.target.value;
                              setFormData({ ...formData, gallery: updated });
                            }}
                            placeholder="https://..."
                            className="w-full px-2 py-1 text-[11px] border rounded-lg bg-white truncate text-slate-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full h-[1px] bg-[#ebd6df]" />

                {/* SECTION 2: PENGATURAN VIDEO TEASER */}
                <div className="p-5 rounded-2xl bg-[#faf5f7] border border-[#ebd6df] space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#be7382]/15 text-[#be7382] flex items-center justify-center">
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif-title font-bold text-sm text-[#542d3e]">
                        Video Teaser Prewedding
                      </h4>
                      <p className="text-xs text-slate-500">
                        Putar video sinematik pernikahan Anda langsung di undangan
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Input YouTube / Vimeo */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tautan Video YouTube atau Vimeo
                      </label>
                      <input
                        type="text"
                        value={formData.videoUrl || ''}
                        onChange={(e) => handleVideoUrlChange(e.target.value)}
                        placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                        className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#be7382]/40"
                      />
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        *Cukup paste link video YouTube biasa (format <code>youtu.be</code>, <code>youtube.com/watch</code>, atau <code>shorts</code>), sistem akan otomatis mengonversinya.
                      </p>
                    </div>

                    {/* Atau Upload Berkas Video Langsung */}
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-slate-700">
                          Atau Unggah Berkas Video Langsung dari Perangkat:
                        </span>
                      </div>

                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#ebd6df] text-[#52293b] text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-xs">
                        <Video className="w-4 h-4 text-[#be7382]" />
                        <span>Pilih Berkas Video (MP4 / WebM / MOV)</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/quicktime"
                          onChange={handleUploadVideoFile}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Video Live Preview */}
                    {formData.videoUrl && (
                      <div className="pt-3">
                        <p className="text-xs font-semibold text-[#542d3e] mb-1.5 flex items-center gap-1.5">
                          <Play className="w-3.5 h-3.5 text-[#be7382]" />
                          <span>Pratinjau Pemutar Video:</span>
                        </p>
                        <div className="aspect-video max-w-md rounded-xl overflow-hidden shadow-md bg-black border border-slate-300">
                          {formData.videoUrl.startsWith('data:video/') ||
                          formData.videoUrl.startsWith('blob:') ||
                          /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(formData.videoUrl) ? (
                            <video
                              src={formData.videoUrl}
                              controls
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <iframe
                              src={formData.videoUrl}
                              title="Preview Teaser"
                              allowFullScreen
                              className="w-full h-full border-0"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MEMPELAI & FOTO PROFIL */}
            {activeTab === 'mempelai' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif-title text-base font-bold text-[#52293b]">
                    Data Umum & Inisial
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Inisial Monogram (Depan)
                      </label>
                      <input
                        type="text"
                        value={formData.general.monogram}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            general: { ...formData.general, monogram: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Judul Sampul
                      </label>
                      <input
                        type="text"
                        value={formData.general.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            general: { ...formData.general, title: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* MEMPELAI PRIA */}
                <div className="p-4 rounded-2xl bg-[#faf5f7] border border-[#ebd6df] space-y-3">
                  <h4 className="font-serif-title font-bold text-sm text-[#843648]">
                    🤵 Mempelai Pria (Groom)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nama Lengkap & Gelar
                      </label>
                      <input
                        type="text"
                        value={formData.mempelai.groom.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mempelai: {
                              ...formData.mempelai,
                              groom: { ...formData.mempelai.groom, name: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nama Panggilan
                      </label>
                      <input
                        type="text"
                        value={formData.mempelai.groom.nickname}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mempelai: {
                              ...formData.mempelai,
                              groom: { ...formData.mempelai.groom, nickname: e.target.value },
                            },
                            general: { ...formData.general, groomNickname: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Urutan Anak
                      </label>
                      <input
                        type="text"
                        value={formData.mempelai.groom.order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mempelai: {
                              ...formData.mempelai,
                              groom: { ...formData.mempelai.groom, order: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={formData.mempelai.groom.instagram || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mempelai: {
                              ...formData.mempelai,
                              groom: { ...formData.mempelai.groom, instagram: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nama Ayah
                      </label>
                      <input
                        type="text"
                        value={formData.mempelai.groom.father}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mempelai: {
                              ...formData.mempelai,
                              groom: { ...formData.mempelai.groom, father: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nama Ibu
                      </label>
                      <input
                        type="text"
                        value={formData.mempelai.groom.mother}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mempelai: {
                              ...formData.mempelai,
                              groom: { ...formData.mempelai.groom, mother: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>

                    {/* Foto Mempelai Pria dengan Opsi Upload Langsung */}
                    <div className="sm:col-span-2 pt-1">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Foto Profil Mempelai Pria
                      </label>
                      <div className="flex items-center gap-3">
                        <img
                          src={formData.mempelai.groom.photo}
                          alt="Groom Preview"
                          className="w-14 h-16 object-cover rounded-xl border border-slate-300"
                        />
                        <div className="space-y-1.5 flex-1">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#ebd6df] text-[#52293b] text-xs font-semibold hover:bg-slate-50 cursor-pointer shadow-xs">
                            <Camera className="w-3.5 h-3.5 text-[#be7382]" />
                            <span>Unggah Foto Pria dari HP / Laptop</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleUploadGroomPhoto}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="text"
                            value={formData.mempelai.groom.photo.startsWith('data:') ? '(Foto Terunggah)' : formData.mempelai.groom.photo}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                mempelai: {
                                  ...formData.mempelai,
                                  groom: { ...formData.mempelai.groom, photo: e.target.value },
                                },
                              })
                            }
                            placeholder="Atau masukkan tautan URL foto https://..."
                            className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white text-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MEMPELAI WANITA */}
                <div className="p-4 rounded-2xl bg-[#faf5f7] border border-[#ebd6df] space-y-3">
                  <h4 className="font-serif-title font-bold text-sm text-[#843648]">
                    👰 Mempelai Wanita (Bride)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nama Lengkap & Gelar
                      </label>
                      <input
                        type="text"
                        value={formData.mempelai.bride.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mempelai: {
                              ...formData.mempelai,
                              bride: { ...formData.mempelai.bride, name: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nama Panggilan
                      </label>
                      <input
                        type="text"
                        value={formData.mempelai.bride.nickname}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mempelai: {
                              ...formData.mempelai,
                              bride: { ...formData.mempelai.bride, nickname: e.target.value },
                            },
                            general: { ...formData.general, brideNickname: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Urutan Anak
                      </label>
                      <input
                        type="text"
                        value={formData.mempelai.bride.order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mempelai: {
                              ...formData.mempelai,
                              bride: { ...formData.mempelai.bride, order: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={formData.mempelai.bride.instagram || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mempelai: {
                              ...formData.mempelai,
                              bride: { ...formData.mempelai.bride, instagram: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nama Ayah
                      </label>
                      <input
                        type="text"
                        value={formData.mempelai.bride.father}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mempelai: {
                              ...formData.mempelai,
                              bride: { ...formData.mempelai.bride, father: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nama Ibu
                      </label>
                      <input
                        type="text"
                        value={formData.mempelai.bride.mother}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mempelai: {
                              ...formData.mempelai,
                              bride: { ...formData.mempelai.bride, mother: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>

                    {/* Foto Mempelai Wanita dengan Opsi Upload Langsung */}
                    <div className="sm:col-span-2 pt-1">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Foto Profil Mempelai Wanita
                      </label>
                      <div className="flex items-center gap-3">
                        <img
                          src={formData.mempelai.bride.photo}
                          alt="Bride Preview"
                          className="w-14 h-16 object-cover rounded-xl border border-slate-300"
                        />
                        <div className="space-y-1.5 flex-1">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#ebd6df] text-[#52293b] text-xs font-semibold hover:bg-slate-50 cursor-pointer shadow-xs">
                            <Camera className="w-3.5 h-3.5 text-[#be7382]" />
                            <span>Unggah Foto Wanita dari HP / Laptop</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleUploadBridePhoto}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="text"
                            value={formData.mempelai.bride.photo.startsWith('data:') ? '(Foto Terunggah)' : formData.mempelai.bride.photo}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                mempelai: {
                                  ...formData.mempelai,
                                  bride: { ...formData.mempelai.bride, photo: e.target.value },
                                },
                              })
                            }
                            placeholder="Atau masukkan tautan URL foto https://..."
                            className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white text-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ACARA & LOKASI */}
            {activeTab === 'acara' && (
              <div className="space-y-6">
                {/* AKAD */}
                <div className="p-4 rounded-2xl bg-[#faf5f7] border border-[#ebd6df]">
                  <h4 className="font-serif-title font-bold text-sm text-[#843648] mb-3">
                    💍 Detail Akad Nikah
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Tanggal Masehi
                      </label>
                      <input
                        type="text"
                        value={formData.events.akad.date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              akad: { ...formData.events.akad, date: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Tanggal Hijriah
                      </label>
                      <input
                        type="text"
                        value={formData.events.akad.hijri}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              akad: { ...formData.events.akad, hijri: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Waktu Pelaksanaan
                      </label>
                      <input
                        type="text"
                        value={formData.events.akad.time}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              akad: { ...formData.events.akad, time: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nama Tempat / Venue
                      </label>
                      <input
                        type="text"
                        value={formData.events.akad.venue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              akad: { ...formData.events.akad, venue: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Alamat Lengkap
                      </label>
                      <input
                        type="text"
                        value={formData.events.akad.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              akad: { ...formData.events.akad, address: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Latitude Koordinat
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.events.akad.coordinates.lat}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              akad: {
                                ...formData.events.akad,
                                coordinates: {
                                  ...formData.events.akad.coordinates,
                                  lat: parseFloat(e.target.value) || 0,
                                },
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Longitude Koordinat
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.events.akad.coordinates.lng}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              akad: {
                                ...formData.events.akad,
                                coordinates: {
                                  ...formData.events.akad.coordinates,
                                  lng: parseFloat(e.target.value) || 0,
                                },
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Tautan Google Maps
                      </label>
                      <input
                        type="text"
                        value={formData.events.akad.gmapsUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              akad: { ...formData.events.akad, gmapsUrl: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* RESEPSI */}
                <div className="p-4 rounded-2xl bg-[#faf5f7] border border-[#ebd6df]">
                  <h4 className="font-serif-title font-bold text-sm text-[#843648] mb-3">
                    🎉 Detail Resepsi Pernikahan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Tanggal Masehi
                      </label>
                      <input
                        type="text"
                        value={formData.events.resepsi.date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              resepsi: { ...formData.events.resepsi, date: e.target.value },
                            },
                            general: { ...formData.general, eventDateDisplay: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Waktu Resepsi
                      </label>
                      <input
                        type="text"
                        value={formData.events.resepsi.time}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              resepsi: { ...formData.events.resepsi, time: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nama Gedung / Ballroom
                      </label>
                      <input
                        type="text"
                        value={formData.events.resepsi.venue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              resepsi: { ...formData.events.resepsi, venue: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Dresscode Tamu
                      </label>
                      <input
                        type="text"
                        value={formData.events.resepsi.dressCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              resepsi: { ...formData.events.resepsi, dressCode: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Alamat Lengkap Resepsi
                      </label>
                      <input
                        type="text"
                        value={formData.events.resepsi.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              resepsi: { ...formData.events.resepsi, address: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Latitude Koordinat (Peta Interaktif)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.events.resepsi.coordinates.lat}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              resepsi: {
                                ...formData.events.resepsi,
                                coordinates: {
                                  ...formData.events.resepsi.coordinates,
                                  lat: parseFloat(e.target.value) || 0,
                                },
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Longitude Koordinat (Peta Interaktif)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.events.resepsi.coordinates.lng}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              resepsi: {
                                ...formData.events.resepsi,
                                coordinates: {
                                  ...formData.events.resepsi.coordinates,
                                  lng: parseFloat(e.target.value) || 0,
                                },
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Target Countdown ISO (Contoh: 2029-05-31T10:00:00)
                      </label>
                      <input
                        type="text"
                        value={formData.events.resepsi.isoTargetDateTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              resepsi: {
                                ...formData.events.resepsi,
                                isoTargetDateTime: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AYAT */}
            {activeTab === 'ayat' && (
              <div className="space-y-4">
                <h3 className="font-serif-title text-base font-bold text-[#52293b]">
                  Ayat Suci & Kalimat Pembuka
                </h3>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Bismillah Calligraphy
                  </label>
                  <input
                    type="text"
                    value={formData.ayat.bismillah}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ayat: { ...formData.ayat, bismillah: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl text-sm font-arabic bg-[#faf5f7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Teks Arab Ayat (QS Ar-Rum 21 atau doa lainnya)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.ayat.arabicText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ayat: { ...formData.ayat, arabicText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl text-sm font-arabic bg-[#faf5f7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Terjemahan Ayat
                  </label>
                  <textarea
                    rows={3}
                    value={formData.ayat.translation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ayat: { ...formData.ayat, translation: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Sumber Ayat / Surat
                  </label>
                  <input
                    type="text"
                    value={formData.ayat.source}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ayat: { ...formData.ayat, source: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Salam Pembuka
                  </label>
                  <input
                    type="text"
                    value={formData.ayat.salamPembuka}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ayat: { ...formData.ayat, salamPembuka: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Teks Pengantar Undangan
                  </label>
                  <textarea
                    rows={2}
                    value={formData.ayat.intro}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ayat: { ...formData.ayat, intro: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            {/* TAB: CERITA (OUR LOVE STORY) */}
            {activeTab === 'cerita' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-title text-base font-bold text-[#52293b]">
                      Timeline Our Love Story
                    </h3>
                    <p className="text-xs text-slate-500">
                      Bagikan kenangan manis perjalanan cinta Anda
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addStory}
                    className="px-3 py-1.5 rounded-xl bg-[#be7382] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#a55263] transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Kisah</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.stories.map((story, idx) => (
                    <div
                      key={story.id}
                      className="p-4 rounded-2xl bg-[#faf5f7] border border-[#ebd6df] space-y-2 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeStory(story.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-all"
                        title="Hapus Cerita"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-8">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            Judul Babak
                          </label>
                          <input
                            type="text"
                            value={story.title}
                            onChange={(e) => {
                              const updated = [...formData.stories];
                              updated[idx].title = e.target.value;
                              setFormData({ ...formData, stories: updated });
                            }}
                            className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            Tahun / Tanggal
                          </label>
                          <input
                            type="text"
                            value={story.year}
                            onChange={(e) => {
                              const updated = [...formData.stories];
                              updated[idx].year = e.target.value;
                              setFormData({ ...formData, stories: updated });
                            }}
                            className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Isi Cerita
                        </label>
                        <textarea
                          rows={2}
                          value={story.story}
                          onChange={(e) => {
                            const updated = [...formData.stories];
                            updated[idx].story = e.target.value;
                            setFormData({ ...formData, stories: updated });
                          }}
                          className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: KADO DIGITAL & QRIS */}
            {activeTab === 'kado' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-title text-base font-bold text-[#52293b]">
                      Pengaturan Rekening & Amplop Digital
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tambahkan nomor rekening BCA, Mandiri, BSI, atau e-Wallet
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addBankAccount}
                    className="px-3 py-1.5 rounded-xl bg-[#be7382] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#a55263] transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Rekening</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.gifts.bankAccounts.map((bank, idx) => (
                    <div
                      key={bank.id}
                      className="p-4 rounded-2xl bg-[#faf5f7] border border-[#ebd6df] grid grid-cols-1 sm:grid-cols-3 gap-3 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeBankAccount(bank.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-all"
                        title="Hapus Rekening"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Nama Bank / e-Wallet
                        </label>
                        <input
                          type="text"
                          value={bank.bankName}
                          onChange={(e) => {
                            const updated = [...formData.gifts.bankAccounts];
                            updated[idx].bankName = e.target.value;
                            setFormData({
                              ...formData,
                              gifts: { ...formData.gifts, bankAccounts: updated },
                            });
                          }}
                          className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Nomor Rekening
                        </label>
                        <input
                          type="text"
                          value={bank.accountNumber}
                          onChange={(e) => {
                            const updated = [...formData.gifts.bankAccounts];
                            updated[idx].accountNumber = e.target.value;
                            setFormData({
                              ...formData,
                              gifts: { ...formData.gifts, bankAccounts: updated },
                            });
                          }}
                          className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Atas Nama
                        </label>
                        <input
                          type="text"
                          value={bank.accountHolder}
                          onChange={(e) => {
                            const updated = [...formData.gifts.bankAccounts];
                            updated[idx].accountHolder = e.target.value;
                            setFormData({
                              ...formData,
                              gifts: { ...formData.gifts, bankAccounts: updated },
                            });
                          }}
                          className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-[#faf5f7] border border-[#ebd6df] space-y-3">
                  <h4 className="font-serif-title font-bold text-sm text-[#843648]">
                    QRIS & Kado Fisik
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Foto / Gambar QRIS
                    </label>
                    <div className="flex items-center gap-3">
                      {formData.gifts.qrisUrl && (
                        <img
                          src={formData.gifts.qrisUrl}
                          alt="QRIS Preview"
                          className="w-16 h-16 object-contain bg-white rounded-lg border p-1"
                        />
                      )}
                      <div className="space-y-1.5 flex-1">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#ebd6df] text-[#52293b] text-xs font-semibold hover:bg-slate-50 cursor-pointer shadow-xs">
                          <Camera className="w-3.5 h-3.5 text-[#be7382]" />
                          <span>Unggah Gambar QRIS dari Perangkat</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadQris}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          value={formData.gifts.qrisUrl?.startsWith('data:') ? '(QRIS Terunggah)' : (formData.gifts.qrisUrl || '')}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gifts: { ...formData.gifts, qrisUrl: e.target.value },
                            })
                          }
                          placeholder="Atau tautan URL gambar QRIS https://..."
                          className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white text-slate-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Penerima Kado Fisik
                      </label>
                      <input
                        type="text"
                        value={formData.gifts.physicalGift?.recipientName || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gifts: {
                              ...formData.gifts,
                              physicalGift: {
                                ...(formData.gifts.physicalGift || {
                                  phone: '',
                                  address: '',
                                }),
                                recipientName: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nomor HP Penerima
                      </label>
                      <input
                        type="text"
                        value={formData.gifts.physicalGift?.phone || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gifts: {
                              ...formData.gifts,
                              physicalGift: {
                                ...(formData.gifts.physicalGift || {
                                  recipientName: '',
                                  address: '',
                                }),
                                phone: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Alamat Pengiriman Kado Fisik
                      </label>
                      <textarea
                        rows={2}
                        value={formData.gifts.physicalGift?.address || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gifts: {
                              ...formData.gifts,
                              physicalGift: {
                                ...(formData.gifts.physicalGift || {
                                  recipientName: '',
                                  phone: '',
                                }),
                                address: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MUSIK & TEMA */}
            {activeTab === 'musik' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-serif-title text-base font-bold text-[#52293b]">
                      Musik Latar & Warna Aksen
                    </h3>
                    <p className="text-xs text-slate-500">
                      Impor musik MP3 dari perangkat Anda atau gunakan tautan URL audio
                    </p>
                  </div>

                  {/* TOMBOL IMPORT MUSIK DARI PERANGKAT */}
                  <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#be7382] to-[#a85566] text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-[#be7382]/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer">
                    <UploadCloud className="w-4 h-4" />
                    <span>Import Musik dari Perangkat</span>
                    <input
                      type="file"
                      accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/m4a,audio/*"
                      onChange={handleUploadMusicFile}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Judul Musik
                    </label>
                    <input
                      type="text"
                      value={formData.general.musicTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          general: { ...formData.general, musicTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      URL File Audio MP3
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={
                          formData.general.musicUrl.startsWith('data:audio/') ||
                          formData.general.musicUrl.startsWith('blob:')
                            ? '(File Musik Diimpor dari Perangkat)'
                            : formData.general.musicUrl
                        }
                        disabled={
                          formData.general.musicUrl.startsWith('data:audio/') ||
                          formData.general.musicUrl.startsWith('blob:')
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            general: { ...formData.general, musicUrl: e.target.value },
                          })
                        }
                        placeholder="https://... (atau klik tombol Import Musik di atas)"
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-600"
                      />
                      {(formData.general.musicUrl.startsWith('data:audio/') ||
                        formData.general.musicUrl.startsWith('blob:')) && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              general: { ...formData.general, musicUrl: '' },
                            })
                          }
                          className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-all shrink-0 cursor-pointer"
                        >
                          Hapus File
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Pemutar Pratinjau Audio */}
                  {formData.general.musicUrl && (
                    <div className="p-3 rounded-xl bg-[#faf5f7] border border-[#ebd6df]">
                      <label className="block text-xs font-semibold text-[#542d3e] mb-1.5 flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-[#be7382]" />
                        <span>Pratinjau Musik Saat Ini:</span>
                      </label>
                      <audio
                        controls
                        src={formData.general.musicUrl}
                        className="w-full h-9 rounded-lg"
                      />
                    </div>
                  )}

                  {/* Preset Pilihan Musik */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Pilihan Musik Populer:
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          title: 'Wedding Nasheed - Muhammad Al-Muqit',
                          url: 'https://www.dropbox.com/scl/fi/ljwd9llgz4o02eewyvnvq/Wedding-Nasheed-Muhammad-Al-Muqit.mp3?rlkey=rlqnxerxaxi0s2p2oiea6249t&st=1notfioh&raw=1',
                        },
                        {
                          title: 'Romantic Piano & Strings (Acoustic Wedding)',
                          url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3',
                        },
                        {
                          title: 'Barakallah - Romantic Islamic Nasheed',
                          url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=wedding-10940.mp3',
                        },
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              general: {
                                ...formData.general,
                                musicTitle: preset.title,
                                musicUrl: preset.url,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center justify-between text-xs transition-colors cursor-pointer"
                        >
                          <span className="font-medium text-slate-700">{preset.title}</span>
                          <span className="text-[10px] text-[#be7382] font-semibold">
                            Pilih Lagu
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GENERATOR LINK TAMU */}
            {activeTab === 'tamu' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif-title text-base font-bold text-[#52293b]">
                    Generator Link Khusus Tamu & WhatsApp
                  </h3>
                  <p className="text-xs text-slate-500">
                    Buat tautan personalisasi dengan nama tamu undangan otomatis
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#faf5f7] border border-[#ebd6df] space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#52293b] mb-1">
                      Nama Tamu Undangan
                    </label>
                    <input
                      type="text"
                      value={guestInput}
                      onChange={(e) => setGuestInput(e.target.value)}
                      placeholder="Contoh: Bapak Budi Santoso & Istri"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ebd6df] text-xs text-[#4a3742] focus:outline-none focus:ring-2 focus:ring-[#be7382]/40"
                    />
                  </div>

                  {guestInput.trim() && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Tautan Personal Terbuat:
                        </label>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 break-all select-all">
                          {generatedUrl}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="px-4 py-2 rounded-xl bg-white border border-[#ebd6df] text-[#6b5863] text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          {copiedLink ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-600" />
                              <span className="text-emerald-700">Tautan Disalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-[#be7382]" />
                              <span>Salin Tautan</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleShareWhatsApp}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Kirim via WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: BACKUP & RESET */}
            {activeTab === 'data' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif-title text-base font-bold text-[#52293b]">
                    Cadangan Data & Reset Draf
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ekspor seluruh konfigurasi undangan atau pulihkan ke template awal Simanten
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Export */}
                  <div className="p-5 rounded-2xl bg-[#faf5f7] border border-[#ebd6df] space-y-2">
                    <h4 className="font-bold text-xs text-[#52293b]">
                      Unduh Konfigurasi (JSON)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Simpan file data undangan Anda ke komputer untuk keamanan atau dipindahkan.
                    </p>
                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="mt-2 px-4 py-2 rounded-xl bg-white border border-[#ebd6df] text-[#52293b] text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50 shadow-sm"
                    >
                      <Download className="w-4 h-4 text-[#be7382]" />
                      <span>Unduh File JSON</span>
                    </button>
                  </div>

                  {/* Import */}
                  <div className="p-5 rounded-2xl bg-[#faf5f7] border border-[#ebd6df] space-y-2">
                    <h4 className="font-bold text-xs text-[#52293b]">
                      Unggah Konfigurasi (JSON)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Muat konfigurasi undangan yang pernah Anda simpan sebelumnya.
                    </p>
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#ebd6df] text-[#52293b] text-xs font-semibold hover:bg-slate-50 shadow-sm cursor-pointer mt-2">
                      <Upload className="w-4 h-4 text-[#be7382]" />
                      <span>Pilih File JSON</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJson}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Reset */}
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <h4 className="font-bold text-xs text-rose-800">
                    Reset ke Template Asli Simanten (Alfan & Mecca)
                  </h4>
                  <p className="text-[11px] text-rose-600">
                    Tindakan ini akan mengembalikan seluruh teks, tanggal, dan foto ke draf default demo Simanten 1502.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Data ke Awal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
