export interface FontOption {
  name: string;
  family: string;
  category: 'display' | 'sans' | 'serif' | 'mono' | 'handwritten' | 'decorative' | 'horror' | 'retro' | 'graffiti';
}

export const CURATED_FONTS: FontOption[] = [
  // DISPLAY - Bold, impactful headline fonts
  { name: 'Anton', family: "'Anton', sans-serif", category: 'display' },
  { name: 'Bebas Neue', family: "'Bebas Neue', sans-serif", category: 'display' },
  { name: 'Black Ops One', family: "'Black Ops One', system-ui", category: 'display' },
  { name: 'Bungee', family: "'Bungee', sans-serif", category: 'display' },
  { name: 'Bungee Inline', family: "'Bungee Inline', sans-serif", category: 'display' },
  { name: 'Bungee Outline', family: "'Bungee Outline', sans-serif", category: 'display' },
  { name: 'Bungee Shade', family: "'Bungee Shade', sans-serif", category: 'display' },
  { name: 'Fugaz One', family: "'Fugaz One', sans-serif", category: 'display' },
  { name: 'Lilita One', family: "'Lilita One', sans-serif", category: 'display' },
  { name: 'Righteous', family: "'Righteous', sans-serif", category: 'display' },
  { name: 'Russo One', family: "'Russo One', sans-serif", category: 'display' },
  { name: 'Staatliches', family: "'Staatliches', sans-serif", category: 'display' },
  { name: 'Archivo Black', family: "'Archivo Black', sans-serif", category: 'display' },
  { name: 'Alfa Slab One', family: "'Alfa Slab One', serif", category: 'display' },
  { name: 'Bowlby One SC', family: "'Bowlby One SC', sans-serif", category: 'display' },
  { name: 'Concert One', family: "'Concert One', sans-serif", category: 'display' },
  { name: 'Contrail One', family: "'Contrail One', sans-serif", category: 'display' },
  { name: 'Dela Gothic One', family: "'Dela Gothic One', sans-serif", category: 'display' },
  { name: 'Faster One', family: "'Faster One', sans-serif", category: 'display' },
  { name: 'Gravitas One', family: "'Gravitas One', serif", category: 'display' },
  { name: 'Passion One', family: "'Passion One', sans-serif", category: 'display' },
  { name: 'Patua One', family: "'Patua One', serif", category: 'display' },
  { name: 'Poller One', family: "'Poller One', serif", category: 'display' },
  { name: 'Racing Sans One', family: "'Racing Sans One', sans-serif", category: 'display' },
  { name: 'Rammetto One', family: "'Rammetto One', sans-serif", category: 'display' },
  { name: 'Sigmar One', family: "'Sigmar One', sans-serif", category: 'display' },
  { name: 'Titan One', family: "'Titan One', sans-serif", category: 'display' },
  { name: 'Viga', family: "'Viga', sans-serif", category: 'display' },
  { name: 'Fira Sans', family: "'Fira Sans', sans-serif", category: 'display' },
  { name: 'Oswald', family: "'Oswald', sans-serif", category: 'display' },
  { name: 'Gajraj One', family: "'Gajraj One', sans-serif", category: 'display' },
  
  // DECORATIVE - Unique, eye-catching styles
  { name: 'Monoton', family: "'Monoton', sans-serif", category: 'decorative' },
  { name: 'Fascinate', family: "'Fascinate', system-ui", category: 'decorative' },
  { name: 'Honk', family: "'Honk', system-ui", category: 'decorative' },
  { name: 'Codystar', family: "'Codystar', sans-serif", category: 'decorative' },
  { name: 'Emblema One', family: "'Emblema One', sans-serif", category: 'decorative' },
  { name: 'Ewert', family: "'Ewert', serif", category: 'decorative' },
  { name: 'Flamenco', family: "'Flamenco', sans-serif", category: 'decorative' },
  { name: 'Flavors', family: "'Flavors', sans-serif", category: 'decorative' },
  { name: 'Henny Penny', family: "'Henny Penny', cursive", category: 'decorative' },
  { name: 'Kavoon', family: "'Kavoon', serif", category: 'decorative' },
  { name: 'Keania One', family: "'Keania One', sans-serif", category: 'decorative' },
  { name: 'Kenia', family: "'Kenia', sans-serif", category: 'decorative' },
  { name: 'Lacquer', family: "'Lacquer', sans-serif", category: 'decorative' },
  { name: 'Lemon', family: "'Lemon', serif", category: 'decorative' },
  { name: 'Modak', family: "'Modak', sans-serif", category: 'decorative' },
  { name: 'Nabla', family: "'Nabla', sans-serif", category: 'decorative' },
  { name: 'Piedra', family: "'Piedra', serif", category: 'decorative' },
  { name: 'Plaster', family: "'Plaster', sans-serif", category: 'decorative' },
  { name: 'Revalia', family: "'Revalia', sans-serif", category: 'decorative' },
  { name: 'Rowdies', family: "'Rowdies', sans-serif", category: 'decorative' },
  { name: 'Shrikhand', family: "'Shrikhand', serif", category: 'decorative' },
  { name: 'Spicy Rice', family: "'Spicy Rice', sans-serif", category: 'decorative' },
  { name: 'Unlock', family: "'Unlock', sans-serif", category: 'decorative' },
  { name: 'Yatra One', family: "'Yatra One', sans-serif", category: 'decorative' },
  { name: 'ZCOOL KuaiLe', family: "'ZCOOL KuaiLe', sans-serif", category: 'decorative' },
  { name: 'ZCOOL QingKe HuangYou', family: "'ZCOOL QingKe HuangYou', sans-serif", category: 'decorative' },
  
  // HORROR - Creepy, spooky fonts
  { name: 'Creepster', family: "'Creepster', system-ui", category: 'horror' },
  { name: 'Nosifer', family: "'Nosifer', system-ui", category: 'horror' },
  { name: 'Butcherman', family: "'Butcherman', cursive", category: 'horror' },
  { name: 'Eater', family: "'Eater', cursive", category: 'horror' },
  { name: 'Irish Grover', family: "'Irish Grover', cursive", category: 'horror' },
  { name: 'Jolly Lodger', family: "'Jolly Lodger', cursive", category: 'horror' },
  { name: 'Miltonian Tattoo', family: "'Miltonian Tattoo', cursive", category: 'horror' },
  { name: 'New Rocker', family: "'New Rocker', cursive", category: 'horror' },
  { name: 'Pirata One', family: "'Pirata One', sans-serif", category: 'horror' },
  { name: 'Sancreek', family: "'Sancreek', serif", category: 'horror' },
  { name: 'Smokum', family: "'Smokum', cursive", category: 'horror' },
  
  // RETRO/PIXEL - Gaming and tech vibes
  { name: 'Press Start 2P', family: "'Press Start 2P', monospace", category: 'retro' },
  { name: 'Silkscreen', family: "'Silkscreen', monospace", category: 'retro' },
  { name: 'VT323', family: "'VT323', monospace", category: 'retro' },
  { name: 'Orbitron', family: "'Orbitron', sans-serif", category: 'retro' },
  { name: 'Rubik Mono One', family: "'Rubik Mono One', monospace", category: 'retro' },
  { name: 'Major Mono Display', family: "'Major Mono Display', monospace", category: 'retro' },
  { name: 'Iceland', family: "'Iceland', sans-serif", category: 'retro' },
  { name: 'Wallpoet', family: "'Wallpoet', sans-serif", category: 'retro' },
  { name: 'Gugi', family: "'Gugi', sans-serif", category: 'retro' },
  { name: 'Saira Stencil One', family: "'Saira Stencil One', sans-serif", category: 'retro' },
  { name: 'Train One', family: "'Train One', sans-serif", category: 'retro' },
  
  // GRAFFITI/STREET - Urban, bold styles
  { name: 'Bangers', family: "'Bangers', cursive", category: 'graffiti' },
  { name: 'Boogaloo', family: "'Boogaloo', sans-serif", category: 'graffiti' },
  { name: 'Chewy', family: "'Chewy', sans-serif", category: 'graffiti' },
  { name: 'Knewave', family: "'Knewave', sans-serif", category: 'graffiti' },
  { name: 'Kranky', family: "'Kranky', sans-serif", category: 'graffiti' },
  { name: 'Slackey', family: "'Slackey', sans-serif", category: 'graffiti' },
  { name: 'Rubik Spray Paint', family: "'Rubik Spray Paint', sans-serif", category: 'graffiti' },
  { name: 'Rubik Marker Hatch', family: "'Rubik Marker Hatch', sans-serif", category: 'graffiti' },
  { name: 'Rubik Vinyl', family: "'Rubik Vinyl', sans-serif", category: 'graffiti' },
  { name: 'Rubik Wet Paint', family: "'Rubik Wet Paint', sans-serif", category: 'graffiti' },
  { name: 'Rubik Glitch', family: "'Rubik Glitch', sans-serif", category: 'graffiti' },
  { name: 'Rubik Bubbles', family: "'Rubik Bubbles', sans-serif", category: 'graffiti' },
  { name: 'Rubik Moonrocks', family: "'Rubik Moonrocks', sans-serif", category: 'graffiti' },
  { name: 'Rubik Puddles', family: "'Rubik Puddles', sans-serif", category: 'graffiti' },
  
  // HANDWRITTEN - Script and marker styles
  { name: 'Permanent Marker', family: "'Permanent Marker', cursive", category: 'handwritten' },
  { name: 'Luckiest Guy', family: "'Luckiest Guy', cursive", category: 'handwritten' },
  { name: 'Special Elite', family: "'Special Elite', system-ui", category: 'handwritten' },
  { name: 'Cabin Sketch', family: "'Cabin Sketch', sans-serif", category: 'handwritten' },
  { name: 'Fredericka the Great', family: "'Fredericka the Great', cursive", category: 'handwritten' },
  { name: 'Gochi Hand', family: "'Gochi Hand', cursive", category: 'handwritten' },
  { name: 'Kaushan Script', family: "'Kaushan Script', cursive", category: 'handwritten' },
  { name: 'Lobster', family: "'Lobster', cursive", category: 'handwritten' },
  { name: 'Lobster Two', family: "'Lobster Two', cursive", category: 'handwritten' },
  { name: 'Pacifico', family: "'Pacifico', cursive", category: 'handwritten' },
  { name: 'Sarina', family: "'Sarina', cursive", category: 'handwritten' },
  
  // SERIF - Elegant and classic
  { name: 'Cinzel', family: "'Cinzel', serif", category: 'serif' },
  { name: 'Cinzel Decorative', family: "'Cinzel Decorative', serif", category: 'serif' },
  { name: 'Playfair Display', family: "'Playfair Display', serif", category: 'serif' },
  { name: 'Graduate', family: "'Graduate', serif", category: 'serif' },
  { name: 'Ultra', family: "'Ultra', serif", category: 'serif' },
  { name: 'Abril Fatface', family: "'Abril Fatface', serif", category: 'serif' },
  { name: 'Berkshire Swash', family: "'Berkshire Swash', serif", category: 'serif' },
  { name: 'Diplomata SC', family: "'Diplomata SC', serif", category: 'serif' },
  { name: 'UnifrakturMaguntia', family: "'UnifrakturMaguntia', serif", category: 'serif' },
  { name: 'Germania One', family: "'Germania One', serif", category: 'serif' },
  { name: 'Stalinist One', family: "'Stalinist One', sans-serif", category: 'serif' },
  { name: 'Stardos Stencil', family: "'Stardos Stencil', sans-serif", category: 'serif' },
  { name: 'Merriweather', family: "'Merriweather', serif", category: 'serif' },
  { name: 'EB Garamond', family: "'EB Garamond', serif", category: 'serif' },
  { name: 'Lora', family: "'Lora', serif", category: 'serif' },
  { name: 'Old Standard TT', family: "'Old Standard TT', serif", category: 'serif' },
  { name: 'Spectral', family: "'Spectral', serif", category: 'serif' },
  
  // SANS - Clean but bold
  { name: 'Gruppo', family: "'Gruppo', sans-serif", category: 'sans' },
  { name: 'Black Han Sans', family: "'Black Han Sans', sans-serif", category: 'sans' },
  { name: 'Comfortaa', family: "'Comfortaa', sans-serif", category: 'sans' },
  { name: 'Dosis', family: "'Dosis', sans-serif", category: 'sans' },
  { name: 'Fredoka', family: "'Fredoka', sans-serif", category: 'sans' },
  { name: 'Lemonada', family: "'Lemonada', sans-serif", category: 'sans' },
  { name: 'Rampart One', family: "'Rampart One', sans-serif", category: 'sans' },
  { name: 'Kelly Slab', family: "'Kelly Slab', serif", category: 'sans' },
  { name: 'Ceviche One', family: "'Ceviche One', sans-serif", category: 'sans' },
  { name: 'Caesar Dressing', family: "'Caesar Dressing', sans-serif", category: 'sans' },
  { name: 'Shojumaru', family: "'Shojumaru', sans-serif", category: 'sans' },
];

