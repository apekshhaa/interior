import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryImage } from '../data/gallery';

interface ImageLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const currentImage = images[currentIndex];

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    const nextIdx = (currentIndex - 1 + images.length) % images.length;
    onNavigate(nextIdx);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    const nextIdx = (currentIndex + 1) % images.length;
    onNavigate(nextIdx);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard controls: Escape to close, Arrow keys to navigate
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll when lightbox is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md transition-opacity duration-300 animate-fadeIn select-none"
      onClick={onClose}
    >
      {/* Top Bar: Minimal Index Counter & Close Button */}
      <div
        className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-20 pointer-events-none"
      >
        <div className="text-white/60 text-xs sm:text-sm font-light tracking-widest pl-2">
          {currentIndex + 1} / {images.length}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="pointer-events-auto p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Close image viewer"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Navigation: Previous Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/30 text-white transition-all cursor-pointer backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Previous photograph"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      )}

      {/* Main Image Container */}
      <div
        className="relative max-w-[92vw] max-h-[85vh] flex items-center justify-center p-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={currentImage.src}
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-w-full max-h-[82vh] w-auto h-auto object-contain rounded-sm shadow-2xl transition-all duration-200"
        />
      </div>

      {/* Navigation: Next Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/30 text-white transition-all cursor-pointer backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Next photograph"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      )}
    </div>
  );
};
