import React from 'react';
import { PageType } from '../types';

interface AboutPageProps {
  onNavigate: (page: PageType) => void;
  onBookNow: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onBookNow }) => {
  return (
    <div className="w-full bg-[#E9EDF0] text-[#1e1e1e] py-16 px-6 sm:px-10 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Two-column editorial layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* ── Left column: story & typography ── */}
          <div className="lg:col-span-6 space-y-8">

            {/* Eyebrow + Heading */}
            <div className="space-y-4">
              <span className="text-xs font-semibold tracking-widest text-[#321B35]/60 uppercase block">
                About Colour Tone
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] text-[#1e1e1e] font-normal tracking-tight leading-[1.1]">
                Two Decades of<br />Transforming Spaces
              </h1>
            </div>

            {/* Introduction paragraphs */}
            <div className="space-y-5 text-base text-[#1e1e1e]/80 font-light leading-[1.8]">
              <p>
                With 20 years of experience in the painting industry, COLOUR TONE helps transform
                residential and commercial spaces through professional painting and decorative wall finishes.
              </p>
              <p>
                Based in Mangalore, we work with customers to choose colours, textures, and finishes
                that suit their spaces and personal preferences.
              </p>
              <p>
                From interior and exterior painting to distinctive decorative wall textures, our focus
                is on thoughtful colour selection, careful workmanship, and finishes that bring
                character to a space.
              </p>
            </div>

            {/* Closing statement */}
            <p className="text-base sm:text-lg font-serif text-[#321B35] leading-relaxed italic border-l-2 border-[#321B35]/25 pl-5">
              Every space has its own character. We help you bring yours to life with the right
              colours, textures, and finishes.
            </p>

            {/* Single verified statistic */}
            <div className="pt-6 border-t border-[#321B35]/12">
              <div className="space-y-1">
                <span className="font-serif text-4xl sm:text-5xl text-[#321B35] font-normal">
                  20+
                </span>
                <p className="text-sm text-[#1e1e1e]/60 font-light tracking-wide">
                  Years of Painting Industry Experience
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onBookNow}
                className="px-8 py-3 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Book a Consultation
              </button>
              <button
                onClick={() => onNavigate('services')}
                className="px-6 py-3 rounded-full border border-[#321B35]/30 text-[#321B35] text-sm hover:border-[#321B35] transition-colors cursor-pointer"
              >
                Our Services
              </button>
            </div>
          </div>

          {/* ── Right column: photograph ── */}
          <div className="lg:col-span-6">
            <div className="w-full aspect-[4/5] overflow-hidden bg-[#d8d4ce]">
              <img
                src="/assets/about-craftsman.jpg"
                alt="COLOUR TONE craftsman applying a decorative plaster finish to a wall"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
