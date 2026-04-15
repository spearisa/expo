import { PropertyType } from '@/types';

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'studio', label: 'Studio' },
  { value: 'loft', label: 'Loft' },
  { value: 'condo', label: 'Condo' },
];

export const propertyTypeLabel = (t: PropertyType) =>
  PROPERTY_TYPES.find((p) => p.value === t)?.label ?? t;
