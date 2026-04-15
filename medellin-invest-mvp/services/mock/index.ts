/**
 * Mock service layer.
 *
 * Mimics an async API so screens/hooks consume a realistic interface.
 * Swap these implementations for real network calls once the backend exists —
 * no screen code should need to change.
 */
import {
  Inquiry,
  Property,
  PropertyFilter,
  SortOption,
  User,
} from '@/types';
import { MOCK_PROPERTIES } from './properties';
import { MOCK_BROKER, MOCK_BUYER, MOCK_INQUIRIES } from './users';

const delay = <T>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const matches = (p: Property, f: PropertyFilter | undefined) => {
  if (!f) return true;
  if (f.minPrice != null && p.price < f.minPrice) return false;
  if (f.maxPrice != null && p.price > f.maxPrice) return false;
  if (f.neighborhoods?.length && !f.neighborhoods.includes(p.neighborhood)) return false;
  if (f.propertyTypes?.length && !f.propertyTypes.includes(p.propertyType)) return false;
  if (f.minBedrooms != null && p.bedrooms < f.minBedrooms) return false;
  if (f.minBathrooms != null && p.bathrooms < f.minBathrooms) return false;
  if (f.furnished != null && p.furnished !== f.furnished) return false;
  if (f.shortTermCapable && !p.shortTermCapable) return false;
  if (f.longTermCapable && !p.longTermCapable) return false;
  if (f.source && p.source !== f.source) return false;
  if (f.minROI != null && p.estimatedROI < f.minROI) return false;
  return true;
};

const sortBy = (list: Property[], opt: SortOption): Property[] => {
  const arr = [...list];
  switch (opt) {
    case 'priceAsc':
      return arr.sort((a, b) => a.price - b.price);
    case 'priceDesc':
      return arr.sort((a, b) => b.price - a.price);
    case 'bestRoi':
      return arr.sort((a, b) => b.estimatedROI - a.estimatedROI);
    case 'highestNightly':
      return arr.sort((a, b) => b.nightlyRateEstimate - a.nightlyRateEstimate);
    case 'newest':
    default:
      return arr.sort(
        (a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime()
      );
  }
};

export const propertiesService = {
  list: (
    filter?: PropertyFilter,
    sort: SortOption = 'newest',
    search?: string
  ): Promise<Property[]> => {
    const q = search?.trim().toLowerCase();
    const filtered = MOCK_PROPERTIES.filter((p) => {
      if (!matches(p, filter)) return false;
      if (q) {
        const hay = `${p.title} ${p.neighborhood} ${p.address} ${p.propertyType}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    return delay(sortBy(filtered, sort));
  },

  byId: (id: string): Promise<Property | undefined> =>
    delay(MOCK_PROPERTIES.find((p) => p.id === id)),

  featured: (): Promise<Property[]> =>
    delay(MOCK_PROPERTIES.filter((p) => p.featured)),

  trending: (): Promise<Property[]> =>
    delay(MOCK_PROPERTIES.filter((p) => p.trending)),

  topROI: (limit = 5): Promise<Property[]> =>
    delay(
      [...MOCK_PROPERTIES]
        .sort((a, b) => b.estimatedROI - a.estimatedROI)
        .slice(0, limit)
    ),

  shortTermOpportunities: (limit = 5): Promise<Property[]> =>
    delay(
      MOCK_PROPERTIES.filter((p) => p.shortTermCapable)
        .sort((a, b) => b.nightlyRateEstimate - a.nightlyRateEstimate)
        .slice(0, limit)
    ),

  similar: (id: string, limit = 4): Promise<Property[]> => {
    const target = MOCK_PROPERTIES.find((p) => p.id === id);
    if (!target) return delay([]);
    const list = MOCK_PROPERTIES.filter(
      (p) => p.id !== id && p.neighborhood === target.neighborhood
    ).slice(0, limit);
    return delay(list);
  },

  myListings: (brokerId: string): Promise<Property[]> =>
    delay(MOCK_PROPERTIES.filter((p) => p.broker.id === brokerId)),
};

export const userService = {
  currentBuyer: (): Promise<User> => delay(MOCK_BUYER),
  currentBroker: (): Promise<User> => delay(MOCK_BROKER),
  inquiries: (): Promise<Inquiry[]> => delay(MOCK_INQUIRIES),
};

export { MOCK_PROPERTIES, MOCK_BROKER, MOCK_BUYER, MOCK_INQUIRIES };
