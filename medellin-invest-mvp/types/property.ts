export type PropertyType =
  | 'apartment'
  | 'house'
  | 'penthouse'
  | 'studio'
  | 'loft'
  | 'condo';

export type ListingSource = 'broker' | 'owner';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Broker = {
  id: string;
  name: string;
  agency?: string;
  avatarUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  rating: number;
  reviewCount: number;
};

export type Property = {
  id: string;
  title: string;
  description: string;
  price: number; // USD
  currency: 'USD';
  neighborhood: string;
  city: string;
  address: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  parking: number;
  furnished: boolean;
  amenities: string[];
  images: string[];
  coverImage: string;

  // Investment
  shortTermCapable: boolean;
  longTermCapable: boolean;
  nightlyRateEstimate: number; // USD/night
  occupancyRateEstimate: number; // 0..1
  monthlyLongTermRent: number; // USD/month
  hoaMonthly: number; // USD/month
  utilitiesMonthly: number;
  managementMonthly: number;
  maintenanceReserveMonthly: number;
  cleaningCostPerStay: number;
  estimatedROI: number; // percent annual cash-on-cash
  estimatedCapRate: number; // percent

  // Listing meta
  listedAt: string; // ISO
  source: ListingSource;
  broker: Broker;
  coordinates: Coordinates;
  featured?: boolean;
  trending?: boolean;
};

export type PropertyFilter = {
  minPrice?: number;
  maxPrice?: number;
  neighborhoods?: string[];
  propertyTypes?: PropertyType[];
  minBedrooms?: number;
  minBathrooms?: number;
  furnished?: boolean;
  shortTermCapable?: boolean;
  longTermCapable?: boolean;
  source?: ListingSource;
  minROI?: number;
};

export type SortOption =
  | 'newest'
  | 'priceAsc'
  | 'priceDesc'
  | 'bestRoi'
  | 'highestNightly';

export type Neighborhood = {
  id: string;
  name: string;
  imageUrl: string;
  listingCount: number;
  averagePricePerSqm: number;
  shortDescription: string;
};
