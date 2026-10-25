export type ProjectCategory =
  | 'All Work'
  | 'Interior Painting'
  | 'Exterior Painting'
  | 'Wall Textures'
  | 'Decorative Finishes';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: 'Interior Painting' | 'Exterior Painting' | 'Wall Textures' | 'Decorative Finishes';
  width?: number;
  height?: number;
}

export const GALLERY_CATEGORIES: ProjectCategory[] = [
  'All Work',
  'Interior Painting',
  'Exterior Painting',
  'Wall Textures',
  'Decorative Finishes',
];

/**
 * Real project photographs of COLOUR TONE craftsmanship.
 * 
 * PHOTO-ONLY GUIDELINE:
 * Only actual work photographs are included. No artificial titles, fake dates,
 * customer names, or stock images are used.
 * 
 * TO ADD MORE IMAGES (Up to 40+):
 * 1. Drop your photo file into /public/assets/projects/ (e.g. project-06.jpg)
 * 2. Add an entry to GALLERY_IMAGES below with its src, alt description, and category.
 */
export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'project-01',
    src: '/assets/projects/project-01.jpg',
    alt: 'Real project photo: Handcrafted wall texture finish with contemporary geometric angular lines meeting timber ceiling',
    category: 'Wall Textures',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-02',
    src: '/assets/projects/project-02.jpg',
    alt: 'Real project photo: Decorative distressed wall plaster finish featuring ornate dual gold and metallic mandala stencils',
    category: 'Decorative Finishes',
    width: 936,
    height: 1024,
  },
  {
    id: 'project-03',
    src: '/assets/projects/project-03.jpg',
    alt: 'Real project photo: Textured plaster accent wall with intricate embossed gold circular mandala motifs',
    category: 'Wall Textures',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-04',
    src: '/assets/projects/project-04.jpg',
    alt: 'Real project photo: Interior painting featuring a deep crimson accent wall with custom white tree and bird botanical wall art',
    category: 'Interior Painting',
    width: 1024,
    height: 768,
  },
  {
    id: 'project-05',
    src: '/assets/projects/project-05.jpg',
    alt: 'Real project photo: Raised decorative relief lattice pattern and gold highlighted mandala plaster finish on entrance wall',
    category: 'Decorative Finishes',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-06',
    src: '/assets/projects/project-06.jpg',
    alt: 'Real project photo: Architectural pillar finish with rich copper and metallic gold swirl texture',
    category: 'Decorative Finishes',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-07',
    src: '/assets/projects/project-07.jpg',
    alt: 'Real project photo: Entrance porch columns with burnished gold texture plaster paired with grey stone facade',
    category: 'Decorative Finishes',
    width: 1024,
    height: 768,
  },
  {
    id: 'project-08',
    src: '/assets/projects/project-08.jpg',
    alt: 'Real project photo: Exterior multi-level building facade featuring horizontal textured copper-brown bands',
    category: 'Exterior Painting',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-09',
    src: '/assets/projects/project-09.jpg',
    alt: 'Real project photo: Modern residential exterior featuring geometric slate grey painted mural wall and textured pillars',
    category: 'Exterior Painting',
    width: 1024,
    height: 768,
  },
  {
    id: 'project-10',
    src: '/assets/projects/project-10.jpg',
    alt: 'Real project photo: COLOUR TONE craftsman hand-painting an artistic floral vine wall mural on an exterior compound wall',
    category: 'Decorative Finishes',
    width: 1024,
    height: 768,
  },
  {
    id: 'project-11',
    src: '/assets/projects/project-11.jpg',
    alt: 'Real project photo: Boundary compound wall finished with crisp geometric black lines and textured pillar accents',
    category: 'Exterior Painting',
    width: 1024,
    height: 768,
  },
  {
    id: 'project-12',
    src: '/assets/projects/project-12.jpg',
    alt: 'Real project photo: Church sanctuary wall featuring textured wave plaster and gold floral stencil border with craftsmen at work',
    category: 'Decorative Finishes',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-13',
    src: '/assets/projects/project-13.jpg',
    alt: 'Real project photo: Architectural textured block wall finish adorned with metallic gold lotus leaf motifs',
    category: 'Wall Textures',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-14',
    src: '/assets/projects/project-14.png',
    alt: 'Real project photo: Calming sage green interior accent wall with white palm frond botanical stencil finish',
    category: 'Interior Painting',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-15',
    src: '/assets/projects/project-15.jpg',
    alt: 'Real project photo: Grand church sanctuary crucifix wall with custom sky backdrop mural, textured columns, and gold motifs',
    category: 'Decorative Finishes',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-16',
    src: '/assets/projects/project-16.jpg',
    alt: 'Real project photo: Exterior compound wall with horizontal slate siding and multi-tone geometric polygon mosaic',
    category: 'Exterior Painting',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-17',
    src: '/assets/projects/project-17.jpg',
    alt: 'Real project photo: Luxury Italian marble-effect finish in emerald green and gold veining framing fluted wood paneling',
    category: 'Decorative Finishes',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-18',
    src: '/assets/projects/project-18.jpg',
    alt: 'Real project photo: Warm yellow textured wall plaster with embossed circular mandala medallions beneath floating display shelves',
    category: 'Wall Textures',
    width: 1024,
    height: 768,
  },
  {
    id: 'project-19',
    src: '/assets/projects/project-19.jpg',
    alt: 'Real project photo: Tactile textured plaster wall with delicate green floral leaf stencil accents',
    category: 'Wall Textures',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-20',
    src: '/assets/projects/project-20.jpg',
    alt: 'Real project photo: Veranda cylindrical architectural pillar with tactile bronze-gold swirl texture and charcoal base finish',
    category: 'Exterior Painting',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-21',
    src: '/assets/projects/project-21.jpg',
    alt: 'Real project photo: Architectural pillar showcasing a two-tone diagonal split stone relief texture in charcoal and terracotta rust',
    category: 'Decorative Finishes',
    width: 793,
    height: 1024,
  },
  {
    id: 'project-22',
    src: '/assets/projects/project-22.jpg',
    alt: 'Real project photo: Pearl cream textured plaster wall with embossed botanical fern leaf motifs',
    category: 'Wall Textures',
    width: 595,
    height: 1024,
  },
  {
    id: 'project-23',
    src: '/assets/projects/project-23.jpg',
    alt: 'Real project photo: Terracotta circular pebble stone texture wall finish creating warm organic depth',
    category: 'Wall Textures',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-24',
    src: '/assets/projects/project-24.jpg',
    alt: 'Real project photo: Metallic silver granite wall texture accented with fine organic gold veining lines',
    category: 'Decorative Finishes',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-25',
    src: '/assets/projects/project-25.jpg',
    alt: 'Real project photo: Traditional ethnic wall mural and symbol motifs hand-painted over metallic gold textured wall plaster',
    category: 'Decorative Finishes',
    width: 788,
    height: 1024,
  },
  {
    id: 'project-26',
    src: '/assets/projects/project-26.jpg',
    alt: 'Real project photo: Mineral stone stucco wall finish with engraved organic flowing lines',
    category: 'Wall Textures',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-27',
    src: '/assets/projects/project-27.jpg',
    alt: 'Real project photo: Exterior facade with geometric black line grid on textured stone plaster around teak wood window',
    category: 'Exterior Painting',
    width: 596,
    height: 1024,
  },
  {
    id: 'project-28',
    src: '/assets/projects/project-28.jpg',
    alt: 'Real project photo: Quad architectural column installation with metallic copper-gold and slate swirl finish',
    category: 'Decorative Finishes',
    width: 588,
    height: 1024,
  },
  {
    id: 'project-29',
    src: '/assets/projects/project-29.png',
    alt: 'Real project photo: Exterior porch wall with horizontal black architectural reveals on speckled stone texture',
    category: 'Exterior Painting',
    width: 729,
    height: 1024,
  },
  {
    id: 'project-30',
    src: '/assets/projects/project-30.jpg',
    alt: 'Real project photo: Veranda porch pillar finished in embossed brick stone pattern and copper textured plaster',
    category: 'Exterior Painting',
    width: 530,
    height: 1024,
  },
  {
    id: 'project-31',
    src: '/assets/projects/project-31.jpg',
    alt: 'Real project photo: Interior architectural pillar with dark bronze and gold stucco texture under decorative crown moulding',
    category: 'Decorative Finishes',
    width: 803,
    height: 1024,
  },
  {
    id: 'project-32',
    src: '/assets/projects/project-32.jpg',
    alt: 'Real project photo: Textured lilac plaster accent wall with embossed celestial moon, stars, and planet motifs',
    category: 'Wall Textures',
    width: 768,
    height: 1024,
  },
  {
    id: 'project-33',
    src: '/assets/projects/project-33.jpg',
    alt: 'Real project photo: Exterior balcony facade with alternating horizontal textured bands of blush rose and pastel lime',
    category: 'Exterior Painting',
    width: 1024,
    height: 768,
  },
  {
    id: 'project-34',
    src: '/assets/projects/project-34.png',
    alt: 'Real project photo: Rich peacock teal interior wall finished with symmetrical white damask stencil pattern',
    category: 'Interior Painting',
    width: 1024,
    height: 576,
  },
  {
    id: 'project-35',
    src: '/assets/projects/project-35.png',
    alt: 'Real project photo: Forest olive green accent wall with two-tone silver and gold ginkgo biloba leaf stencil art',
    category: 'Decorative Finishes',
    width: 758,
    height: 1024,
  },
  {
    id: 'project-36',
    src: '/assets/projects/project-36.jpg',
    alt: 'Real project photo: Distressed lime plaster texture with exposed gold metallic leaf undertones',
    category: 'Wall Textures',
    width: 861,
    height: 1024,
  },
  {
    id: 'project-37',
    src: '/assets/projects/project-37.png',
    alt: 'Real project photo: Multi-story exterior facade featuring an embossed tree of life mural in metallic gold relief on textured stone plaster',
    category: 'Exterior Painting',
    width: 522,
    height: 1024,
  },
  /*
   * PREPARED SLOTS FOR FUTURE PROJECT PHOTOGRAPHS:
   * Keep sharing images and they will be appended to the gallery!
   */
];
