import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// WallColourCanvas — pixel-accurate wall-only colour preview
// Uses a pre-computed PNG mask to isolate wall pixels, then blends the chosen
// colour via luminance-preserving (soft-light-style) compositing so that
// natural shadows, grain and highlights are retained.
// ---------------------------------------------------------------------------
interface WallColourCanvasProps {
  roomSrc: string;      // path to the room photograph
  maskSrc: string;      // path to the matching greyscale-alpha wall mask PNG
  colourHex: string;    // target wall colour  e.g. "#A9B7A6"
  alt: string;
  className?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const num = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

const WallColourCanvas: React.FC<WallColourCanvasProps> = ({
  roomSrc,
  maskSrc,
  colourHex,
  alt,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Cache loaded image data so we only fetch once per src change
  const roomDataRef  = useRef<ImageData | null>(null);
  const maskDataRef  = useRef<ImageData | null>(null);
  const roomSrcRef   = useRef('');
  const maskSrcRef   = useRef('');
  const pendingRef   = useRef(false);

  // Render the canvas: blend colour onto wall pixels only
  const render = useCallback((roomData: ImageData, maskData: ImageData, hex: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = roomData;
    canvas.width  = width;
    canvas.height = height;

    // Build output pixel buffer
    const out = ctx.createImageData(width, height);
    const src = roomData.data;
    const msk = maskData.data;
    const dst = out.data;
    const [tr, tg, tb] = hexToRgb(hex);

    for (let i = 0; i < src.length; i += 4) {
      const sr = src[i],     sg = src[i + 1], sb = src[i + 2], sa = src[i + 3];
      // Mask alpha channel encodes wall coverage (0 = not wall, 255 = full wall)
      const coverage = msk[i + 3] / 255;  // 0..1

      if (coverage < 0.01) {
        // Non-wall pixel — copy unchanged
        dst[i] = sr; dst[i + 1] = sg; dst[i + 2] = sb; dst[i + 3] = sa;
      } else {
        // Wall pixel — luminance-preserving blend
        // Perceived luminance of the original wall pixel (BT.709)
        const lum = (0.2126 * sr + 0.7152 * sg + 0.0722 * sb) / 255;

        // Target: apply luminance as a brightness multiplier to the chosen colour
        // Soft-light style: keeps shadows dark and highlights light
        const blend = (orig: number, target: number): number => {
          const t = target / 255;
          // Soft-light formula (Pegtop)
          const softLight = (1 - 2 * t) * (orig / 255) * (orig / 255) + 2 * t * (orig / 255);
          // Blend between the soft-light result and a simpler luminance-scale
          const lumScale  = lum * target;
          const mixed     = softLight * 255 * 0.4 + lumScale * 0.6;
          return Math.min(255, Math.max(0, Math.round(mixed)));
        };

        const blendedR = blend(sr, tr);
        const blendedG = blend(sg, tg);
        const blendedB = blend(sb, tb);

        // Mix blended result with original according to coverage (partial-mask feathering)
        dst[i]     = Math.round(sr * (1 - coverage) + blendedR * coverage);
        dst[i + 1] = Math.round(sg * (1 - coverage) + blendedG * coverage);
        dst[i + 2] = Math.round(sb * (1 - coverage) + blendedB * coverage);
        dst[i + 3] = sa;
      }
    }

    ctx.putImageData(out, 0, 0);
  }, []);

  // Load images and render whenever src or colour changes
  useEffect(() => {
    if (pendingRef.current) return; // already loading

    const roomChanged = roomSrc !== roomSrcRef.current;
    const maskChanged = maskSrc !== maskSrcRef.current;

    const doRender = () => {
      if (roomDataRef.current && maskDataRef.current) {
        render(roomDataRef.current, maskDataRef.current, colourHex);
      }
    };

    if (!roomChanged && !maskChanged) {
      // Only colour changed — re-render with cached data
      doRender();
      return;
    }

    // Need to (re)load at least one image
    pendingRef.current = true;
    let loaded = 0;
    const needed = (roomChanged ? 1 : 0) + (maskChanged ? 1 : 0);

    const onLoad = () => {
      loaded++;
      if (loaded === needed) {
        pendingRef.current = false;
        doRender();
      }
    };

    const loadImage = (src: string, onDone: (data: ImageData) => void) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const tmp = document.createElement('canvas');
        tmp.width  = img.naturalWidth;
        tmp.height = img.naturalHeight;
        const ctx2 = tmp.getContext('2d')!;
        ctx2.drawImage(img, 0, 0);
        onDone(ctx2.getImageData(0, 0, tmp.width, tmp.height));
        onLoad();
      };
      img.onerror = () => { pendingRef.current = false; };
      img.src = src;
    };

    if (roomChanged) {
      roomSrcRef.current = roomSrc;
      loadImage(roomSrc, (data) => { roomDataRef.current = data; });
    }
    if (maskChanged) {
      maskSrcRef.current = maskSrc;
      loadImage(maskSrc, (data) => { maskDataRef.current = data; });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomSrc, maskSrc, colourHex]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};
// ---------------------------------------------------------------------------
import { Product, PageType } from '../types';
import { SHOP_PRODUCTS } from '../data/catalogue';
import { COLOUR_PALETTE, COLOUR_FAMILIES } from '../data/colours';
import { Search, X, ArrowRight, Eye, Check } from 'lucide-react';

interface ShopPageProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onNavigate?: (page: PageType) => void;
  onOpenBooking?: () => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onSelectProduct,
  onAddToCart,
  onNavigate,
  onOpenBooking,
}) => {
  // Selection states for finishes & colours
  const [selectedFinishIds, setSelectedFinishIds] = useState<string[]>([]);
  const [selectedColourIds, setSelectedColourIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('colourtone_selected_colours');
      if (saved) {
        const ids = JSON.parse(saved);
        if (Array.isArray(ids) && ids.every((id): id is string => typeof id === 'string')) {
          const legacyDefaults = ['col-01', 'col-10', 'col-26'];
          return ids.length === legacyDefaults.length && legacyDefaults.every((id) => ids.includes(id)) ? [] : ids;
        }
      }
    } catch {
      // Persistence is optional when browser storage is unavailable or invalid.
    }
    return [];
  });

  // Active preview item for the texture and colour visualiser
  const [activePreviewFinishId, setActivePreviewFinishId] = useState<string>('venetian-plaster');
  const [activePreviewColourId, setActivePreviewColourId] = useState<string>('col-10');

  // Search & Filters for Colour Palette
  const [colourSearch, setColourSearch] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  const [selectedTone, setSelectedTone] = useState<'all' | 'warm' | 'cool' | 'neutral'>('all');
  const [selectedShade, setSelectedShade] = useState<'all' | 'light' | 'medium' | 'deep'>('all');

  // Active view tab for simple restrained navigation
  const [activeTab, setActiveTab] = useState<'all' | 'textures' | 'colours' | 'selection'>('all');

  useEffect(() => {
    try {
      localStorage.setItem('colourtone_selected_colours', JSON.stringify(selectedColourIds));
    } catch {
      // Persistence is optional when browser storage is unavailable.
    }
  }, [selectedColourIds]);

  // Helper getters for selected finishes and colours
  const selectedFinishes = useMemo(() => {
    return SHOP_PRODUCTS.filter((prod) => selectedFinishIds.includes(prod.id));
  }, [selectedFinishIds]);

  const selectedColours = useMemo(() => {
    return COLOUR_PALETTE.filter((col) => selectedColourIds.includes(col.id));
  }, [selectedColourIds]);

  const totalSelectionsCount = selectedFinishes.length + selectedColours.length;

  // Active preview objects
  const activePreviewFinish = useMemo(() => {
    return SHOP_PRODUCTS.find((p) => p.id === activePreviewFinishId) || SHOP_PRODUCTS[0];
  }, [activePreviewFinishId]);

  const activePreviewColour = useMemo(() => {
    return COLOUR_PALETTE.find((c) => c.id === activePreviewColourId) || COLOUR_PALETTE[0];
  }, [activePreviewColourId]);

  // Filtered colour palette
  const filteredColours = useMemo(() => {
    return COLOUR_PALETTE.filter((swatch) => {
      if (selectedFamily !== 'All' && swatch.family !== selectedFamily) {
        return false;
      }
      if (selectedTone !== 'all' && swatch.tone !== selectedTone) {
        return false;
      }
      if (selectedShade !== 'all' && swatch.shade !== selectedShade) {
        return false;
      }
      if (colourSearch.trim()) {
        const query = colourSearch.trim().toLowerCase();
        const matchesName = swatch.name.toLowerCase().includes(query);
        const matchesHex = swatch.hex.toLowerCase().includes(query);
        const matchesFamily = swatch.family.toLowerCase().includes(query);
        if (!matchesName && !matchesHex && !matchesFamily) {
          return false;
        }
      }
      return true;
    });
  }, [selectedFamily, selectedTone, selectedShade, colourSearch]);

  // Toggle finish selection
  const toggleFinishSelection = (finishId: string) => {
    setSelectedFinishIds((prev) => {
      const exists = prev.includes(finishId);
      if (exists) {
        return prev.filter((id) => id !== finishId);
      } else {
        setActivePreviewFinishId(finishId);
        return [...prev, finishId];
      }
    });
  };

  // Toggle colour selection
  const toggleColourSelection = (colourId: string) => {
    setSelectedColourIds((prev) => {
      const exists = prev.includes(colourId);
      if (exists) {
        return prev.filter((id) => id !== colourId);
      } else {
        setActivePreviewColourId(colourId);
        return [...prev, colourId];
      }
    });
  };

  const removeFinish = (id: string) => {
    setSelectedFinishIds((prev) => prev.filter((item) => item !== id));
  };

  const removeColour = (id: string) => {
    setSelectedColourIds((prev) => prev.filter((item) => item !== id));
  };

  const clearAllSelections = () => {
    setSelectedFinishIds([]);
    setSelectedColourIds([]);
  };

  // Proceed to quotation
  const handleProceedToQuotation = () => {
    if (onAddToCart) {
      selectedFinishes.forEach((finish) => {
        onAddToCart(finish, 1);
      });
    }
    if (onOpenBooking) {
      onOpenBooking();
    } else if (onNavigate) {
      onNavigate('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full bg-[#E9EDF0] text-[#1e1e1e] pt-12 pb-24 px-6 sm:px-10 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* ============================================================ */}
        {/* 1. Simplified Page Header                                    */}
        {/* ============================================================ */}
        <header className="border-b border-[#321B35]/15 pb-8">
          <div className="max-w-3xl space-y-3">
            <h1 className="font-serif text-4xl sm:text-5xl text-[#321B35] font-normal tracking-tight">
              Textures & Colours
            </h1>
            <p className="text-base text-[#1e1e1e]/80 font-light leading-relaxed">
              Explore decorative wall textures and a curated palette of colours for your space. Select your preferred finishes and shades to request a personalised quotation.
            </p>
          </div>

          {/* Simple Restrained Navigation Links */}
          <nav aria-label="Catalogue sections" className="mt-8 flex flex-wrap items-center gap-6 pt-4 border-t border-[#321B35]/10 text-sm">
            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                scrollToSection('catalogue-top');
              }}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'text-[#321B35] border-b-2 border-[#321B35] font-medium'
                  : 'text-[#1e1e1e]/70 hover:text-[#321B35]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('textures');
                scrollToSection('textures-section');
              }}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === 'textures'
                  ? 'text-[#321B35] border-b-2 border-[#321B35] font-medium'
                  : 'text-[#1e1e1e]/70 hover:text-[#321B35]'
              }`}
            >
              Textures
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('colours');
                scrollToSection('colours-section');
              }}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === 'colours'
                  ? 'text-[#321B35] border-b-2 border-[#321B35] font-medium'
                  : 'text-[#1e1e1e]/70 hover:text-[#321B35]'
              }`}
            >
              Colours
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('selection');
                scrollToSection('selection-section');
              }}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === 'selection'
                  ? 'text-[#321B35] border-b-2 border-[#321B35] font-medium'
                  : 'text-[#1e1e1e]/70 hover:text-[#321B35]'
              }`}
            >
              My Selection
            </button>
          </nav>
        </header>

        <div id="catalogue-top" />

        {/* ============================================================ */}
        {/* 2. Texture Catalogue — All 12 Finishes                      */}
        {/* ============================================================ */}
        <section id="textures-section" className="space-y-8 scroll-mt-24">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#321B35] font-normal tracking-tight">
              Decorative Wall Textures
            </h2>
            <p className="text-sm text-[#1e1e1e]/70 mt-1 max-w-2xl font-light">
              Browse our complete range of interior and architectural wall finishes.
            </p>
          </div>

          {/* Consistent 3-column desktop, 2-column tablet, 1-column mobile grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SHOP_PRODUCTS.map((finish) => {
              const isSelected = selectedFinishIds.includes(finish.id);
              return (
                <div
                  key={finish.id}
                  className={`bg-white rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#321B35] shadow-xs'
                      : 'border-[#321B35]/15 hover:border-[#321B35]/35'
                  }`}
                >
                  {/* Texture Image Container */}
                  <div className="relative aspect-[4/3] bg-black/5 overflow-hidden">
                    <img
                      src={finish.image}
                      alt={finish.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
                      loading="lazy"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl text-[#1e1e1e] font-normal">
                        {finish.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#1e1e1e]/75 font-light leading-relaxed">
                        {finish.description}
                      </p>
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-4 border-t border-[#321B35]/10 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#1e1e1e]/60">Pricing</span>
                        <span className="text-[#1e1e1e]/90 font-medium">
                          Quotation on request
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => toggleFinishSelection(finish.id)}
                          className={`flex-1 py-2 px-4 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#321B35] text-white hover:bg-[#432347]'
                              : 'bg-white text-[#1e1e1e] border border-[#1e1e1e]/25 hover:border-[#321B35] hover:text-[#321B35]'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>

                        <button
                          type="button"
                          onClick={() => onSelectProduct(finish)}
                          title={`View details for ${finish.name}`}
                          className="py-2 px-3 rounded-full border border-[#1e1e1e]/20 hover:border-[#321B35] text-xs text-[#1e1e1e]/70 hover:text-[#321B35] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="sr-only">View finish details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. Colour Selection & Clean Filters                          */}
        {/* ============================================================ */}
        <section id="colours-section" className="space-y-8 scroll-mt-24 pt-8 border-t border-[#321B35]/15">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#321B35] font-normal tracking-tight">
              Colour Palette
            </h2>
            <p className="text-sm text-[#1e1e1e]/70 mt-1 max-w-2xl font-light">
              An illustrative 50-shade palette for wall tints, feature surfaces, and ceiling finishes.
            </p>
          </div>

          {/* Clean, Balanced Search & Filter Layout */}
          <div className="bg-white p-5 rounded-2xl border border-[#321B35]/10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* 1. Aligned Search Input (full width on mobile, 5 cols on desktop) */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-[#1e1e1e]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={colourSearch}
                  onChange={(e) => setColourSearch(e.target.value)}
                  placeholder="Search colours by name or HEX..."
                  className="w-full pl-10 pr-9 py-2 rounded-full bg-[#f8f9fa] border border-[#e2e4e8] focus:outline-none focus:border-[#321B35] text-xs text-[#1e1e1e]"
                />
                {colourSearch && (
                  <button
                    type="button"
                    onClick={() => setColourSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1e1e1e]/40 hover:text-[#1e1e1e] cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 2. Compact Category Dropdown (4 cols on desktop) */}
              <div className="md:col-span-4">
                <select
                  value={selectedFamily}
                  onChange={(e) => setSelectedFamily(e.target.value)}
                  aria-label="Filter by colour family"
                  className="w-full px-4 py-2 rounded-full bg-[#f8f9fa] border border-[#e2e4e8] text-xs text-[#1e1e1e] focus:outline-none focus:border-[#321B35] cursor-pointer"
                >
                  {COLOUR_FAMILIES.map((family) => (
                    <option key={family} value={family}>
                      {family === 'All' ? 'All Colour Families' : family}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Discreet Tone & Shade Controls (3 cols on desktop) */}
              <div className="md:col-span-3 flex gap-2">
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value as 'all' | 'warm' | 'cool' | 'neutral')}
                  aria-label="Filter by tone"
                  className="flex-1 px-3 py-2 rounded-full bg-[#f8f9fa] border border-[#e2e4e8] text-xs text-[#1e1e1e] focus:outline-none focus:border-[#321B35] cursor-pointer"
                >
                  <option value="all">Tone: All</option>
                  <option value="warm">Warm</option>
                  <option value="cool">Cool</option>
                  <option value="neutral">Neutral</option>
                </select>

                <select
                  value={selectedShade}
                  onChange={(e) => setSelectedShade(e.target.value as 'all' | 'light' | 'medium' | 'deep')}
                  aria-label="Filter by shade"
                  className="flex-1 px-3 py-2 rounded-full bg-[#f8f9fa] border border-[#e2e4e8] text-xs text-[#1e1e1e] focus:outline-none focus:border-[#321B35] cursor-pointer"
                >
                  <option value="all">Shade: All</option>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="deep">Deep</option>
                </select>
              </div>
            </div>

            {/* Filter Status & Reset Action */}
            {(selectedFamily !== 'All' || selectedTone !== 'all' || selectedShade !== 'all' || colourSearch) && (
              <div className="pt-2 border-t border-[#321B35]/10 flex items-center justify-between text-xs text-[#1e1e1e]/60">
                <span>
                  Showing {filteredColours.length} of 50 colours
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFamily('All');
                    setSelectedTone('all');
                    setSelectedShade('all');
                    setColourSearch('');
                  }}
                  className="text-[#321B35] hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* 50-Colour Responsive Swatch Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredColours.map((swatch) => {
              const isSelected = selectedColourIds.includes(swatch.id);
              return (
                <button
                  key={swatch.id}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`Select ${swatch.name}, ${swatch.hex}`}
                  onClick={() => toggleColourSelection(swatch.id)}
                  className={`bg-white rounded-2xl p-3 border transition-all duration-150 cursor-pointer flex flex-col justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#321B35] focus-visible:ring-offset-2 ${
                    isSelected
                      ? 'border-[#321B35] ring-1 ring-[#321B35]'
                      : 'border-[#321B35]/10 hover:border-[#321B35]/30'
                  }`}
                >
                  {/* Swatch Color Box */}
                  <div
                    className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-black/10 flex items-center justify-center"
                    style={{ backgroundColor: swatch.hex }}
                  >
                    {isSelected && (
                      <div className="bg-white/90 text-[#321B35] rounded-full p-1 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>

                  {/* Swatch Metadata */}
                  <div className="space-y-0.5">
                    <p className="font-medium text-xs text-[#1e1e1e] truncate">
                      {swatch.name}
                    </p>
                    <p className="text-[11px] font-mono text-[#1e1e1e]/60">
                      {swatch.hex}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredColours.length === 0 && (
            <div className="py-10 text-center bg-white rounded-2xl border border-[#321B35]/10 space-y-2">
              <p className="text-sm text-[#1e1e1e]/70">No colours match your criteria.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedFamily('All');
                  setSelectedTone('all');
                  setSelectedShade('all');
                  setColourSearch('');
                }}
                className="text-xs text-[#321B35] underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* 4. Simplified Texture and Colour Visualiser                  */}
          {/* ============================================================ */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#321B35]/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl text-[#1e1e1e] font-normal">
                  Texture & Colour Visualiser
                </h3>
                <p className="text-xs text-[#1e1e1e]/70 mt-0.5">
                  Preview how your chosen finish and colour pair together.
                </p>
              </div>

              {/* Clean Selectors */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="preview-finish-select" className="text-xs text-[#1e1e1e]/70">Texture:</label>
                  <select
                    id="preview-finish-select"
                    value={activePreviewFinishId}
                    onChange={(e) => setActivePreviewFinishId(e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#f8f9fa] border border-[#e2e4e8] text-[#1e1e1e] focus:outline-none focus:border-[#321B35] cursor-pointer"
                  >
                    {SHOP_PRODUCTS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="preview-colour-select" className="text-xs text-[#1e1e1e]/70">Colour:</label>
                  <select
                    id="preview-colour-select"
                    value={activePreviewColourId}
                    onChange={(e) => setActivePreviewColourId(e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#f8f9fa] border border-[#e2e4e8] text-[#1e1e1e] focus:outline-none focus:border-[#321B35] cursor-pointer"
                  >
                    {COLOUR_PALETTE.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.hex})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Visualiser Display Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 relative aspect-[16/10] rounded-xl overflow-hidden border border-[#321B35]/10 bg-black/5">
                {activePreviewFinish.id === 'stucco-texture' ? (
                  /* Pixel-accurate wall-only colour preview for Stucco Texture room */
                  <WallColourCanvas
                    roomSrc="/assets/finishes/stucco-texture.jpg"
                    maskSrc="/assets/masks/stucco-texture-mask.png"
                    colourHex={activePreviewColour.hex}
                    alt={`${activePreviewFinish.name} in ${activePreviewColour.name}`}
                    className="w-full h-full"
                  />
                ) : (
                  /* CSS blend-mode overlay for all other finish previews */
                  <>
                    <img
                      src={activePreviewFinish.image}
                      alt={activePreviewFinish.name}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 mix-blend-color pointer-events-none transition-colors duration-300"
                      style={{ backgroundColor: activePreviewColour.hex, opacity: 0.7 }}
                    />
                    <div
                      className="absolute inset-0 mix-blend-multiply pointer-events-none transition-colors duration-300"
                      style={{ backgroundColor: activePreviewColour.hex, opacity: 0.25 }}
                    />
                  </>
                )}

                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/60 text-xs flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: activePreviewColour.hex }}
                  />
                  <span className="font-medium text-[#1e1e1e]">
                    {activePreviewFinish.name} in {activePreviewColour.name}
                  </span>
                </div>
              </div>

              {/* Action & Concise Disclaimer */}
              <div className="lg:col-span-4 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-[#1e1e1e]">
                    {activePreviewFinish.name}
                  </h4>
                  <p className="text-xs text-[#1e1e1e]/75 leading-relaxed font-light">
                    {activePreviewFinish.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!selectedFinishIds.includes(activePreviewFinish.id)) {
                      setSelectedFinishIds((prev) => [...prev, activePreviewFinish.id]);
                    }
                    if (!selectedColourIds.includes(activePreviewColour.id)) {
                      setSelectedColourIds((prev) => [...prev, activePreviewColour.id]);
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Add Combination to Selection
                </button>

                <p className="text-[11px] text-[#1e1e1e]/60 leading-relaxed">
                  Screen colours may vary from actual painted finishes depending on lighting and display settings. Physical samples can be reviewed during an on-site consultation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. Simplified My Selection (Light Background)                */}
        {/* ============================================================ */}
        <section id="selection-section" className="scroll-mt-24 pt-8 border-t border-[#321B35]/15">
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#321B35]/15 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#321B35]/10 pb-6">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#321B35] font-normal tracking-tight">
                  My Selection
                </h2>
                <p className="text-sm text-[#1e1e1e]/70 mt-1 max-w-xl font-light">
                  Review your chosen wall textures and colours to request a personalised quotation.
                </p>
              </div>

              {totalSelectionsCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllSelections}
                  className="text-xs text-[#1e1e1e]/60 hover:text-[#321B35] underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {totalSelectionsCount === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-sm text-[#1e1e1e]/70">No textures or colours selected yet.</p>
                <p className="text-xs text-[#1e1e1e]/50">
                  Select finishes or colours from the catalogue above to create your specification.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Selected Textures */}
                {selectedFinishes.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1e1e1e]/70">
                      Selected Textures ({selectedFinishes.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedFinishes.map((finish) => (
                        <div
                          key={finish.id}
                          className="bg-[#f8f9fa] rounded-xl p-3 border border-[#e2e4e8] flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={finish.image}
                              alt={finish.name}
                              className="w-12 h-12 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-medium text-[#1e1e1e] truncate">
                                {finish.name}
                              </h4>
                              <p className="text-[11px] text-[#1e1e1e]/60">
                                Quotation on request
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFinish(finish.id)}
                            title={`Remove ${finish.name}`}
                            className="p-1 rounded-full text-[#1e1e1e]/40 hover:text-[#1e1e1e] transition-colors cursor-pointer shrink-0"
                          >
                            <X className="w-4 h-4" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Colours */}
                {selectedColours.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1e1e1e]/70">
                      Selected Colours ({selectedColours.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedColours.map((colour) => (
                        <div
                          key={colour.id}
                          className="bg-[#f8f9fa] rounded-full pl-2 pr-3 py-1 border border-[#e2e4e8] flex items-center gap-2 text-xs text-[#1e1e1e]"
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                            style={{ backgroundColor: colour.hex }}
                          />
                          <span className="font-medium">{colour.name}</span>
                          <span className="text-[11px] font-mono text-[#1e1e1e]/60">{colour.hex}</span>
                          <button
                            type="button"
                            onClick={() => removeColour(colour.id)}
                            title={`Remove ${colour.name}`}
                            className="p-0.5 text-[#1e1e1e]/40 hover:text-[#1e1e1e] cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Request Quotation CTA */}
                <div className="pt-6 border-t border-[#321B35]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-[#1e1e1e]/70">
                    {selectedFinishes.length} {selectedFinishes.length === 1 ? 'texture' : 'textures'} and {selectedColours.length} {selectedColours.length === 1 ? 'colour' : 'colours'} selected.
                  </p>

                  <button
                    type="button"
                    onClick={handleProceedToQuotation}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Request Quotation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. Discreet, Non-Intrusive Bottom Bar (Only when items selected) */}
        {/* ============================================================ */}
        {totalSelectionsCount > 0 && (
          <aside
            aria-label="Selection summary"
            className="fixed bottom-4 left-6 right-6 sm:left-auto sm:right-8 sm:bottom-6 z-40 bg-[#1e1e1e]/90 text-white backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-lg flex items-center justify-between gap-4 text-xs"
          >
            <span className="font-medium text-white/90">
              {totalSelectionsCount} {totalSelectionsCount === 1 ? 'item' : 'items'} selected
            </span>

            <button
              type="button"
              onClick={handleProceedToQuotation}
              className="px-4 py-1.5 rounded-full bg-white text-[#1e1e1e] hover:bg-white/90 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Request Quote</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </aside>
        )}
      </div>
    </div>
  );
};
