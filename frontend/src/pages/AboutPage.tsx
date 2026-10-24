import React from 'react';
import { PageType } from '../types';
import { BUSINESS_INFO } from '../data/catalogue';
import { Award, ShieldCheck, Clock, MapPin } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageType) => void;
  onBookNow: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onBookNow }) => {
  return (
    <div className="w-full bg-[#E9EDF0] text-[#1e1e1e] py-12 px-6 sm:px-10 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Main 2-Column Section matching Video Frame 40 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Story & Typography */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-semibold tracking-widest text-[#321B35]/70 uppercase block mb-2">
                20 Years of Painting Excellence
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl text-[#1e1e1e] font-normal tracking-tight leading-[1.12]">
                Built on 20 Years
                <br />
                of Craftsmanship
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#1e1e1e]/90 font-light leading-relaxed">
              We elevate residential homes, commercial towers, and boutique villas with unstoppable precision, artistic textures, and enduring finishes.
            </p>

            <div className="space-y-4 text-sm sm:text-base text-[#1e1e1e]/75 font-light leading-relaxed">
              <p>
                Founded in Mangalore, COLOUR TONE was born from a singular passion: elevating walls from mere structural dividers into tactile, light-reflective canvases of architectural beauty.
              </p>
              <p>
                Our master artisans pinpoint authentic lime plasters, imported mineral grains, and specialized troweling techniques long before they become mainstream trends. Over 20 years in the painting industry, we have tested and refined finishes specifically formulated to conquer Mangalore's high humidity and coastal monsoon conditions without blistering, chalking, or fading.
              </p>
              <p>
                From hand-burnished Venetian plaster in luxury living rooms to high-performance weather-shield exterior coatings, every stroke is guided by discipline and pride in workmanship. Stop settling for ordinary walls. Transform your environment with a team built to deliver perfection.
              </p>
            </div>

            {/* Credibility Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[#321B35]/10">
              <div className="space-y-1">
                <span className="font-serif text-3xl sm:text-4xl text-[#321B35] font-normal">
                  20+
                </span>
                <p className="text-xs text-[#1e1e1e]/70">Years in Painting Industry</p>
              </div>
              <div className="space-y-1">
                <span className="font-serif text-3xl sm:text-4xl text-[#321B35] font-normal">
                  1,500+
                </span>
                <p className="text-xs text-[#1e1e1e]/70">Projects Handcrafted</p>
              </div>
              <div className="space-y-1">
                <span className="font-serif text-3xl sm:text-4xl text-[#321B35] font-normal">
                  100%
                </span>
                <p className="text-xs text-[#1e1e1e]/70">Substrate Testing</p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onBookNow}
                className="px-8 py-3 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-sm font-medium transition-all shadow-md cursor-pointer"
              >
                Book a Site Consultation
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-3 rounded-full border border-[#321B35]/30 text-[#321B35] text-sm hover:border-[#321B35] transition-colors cursor-pointer"
              >
                Browse Wall Textures
              </button>
            </div>
          </div>

          {/* Right Column: High-Resolution Photo matching Video Frame 40 */}
          <div className="lg:col-span-6 aspect-[4/5] bg-black/5 overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80"
              alt="COLOUR TONE Master Painter Craftsmanship"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
