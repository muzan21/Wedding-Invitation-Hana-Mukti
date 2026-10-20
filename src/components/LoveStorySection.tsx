import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { LoveStoryItem } from '../types/invitation';

interface LoveStorySectionProps {
  stories: LoveStoryItem[];
}

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({ stories }) => {
  return (
    <section id="sec-story" className="relative w-full py-12 px-5 overflow-hidden">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.25em] font-semibold text-[#8a5b6f] uppercase">
            Perjalanan Kasih
          </p>
          <h2 className="font-serif-title text-3xl font-bold text-[#542d3e] mt-1">
            Our Love Story
          </h2>
          <div className="w-12 h-0.5 bg-[#be7382]/40 mx-auto mt-2 rounded-full" />
        </div>

        {/* Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-[#be7382]/35 space-y-8 ml-3 sm:ml-4">
          {stories.map((story, idx) => (
            <div key={story.id} className="relative group">
              {/* Node dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full bg-white border-2 border-[#be7382] flex items-center justify-center text-[#be7382] shadow-md group-hover:scale-110 transition-transform">
                {idx === stories.length - 1 ? (
                  <Heart className="w-3.5 h-3.5 fill-[#be7382]" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Story Box */}
              <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-[#eedfe5] hover:shadow-md transition-shadow">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#be7382]/15 text-[#be7382] text-[11px] font-semibold tracking-wider">
                  {story.year}
                </span>
                <h3 className="font-serif-title text-lg font-bold text-[#562c3f] mt-1.5">
                  {story.title}
                </h3>
                <p className="text-xs text-[#6e5866] leading-relaxed mt-2 text-justify">
                  {story.story}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
