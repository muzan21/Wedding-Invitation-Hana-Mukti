/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { Settings, Share2, Sparkles, RefreshCw } from 'lucide-react';
import { InvitationData, RsvpEntry } from './types/invitation';
import { DEFAULT_INVITATION } from './data/defaultInvitation';
import { OpeningCover } from './components/OpeningCover';
import { HeroSection } from './components/HeroSection';
import { AyatSection } from './components/AyatSection';
import { CoupleSection } from './components/CoupleSection';
import { EventsSection } from './components/EventsSection';
import { LoveStorySection } from './components/LoveStorySection';
import { GallerySection } from './components/GallerySection';
import { GiftSection } from './components/GiftSection';
import { RsvpGuestbookSection } from './components/RsvpGuestbookSection';
import { ClosingSection } from './components/ClosingSection';
import { MusicPlayer } from './components/MusicPlayer';
import { BottomNav } from './components/BottomNav';
import { EditorModal } from './components/EditorModal';

const STORAGE_KEY = 'simanten_invitation_data_v1';

export default function App() {
  // Load initial data from localStorage if exists
  const [data, setData] = useState<InvitationData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved data:', e);
    }
    return DEFAULT_INVITATION;
  });

  const [isOpened, setIsOpened] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('sec-hero');
  const [guestName, setGuestName] = useState('Bapak/Ibu/Saudara/i');

  // State untuk pengaman tombol edit rahasia
  const [isAdmin, setIsAdmin] = useState(false);

  // Parse guest name and admin key from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    const adminKey = params.get('admin');

    if (to && to.trim()) {
      setGuestName(to.trim());
    }

    // Tombol edit hanya akan aktif jika link ditambahkan ?admin=muktihana123
    if (adminKey === 'muktihana123') {
      setIsAdmin(true);
    }
  }, []);

  // Save to localStorage whenever data changes
  const handleSaveData = (newData: InvitationData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  const handleResetData = () => {
    setData(DEFAULT_INVITATION);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to reset storage:', e);
    }
  };

  // RSVP handlers
  const handleAddRsvp = (newEntry: Omit<RsvpEntry, 'id' | 'createdAt' | 'likes'>) => {
    const entry: RsvpEntry = {
      ...newEntry,
      id: `rsvp-${Date.now()}`,
      createdAt: 'Baru saja',
      likes: 0,
    };
    const updated = {
      ...data,
      rsvps: [entry, ...data.rsvps],
    };
    handleSaveData(updated);
  };

  const handleLikeRsvp = (id: string) => {
    const updated = {
      ...data,
      rsvps: data.rsvps.map((r) =>
        r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r
      ),
    };
    handleSaveData(updated);
  };

  // Scroll to section
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // IntersectionObserver to sync bottom nav with scroll
  useEffect(() => {
    if (!isOpened) return;

    const sectionIds = [
      'sec-hero',
      'sec-couple',
      'sec-events',
      'sec-story',
      'sec-gallery',
      'sec-gifts',
      'sec-rsvp',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isOpened]);

  return (
    <div className="min-h-screen bg-[#2d2228] flex justify-center selection:bg-[#be7382]/30 selection:text-[#842a3e]">
      {/* Top Floating App Action Bar (Always visible for easy editing & sharing) */}
      <header className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-md bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-[#eedfe5] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#be7382] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {data.general.monogram}
          </div>
          <div className="text-[11px] font-semibold text-[#542d3e] truncate max-w-[130px] sm:max-w-[160px]">
            {data.general.groomNickname} & {data.general.brideNickname}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Tombol Edit Undangan (Hanya muncul jika link memiliki parameter ?admin=muktihana123) */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#be7382] hover:bg-[#a65364] text-white text-[11px] font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Edit teks, foto, acara, dan kado"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Undangan</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: data.general.title,
                  text: `Undangan Pernikahan ${data.mempelai.groom.name} & ${data.mempelai.bride.name}`,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Tautan undangan telah disalin ke clipboard!');
              }
            }}
            className="p-1.5 rounded-full bg-white border border-[#ebd6df] text-[#6b5462] hover:text-[#4a3642] hover:bg-[#faf4f6] transition-all shadow-xs"
            title="Bagikan Tautan"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Invitation Column (Mobile view layout identical to Simanten preview frame) */}
      <div className="relative w-full max-w-lg min-h-screen bg-[#faf5f7] shadow-2xl overflow-x-hidden border-x border-[#ecd6e0]">
        {/* OPENING COVER */}
        <OpeningCover
          groomNickname={data.general.groomNickname}
          brideNickname={data.general.brideNickname}
          monogram={data.general.monogram}
          eventDateDisplay={data.general.eventDateDisplay}
          guestName={guestName}
          isOpen={isOpened}
          onOpen={() => setIsOpened(true)}
        />

        {/* INVITATION CONTENT (Visible once opened) */}
        <main className={`transition-opacity duration-700 ${isOpened ? 'opacity-100' : 'opacity-0'}`}>
          {/* Hero Section */}
          <HeroSection
            title={data.general.title}
            groomNickname={data.general.groomNickname}
            brideNickname={data.general.brideNickname}
            eventDateDisplay={data.general.eventDateDisplay}
            hijriDateDisplay={data.general.hijriDateDisplay}
            monogram={data.general.monogram}
          />

          {/* Ayat & Sambutan Section */}
          <AyatSection
            bismillah={data.ayat.bismillah}
            salamPembuka={data.ayat.salamPembuka}
            intro={data.ayat.intro}
            arabicText={data.ayat.arabicText}
            translation={data.ayat.translation}
            source={data.ayat.source}
          />

          {/* Couple (Mempelai) Section */}
          <CoupleSection
            groom={data.mempelai.groom}
            bride={data.mempelai.bride}
          />

          {/* Events (Akad & Resepsi) + Countdown + Interactive Map */}
          <EventsSection
            akad={data.events.akad}
            resepsi={data.events.resepsi}
          />

          {/* Love Story Section */}
          <LoveStorySection stories={data.stories} />

          {/* Gallery Section */}
          <GallerySection
            gallery={data.gallery}
            videoUrl={data.videoUrl}
          />

          {/* Digital Gift / Amplop Section */}
          <GiftSection
            title={data.gifts.title}
            description={data.gifts.description}
            bankAccounts={data.gifts.bankAccounts}
            qrisUrl={data.gifts.qrisUrl}
            physicalGift={data.gifts.physicalGift}
          />

          {/* Interactive RSVP & Guestbook Section */}
          <RsvpGuestbookSection
            rsvps={data.rsvps}
            defaultGuestName={guestName === 'Bapak/Ibu/Saudara/i' ? '' : guestName}
            onAddRsvp={handleAddRsvp}
            onLikeRsvp={handleLikeRsvp}
          />

          {/* Closing & Family Wishes Section (Watermark completely removed!) */}
          <ClosingSection
            closing={data.closing}
            monogram={data.general.monogram}
          />
        </main>

        {/* FLOATING CONTROLS (Only active after invitation opened) */}
        {isOpened && (
          <>
            {/* Background Music Player */}
            <MusicPlayer
              musicUrl={data.general.musicUrl}
              musicTitle={data.general.musicTitle}
              autoPlayTrigger={isOpened}
            />

            {/* Bottom Floating Navigation Dock */}
            <BottomNav
              activeSection={activeSection}
              onNavigate={handleNavigate}
            />
          </>
        )}

        {/* FULL EDITOR MODAL */}
        <EditorModal
          data={data}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveData}
          onReset={handleResetData}
        />
      </div>
    </div>
  );
}