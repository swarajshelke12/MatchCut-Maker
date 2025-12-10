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
  grainOverlay?: boolean;
  scaleJitter?: { min: number; max: number };
  rotationJitter?: { min: number; max: number };
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
    backgroundColor: '#000000',
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
    backgroundColor: '#0a0a0a',
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
    backgroundColor: '#1a0a2e',
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
    backgroundColor: '#2d3436',
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
    backgroundColor: '#000000',
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
    backgroundColor: '#0d0d0d',
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
    backgroundColor: '#1a0033',
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
    backgroundColor: '#1a1a2e',
  },
  {
    id: 'newspaper-headline',
    name: 'Newspaper Headline',
    description: 'Classic newspaper with fast jitter',
    fonts: ['Playfair Display', 'Merriweather', 'EB Garamond', 'Lora', 'Old Standard TT', 'Spectral', 'Cinzel', 'Ultra', 'Abril Fatface', 'Graduate'],
    framesPerCard: 1,
    fps: 60,
    duration: 1.8,
    foregroundColor: '#000000',
    backgroundColor: '#f2f2e9',
    grainOverlay: true,
    scaleJitter: { min: 1.0, max: 1.02 },
    rotationJitter: { min: -1, max: 1 },
  },
];

export type AnimationStyleId = typeof ANIMATION_STYLES[number]['id'];

export function getAnimationStyle(id: string): AnimationStyle | undefined {
  return ANIMATION_STYLES.find(style => style.id === id);
}
