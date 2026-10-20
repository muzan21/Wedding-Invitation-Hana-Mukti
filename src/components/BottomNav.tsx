import React from 'react';
import { Home, Users, Calendar, BookHeart, Image, Gift, MessageSquare } from 'lucide-react';

interface BottomNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeSection, onNavigate }) => {
  const navItems = [
    { id: 'sec-hero', label: 'Sampul', icon: Home },
    { id: 'sec-couple', label: 'Mempelai', icon: Users },
    { id: 'sec-events', label: 'Acara', icon: Calendar },
    { id: 'sec-story', label: 'Cerita', icon: BookHeart },
    { id: 'sec-gallery', label: 'Galeri', icon: Image },
    { id: 'sec-gifts', label: 'Kado', icon: Gift },
    { id: 'sec-rsvp', label: 'Ucapan', icon: MessageSquare },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md bg-white/92 backdrop-blur-md rounded-full shadow-2xl border border-[#ebd6df]/90 px-2 py-2 flex items-center justify-between transition-all">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-full transition-all duration-300 relative ${
              isActive
                ? 'text-[#be7382] font-semibold scale-110'
                : 'text-[#846e7b] hover:text-[#523243]'
            }`}
          >
            {isActive && (
              <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#be7382]" />
            )}
            <Icon className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] tracking-tight whitespace-nowrap leading-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
