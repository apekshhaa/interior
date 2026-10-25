import React, { useState, useMemo } from 'react';
import { PageType } from '../types';
import {
  GALLERY_IMAGES,
  GALLERY_CATEGORIES,
  ProjectCategory,
  GalleryImage,
} from '../data/gallery';
import { ImageLightbox } from '../components/ImageLightbox';
import { ArrowRight, Sparkles } from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (page: PageType) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All Work');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter images based on selected category
  const filteredImages = useMemo(() => {
    if (selectedCategory === 'All Work') {
      return GALLERY_IMAGES;
    }
    return GALLERY_IMAGES.filter((img) => img.category === selectedCategory);
  }, [selectedCategory]);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  return (
    <div className="w-full bg-[#E9EDF0] text-[#1e1e1e] min-h-screen">
      {/* ── 1. Hero Introduction ── */}
      <section className="pt-12 sm:pt-16 pb-8 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-semibold tracking-widest text-[#321B35]/70 uppercase block">
            Portfolio
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1e1e1e] font-normal tracking-tight leading-[1.08]">
            Our Work
          </h1>
          <p className="text-base sm:text-lg text-[#1e1e1e]/75 font-light leading-relaxed">
            Explore our painting projects and decorative wall finishes. Get inspired by the colours,
            textures, and transformations we bring to spaces.
          </p>
        </div>

        {/* ── 2. Simple Category Filters ── */}
        <div className="pt-8 flex flex-wrap items-center gap-2 sm:gap-3 border-b border-[#321B35]/10 pb-6">
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#321B35] text-[#E9EDF0] shadow-sm font-medium'
                    : 'bg-white/80 hover:bg-white text-[#1e1e1e]/75 hover:text-[#321B35] border border-[#321B35]/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. Photo-Only Gallery Grid ── */}
      <section className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto pb-20">
        {filteredImages.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {filteredImages.map((image, idx) => (
              <div
                key={image.id}
                onClick={() => handleOpenLightbox(idx)}
                className="group relative mb-6 break-inside-avoid overflow-hidden rounded-2xl bg-white/60 shadow-sm hover:shadow-xl transition-all duration-300 cursor-zoom-in border border-[#321B35]/10"
              >
                {/* Photo container preserving original aspect ratio without distortion */}
                <div className="w-full overflow-hidden bg-[#dcdad5]">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading={idx > 2 ? 'lazy' : 'eager'}
                    decoding="async"
                    className="w-full h-auto object-cover block group-hover:scale-[1.025] transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Subtle, elegant hover sheen indicator */}
                <div className="absolute inset-0 bg-[#321B35]/0 group-hover:bg-[#321B35]/5 transition-colors duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        ) : (
          /* Graceful empty state if a specific category has no photos yet */
          <div className="text-center py-20 px-6 bg-white/50 rounded-3xl border border-[#321B35]/10 max-w-xl mx-auto space-y-4">
            <Sparkles className="w-8 h-8 text-[#F2B632] mx-auto opacity-80" />
            <h3 className="font-serif text-2xl text-[#321B35]">Photographs Coming Soon</h3>
            <p className="text-sm text-[#1e1e1e]/70 leading-relaxed font-light">
              We are updating our portfolio with new project photographs for this category.
              Please check back shortly or explore our full collection under{' '}
              <button
                onClick={() => setSelectedCategory('All Work')}
                className="underline text-[#321B35] font-medium cursor-pointer"
              >
                All Work
              </button>
              .
            </p>
          </div>
        )}
      </section>

      {/* ── 4. Closing Contact Section ── */}
      <section className="bg-white border-t border-[#321B35]/15 py-16 sm:py-20 px-6 sm:px-10 lg:px-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-semibold tracking-widest text-[#321B35]/70 uppercase block">
            Start Your Transformation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1e1e1e] font-normal tracking-tight">
            Inspired by what you see?
          </h2>
          <p className="text-base sm:text-lg text-[#1e1e1e]/75 font-light leading-relaxed max-w-2xl mx-auto">
            Get in touch with COLOUR TONE to discuss painting and decorative wall finishes for your space.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                onNavigate('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#321B35] hover:bg-[#432347] text-white text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer group"
            >
              <span>Enquire About Your Project</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ── 5. Fullscreen Lightbox ── */}
      <ImageLightbox
        images={filteredImages}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={handleCloseLightbox}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </div>
  );
};