// Default high-impact fonts for best results
export const DEFAULT_IMPACT_FONTS = [
  'Bangers', 'Bungee', 'Rubik Glitch', 'Rubik Spray Paint', 'Nosifer',
  'Anton', 'Creepster', 'Press Start 2P', 'Monoton', 'Fascinate',
  'Permanent Marker', 'Luckiest Guy', 'Butcherman', 'Honk', 'Nabla',
  'Eater', 'Pirata One', 'Knewave', 'Rubik Wet Paint', 'Silkscreen',
  'Stalinist One', 'Faster One', 'Lacquer', 'Major Mono Display', 'Modak',
  'Abril Fatface', 'Archivo Black', 'Bowlby One SC', 'Dela Gothic One',
  'Emblema One', 'Gravitas One', 'Sigmar One', 'Titan One', 'Ultra',
  'Bungee Shade', 'Rubik Moonrocks', 'Rubik Bubbles', 'Rowdies', 'Shrikhand'
];

export const PRESETS = {
  'maximum-chaos': {
    name: 'Maximum Chaos',
    framesPerCard: 1,
    fps: 60,
    duration: 2,
    fonts: DEFAULT_IMPACT_FONTS,
  },
  'fast-glitchy': {
    name: 'Fast Glitchy',
    framesPerCard: 1,
    fps: 30,
    duration: 2,
    fonts: ['Press Start 2P', 'Silkscreen', 'VT323', 'Rubik Glitch', 'Major Mono Display', 'Orbitron', 'Iceland', 'Nosifer', 'Monoton'],
  },
  'clean-modern': {
    name: 'Clean Modern',
    framesPerCard: 3,
    fps: 30,
    duration: 3,
    fonts: ['Anton', 'Bebas Neue', 'Oswald', 'Russo One', 'Staatliches', 'Archivo Black', 'Fira Sans', 'Viga', 'Black Han Sans'],
  },
  'handwritten-flash': {
    name: 'Handwritten Flash',
    framesPerCard: 2,
    fps: 30,
    duration: 2.5,
    fonts: ['Permanent Marker', 'Luckiest Guy', 'Special Elite', 'Cabin Sketch', 'Gochi Hand', 'Kaushan Script', 'Pacifico', 'Lobster'],
  },
  'horror-vibes': {
    name: 'Horror Vibes',
    framesPerCard: 2,
    fps: 24,
    duration: 3,
    fonts: ['Creepster', 'Nosifer', 'Butcherman', 'Eater', 'Irish Grover', 'Jolly Lodger', 'New Rocker', 'Pirata One', 'Sancreek', 'Smokum'],
  },
  'cinematic-pop': {
    name: 'Cinematic Pop',
    framesPerCard: 4,
    fps: 24,
    duration: 3,
    fonts: ['Cinzel', 'Playfair Display', 'Graduate', 'Ultra', 'Abril Fatface', 'Cinzel Decorative', 'Diplomata SC'],
  },
  'tiktok-punch': {
    name: 'TikTok Punch',
    framesPerCard: 1,
    fps: 60,
    duration: 1.5,
    fonts: ['Bungee', 'Lilita One', 'Righteous', 'Fugaz One', 'Fascinate', 'Bangers', 'Chewy', 'Knewave', 'Rowdies', 'Modak'],
  },
  'street-graffiti': {
    name: 'Street Graffiti',
    framesPerCard: 1,
    fps: 30,
    duration: 2,
    fonts: ['Rubik Spray Paint', 'Rubik Marker Hatch', 'Rubik Wet Paint', 'Rubik Vinyl', 'Bangers', 'Kranky', 'Slackey', 'Knewave'],
  },
  'retro-gaming': {
    name: 'Retro Gaming',
    framesPerCard: 2,
    fps: 30,
    duration: 2,
    fonts: ['Press Start 2P', 'Silkscreen', 'VT323', 'Orbitron', 'Major Mono Display', 'Iceland', 'Wallpoet', 'Gugi'],
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
