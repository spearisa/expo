import { z } from 'zod';

/**
 * Add-listing schema.
 * Validations are intentionally lightweight for the MVP — keep them strict
 * enough to surface a real error UI without blocking demos.
 */
export const listingSchema = z.object({
  // Step 1
  title: z.string().min(6, 'Title must be at least 6 characters'),
  description: z.string().min(20, 'Add a description (min 20 chars)'),
  propertyType: z.enum(['apartment', 'house', 'penthouse', 'studio', 'loft', 'condo']),
  price: z.coerce.number().positive('Price must be greater than 0'),

  // Step 2
  bedrooms: z.coerce.number().int().min(0).max(20),
  bathrooms: z.coerce.number().min(0).max(20),
  squareMeters: z.coerce.number().int().positive('Area is required'),
  parking: z.coerce.number().int().min(0).max(20),
  furnished: z.boolean(),
  amenities: z.array(z.string()),

  // Step 3
  neighborhood: z.string().min(2, 'Choose a neighborhood'),
  address: z.string().min(4, 'Address is required'),

  // Step 4
  shortTermCapable: z.boolean(),
  longTermCapable: z.boolean(),
  nightlyRateEstimate: z.coerce.number().min(0),
  monthlyLongTermRent: z.coerce.number().min(0),
  hoaMonthly: z.coerce.number().min(0),
  utilitiesMonthly: z.coerce.number().min(0),
  managementMonthly: z.coerce.number().min(0),
  maintenanceReserveMonthly: z.coerce.number().min(0),

  // Step 5
  images: z.array(z.string()).min(1, 'Add at least one image'),
  coverImageIndex: z.number().int().min(0),
});

export type ListingFormValues = z.infer<typeof listingSchema>;

export const defaultListingValues: ListingFormValues = {
  title: '',
  description: '',
  propertyType: 'apartment',
  price: 0,
  bedrooms: 1,
  bathrooms: 1,
  squareMeters: 60,
  parking: 0,
  furnished: false,
  amenities: [],
  neighborhood: '',
  address: '',
  shortTermCapable: false,
  longTermCapable: true,
  nightlyRateEstimate: 0,
  monthlyLongTermRent: 0,
  hoaMonthly: 0,
  utilitiesMonthly: 0,
  managementMonthly: 0,
  maintenanceReserveMonthly: 0,
  images: [],
  coverImageIndex: 0,
};

export const STEP_TITLES = [
  'Basic info',
  'Property details',
  'Location',
  'Investment details',
  'Media',
  'Review',
];
