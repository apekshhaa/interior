import React from 'react';
import { PageType } from '../types';
import { BUSINESS_INFO } from '../data/catalogue';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#E9EDF0] border-t border-[#321B35]/15 pt-16 pb-12 px-6 sm:px-10 lg:px-16 text-[#321B35]">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Row matching Reference Frame 17 */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pb-12 border-b border-[#321B35]/10">
          {/* Left Column: Brand name in prominent Serif */}
          <div className="space-y-3">
            <h2
              onClick={() => {
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-serif text-3xl sm:text-5xl tracking-tight text-[#321B35] cursor-pointer hover:opacity-85 transition-opacity"
            >
              Colour Tone
            </h2>
            <p className="text-sm text-[#1e1e1e]/75 max-w-md leading-relaxed">
              {BUSINESS_INFO.experience} • {BUSINESS_INFO.location}.
              <br />
              Interior & exterior decorative wall finishes, Italian stuccos, and premium architectural coatings.
            </p>
          </div>

          {/* Right Column: Contact email and phone */}
          <div className="space-y-3 lg:text-right">
            <a
              href={`mailto:${BUSINESS_INFO.email}`}
              className="font-serif text-2xl sm:text-4xl text-[#321B35] hover:text-[#432347] transition-colors block"
            >
              {BUSINESS_INFO.email}
            </a>
            <div className="flex flex-wrap items-center lg:justify-end gap-4 text-sm text-[#1e1e1e]/80">
              <a href={`tel:${BUSINESS_INFO.phone1}`} className="hover:underline">
                Tel: {BUSINESS_INFO.phone1}
              </a>
              <span>•</span>
              <a href={`tel:${BUSINESS_INFO.phone2.replace(/\s+/g, '')}`} className="hover:underline">
                {BUSINESS_INFO.phone2}
              </a>
            </div>

            {/* Social Icons matching Frame 17 */}
            <div className="flex items-center lg:justify-end gap-5 pt-2 text-[#321B35]/80">
              {/* X / Twitter icon */}
              <a
                href="#x"
                aria-label="X Twitter"
                className="hover:text-[#321B35] transition-colors font-medium text-lg leading-none"
              >
                𝕏
              </a>
              {/* Instagram */}
              <a
                href="#instagram"
                aria-label="Instagram"
                className="hover:text-[#321B35] transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-none stroke-current stroke-2"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="#facebook"
                aria-label="Facebook"
                className="hover:text-[#321B35] transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-none stroke-current stroke-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Sub-row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#1e1e1e]/60 gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => onNavigate('services')} className="hover:underline cursor-pointer">
              Services
            </button>
            <button onClick={() => onNavigate('shop')} className="hover:underline cursor-pointer">
              Textures Catalogue
            </button>
            <button onClick={() => onNavigate('about')} className="hover:underline cursor-pointer">
              Our 20-Year Legacy
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:underline cursor-pointer">
              Contact & Site Visit
            </button>
            <button onClick={() => onNavigate('auth')} className="hover:underline cursor-pointer text-[#321B35] font-medium">
              Client Login / Account
            </button>
          </div>
          <p>© {new Date().getFullYear()} COLOUR TONE. Handcrafted decorative wall textures in Mangalore.</p>
        </div>
      </div>
    </footer>
  );
};
