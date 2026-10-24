export interface ColourSwatch {
  id: string;
  name: string;
  hex: string;
  family: string;
  tone: 'warm' | 'cool' | 'neutral';
  shade: 'light' | 'medium' | 'deep';
}

export const COLOUR_FAMILIES = [
  'All',
  'Whites & Off-Whites',
  'Creams & Ivory',
  'Beiges & Warm Neutrals',
  'Greys & Charcoals',
  'Browns & Earthy Tones',
  'Muted Greens',
  'Blues & Blue-Greys',
  'Yellows & Ochres',
  'Terracotta & Rust',
  'Pinks & Mauves',
  'Deep Aubergine & Accents',
] as const;

export const COLOUR_PALETTE: ColourSwatch[] = [
  // 1. Whites & Off-Whites
  { id: 'col-01', name: 'Pure Chalk', hex: '#FAF9F6', family: 'Whites & Off-Whites', tone: 'neutral', shade: 'light' },
  { id: 'col-02', name: 'Whispering White', hex: '#F5F5F0', family: 'Whites & Off-Whites', tone: 'warm', shade: 'light' },
  { id: 'col-03', name: 'Alabaster Mist', hex: '#F2F0EB', family: 'Whites & Off-Whites', tone: 'neutral', shade: 'light' },
  { id: 'col-04', name: 'Linen White', hex: '#EDE8DF', family: 'Whites & Off-Whites', tone: 'warm', shade: 'light' },
  { id: 'col-05', name: 'Architectural White', hex: '#F0F2F2', family: 'Whites & Off-Whites', tone: 'cool', shade: 'light' },

  // 2. Creams & Ivory
  { id: 'col-06', name: 'Soft Ivory', hex: '#FDF6E2', family: 'Creams & Ivory', tone: 'warm', shade: 'light' },
  { id: 'col-07', name: 'Clotted Cream', hex: '#F7EED6', family: 'Creams & Ivory', tone: 'warm', shade: 'light' },
  { id: 'col-08', name: 'Vanilla Custard', hex: '#F3E5C8', family: 'Creams & Ivory', tone: 'warm', shade: 'light' },
  { id: 'col-09', name: 'Antique Parchment', hex: '#EBDDC2', family: 'Creams & Ivory', tone: 'warm', shade: 'light' },

  // 3. Beiges, Sand & Warm Neutrals
  { id: 'col-10', name: 'Coastal Sand', hex: '#E2D3B8', family: 'Beiges & Warm Neutrals', tone: 'warm', shade: 'light' },
  { id: 'col-11', name: 'Warm Greige', hex: '#D3C7B6', family: 'Beiges & Warm Neutrals', tone: 'warm', shade: 'medium' },
  { id: 'col-12', name: 'Raw Oatmeal', hex: '#C8B9A6', family: 'Beiges & Warm Neutrals', tone: 'warm', shade: 'medium' },
  { id: 'col-13', name: 'Desert Dune', hex: '#BAA58C', family: 'Beiges & Warm Neutrals', tone: 'warm', shade: 'medium' },
  { id: 'col-14', name: 'Roasted Almond', hex: '#A89279', family: 'Beiges & Warm Neutrals', tone: 'warm', shade: 'medium' },

  // 4. Greys & Charcoals
  { id: 'col-15', name: 'Mineral Grey', hex: '#D8DBDC', family: 'Greys & Charcoals', tone: 'cool', shade: 'light' },
  { id: 'col-16', name: 'Silver Birch', hex: '#BDC3C7', family: 'Greys & Charcoals', tone: 'cool', shade: 'medium' },
  { id: 'col-17', name: 'Slate Pewter', hex: '#8E979D', family: 'Greys & Charcoals', tone: 'cool', shade: 'medium' },
  { id: 'col-18', name: 'Graphite Wash', hex: '#5A6268', family: 'Greys & Charcoals', tone: 'cool', shade: 'deep' },
  { id: 'col-19', name: 'Carbon Charcoal', hex: '#2F353B', family: 'Greys & Charcoals', tone: 'cool', shade: 'deep' },

  // 5. Browns & Earthy Tones
  { id: 'col-20', name: 'Clay Umber', hex: '#967259', family: 'Browns & Earthy Tones', tone: 'warm', shade: 'medium' },
  { id: 'col-21', name: 'Spiced Walnut', hex: '#78533B', family: 'Browns & Earthy Tones', tone: 'warm', shade: 'deep' },
  { id: 'col-22', name: 'Smoked Chestnut', hex: '#5C3E29', family: 'Browns & Earthy Tones', tone: 'warm', shade: 'deep' },
  { id: 'col-23', name: 'Dark Teak', hex: '#483224', family: 'Browns & Earthy Tones', tone: 'warm', shade: 'deep' },
  { id: 'col-24', name: 'Espresso Earth', hex: '#362419', family: 'Browns & Earthy Tones', tone: 'warm', shade: 'deep' },

  // 6. Muted Greens
  { id: 'col-25', name: 'Pale Celadon', hex: '#D1DBD0', family: 'Muted Greens', tone: 'cool', shade: 'light' },
  { id: 'col-26', name: 'Sage Haze', hex: '#A9B7A6', family: 'Muted Greens', tone: 'cool', shade: 'medium' },
  { id: 'col-27', name: 'Olive Grove', hex: '#7C8B6E', family: 'Muted Greens', tone: 'warm', shade: 'medium' },
  { id: 'col-28', name: 'Eucalyptus Leaf', hex: '#5F7363', family: 'Muted Greens', tone: 'cool', shade: 'medium' },
  { id: 'col-29', name: 'Forest Canopy', hex: '#36483B', family: 'Muted Greens', tone: 'cool', shade: 'deep' },

  // 7. Blues & Blue-Greys
  { id: 'col-30', name: 'Coastal Mist', hex: '#D4DFE8', family: 'Blues & Blue-Greys', tone: 'cool', shade: 'light' },
  { id: 'col-31', name: 'Duck Egg Blue', hex: '#A7BCC7', family: 'Blues & Blue-Greys', tone: 'cool', shade: 'medium' },
  { id: 'col-32', name: 'Slate Denim', hex: '#6D8294', family: 'Blues & Blue-Greys', tone: 'cool', shade: 'medium' },
  { id: 'col-33', name: 'Indigo Dusk', hex: '#3D566E', family: 'Blues & Blue-Greys', tone: 'cool', shade: 'deep' },
  { id: 'col-34', name: 'Midnight Navy', hex: '#1F2D3D', family: 'Blues & Blue-Greys', tone: 'cool', shade: 'deep' },

  // 8. Yellows & Ochres
  { id: 'col-35', name: 'Morning Sun', hex: '#FBE39A', family: 'Yellows & Ochres', tone: 'warm', shade: 'light' },
  { id: 'col-36', name: 'Raw Ochre', hex: '#DEAC45', family: 'Yellows & Ochres', tone: 'warm', shade: 'medium' },
  { id: 'col-37', name: 'Honeyed Amber', hex: '#C68B2C', family: 'Yellows & Ochres', tone: 'warm', shade: 'medium' },
  { id: 'col-38', name: 'Golden Mustard', hex: '#A9711C', family: 'Yellows & Ochres', tone: 'warm', shade: 'deep' },

  // 9. Terracotta & Rust
  { id: 'col-39', name: 'Baked Clay', hex: '#D5825D', family: 'Terracotta & Rust', tone: 'warm', shade: 'medium' },
  { id: 'col-40', name: 'Mangalore Terracotta', hex: '#BD5E3B', family: 'Terracotta & Rust', tone: 'warm', shade: 'medium' },
  { id: 'col-41', name: 'Rustic Sienna', hex: '#A04A2A', family: 'Terracotta & Rust', tone: 'warm', shade: 'deep' },
  { id: 'col-42', name: 'Spiced Rust', hex: '#88361B', family: 'Terracotta & Rust', tone: 'warm', shade: 'deep' },

  // 10. Pinks & Mauves
  { id: 'col-43', name: 'Powder Blush', hex: '#F1DCD6', family: 'Pinks & Mauves', tone: 'warm', shade: 'light' },
  { id: 'col-44', name: 'Dusty Rose', hex: '#D7A99C', family: 'Pinks & Mauves', tone: 'warm', shade: 'medium' },
  { id: 'col-45', name: 'Antique Mauve', hex: '#B98D91', family: 'Pinks & Mauves', tone: 'cool', shade: 'medium' },
  { id: 'col-46', name: 'Vintage Heather', hex: '#9B707B', family: 'Pinks & Mauves', tone: 'cool', shade: 'medium' },

  // 11. Deep Aubergine & Rich Accent Shades
  { id: 'col-47', name: 'Royal Plum', hex: '#5B3247', family: 'Deep Aubergine & Accents', tone: 'cool', shade: 'deep' },
  { id: 'col-48', name: 'Deep Aubergine', hex: '#3B1F34', family: 'Deep Aubergine & Accents', tone: 'cool', shade: 'deep' },
  { id: 'col-49', name: 'Bordeaux Wine', hex: '#4A1A2C', family: 'Deep Aubergine & Accents', tone: 'cool', shade: 'deep' },
  { id: 'col-50', name: 'Damson Fig', hex: '#301728', family: 'Deep Aubergine & Accents', tone: 'cool', shade: 'deep' },
];
