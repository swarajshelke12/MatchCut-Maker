import { DEFAULT_IMPACT_FONTS, CURATED_FONTS } from './fonts';

export interface AnimationStyle {
  id: string;
  name: string;
  description: string;
  fonts: string[];
  framesPerCard: number;
  fps: number;
  duration: number;
  foregroundColor: string;
  backgroundColor: string;
}

// Get fonts by category
const getFontsByCategory = (category: string): string[] => {
  return CURATED_FONTS.filter(f => f.category === category).map(f => f.name);
};

export const ANIMATION_STYLES: AnimationStyle[] = [
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Clean, modern fonts with smooth transitions',
    fonts: ['Anton', 'Bebas Neue', 'Oswald', 'Russo One', 'Staatliches', 'Archivo Black', 'Fira Sans', 'Viga', 'Black Han Sans', 'Comfortaa'],
    framesPerCard: 3,
    fps: 30,
    duration: 2.5,
    foregroundColor: '#ffffff',
    backgroundColor: 'auto',
  },
  {
    id: 'glitch-flash',
    name: 'Glitch Flash',
    description: 'Rapid, glitchy pixel fonts',
    fonts: ['Press Start 2P', 'Silkscreen', 'VT323', 'Rubik Glitch', 'Major Mono Display', 'Orbitron', 'Iceland', 'Nosifer', 'Monoton', 'Rubik Moonrocks'],
    framesPerCard: 1,
    fps: 60,
    duration: 1.5,
    foregroundColor: '#00ff88',
    backgroundColor: 'auto',
  },
  {
    id: 'kinetic-pop',
    name: 'Kinetic Pop',
    description: 'Bold, punchy display fonts',
    fonts: ['Bungee', 'Lilita One', 'Righteous', 'Fugaz One', 'Fascinate', 'Bangers', 'Chewy', 'Knewave', 'Rowdies', 'Modak', 'Titan One', 'Sigmar One'],
    framesPerCard: 1,
    fps: 60,
    duration: 2,
    foregroundColor: '#ffff00',
    backgroundColor: 'auto',
  },
  {
    id: 'handwritten-bounce',
    name: 'Handwritten Bounce',
    description: 'Organic, hand-drawn feel',
    fonts: ['Permanent Marker', 'Luckiest Guy', 'Special Elite', 'Cabin Sketch', 'Gochi Hand', 'Kaushan Script', 'Pacifico', 'Lobster', 'Fredericka the Great', 'Sarina'],
    framesPerCard: 2,
    fps: 30,
    duration: 2.5,
    foregroundColor: '#ffffff',
    backgroundColor: 'auto',
  },
  {
    id: 'bold-punch',
    name: 'Bold Punch',
    description: 'Maximum impact, intense variety',
    fonts: DEFAULT_IMPACT_FONTS,
    framesPerCard: 1,
    fps: 60,
    duration: 2,
    foregroundColor: '#ffffff',
    backgroundColor: 'auto',
  },
  {
    id: 'horror-chaos',
    name: 'Horror Chaos',
    description: 'Creepy, unsettling vibes',
    fonts: ['Creepster', 'Nosifer', 'Butcherman', 'Eater', 'Irish Grover', 'Jolly Lodger', 'New Rocker', 'Pirata One', 'Sancreek', 'Smokum', 'Miltonian Tattoo'],
    framesPerCard: 2,
    fps: 24,
    duration: 3,
    foregroundColor: '#ff0000',
    backgroundColor: 'auto',
  },
  {
    id: 'retro-arcade',
    name: 'Retro Arcade',
    description: '80s gaming aesthetics',
    fonts: ['Press Start 2P', 'Silkscreen', 'VT323', 'Orbitron', 'Major Mono Display', 'Iceland', 'Wallpoet', 'Gugi', 'Rubik Mono One', 'Train One'],
    framesPerCard: 2,
    fps: 30,
    duration: 2,
    foregroundColor: '#00ffff',
    backgroundColor: 'auto',
  },
  {
    id: 'street-graffiti',
    name: 'Street Graffiti',
    description: 'Urban, spray-paint style',
    fonts: ['Rubik Spray Paint', 'Rubik Marker Hatch', 'Rubik Wet Paint', 'Rubik Vinyl', 'Bangers', 'Kranky', 'Slackey', 'Knewave', 'Boogaloo', 'Rubik Bubbles'],
    framesPerCard: 1,
    fps: 30,
    duration: 2,
    foregroundColor: '#ff6b35',
    backgroundColor: 'auto',
  },
  // NEW STYLES
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    description: 'Futuristic cyberpunk glow',
    fonts: ['Orbitron', 'Monoton', 'Major Mono Display', 'Iceland', 'Saira Stencil One', 'Gugi', 'Train One', 'Rubik Mono One', 'Wallpoet', 'Faster One'],
    framesPerCard: 1,
    fps: 60,
    duration: 1.8,
    foregroundColor: '#ff00ff',
    backgroundColor: 'auto',
  },
  {
    id: 'vintage-cinema',
    name: 'Vintage Cinema',
    description: 'Classic movie title cards',
    fonts: ['Cinzel', 'Playfair Display', 'Cinzel Decorative', 'Abril Fatface', 'Ultra', 'Berkshire Swash', 'Graduate', 'Germania One', 'UnifrakturMaguntia', 'Diplomata SC'],
    framesPerCard: 4,
    fps: 24,
    duration: 3.5,
    foregroundColor: '#f5deb3',
    backgroundColor: 'auto',
  },
  {
    id: 'comic-burst',
    name: 'Comic Burst',
    description: 'Cartoon explosions & action',
    fonts: ['Bangers', 'Bungee', 'Chewy', 'Luckiest Guy', 'Lilita One', 'Rowdies', 'Modak', 'Kavoon', 'Flavors', 'Henny Penny'],
    framesPerCard: 1,
    fps: 48,
    duration: 1.5,
    foregroundColor: '#ffeb3b',
    backgroundColor: 'auto',
  },
  {
    id: 'elegant-luxury',
    name: 'Elegant Luxury',
    description: 'High-end brand aesthetics',
    fonts: ['Playfair Display', 'Cinzel', 'Abril Fatface', 'Gruppo', 'Comfortaa', 'Dosis', 'Fredoka', 'Lemonada', 'Ultra', 'Gravitas One'],
    framesPerCard: 5,
    fps: 24,
    duration: 4,
    foregroundColor: '#d4af37',
    backgroundColor: 'auto',
  },
  {
    id: 'psychedelic-wave',
    name: 'Psychedelic Wave',
    description: 'Trippy, mind-bending fonts',
    fonts: ['Monoton', 'Nabla', 'Honk', 'Rubik Moonrocks', 'Rubik Puddles', 'Rubik Bubbles', 'Codystar', 'Fascinate', 'Emblema One', 'Lacquer'],
    framesPerCard: 1,
    fps: 60,
    duration: 2,
    foregroundColor: '#ff6ec7',
    backgroundColor: 'auto',
  },
  {
    id: 'military-stencil',
    name: 'Military Stencil',
    description: 'Army, tactical, industrial',
    fonts: ['Black Ops One', 'Saira Stencil One', 'Stardos Stencil', 'Stalinist One', 'Kelly Slab', 'Russo One', 'Contrail One', 'Racing Sans One', 'Ceviche One', 'Viga'],
    framesPerCard: 2,
    fps: 30,
    duration: 2.5,
    foregroundColor: '#8fbc8f',
    backgroundColor: 'auto',
  },
  {
    id: 'japanese-pop',
    name: 'Japanese Pop',
    description: 'Anime & manga inspired',
    fonts: ['Black Han Sans', 'ZCOOL KuaiLe', 'ZCOOL QingKe HuangYou', 'Gugi', 'Shojumaru', 'Dela Gothic One', 'Rampart One', 'Gajraj One', 'Yatra One', 'Train One'],
    framesPerCard: 1,
    fps: 48,
    duration: 1.8,
    foregroundColor: '#ff4081',
    backgroundColor: 'auto',
  },
  {
    id: 'typewriter-flash',
    name: 'Typewriter Flash',
    description: 'Rapid typed feel',
    fonts: ['Special Elite', 'VT323', 'Press Start 2P', 'Silkscreen', 'Cabin Sketch', 'Fredericka the Great', 'Major Mono Display', 'Gruppo', 'Dosis', 'Iceland'],
    framesPerCard: 1,
    fps: 60,
    duration: 1.5,
    foregroundColor: '#00ff00',
    backgroundColor: 'auto',
  },
  {
    id: 'sunset-vibes',
    name: 'Sunset Vibes',
    description: 'Warm, chill aesthetic',
    fonts: ['Pacifico', 'Lobster', 'Lobster Two', 'Kaushan Script', 'Sarina', 'Comfortaa', 'Fredoka', 'Lemonada', 'Righteous', 'Concert One'],
    framesPerCard: 3,
    fps: 30,
    duration: 3,
    foregroundColor: '#ff7e5f',
    backgroundColor: 'auto',
  },
  {
    id: 'chaos-maximum',
    name: 'Chaos Maximum',
    description: 'Every font, pure randomness',
    fonts: [...DEFAULT_IMPACT_FONTS, 'Nabla', 'Honk', 'Stalinist One', 'Shojumaru', 'ZCOOL KuaiLe', 'Rampart One', 'Piedra', 'Revalia', 'Plaster', 'Lacquer'],
    framesPerCard: 1,
    fps: 60,
    duration: 1.5,
    foregroundColor: '#ffffff',
    backgroundColor: 'auto',
  },
];

export type AnimationStyleId = typeof ANIMATION_STYLES[number]['id'];

export function getAnimationStyle(id: string): AnimationStyle | undefined {
  return ANIMATION_STYLES.find(style => style.id === id);
}
