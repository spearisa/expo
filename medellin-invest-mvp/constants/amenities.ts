export const AMENITIES = [
  'Pool',
  'Gym',
  'Sauna',
  'Turkish Bath',
  'Concierge',
  '24/7 Security',
  'Rooftop Terrace',
  'BBQ Area',
  'Coworking',
  'Pet Friendly',
  'Elevator',
  'Parking',
  'Storage',
  'Air Conditioning',
  'Smart Home',
  'Solar Panels',
  'Garden',
  'Balcony',
  'Mountain View',
  'City View',
] as const;

export type Amenity = (typeof AMENITIES)[number];

export const SORT_LABELS: Record<string, string> = {
  newest: 'Newest',
  priceAsc: 'Price: Low to High',
  priceDesc: 'Price: High to Low',
  bestRoi: 'Best ROI',
  highestNightly: 'Highest Nightly',
};
