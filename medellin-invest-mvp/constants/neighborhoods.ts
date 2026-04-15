import { Neighborhood } from '@/types';

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'el-poblado',
    name: 'El Poblado',
    imageUrl: 'https://picsum.photos/seed/poblado/800/600',
    listingCount: 184,
    averagePricePerSqm: 2450,
    shortDescription: 'Upscale, walkable, strongest short-term rental demand.',
  },
  {
    id: 'laureles',
    name: 'Laureles',
    imageUrl: 'https://picsum.photos/seed/laureles/800/600',
    listingCount: 121,
    averagePricePerSqm: 1850,
    shortDescription: 'Tree-lined streets, balanced long-term rental market.',
  },
  {
    id: 'envigado',
    name: 'Envigado',
    imageUrl: 'https://picsum.photos/seed/envigado/800/600',
    listingCount: 96,
    averagePricePerSqm: 1750,
    shortDescription: 'Family-friendly, growing expat appeal.',
  },
  {
    id: 'sabaneta',
    name: 'Sabaneta',
    imageUrl: 'https://picsum.photos/seed/sabaneta/800/600',
    listingCount: 64,
    averagePricePerSqm: 1450,
    shortDescription: 'Quieter pace, attractive entry-level pricing.',
  },
  {
    id: 'belen',
    name: 'Belén',
    imageUrl: 'https://picsum.photos/seed/belen/800/600',
    listingCount: 78,
    averagePricePerSqm: 1320,
    shortDescription: 'Local feel, rising long-term rental yields.',
  },
];

export const NEIGHBORHOOD_NAMES = NEIGHBORHOODS.map((n) => n.name);
