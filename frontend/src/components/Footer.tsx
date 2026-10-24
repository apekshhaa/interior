import React from 'react';
import { PageType } from '../types';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

// Verified contact details
const PHONE_1 = '9972727446';
const PHONE_2 = '+91 89519 70259';
const PHONE_2_TEL = '+918951970259';

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#E9EDF0] border-t border-[#321B35]/15 pt-16 pb-12 px-6 sm:px-10 lg:px-16 text-[#321B35]">
      <div className="max-w-7xl mx-auto">
        {/* Main footer row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pb-12 border-b border-[#321B35]/10">
          {/* Brand */}
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
            <p className="text-sm text-[#1e1e1e]/70 max-w-md leading-relaxed">
              20 years of painting experience · Mangalore, Karnataka, India.
              <br />
              Interior &amp; exterior painting and decorative wall finishes.
            </p>
          </div>

          {/* Phone numbers */}
          <div className="space-y-3 lg:text-right">
            <div className="flex flex-wrap items-center lg:justify-end gap-4 text-sm text-[#1e1e1e]/80">
              <a href={`tel:${PHONE_1}`} className="hover:underline underline-offset-2">
                {PHONE_1}
              </a>
              <span>·</span>
              <a href={`tel:${PHONE_2_TEL}`} className="hover:underline underline-offset-2">
                {PHONE_2}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom sub-row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#1e1e1e]/60 gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => onNavigate('services')} className="hover:underline cursor-pointer">
              Services
            </button>
            <button onClick={() => onNavigate('shop')} className="hover:underline cursor-pointer">
              Textures &amp; Colours
            </button>
            <button onClick={() => onNavigate('about')} className="hover:underline cursor-pointer">
              About
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:underline cursor-pointer">
              Contact
            </button>
          </div>
          <p>© {new Date().getFullYear()} COLOUR TONE · Mangalore, Karnataka, India.</p>
        </div>
      </div>
    </footer>
  );
};
