import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface MusicPlayerProps {
  musicUrl: string;
  musicTitle: string;
  autoPlayTrigger: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  musicUrl,
  musicTitle,
  autoPlayTrigger,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
    } else {
      audioRef.current.src = musicUrl;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [musicUrl]);

  useEffect(() => {
    if (autoPlayTrigger && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 4000);
        })
        .catch((err) => {
          console.log('Autoplay deferred until user interaction:', err);
          setIsPlaying(false);
        });
    }
  }, [autoPlayTrigger]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Audio playback error:', err));
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-40 flex items-center gap-2">
      {/* Title Tooltip */}
      {showTooltip && (
        <div className="bg-black/75 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-full shadow-lg border border-white/20 whitespace-nowrap animate-fade-in flex items-center gap-1.5">
          <Music className="w-3 h-3 text-[#f59e0b] animate-bounce" />
          <span>{musicTitle || 'Wedding Nasheed'}</span>
        </div>
      )}

      {/* Disc Button */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Hentikan Musik' : 'Putar Musik'}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-2 transition-all duration-300 ${
          isPlaying
            ? 'bg-[#be7382] border-white text-white shadow-[#be7382]/40 scale-105'
            : 'bg-white/90 border-[#ebd6df] text-[#6b5863] shadow-black/10'
        }`}
      >
        <div className={`relative flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
          <div className="w-8 h-8 rounded-full border border-dashed border-white/40 flex items-center justify-center">
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-white" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#8a6878]" />
            )}
          </div>
        </div>
      </button>
    </div>
  );
};
