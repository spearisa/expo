import { Inquiry, User } from '@/types';

export const MOCK_BUYER: User = {
  id: 'u-buyer-1',
  name: 'Alex Morgan',
  email: 'alex@example.com',
  role: 'buyer',
  avatarUrl: 'https://i.pravatar.cc/200?u=alex-buyer',
  joinedAt: '2025-11-04T00:00:00.000Z',
  phone: '+1 415 555 0188',
};

export const MOCK_BROKER: User = {
  id: 'u-broker-1',
  name: 'Sofía Restrepo',
  email: 'sofia@medellininvest.example',
  role: 'broker',
  avatarUrl: 'https://i.pravatar.cc/200?u=sofia-broker',
  joinedAt: '2024-08-12T00:00:00.000Z',
  phone: '+57 300 555 0144',
  agency: 'Medellín Invest Realty',
};

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    propertyId: 'mde-001',
    propertyTitle: 'Modern 2BR with Skyline Views — Provenza',
    propertyImage: 'https://picsum.photos/seed/mde-001-a/200/200',
    message: 'Hi, is the property still available for an April closing?',
    status: 'replied',
    sentAt: '2026-04-12T16:30:00.000Z',
  },
  {
    id: 'inq-2',
    propertyId: 'mde-006',
    propertyTitle: 'Brand-new Studio with Pool — Envigado',
    propertyImage: 'https://picsum.photos/seed/mde-006-a/200/200',
    message: 'Could I schedule a virtual tour this Friday?',
    status: 'pending',
    sentAt: '2026-04-13T10:05:00.000Z',
  },
  {
    id: 'inq-3',
    propertyId: 'mde-009',
    propertyTitle: 'Designer Condo with Pool — Provenza',
    propertyImage: 'https://picsum.photos/seed/mde-009-a/200/200',
    message: 'What are the HOA fees and short-term rental restrictions?',
    status: 'closed',
    sentAt: '2026-03-29T09:15:00.000Z',
  },
];
