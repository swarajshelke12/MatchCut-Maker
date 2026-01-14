// Use case helper - maps content types to recommended animation styles
export type UseCaseId = 
  | 'instagram-reel'
  | 'youtube-short'
  | 'podcast-clip'
  | 'quote-video'
  | 'promo-announcement'
  | 'educational-video';

export interface UseCase {
  id: UseCaseId;
  name: string;
  recommendedStyles: string[]; // Animation style IDs
  defaultStyle: string; // First style to preselect
}

export const USE_CASES: UseCase[] = [
  {
    id: 'instagram-reel',
    name: 'Instagram Reel',
    recommendedStyles: ['glitch-flash', 'chaos-maximum', 'bold-punch'],
    defaultStyle: 'glitch-flash',
  },
  {
    id: 'youtube-short',
    name: 'YouTube Short',
    recommendedStyles: ['minimal-clean', 'chaos-maximum'],
    defaultStyle: 'minimal-clean',
  },
  {
    id: 'podcast-clip',
    name: 'Podcast Clip',
    recommendedStyles: ['minimal-clean', 'handwritten-bounce'],
    defaultStyle: 'minimal-clean',
  },
  {
    id: 'quote-video',
    name: 'Quote Video',
    recommendedStyles: ['handwritten-bounce', 'minimal-clean'],
    defaultStyle: 'handwritten-bounce',
  },
  {
    id: 'promo-announcement',
    name: 'Promo / Announcement',
    recommendedStyles: ['bold-punch', 'glitch-flash'],
    defaultStyle: 'bold-punch',
  },
  {
    id: 'educational-video',
    name: 'Educational Video',
    recommendedStyles: ['minimal-clean'],
    defaultStyle: 'minimal-clean',
  },
];

export function getUseCase(id: string): UseCase | undefined {
  return USE_CASES.find(uc => uc.id === id);
}

export function isStyleRecommended(useCaseId: string | null, styleId: string): boolean {
  if (!useCaseId) return false;
  const useCase = getUseCase(useCaseId);
  return useCase?.recommendedStyles.includes(styleId) ?? false;
}
