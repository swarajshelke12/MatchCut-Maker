export interface FontOption {
  name: string;
  family: string;
  category: 'display' | 'sans' | 'serif' | 'mono' | 'handwritten';
}

export const CURATED_FONTS: FontOption[] = [
  { name: 'Anton', family: "'Anton', sans-serif", category: 'display' },
  { name: 'Bebas Neue', family: "'Bebas Neue', sans-serif", category: 'display' },
  { name: 'Black Ops One', family: "'Black Ops One', system-ui", category: 'display' },
  { name: 'Bungee', family: "'Bungee', sans-serif", category: 'display' },
  { name: 'Cinzel', family: "'Cinzel', serif", category: 'serif' },
  { name: 'Codystar', family: "'Codystar', sans-serif", category: 'display' },
  { name: 'Creepster', family: "'Creepster', system-ui", category: 'display' },
  { name: 'Fascinate', family: "'Fascinate', system-ui", category: 'display' },
  { name: 'Fugaz One', family: "'Fugaz One', sans-serif", category: 'display' },
  { name: 'Graduate', family: "'Graduate', serif", category: 'serif' },
  { name: 'Gruppo', family: "'Gruppo', sans-serif", category: 'sans' },
  { name: 'Honk', family: "'Honk', system-ui", category: 'display' },
  { name: 'Lilita One', family: "'Lilita One', sans-serif", category: 'display' },
  { name: 'Luckiest Guy', family: "'Luckiest Guy', cursive", category: 'handwritten' },
  { name: 'Monoton', family: "'Monoton', sans-serif", category: 'display' },
  { name: 'Nosifer', family: "'Nosifer', system-ui", category: 'display' },
  { name: 'Orbitron', family: "'Orbitron', sans-serif", category: 'mono' },
  { name: 'Oswald', family: "'Oswald', sans-serif", category: 'sans' },
  { name: 'Permanent Marker', family: "'Permanent Marker', cursive", category: 'handwritten' },
  { name: 'Playfair Display', family: "'Playfair Display', serif", category: 'serif' },
  { name: 'Press Start 2P', family: "'Press Start 2P', monospace", category: 'mono' },
  { name: 'Righteous', family: "'Righteous', sans-serif", category: 'display' },
  { name: 'Rubik Mono One', family: "'Rubik Mono One', monospace", category: 'mono' },
  { name: 'Russo One', family: "'Russo One', sans-serif", category: 'display' },
  { name: 'Silkscreen', family: "'Silkscreen', monospace", category: 'mono' },
  { name: 'Special Elite', family: "'Special Elite', system-ui", category: 'handwritten' },
  { name: 'Staatliches', family: "'Staatliches', sans-serif", category: 'display' },
  { name: 'Ultra', family: "'Ultra', serif", category: 'serif' },
];

export const PRESETS = {
  'fast-glitchy': {
    name: 'Fast Glitchy',
    framesPerCard: 1,
    fps: 30,
    duration: 2,
    fonts: ['Press Start 2P', 'Silkscreen', 'Orbitron', 'Black Ops One', 'Nosifer'],
  },
  'clean-modern': {
    name: 'Clean Modern',
    framesPerCard: 3,
    fps: 30,
    duration: 3,
    fonts: ['Anton', 'Bebas Neue', 'Oswald', 'Russo One', 'Staatliches'],
  },
  'handwritten-flash': {
    name: 'Handwritten Flash',
    framesPerCard: 2,
    fps: 30,
    duration: 2.5,
    fonts: ['Permanent Marker', 'Luckiest Guy', 'Special Elite', 'Creepster'],
  },
  'cinematic-pop': {
    name: 'Cinematic Pop',
    framesPerCard: 4,
    fps: 24,
    duration: 3,
    fonts: ['Cinzel', 'Playfair Display', 'Graduate', 'Ultra'],
  },
  'tiktok-punch': {
    name: 'TikTok Punch',
    framesPerCard: 1,
    fps: 60,
    duration: 1.5,
    fonts: ['Bungee', 'Lilita One', 'Righteous', 'Fugaz One', 'Fascinate'],
  },
};

export type PresetKey = keyof typeof PRESETS;

// Seeded random number generator
export function seededRandom(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export function shuffleFonts(fonts: string[], seed: number, count: number): string[] {
  const random = seededRandom(seed);
  const result: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const index = Math.floor(random() * fonts.length);
    result.push(fonts[index]);
  }
  
  return result;
}
